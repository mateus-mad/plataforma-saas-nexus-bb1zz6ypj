import type PocketBase from 'pocketbase'

export interface MigrationBatch {
  id: string
  source_project: string
  label: string
  manifest_sha256: string
  record_count: number
  file_count: number
  database_export: string
  storage_export: string
}
export interface SourceRecord {
  source_project: string
  source_table: string
  source_id: string
  payload_text: string
  sha256: string
}
export interface SourceFile {
  source_project: string
  bucket: string
  object_path: string
  source_id: string
  sha256: string
  size_bytes: number
  metadata_text: string
}
export interface ImportBundle {
  schema_version: 1
  manifest_sha256: string
  records: SourceRecord[]
  files: SourceFile[]
  archives: Record<'database_export' | 'storage_export', { sha256: string; size_bytes: number }>
}
export interface ImportProgress {
  checked: number
  created: number
  skipped: number
  total: number
}
const digestPattern = /^[a-f0-9]{64}$/
export async function sha256(value: string | ArrayBuffer): Promise<string> {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}
function assertSession(client: PocketBase, userId: string) {
  if (!client.authStore.isValid || client.authStore.record?.id !== userId)
    throw new Error('A sessão mudou. Entre novamente antes de continuar.')
}
function recordKey(r: SourceRecord) {
  return JSON.stringify([r.source_project, r.source_table, r.source_id])
}
function fileKey(r: SourceFile) {
  return JSON.stringify([r.source_project, r.bucket, r.object_path])
}
export async function validateBundle(value: unknown, batch: MigrationBatch): Promise<ImportBundle> {
  const b = value as ImportBundle
  if (
    !b ||
    b.schema_version !== 1 ||
    b.manifest_sha256 !== batch.manifest_sha256 ||
    !Array.isArray(b.records) ||
    !Array.isArray(b.files)
  ) {
    throw new Error('O pacote não corresponde ao manifesto deste lote.')
  }
  if (b.records.length !== batch.record_count || b.files.length !== batch.file_count)
    throw new Error('O pacote está incompleto para este lote.')
  const seen = new Set<string>()
  for (const r of b.records) {
    if (
      r.source_project !== batch.source_project ||
      !/^[a-z][a-z0-9_]*$/.test(r.source_table) ||
      typeof r.source_id !== 'string' ||
      !r.source_id ||
      typeof r.payload_text !== 'string' ||
      !digestPattern.test(r.sha256)
    )
      throw new Error('Registro de origem inválido.')
    const key = recordKey(r)
    if (seen.has(key)) throw new Error('O pacote contém origens duplicadas.')
    seen.add(key)
    try {
      const data = JSON.parse(r.payload_text)
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw Error()
    } catch {
      throw new Error('Conteúdo JSON inválido no pacote.')
    }
    if ((await sha256(r.payload_text)) !== r.sha256)
      throw new Error('O conteúdo de um registro difere do hash esperado.')
  }
  const seenFiles = new Set<string>()
  for (const f of b.files) {
    if (
      f.source_project !== batch.source_project ||
      typeof f.bucket !== 'string' ||
      !f.bucket ||
      typeof f.source_id !== 'string' ||
      !f.source_id ||
      typeof f.object_path !== 'string' ||
      !f.object_path ||
      f.object_path.startsWith('/') ||
      f.object_path.includes('\\') ||
      f.object_path.split('/').some((p) => p === '..' || p === '') ||
      !digestPattern.test(f.sha256) ||
      !Number.isSafeInteger(f.size_bytes) ||
      f.size_bytes < 0 ||
      typeof f.metadata_text !== 'string'
    )
      throw new Error('Metadados de anexo inválidos.')
    const key = fileKey(f)
    if (seenFiles.has(key)) throw new Error('O pacote contém anexos duplicados.')
    seenFiles.add(key)
  }
  for (const name of ['database_export', 'storage_export'] as const) {
    if (
      !b.archives?.[name] ||
      !digestPattern.test(b.archives[name].sha256) ||
      !Number.isSafeInteger(b.archives[name].size_bytes) ||
      b.archives[name].size_bytes < 1 ||
      b.archives[name].size_bytes > 52428800
    )
      throw new Error('Manifesto dos arquivos ZIP inválido.')
  }
  return b
}
export async function importBundle(
  client: PocketBase,
  batch: MigrationBatch,
  bundle: ImportBundle,
  onProgress: (p: ImportProgress) => void,
) {
  const userId = client.authStore.record?.id || ''
  assertSession(client, userId)
  await validateBundle(bundle, batch)
  const filter = client.filter('batch_id = {:batch}', { batch: batch.id })
  const existingRecords = await client
    .collection('_orbix_source_records')
    .getFullList<SourceRecord>({
      filter,
      fields: 'source_project,source_table,source_id,payload_text,sha256',
      requestKey: null,
    })
  assertSession(client, userId)
  const existingFiles = await client.collection('_orbix_source_files').getFullList<SourceFile>({
    filter,
    fields: 'source_project,bucket,object_path,source_id,sha256,size_bytes,metadata_text',
    requestKey: null,
  })
  const sourceRecords = new Map(bundle.records.map((r) => [recordKey(r), r]))
  const sourceFiles = new Map(bundle.files.map((r) => [fileKey(r), r]))
  const existingRecordKeys = new Set<string>(),
    existingFileKeys = new Set<string>()
  // Complete reconciliation before any write. A mismatch never overwrites history.
  for (const r of existingRecords) {
    const key = recordKey(r),
      expected = sourceRecords.get(key)
    if (
      existingRecordKeys.has(key) ||
      !expected ||
      r.payload_text !== expected.payload_text ||
      r.sha256 !== expected.sha256 ||
      (await sha256(r.payload_text)) !== expected.sha256
    )
      throw new Error(
        'O destino contém um registro diferente do pacote. A importação foi interrompida.',
      )
    existingRecordKeys.add(key)
  }
  for (const f of existingFiles) {
    const key = fileKey(f),
      expected = sourceFiles.get(key)
    if (
      existingFileKeys.has(key) ||
      !expected ||
      ['source_id', 'sha256', 'size_bytes', 'metadata_text'].some((k) => f[k] !== expected[k])
    )
      throw new Error('O destino contém metadados de anexo diferentes do pacote.')
    existingFileKeys.add(key)
  }
  const progress: ImportProgress = {
    checked: 0,
    created: 0,
    skipped: 0,
    total: bundle.records.length + bundle.files.length,
  }
  for (const [collection, rows, keys, keyOf] of [
    ['_orbix_source_records', bundle.records, existingRecordKeys, recordKey],
    ['_orbix_source_files', bundle.files, existingFileKeys, fileKey],
  ] as const) {
    for (const row of rows) {
      assertSession(client, userId)
      const key = (keyOf as (r: SourceRecord | SourceFile) => string)(row)
      if (keys.has(key)) progress.skipped++
      else {
        // Explicit allowlist: payload cannot supply destination IDs or credentials.
        const data =
          collection === '_orbix_source_records'
            ? Object.fromEntries(
                ['source_project', 'source_table', 'source_id', 'payload_text', 'sha256'].map(
                  (k) => [k, row[k]],
                ),
              )
            : Object.fromEntries(
                [
                  'source_project',
                  'bucket',
                  'object_path',
                  'source_id',
                  'sha256',
                  'size_bytes',
                  'metadata_text',
                ].map((k) => [k, row[k]]),
              )
        await client
          .collection(collection)
          .create({ ...data, batch_id: batch.id }, { requestKey: null })
        progress.created++
      }
      progress.checked++
      onProgress({ ...progress })
    }
  }
  return progress
}
export async function uploadArchive(
  client: PocketBase,
  batch: MigrationBatch,
  bundle: ImportBundle,
  field: 'database_export' | 'storage_export',
  file: File,
) {
  const userId = client.authStore.record?.id || ''
  assertSession(client, userId)
  if (batch[field])
    throw new Error('Este arquivo já foi enviado. Use a conferência do arquivo gravado.')
  const expected = bundle.archives[field]
  if (
    file.size !== expected.size_bytes ||
    (await sha256(await file.arrayBuffer())) !== expected.sha256
  )
    throw new Error('O ZIP selecionado difere do manifesto.')
  assertSession(client, userId)
  const form = new FormData()
  form.set(field, file, file.name)
  return client
    .collection('_orbix_import_batches')
    .update<MigrationBatch>(batch.id, form, { requestKey: null })
}
export async function verifyArchive(
  client: PocketBase,
  batch: MigrationBatch,
  bundle: ImportBundle,
  field: 'database_export' | 'storage_export',
) {
  const userId = client.authStore.record?.id || ''
  assertSession(client, userId)
  if (!batch[field]) throw new Error('O arquivo ainda não foi enviado.')
  const token = await client.files.getToken()
  assertSession(client, userId)
  const response = await fetch(
    client.files.getURL({ ...batch, collectionName: '_orbix_import_batches' }, batch[field], {
      token,
    }),
    { cache: 'no-store' },
  )
  if (!response.ok) throw new Error('Não foi possível conferir o arquivo protegido.')
  const bytes = await response.arrayBuffer()
  assertSession(client, userId)
  const expected = bundle.archives[field]
  if (bytes.byteLength !== expected.size_bytes || (await sha256(bytes)) !== expected.sha256)
    throw new Error('O arquivo gravado difere do manifesto.')
}
