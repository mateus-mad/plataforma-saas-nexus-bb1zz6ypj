migrate(
  (app) => {
    // 1. Coleção financial_transactions
    let transactionsCol
    try {
      transactionsCol = app.findCollectionByNameOrId('financial_transactions')
    } catch (_) {
      const relsCol = app.findCollectionByNameOrId('relacionamentos')
      transactionsCol = new Collection({
        name: 'financial_transactions',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
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
        ],
        indexes: [
          'CREATE INDEX idx_fin_tx_due_date ON financial_transactions (due_date)',
          'CREATE INDEX idx_fin_tx_status ON financial_transactions (status)',
          'CREATE INDEX idx_fin_tx_type ON financial_transactions (type)',
        ],
      })
      app.save(transactionsCol)
    }

    // 2. Coleção dashboard_goals
    let goalsCol
    try {
      goalsCol = app.findCollectionByNameOrId('dashboard_goals')
    } catch (_) {
      goalsCol = new Collection({
        name: 'dashboard_goals',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'month', type: 'text', required: true }, // ex: "2026-04"
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
        ],
        indexes: ['CREATE UNIQUE INDEX idx_dash_goals_month ON dashboard_goals (month)'],
      })
      app.save(goalsCol)
    }

    // 3. Seed inicial da meta do mês corrente
    try {
      const now = new Date()
      const yearMonth = now.toISOString().slice(0, 7) // "2026-04"
      try {
        app.findFirstRecordByData('dashboard_goals', 'month', yearMonth)
      } catch (_) {
        const goalRec = new Record(goalsCol)
        goalRec.set('month', yearMonth)
        goalRec.set('target_revenue', 25000.0)
        goalRec.set('target_hours', 160)
        goalRec.set('notes', 'Meta de faturamento e operação mensal')
        app.save(goalRec)
      }
    } catch (err) {
      console.log('Erro ao semear dashboard_goals:', err)
    }

    // 4. Seed de transações financeiras realistas (incluindo faturas vencidas, pagas e a vencer)
    try {
      const txCount = app.countRecords('financial_transactions')
      if (txCount === 0) {
        const now = new Date()
        const pastDate5 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
        const pastDate12 = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
        const pastDate2 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
        const futureDate8 = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
        const futureDate15 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]

        const sampleTxs = [
          {
            description: 'Fatura #1042 - Licença Software ERP (Cliente Beta)',
            type: 'income',
            amount: 4500.0,
            category: 'Licenças',
            due_date: pastDate5 + ' 00:00:00.000Z',
            status: 'overdue',
            notes: 'Aguardando comprovante bancário',
          },
          {
            description: 'Fatura #1038 - Manutenção Predial e Consultoria',
            type: 'income',
            amount: 3200.0,
            category: 'Serviços',
            due_date: pastDate12 + ' 00:00:00.000Z',
            status: 'overdue',
            notes: 'Cliente notificado via WhatsApp',
          },
          {
            description: 'Mensalidade Suporte Técnico Março',
            type: 'income',
            amount: 1800.0,
            category: 'Suporte',
            due_date: pastDate2 + ' 00:00:00.000Z',
            status: 'overdue',
            notes: 'Cobrança reenviada',
          },
          {
            description: 'Contrato Prestação de Serviços Elétricos',
            type: 'income',
            amount: 8500.0,
            category: 'Serviços',
            due_date: pastDate12 + ' 00:00:00.000Z',
            payment_date: pastDate12 + ' 14:00:00.000Z',
            status: 'paid',
            notes: 'Pago via PIX',
          },
          {
            description: 'Consultoria de Engenharia Estrutural',
            type: 'income',
            amount: 6200.0,
            category: 'Engenharia',
            due_date: pastDate5 + ' 00:00:00.000Z',
            payment_date: pastDate5 + ' 10:30:00.000Z',
            status: 'paid',
            notes: 'Transferência TED',
          },
          {
            description: 'Serviços de Infraestrutura em Nuvem (AWS/Azure)',
            type: 'expense',
            amount: 1450.0,
            category: 'Infraestrutura',
            due_date: pastDate5 + ' 00:00:00.000Z',
            payment_date: pastDate5 + ' 09:00:00.000Z',
            status: 'paid',
            notes: 'Débito automático corporativo',
          },
          {
            description: 'Fatura #1050 - Implantação Módulo Ponto Mobile',
            type: 'income',
            amount: 5400.0,
            category: 'Implantação',
            due_date: futureDate8 + ' 00:00:00.000Z',
            status: 'pending',
            notes: 'Boleto bancário emitido',
          },
          {
            description: 'Locação de Equipamentos Topográficos',
            type: 'expense',
            amount: 2100.0,
            category: 'Equipamentos',
            due_date: futureDate15 + ' 00:00:00.000Z',
            status: 'pending',
            notes: 'Boleto para o dia 15',
          },
        ]

        for (const txData of sampleTxs) {
          const rec = new Record(transactionsCol)
          rec.set('description', txData.description)
          rec.set('type', txData.type)
          rec.set('amount', txData.amount)
          rec.set('category', txData.category)
          rec.set('due_date', txData.due_date)
          if (txData.payment_date) {
            rec.set('payment_date', txData.payment_date)
          }
          rec.set('status', txData.status)
          rec.set('notes', txData.notes)
          app.save(rec)
        }
      }
    } catch (err) {
      console.log('Erro ao semear financial_transactions:', err)
    }

    // 5. Seed de colaboradores e batidas de ponto representativas para cálculo de horas da semana
    try {
      const colabs = app.findRecordsByFilter(
        'relacionamentos',
        "type = 'colaborador'",
        '-created',
        10,
        0,
      )

      let colab1Id = ''
      let colab2Id = ''

      if (colabs.length === 0) {
        const relCol = app.findCollectionByNameOrId('relacionamentos')
        const c1 = new Record(relCol)
        c1.set('name', 'Carlos Eduardo Silveira')
        c1.set('type', 'colaborador')
        c1.set('document_number', '123.456.789-01')
        c1.set('status', 'ativo')
        c1.set('compliance_status', 'em_dia')
        c1.set('work_details', { weekly_hours: 44, start_time: '08:00', end_time: '17:00' })
        app.save(c1)
        colab1Id = c1.id

        const c2 = new Record(relCol)
        c2.set('name', 'Mariana Rocha Mendes')
        c2.set('type', 'colaborador')
        c2.set('document_number', '987.654.321-09')
        c2.set('status', 'ativo')
        c2.set('compliance_status', 'pendente') // Gerará alerta de compliance
        c2.set('work_details', { weekly_hours: 40, start_time: '08:30', end_time: '17:30' })
        app.save(c2)
        colab2Id = c2.id
      } else {
        colab1Id = colabs[0].id
        if (colabs.length > 1) {
          colab2Id = colabs[1].id
        }
      }

      // Se temos poucas time_entries, inserir batidas de ponto para a semana corrente e anterior
      const teCount = app.countRecords('time_entries')
      if (teCount < 5) {
        const timeCol = app.findCollectionByNameOrId('time_entries')
        const now = new Date()

        // Segunda, Terça, Quarta desta semana
        const daysAgo = [3, 2, 1]
        for (const d of daysAgo) {
          const dayDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000)
          const y = dayDate.getFullYear()
          const m = String(dayDate.getMonth() + 1).padStart(2, '0')
          const dt = String(dayDate.getDate()).padStart(2, '0')
          const datePrefix = `${y}-${m}-${dt}`

          // Entrada 08:00
          const e1 = new Record(timeCol)
          e1.set('timestamp', `${datePrefix} 08:00:00.000Z`)
          e1.set('type', 'entrada')
          if (colab1Id) e1.set('relacionamento_id', colab1Id)
          app.save(e1)

          // Pausa Inicio 12:00
          const e2 = new Record(timeCol)
          e2.set('timestamp', `${datePrefix} 12:00:00.000Z`)
          e2.set('type', 'pausa_inicio')
          if (colab1Id) e2.set('relacionamento_id', colab1Id)
          app.save(e2)

          // Pausa Fim 13:00
          const e3 = new Record(timeCol)
          e3.set('timestamp', `${datePrefix} 13:00:00.000Z`)
          e3.set('type', 'pausa_fim')
          if (colab1Id) e3.set('relacionamento_id', colab1Id)
          app.save(e3)

          // Saída 17:00 (8 horas trabalhadas)
          const e4 = new Record(timeCol)
          e4.set('timestamp', `${datePrefix} 17:00:00.000Z`)
          e4.set('type', 'saida')
          if (colab1Id) e4.set('relacionamento_id', colab1Id)
          app.save(e4)
        }
      }
    } catch (err) {
      console.log('Erro ao semear colaboradores e pontos:', err)
    }
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('dashboard_goals'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('financial_transactions'))
    } catch (_) {}
  },
)
