// 0025 — Backup lógico restrito para o piloto ORBIX (coleções financeiras)
//
// Escopo: SOMENTE `financial_transactions` e `dashboard_goals`.
// - Cria coleções de backup com TODAS as regras null (não expostas à API),
//   replicando campos, tipos, índices e constraints das originais.
// - Copia todos os registros (todos os campos; SEM usuários, senhas, tokens ou segredos).
// - Idempotente: em reaplicação, substitui o conteúdo do backup pelo estado atual
//   das originais (upsert por id). Nunca altera as coleções originais.
// - Verificação de restaurabilidade: restaura o backup em coleções temporárias
//   `_restore_test_*`, compara contagem e conteúdo campo a campo com as originais
//   e remove as estruturas de teste ao final.
// - No-op em banco vazio (as coleções originais não existem → nada é feito).
//
// A migração de isolamento ORBIX NÃO faz parte desta etapa (passará a ser 0026).

function finTxFields(app) {
  const relsCol = app.findCollectionByNameOrId('relacionamentos')
  return [
    { name: 'description', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      values: ['income', 'expense'],
      maxSelect: 1,
    },
    { name: 'amount', type: 'number', required: true },
    { name: 'category', type: 'text' },
    { name: 'due_date', type: 'date', required: true },
    { name: 'payment_date', type: 'date' },
    {
      name: 'status',
      type: 'select',
      required: true,
      values: ['pending', 'paid', 'overdue', 'cancelled'],
      maxSelect: 1,
    },
    {
      name: 'relacionamento_id',
      type: 'relation',
      collectionId: relsCol.id,
      maxSelect: 1,
    },
    {
      name: 'user_id',
      type: 'relation',
      collectionId: '_pb_users_auth_',
      maxSelect: 1,
    },
    { name: 'notes', type: 'text' },
    { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
    { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
  ]
}

function goalsFields() {
  return [
    { name: 'month', type: 'text', required: true },
    { name: 'target_revenue', type: 'number', required: true },
    { name: 'target_hours', type: 'number' },
    { name: 'notes', type: 'text' },
    {
      name: 'user_id',
      type: 'relation',
      collectionId: '_pb_users_auth_',
      maxSelect: 1,
    },
    { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
    { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
  ]
}

const SPECS = [
  {
    orig: 'financial_transactions',
    backup: '_backup_financial_transactions',
    test: '_restore_test_financial_transactions',
    dataFields: [
      'description',
      'type',
      'amount',
      'category',
      'due_date',
      'payment_date',
      'status',
      'relacionamento_id',
      'user_id',
      'notes',
    ],
    fields: finTxFields,
    indexes: (table, prefix) => [
      'CREATE INDEX ' + prefix + '_fin_tx_due_date ON ' + table + ' (due_date)',
      'CREATE INDEX ' + prefix + '_fin_tx_status ON ' + table + ' (status)',
      'CREATE INDEX ' + prefix + '_fin_tx_type ON ' + table + ' (type)',
    ],
  },
  {
    orig: 'dashboard_goals',
    backup: '_backup_dashboard_goals',
    test: '_restore_test_dashboard_goals',
    dataFields: ['month', 'target_revenue', 'target_hours', 'notes', 'user_id'],
    fields: goalsFields,
    indexes: (table, prefix) => [
      'CREATE UNIQUE INDEX ' + prefix + '_dash_goals_month ON ' + table + ' (month)',
    ],
  },
]

function collectionExists(app, name) {
  try {
    app.findCollectionByNameOrId(name)
    return true
  } catch (_) {
    return false
  }
}

// Cria (ou devolve) uma coleção espelho com todas as regras null.
function ensureMirror(app, spec, name, prefix) {
  let col
  try {
    col = app.findCollectionByNameOrId(name)
  } catch (_) {
    col = new Collection({
      name: name,
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: spec.fields(app),
      indexes: spec.indexes(name, prefix),
    })
    app.save(col)
  }
  // Reforça as regras null a cada aplicação (defesa em profundidade).
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

// Copia um registro preservando id e timestamps.
function copyRecord(app, targetCol, targetName, source) {
  let rec
  try {
    rec = app.findRecordById(targetName, source.id)
  } catch (_) {
    rec = new Record(targetCol)
    rec.set('id', source.id)
  }
  for (const f of copyRecord.currentFields) {
    rec.set(f, source.get(f))
  }
  rec.set('created', source.getDateTime('created'))
  rec.set('updated', source.getDateTime('updated'))
  app.save(rec)
  // Campos autodate são recalculados pelo PocketBase no save (viram "agora"),
  // o que alteraria o conteúdo copiado. Reafirma os timestamps originais.
  app
    .db()
    .newQuery('UPDATE ' + targetName + ' SET created = {:c}, updated = {:u} WHERE id = {:id}')
    .bind({
      c: source.getString('created'),
      u: source.getString('updated'),
      id: source.id,
    })
    .execute()
  return rec
}

migrate(
  (app) => {
    for (const spec of SPECS) {
      // No-op em banco vazio: sem a coleção original, nada a fazer.
      if (!collectionExists(app, spec.orig)) {
        console.log('[backup-orbix] ' + spec.orig + ' inexistente — backup pulado (no-op)')
        continue
      }

      const originals = app.findRecordsByFilter(spec.orig, '', '-created', 100000, 0)

      // ---- 1. Coleção de backup (regras null, espelho da original) ----
      const bkpCol = ensureMirror(app, spec, spec.backup, 'idx_bkp')

      // ---- 2. Upsert por id: backup ← original (nunca toca na original) ----
      copyRecord.currentFields = spec.dataFields
      const seen = {}
      for (const o of originals) {
        seen[o.id] = true
        copyRecord(app, bkpCol, spec.backup, o)
      }
      // Remove do backup registros que não existem mais nas originais.
      const backups = app.findRecordsByFilter(spec.backup, '', '-created', 100000, 0)
      for (const b of backups) {
        if (!seen[b.id]) {
          app.delete(app.findRecordById(spec.backup, b.id))
        }
      }

      // ---- 3. Verificação de restaurabilidade (estrutura temporária) ----
      if (collectionExists(app, spec.test)) {
        app.delete(app.findCollectionByNameOrId(spec.test))
      }
      const tstCol = ensureMirror(app, spec, spec.test, 'idx_rst')
      copyRecord.currentFields = spec.dataFields
      for (const b of backups) {
        copyRecord(app, tstCol, spec.test, b)
      }

      // ---- 4. Comparação: contagem + conteúdo campo a campo ----
      const restored = app.findRecordsByFilter(spec.test, '', '-created', 100000, 0)
      if (restored.length !== originals.length) {
        throw new Error(
          '[backup-orbix] restauração de ' +
            spec.orig +
            ': contagem divergente (original=' +
            originals.length +
            ', restaurado=' +
            restored.length +
            ')',
        )
      }
      const byId = {}
      for (const t of restored) {
        byId[t.id] = t
      }
      const cmpFields = spec.dataFields.concat(['created', 'updated'])
      for (const o of originals) {
        const t = byId[o.id]
        if (!t) {
          throw new Error(
            '[backup-orbix] restauração de ' +
              spec.orig +
              ': registro ausente na estrutura de teste',
          )
        }
        for (const f of cmpFields) {
          if (o.getString(f) !== t.getString(f)) {
            throw new Error(
              '[backup-orbix] restauração de ' + spec.orig + ': divergência no campo "' + f + '"',
            )
          }
        }
      }
      console.log(
        '[backup-orbix] restauração verificada: ' +
          spec.orig +
          ' → ' +
          spec.backup +
          ' (' +
          originals.length +
          ' registros; comparação campo a campo OK)',
      )

      // ---- 5. Remove a estrutura de teste temporária (backup permanente fica) ----
      app.delete(app.findCollectionByNameOrId(spec.test))
      console.log(
        '[backup-orbix] backup concluído: ' +
          spec.backup +
          ' com ' +
          originals.length +
          ' registros',
      )
    }
  },
  (app) => {
    for (const spec of SPECS) {
      for (const name of [spec.test, spec.backup]) {
        try {
          app.delete(app.findCollectionByNameOrId(name))
        } catch (_) {}
      }
    }
  },
)
