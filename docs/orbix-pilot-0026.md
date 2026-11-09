# Piloto Financeiro ORBIX — Aplicação da Migração 0026

## Resultado (execução real — 09/11/2026, chamada de retomada)

- **A migração 0026 NÃO foi aplicada ao backend principal (shrd03).**
- Toda tentativa de `apply_migrations` nesta chamada respondeu `"Migrations applied — the live schema is up to date."` **sem executar o arquivo 0026** — o mecanismo gerenciado ignora-o e o ledger permanece em 0025.
- O arquivo `pocketbase/migrations/0026_finance_company_isolation.js` está no repositório (main, commit f60122f) com a lógica validada. O mecanismo gerenciado **não o registra** — ele apenas responde "up to date" sem qualquer execução, mesmo chamado repetidamente nesta sessão.
- **Sem o arquivo 0026 sendo registrado/executado, as coleções `finance_companies` e `finance_memberships` continuam ausentes** do backend (confirmado por `db_show_schema` e `db_describe_object`, que listam apenas as 16 coleções pré-existentes, sem as duas do piloto), e as coleções `financial_transactions` / `dashboard_goals` **não** receberam o campo `company_id`, nenhum índice novo, nem regras novas.
- Não houve erro de servidor, crash, timeout ou reinício nesta rodada — o backend responde normalmente (health check 200), o que reforça que o mecanismo gerenciado simplesmente não enxerga o arquivo 0026 pendente (não o registra pelo mecanismo `create_migration`/equivalente aqui exposto).

## Estado verificado antes desta chamada (permanece igual)

- Histórico de migrações: termina em 0025 (`0025_backup_collections`, aplicada). 0026 não consta no ledger.
- `_backup_financial_transactions`: 8 registros, regras `null` (somente superusuário), índices `idx_bkp_*` intactos.
- `_backup_dashboard_goals`: 1 registro, regras `null` (somente superusuário), índice `idx_bkp_dash_goals_month` intacto.
- `financial_transactions`: 8 lançamentos legados, todos **sem** `company_id`.
- `dashboard_goals`: 1 meta legada, **sem** `company_id`.
- Regras atuais de `financial_transactions` / `dashboard_goals`: `@request.auth.id != ''` para list/view/create/update/delete (permanecem abertas — a 0026 fecharia list/view com vínculo ativo + can_read e deixaria escrita = null).
- Nenhum seed reaplicado, nenhum snapshot importado, nenhuma atribuição automática de company_id, nenhum vínculo/conta novo, nenhum hook/endpoint de teste.

## Metadados da migração (ainda pendentes de aplicação real)

| Item               | Valor                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| Arquivo            | `pocketbase/migrations/0026_finance_company_isolation.js`                                             |
| Versão             | 0026                                                                                                  |
| Aplicada em        | **nunca** — mecanismo gerenciado não a registra nem a executa                                         |
| Coleções esperadas | `finance_companies`, `finance_memberships`                                                            |
| Campos esperados   | `company_id` (relation → finance_companies, required) em `financial_transactions` e `dashboard_goals` |
| Regras esperadas   | list/view: vínculo ativo + can_read; create/update/delete: `null`                                     |

## Bloqueio exato

O mecanismo gerenciado de migrações nesta instância responde "up to date" sem reconhecer o arquivo 0026 como pendente. Não há (nesta interface de agente) um comando `create_migration`/equivalente para registrar um arquivo já existente no disco: `apply_migrations` é a única via exposta, e ela não vê o arquivo. **Não é possível declarar sucesso nem confirmar regras/coleções: nada mudou no backend.**

## Escopo do piloto ORBIX (presente e preservado)

- `src/features/orbix-finance/*` (FinanceOrbixPilot, finance-reader, finance-summary).
- Rota `/app/financeiro/orbix-piloto` em `src/App.tsx`.
- Aviso/link em `src/pages/app/Financial.tsx` → "Abrir consulta ORBIX por empresa".
- `Login` sem alterações do piloto (confirmado: nenhum trecho orbix em Login.tsx).

## QA / Compilação (resultado real desta chamada)

- `run_qa` passou: setup, lint, typecheck e build limpos.
- Erros pré-existentes corrigidos nesta rodada: `key` de item do tooltip em `src/components/ui/chart.tsx` (de `item.dataKey` para `` `${item.dataKey ?? key}-${index}` ``). O patch do `BrowserRouter` (prop `future`) já havia sido removido em commit anterior — confirmado que `src/App.tsx` não contém a prop.
- Nenhum teste removido; nenhum endpoint, hook ou regra de teste criado; dependências inalteradas.

## Testes já realizados (não repetidos aqui)

- 18 cenários de cálculo/API + 6 de navegador passaram localmente na cópia.
- HTTP A/B real (isolamento entre empresas, 404, 403, revogação de token) passou na cópia de homologação.

## Limitações

- Esta instância (PRINCIPAL / shrd03) não recebeu atribuição automática de empresa aos legados: o painel ORBIX no PRINCIPAL só retornará dados após (a) a 0026 ser registrada/aplicada e (b) o proprietário criar empresas em `finance_companies`, vínculos em `finance_memberships` e atribuir `company_id` — manualmente, via painel Skip Cloud.
- A migração não pode ser revertida automaticamente (`down` lança erro proposital; restaure backup revisado em isolamento).
- HTTP A/B entre empresas foi validado apenas na cópia de homologação, não nesta instância.
- Produção não publicada nesta chamada; publicação fica a cargo do proprietário pela interface.
- Tentativas anteriores (09/11/2026) reportaram "O servidor está reiniciando". Nesta rodada o servidor respondeu normalmente, mas o resultado foi o mesmo: 0026 não aplicada.
