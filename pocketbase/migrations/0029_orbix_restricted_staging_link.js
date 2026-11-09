// 0029 — Área técnica RESTRITA de entrada/staging ORBIX: vínculo e chaves de integridade
//
// Segunda parte da área de staging (estrutura vazia criada pela 0028).
// - Adiciona o campo batch_id (relation OBRIGATÓRIA para _orbix_import_batches,
//   maxSelect 1, cascadeDelete false) em _orbix_source_records e _orbix_source_files.
// - Cria os índices UNIQUE de integridade:
//     _orbix_source_records: (batch_id, source_project, source_table, source_id)
//     _orbix_source_files:   (batch_id, bucket, object_path)
// - Reforça TODAS as cinco API rules null nas três coleções (somente superusuário).
// - Nenhum dado, contagem real ou PII é embutido. Piloto financeiro ORBIX intocado.
// (A 0028 precisou ser aplicada antes desta: o validador gerenciado exige que a
//  coleção referenciada por uma relation já exista — inclusive entre arquivos do
//  mesmo lote pendente.)

function ensureNullRules(app, name) {
  var col = app.findCollectionByNameOrId(name)
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
  return col
}

function addBatchRelation(app, col) {
  if (col.fields.getByName('batch_id')) {
    return // idempotente
  }
  var batchesCol = app.findCollectionByNameOrId('_orbix_import_batches')
  col.fields.add(
    new RelationField({
      name: 'batch_id',
      required: true,
      collectionId: batchesCol.id,
      cascadeDelete: false,
      maxSelect: 1,
    }),
  )
  app.save(col)
}

migrate(
  (app) => {
    var batches = ensureNullRules(app, '_orbix_import_batches')

    var records = ensureNullRules(app, '_orbix_source_records')
    addBatchRelation(app, records)
    // Idempotente via col.addIndex — seguro mesmo se o índice já existir.
    records.addIndex(
      'idx_orbix_records_batch_proj_table_id',
      true,
      'batch_id, source_project, source_table, source_id',
      '',
    )
    app.save(records)

    var files = ensureNullRules(app, '_orbix_source_files')
    addBatchRelation(app, files)
    files.addIndex('idx_orbix_files_batch_bucket_path', true, 'batch_id, bucket, object_path', '')
    app.save(files)

    console.log(
      '[orbix-staging] vínculos e índices UNIQUE aplicados; regras null reforçadas em ' +
        batches.name +
        ', ' +
        records.name +
        ', ' +
        files.name,
    )
  },
  (app) => {
    // Preserve provenance and duplicate protection after any staged data exists.
    if (app.countRecords('_orbix_source_records') > 0 || app.countRecords('_orbix_source_files') > 0) {
      throw new Error('ORBIX staging rollback blocked: preserve populated batch relations and indexes')
    }
    // Down: only empty staging structures may lose their batch relation.
    try {
      var records = app.findCollectionByNameOrId('_orbix_source_records')
      records.removeIndex('idx_orbix_records_batch_proj_table_id')
      if (records.fields.getByName('batch_id')) {
        records.fields.removeByName('batch_id')
      }
      app.save(records)
    } catch (_) {}
    try {
      var files = app.findCollectionByNameOrId('_orbix_source_files')
      files.removeIndex('idx_orbix_files_batch_bucket_path')
      if (files.fields.getByName('batch_id')) {
        files.fields.removeByName('batch_id')
      }
      app.save(files)
    } catch (_) {}
  },
)
