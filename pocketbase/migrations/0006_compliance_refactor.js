migrate(
  (app) => {
    // Initialize missing compliance_status fields
    app
      .db()
      .newQuery(
        "UPDATE relacionamentos SET compliance_status = 'pendente' WHERE compliance_status IS NULL OR compliance_status = ''",
      )
      .execute()

    // Standardize status strings to lowercase as requested by UI Labels
    app
      .db()
      .newQuery("UPDATE relacionamentos SET status = 'rascunho' WHERE status = 'Rascunho'")
      .execute()
    app
      .db()
      .newQuery("UPDATE relacionamentos SET status = 'ativo' WHERE status = 'Ativo'")
      .execute()
    app
      .db()
      .newQuery("UPDATE relacionamentos SET status = 'desligado' WHERE status = 'Desligado'")
      .execute()
    app
      .db()
      .newQuery("UPDATE relacionamentos SET status = 'inativo' WHERE status = 'Inativo'")
      .execute()
  },
  (app) => {
    // Reverting data transformation is not safely possible
  },
)
