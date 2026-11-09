# ORBIX → Skip — contrato do piloto financeiro

## Fonte inspecionada

Projeto Lovable `ERP.ORBIX` (`b048ac29-e657-4a32-9fca-ca231661cbf8`), commit `ddbfa261804a740458b89c0234f454205df5e828`. A inspeção leu código, sem consultar/copiar registros financeiros.

Arquivos: `src/components/FinancialOverview.tsx`, `FinancialPayables.tsx` e `FinancialReceivables.tsx`.

## Correspondência e limites

| ORBIX                                            | Piloto Skip                                 | Tratamento                                                                                          |
| ------------------------------------------------ | ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `accounts_payable`                               | `financial_transactions`, `type=expense`    | Correspondência conceitual; nenhum importador executado                                             |
| `accounts_receivable`                            | `financial_transactions`, `type=income`     | Correspondência conceitual; nenhum importador executado                                             |
| `description`                                    | `description`                               | Mesmo significado                                                                                   |
| `amount`                                         | `amount`                                    | Mesmo valor nominal; sem inferir saldo após pagamento parcial                                       |
| `due_date`                                       | `due_date`                                  | Data de vencimento, preservada como data civil                                                      |
| `payment_date`                                   | `payment_date`                              | Data informada; não comprova conciliação                                                            |
| `status=pending/paid/cancelled`                  | `status`                                    | Requer validar domínio completo antes de importar; não mapear estados desconhecidos silenciosamente |
| `supplier_id` / `customer_id`                    | `relacionamento_id`                         | Exige tabela de correspondência por empresa; IDs não são intercambiáveis                            |
| `approval_status`, `approved_at`, `approved_by`  | Sem equivalente no piloto                   | Preservar como etapa de modelagem; não converter aprovação em pagamento                             |
| `document_number`, `document_type`, `issue_date` | Sem equivalente dedicado                    | Não perder rastreabilidade em uma futura importação                                                 |
| `cost_center_id`, `site_id`, `account_id`        | Sem equivalente no piloto                   | Exige relações isoladas por empresa antes da migração                                               |
| `payment_method`, anexos de fatura               | Sem equivalente dedicado                    | Não copiar URLs assinadas temporárias como anexos permanentes                                       |
| Origem Supabase e `id`                           | Chave de origem ainda não modelada          | Prevenção de duplicidade é pré-requisito de importação                                              |
| Empresa autorizada                               | `finance_companies` + `finance_memberships` | Cadastro administrativo explícito; nunca deduzido de nome, usuário ou tenant demonstrativo          |

O piloto utiliza os lançamentos já existentes no PocketBase; não faz sincronização periódica com Supabase. O ORBIX mantém tabelas e recursos que o piloto ainda não representa, incluindo aprovação e vínculos contábeis. A transferência nesta etapa é da lógica de consulta e indicadores.

## Operação no Skip

- Projeto principal: `af44e044-8a93-4b25-a413-19c99ab6e5cd` — Plataforma SaaS Nexus, repositório confirmado na interface: `mateus-mad/plataforma-saas-nexus-bb1zz6ypj`.
- Homologação: `aab3c043-4734-4a5a-add7-34c111dd6a24` — MAD — Homologação ORBIX → Skip, criado pela duplicação nativa em 09/11/2026.
- Backend principal confirmado no painel Skip Cloud em 09/11/2026: `plataforma-saas-bf8b5.shrd03.internal.goskip.dev`. O `.env` exportado apontava para `shrd00`; preservar a configuração gerenciada atual e não copiar esse endereço antigo para a implantação.
- Backend da homologação confirmado no painel Skip Cloud: `plataforma-saas-copy-49ea6.shrd01.internal.goskip.dev`.
- O painel original mostrou 14 coleções, com 8 lançamentos e 1 meta; a cópia começou com 6 coleções. A duplicação não comprova clonagem integral dos registros.
- Não tratar duplicação de código como prova de backup completo/restaurável do banco principal. Os testes da cópia não certificam dados ou configurações da produção.

O relatório de homologação registra resultados e pendências separadamente em `MAD_ORBIX_SKIP_HOMOLOGACAO.md`.
