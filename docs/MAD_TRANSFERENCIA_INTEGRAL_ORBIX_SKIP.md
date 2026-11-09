# MAD Engenharia — transferência integral ORBIX (Lovable) → Skip

**Destino principal:** Skip, `mateus-mad/plataforma-saas-nexus-bb1zz6ypj`.
**Origem imutável:** ERP.ORBIX do Lovable, repositório `mateus-mad/daily-clock-smart`, commit `ddbfa261804a740458b89c0234f454205df5e828`.
O hash da origem coincide com o último commit inspecionado no Lovable.

## Estado atual verificável
- O código completo do ORBIX **já está sob controle da conta GitHub MAD**, no repositório de origem; não é necessário reconstituir milhares de linhas.
- O código atual do Skip permanece no repositório de destino. Nenhum merge de ERPs deve sobrescrever `src/App.tsx`, `src/pages` nem os hooks existentes sem adaptação.
- O primeiro experimento de painel financeiro está na branch `test/orbix-finance-pilot-mad`, PR #1 em rascunho.
- Esta branch `migration/full-orbix-source-to-skip` prepara a transferência integral da **fonte do código**. Integrar recursos ao aplicativo é trabalho distinto e exige testes.
- O script `scripts/mad-stage-orbix.sh` adiciona o repositório original como submódulo Git fixado em versão. Deve ser executado apenas em uma cópia local e branch migration/*. Não altera os bancos.

## Como importar todo o código para o repositório Skip (sem duplicar banco)
1. Clonar o repo Skip em um ambiente de desenvolvimento autorizado, entrar na branch `migration/full-orbix-source-to-skip`.
2. Executar `bash scripts/mad-stage-orbix.sh`. A autenticação do GitHub da MAD deve permitir ler o repo ORBIX.
3. Conferir `git diff --cached -- .gitmodules vendor/erp-orbix`. O submódulo é um **vínculo versionado**, não uma cópia independente dos bytes.
4. Fazer commit somente se os links de origem, hashes e arquivos estiverem corretos.
5. Para preservar total independência da origem, criar separadamente um arquivo `git archive` verificado e armazená-lo em backup privado da MAD. Não publicar chaves/segredos e nunca copiar `.env` de produção sem revisão.

## Compatibilidade entre projetos
| Área | Lovable ORBIX | Skip | Trabalho de adaptação |
|---|---|---|---|
| Frontend | React 18, TypeScript, Vite | React 19, TypeScript, Vite | Verificar hooks, rota, dependências, tipos |
| Banco | Supabase/PostgreSQL | PocketBase/SQLite | Modelar tabelas/coleções e migrar dados explicitamente |
| Identidade | Supabase Auth | autenticação Skip/PocketBase | Substituir verificações por serviço autorizado no backend |
| Obras | `sites` | gestão de obras no Skip | Criar chave canônica, validar status/escopo |
| Pessoas | `employees` | cadastros de equipe | Dedupe e vínculos empresa/obra |
| Pontos | `time_entries`, `time_work_sessions` | ponto do Skip | Conciliar jornada, fuso e sobreposições |
| Folha | `payroll`, RPCs | não homólogo integral | Migrar cálculos sob testes e aprovação |
| Financeiro | `accounts_payable`, `accounts_receivable` | `financial_transactions` | Não misturar quitação com status; autorização no servidor |
| Arquivos | Supabase Storage | storage PocketBase | Cópias com checksum e controle LGPD |

## Sequência técnica para a transferência funcional
1. **Segurança e dados:** bloquear permissões financeiras amplas no servidor, mapear tenant/empresa e garantir backups.
2. **Cadastros e relacionamento:** obras, pessoas e fornecedores com identificadores e deduplicação.
3. **Ponto e folha:** jornada, pagamento e PDF padrão MAD com comparação entre os dois sistemas.
4. **ERP:** pagar/receber, centros de custo, compras, estoque, CRM, orçamento e equipamentos.
5. **Homologação:** testes unitários, E2E, controle de custos, recuperabilidade, controle de acesso interempresas e auditoria. Publicar somente após aprovação.

## Política de custo
- Não contratar novo Supabase nem duplicar banco antes de decidir persistência oficial.
- Não executar SQL migrations, sincronização de produção, upload de arquivos nem importação de dados reais automaticamente.
- O link Git de origem permanece disponível, inclusive se o Lovable deixar de ser utilizado para programar, sujeito à manutenção do repositório privado.

## Observação importante
A transferência do código **não é o mesmo que transferência funcional e dos dados**. Esta branch de preparação não está implantada no Skip hospedado e não torna o ERP pronto para pagamentos.
