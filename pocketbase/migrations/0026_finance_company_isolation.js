// Read-only finance pilot. Apply to a backed-up homologation database first.
// Never assign legacy/demo transactions to a company automatically.
// NOTE: this file's content is the source for 0027_finance_company_isolation_implant.js
// (this 0026 file was never recognized by the managed migration mechanism).
migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    const companies = new Collection({
      name: 'finance_companies',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'active', type: 'bool' },
      ],
    })
    app.save(companies)
    const memberships = new Collection({
      name: 'finance_memberships',
      type: 'base',
      listRule:
        "@request.auth.id != '' && user_id = @request.auth.id && active = true && can_read = true && company_id.active = true",
      viewRule:
        "@request.auth.id != '' && user_id = @request.auth.id && active = true && can_read = true && company_id.active = true",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'company_id',
          type: 'relation',
          collectionId: companies.id,
          maxSelect: 1,
          required: true,
          cascadeDelete: false,
        },
        {
          name: 'user_id',
          type: 'relation',
          collectionId: users.id,
          maxSelect: 1,
          required: true,
          cascadeDelete: false,
        },
        { name: 'active', type: 'bool' },
        { name: 'can_read', type: 'bool' },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_finance_membership_company_user ON finance_memberships (company_id, user_id)',
      ],
    })
    app.save(memberships)
    // All predicates use the SAME collection alias: another user's membership
    // must never supply the permission for the requesting user's company.
    const membershipRule =
      '@collection.finance_memberships.user_id ?= @request.auth.id && @collection.finance_memberships.active ?= true && @collection.finance_memberships.can_read ?= true'
    const companyRule =
      "@request.auth.id != '' && active = true && @collection.finance_memberships.company_id ?= id && " +
      membershipRule
    companies.listRule = companyRule
    companies.viewRule = companyRule
    app.save(companies)

    for (const name of ['financial_transactions', 'dashboard_goals']) {
      const collection = app.findCollectionByNameOrId(name)
      collection.fields.add(
        new RelationField({
          name: 'company_id',
          collectionId: companies.id,
          maxSelect: 1,
          required: true,
          cascadeDelete: false,
        }),
      )
      const rule =
        "@request.auth.id != '' && company_id != '' && company_id.active = true && @collection.finance_memberships.company_id ?= company_id && " +
        membershipRule
      collection.listRule = rule
      collection.viewRule = rule
      // Separate create/edit/approve/settle permissions are a later milestone.
      collection.createRule = null
      collection.updateRule = null
      collection.deleteRule = null
      collection.indexes.push('CREATE INDEX idx_' + name + '_company ON ' + name + ' (company_id)')
      if (name === 'dashboard_goals') {
        collection.indexes = collection.indexes.filter(
          (index) => !index.includes('idx_dash_goals_month'),
        )
        // Existing goals have no company; a partial index preserves legacy rows.
        collection.indexes.push(
          "CREATE UNIQUE INDEX idx_dash_goals_company_month ON dashboard_goals (company_id, month) WHERE company_id != ''",
        )
      }
      app.save(collection)
    }
  },
  () => {
    // Downgrading to 0024 would restore unrestricted authenticated access and
    // discard company attribution. Restore a reviewed backup instead.
    throw new Error(
      'Security migration cannot be downgraded automatically. Restore a reviewed backup in isolation.',
    )
  },
)
