// Validates immutable source payloads without parsing/re-serializing stored numbers.
onRecordCreateRequest((e) => {
  const text = e.record.getString('payload_text')
  const digest = e.record.getString('sha256')
  if (!/^[a-f0-9]{64}$/.test(digest) || $security.sha256(text) !== digest) {
    throw new BadRequestError('Source payload checksum mismatch')
  }
  let data
  try {
    data = JSON.parse(text)
  } catch (_) {
    throw new BadRequestError('Source payload must be JSON')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new BadRequestError('Source payload must be an object')
  const table = e.record.getString('source_table')
  if (!/^[a-z][a-z0-9_]*$/.test(table)) throw new BadRequestError('Invalid source table')
  const excluded = {
    employees: ['mobile_pin_hash', 'mobile_pin_salt'],
    user_invitations: ['token'],
    mobile_session_tokens: ['token'],
    crm_integration_configs: ['credentials', 'webhook_secret'],
    crm_proposals: ['share_password'],
  }
  for (const key of excluded[table] || []) {
    if (Object.prototype.hasOwnProperty.call(data, key))
      throw new BadRequestError('Authentication secrets cannot be imported')
  }
  e.next()
}, '_orbix_source_records')

onRecordCreateRequest((e) => {
  const path = e.record.getString('object_path')
  const size = e.record.getFloat('size_bytes')
  if (
    !/^[a-f0-9]{64}$/.test(e.record.getString('sha256')) ||
    !path ||
    path.startsWith('/') ||
    path.includes('\\') ||
    path.split('/').some((p) => p === '..' || p === '') ||
    !Number.isSafeInteger(size) ||
    size < 0
  ) {
    throw new BadRequestError('Invalid source file metadata')
  }
  e.next()
}, '_orbix_source_files')

onRecordUpdateRequest((e) => {
  if (!e.hasSuperuserAuth()) {
    const original = e.record.original()
    const body = e.requestInfo().body
    for (const name of ['id', 'created', 'updated']) {
      if (Object.prototype.hasOwnProperty.call(body, name))
        throw new BadRequestError('Migration system fields are immutable')
    }
    for (const name of [
      'source_project',
      'source_system',
      'label',
      'status',
      'scope',
      'manifest_sha256',
      'record_count',
      'file_count',
      'exported_at',
    ]) {
      if (JSON.stringify(e.record.get(name)) !== JSON.stringify(original.get(name))) {
        throw new BadRequestError('Migration batch metadata is immutable')
      }
    }
    for (const name of ['database_export', 'storage_export']) {
      const before = original.getString(name)
      if (before && (e.findUploadedFiles(name).length > 0 || e.record.getString(name) !== before)) {
        throw new BadRequestError('An existing migration archive cannot be replaced or removed')
      }
    }
  }
  e.next()
}, '_orbix_import_batches')
