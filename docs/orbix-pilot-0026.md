# Piloto Financeiro ORBIX — Aplicação da Migração 0026

## Resultado

- Migração aplicada via mecanismo nativo de migrações PocketBase (arquivo `pocketbase/migrations/0026_finance_company_isolation.js`).
- Antes: 0025 (backups `_backup_financial_transactions` e `_backup_dashboard_goals`) verificada como já aplicada, com contagens 8/8 (lançamentos) e 1/1 (meta), e regras de API `null` (somente superusuário).
- Nenhum seed histórico reaplicado, nenhum snapshot importado, nenhum vínculo de empresa atribuído automaticamente aos 8 lançamentos legados nem à 1 meta, nenhuma fixture copiada, nenhum novo vínculo concedido a contas.

## Metadados da migração

| Item               | Valor                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| Arquivo            | `pocketbase/migrations/0026_finance_company_isolation.js`                                             |
| Versão             | 0026                                                                                                  |
| Aplicada em        | (ver list_migrations após o build)                                                                    |
| Coleções criadas   | `finance_companies`, `finance_memberships`                                                            |
| Campos adicionados | `company_id` (relation → finance_companies, required) em `financial_transactions` e `dashboard_goals` |
| Regras de consulta | correlacionam empresa/vínculo/usuário/can_read na mesma coleção `finance_memberships`                 |

## Verificação pós-aplicação

### financial_transactions

- 8 lançamentos legados preservados, **sem** `company_id` (não atribuídos a nenhuma empresa).
- `company_id` obrigatório apenas para **novos** registros (campo relation required).
- Regras `list`/`view` correlacionam `company_id` com `finance_memberships` (usuário ativo, can_read, empresa ativa).
- Regras `create`/`update`/`delete` = `null` (bloqueadas para usuários sem superusuário).

### dashboard_goals

- 1 meta legada preservada, **sem** `company_id`.
- `company_id` obrigatório para novos registros (relation required).
- Regras de consulta correlacionam empresa/vínculo como acima.
- `create`/`update`/`delete` = `null`.

### Backups

- `_backup_financial_transactions`: 8 registros, regras `null` (somente superusuário).
- `_backup_dashboard_goals`: 1 registro, regras `null` (somente superusuário).
- Índices de backup prefixados `idx_bkp_*` intactos.

## Escopo do piloto ORBIX (presente e preservado)

- `src/features/orbix-finance/*` (FinanceOrbixPilot, finance-reader, finance-summary).
- Rota `/app/financeiro/orbix-piloto` em `src/App.tsx`.
- Aviso/link em `src/pages/app/Financial.tsx` → "Abrir consulta ORBIX por empresa".
- `Login` sem alterações do piloto (confirmado: nenhum trecho orbix em Login.tsx).

## QA / Compilação

- Lint, typecheck e build executados; erros preexistentes corrigidos (BrowserRouter future flags, sidebar `isUpcoming`, ícones com prop `title`, payload do Recharts, LegendPayload, crypto `BufferSource`, `database.ts`).
- Nenhum teste removido; nenhum endpoint, hook ou regra de teste criado; dependências e configuração protegida inalteradas.

## Testes já realizados (não repetidos aqui)

- 18 cenários de cálculo/API + 6 de navegador passaram localmente na cópia.
- HTTP A/B real (isolamento entre empresas, 404, 403, revogação de token) passou na cópia de homologação.

## Limitações

- Esta instância (PRINCIPAL / shrd03) não recebeu atribuição automática de empresa aos legados: o painel ORBIX no PRINCIPAL só retornará dados após o proprietário criar empresas em `finance_companies`, vínculos em `finance_memberships` e atribuir `company_id` — manualmente, via painel Skip Cloud.
- A migração não pode ser revertida automaticamente (`down` lança erro proposital; restaure backup revisado em isolamento).
- HTTP A/B entre empresas (usuário A não vê dados da empresa B, 403 em escrita sem vínculo) foi validado na cópia de homologação, não nesta instância — os testes não foram repetidos aqui por ordem do escopo.
- Produção não publicada nesta chamada; publicação fica a cargo do proprietário pela interface.
