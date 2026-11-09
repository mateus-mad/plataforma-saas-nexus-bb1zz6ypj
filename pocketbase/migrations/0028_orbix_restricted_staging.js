// 0028 — Área técnica RESTRITA de entrada/staging para a migração ORBIX (Supabase → Skip Cloud)
//
// Escopo: SOMENTE estrutura vazia. Nenhum dado, export, contagem real ou PII é embutido aqui.
// - Cria três coleções BASE com nome iniciado por "_" (fora da API pública de dados comuns):
//     _orbix_import_batches  — lote de importação (metadados do export)
//     _orbix_source_records  — registros de origem (payload JSON textual, sem arredondamento)
//     _orbix_source_files    — objetos de storage de origem (caminho + hash + metadados)
// - TODAS as cinco API rules de TODAS as três coleções são null: acesso somente
//   superusuário/console nativo. Nenhuma regra pública, nenhum endpoint, hook ou rota.
// - Campos file são protegidos (protected: true), maxSelect 1, maxSize 50 MB,
//   mime restrito a application/zip.
// - A relação obrigatória batch_id (para _orbix_import_batches) e os índices UNIQUE são
//   adicionados na migração de acompanhamento 0029 — o validador gerenciado exige que a
//   coleção referenciada já exista antes da migração que cria a relação.
// - Idempotente: se a coleção já existe, apenas reforça as regras null e sai.
// - NÃO altera o piloto financeiro ORBIX: finance_companies, finance_memberships,
//   financial_transactions, dashboard_goals e suas coleções de backup ficam intocados.

var MAX_ZIP_BYTES = 52428800

function batchesFields() {
  return [
    { name: 'source_project', type: 'text', required: true },
    { name: 'source_system', type: 'text', required: true },
    { name: 'label', type: 'text', required: true },
    { name: 'status', type: 'text', required: true },
    { name: 'scope', type: 'text' },
    { name: 'manifest_sha256', type: 'text' },
    { name: 'record_count', type: 'number' },
    { name: 'file_count', type: 'number' },
    { name: 'exported_at', type: 'text' },
    {
      name: 'database_export',
      type: 'file',
      maxSelect: 1,
      maxSize: MAX_ZIP_BYTES,
      mimeTypes: ['application/zip'],
      protected: true,
    },
    {
      name: 'storage_export',
      type: 'file',
      maxSelect: 1,
      maxSize: MAX_ZIP_BYTES,
      mimeTypes: ['application/zip'],
      protected: true,
    },
    { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
    { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
  ]
}

function recordsFields() {
  return [
    { name: 'source_project', type: 'text', required: true },
    { name: 'source_table', type: 'text', required: true },
    { name: 'source_id', type: 'text', required: true },
    { name: 'payload_text', type: 'text', required: true, max: 20000000 },
    { name: 'sha256', type: 'text', required: true },
    { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
    { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
  ]
}

function filesFields() {
  return [
    { name: 'source_project', type: 'text', required: true },
    { name: 'bucket', type: 'text', required: true },
    { name: 'object_path', type: 'text', required: true },
    { name: 'source_id', type: 'text', required: true },
    { name: 'sha256', type: 'text', required: true },
    { name: 'size_bytes', type: 'number' },
    { name: 'metadata_text', type: 'text', max: 2000000 },
    { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
    { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
  ]
}

// Especificação declarativa das três coleções (sem a relação batch_id — fica na 0029).
var SPECS = [
  { name: '_orbix_import_batches', fields: batchesFields },
  { name: '_orbix_source_records', fields: recordsFields },
  { name: '_orbix_source_files', fields: filesFields },
]

function collectionExists(app, name) {
  try {
    app.findCollectionByNameOrId(name)
    return true
  } catch (_) {
    return false
  }
}

function ensureNullRules(app, col) {
  if (
    col.listRule !== null ||
    col.viewRule !== null ||
    col.createRule !== null ||
    col.updateRule !== null ||
    col.deleteRule !== null
  ) {
    col.listRule = null
    col.viewRule = null
    col.createRule = null
    col.updateRule = null
    col.deleteRule = null
    app.save(col)
  }
}

migrate(
  (app) => {
    for (var i = 0; i < SPECS.length; i++) {
      var spec = SPECS[i]

      if (collectionExists(app, spec.name)) {
        // Idempotente: apenas reforça as regras null (defesa em profundidade).
        ensureNullRules(app, app.findCollectionByNameOrId(spec.name))
        console.log('[orbix-staging] ' + spec.name + ' já existe — regras null reforçadas')
        continue
      }

      var col = new Collection({
        name: spec.name,
        type: 'base',
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: spec.fields(),
      })
      app.save(col)
      console.log('[orbix-staging] criada coleção ' + spec.name + ' (todas as regras null)')
    }
  },
  (app) => {
    // Down: remove apenas as estruturas criadas nesta migração, somente se vazias.
    for (var i = SPECS.length - 1; i >= 0; i--) {
      var name = SPECS[i].name
      if (!collectionExists(app, name)) {
        continue
      }
      var total = app.countRecords(name)
      if (total > 0) {
        throw new Error(
          '[orbix-staging] down bloqueado: ' + name + ' contém ' + total + ' registros',
        )
      }
      app.delete(app.findCollectionByNameOrId(name))
    }
  },
)
