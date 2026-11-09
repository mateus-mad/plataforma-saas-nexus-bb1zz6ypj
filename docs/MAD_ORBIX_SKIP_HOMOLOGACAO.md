# MAD Engenharia — integração ORBIX → Skip

## Estado em 09/11/2026

Branch `test/orbix-finance-pilot-mad`; PR #1 em rascunho. O piloto adapta indicadores do ORBIX para o PocketBase do Skip. A etapa atual implementa **consulta isolada por empresa no servidor**. Não é integração completa dos ERPs nem migração financeira homologada.

A migração `0025_finance_company_isolation.js` foi executada somente em banco local descartável com PocketBase **0.26.6** e fixture legada. O PocketBase hospedado no Skip, o Supabase do ORBIX e a produção não foram alterados. A versão do servidor hospedado ainda precisa ser confirmada.

## Alteração de autorização

| Coleção | Consulta normal | Escrita normal |
| --- | --- | --- |
| `finance_companies` | Empresa ativa e vínculo ativo com `can_read` | Bloqueada |
| `finance_memberships` | Somente vínculo do próprio usuário com acesso ativo | Bloqueada |
| `financial_transactions` | Empresa ativa e vínculo ativo do solicitante com `can_read` | Bloqueada |
| `dashboard_goals` | Mesma regra de lançamentos | Bloqueada |

As regras são aplicadas por PocketBase, inclusive em HTTP direto; filtros React não concedem acesso. Superusuários continuam tendo poderes administrativos e suas credenciais nunca devem ir ao frontend. Usuários não podem se autoatribuir empresas ou permissões.

`company_id` é uma relação obrigatória para novos lançamentos/metas. Os registros existentes sem empresa permanecem armazenados e ocultos das contas normais. **Não há atribuição automática à MAD, exclusão ou classificação automática como dado real.** A migração histórica 0024 insere dados demonstrativos; esses registros também ficam sem empresa. Revisar origem e titularidade antes de qualquer atribuição administrativa.

O índice mensal das metas passa de global para `(company_id, month)`, sem conflitar com registros legados. O snapshot `src/lib/pocketbase/schema.json` descreve o alvo da migração pendente; não representa uma exportação do servidor em produção.

## Interface do piloto

- Rota: `/app/financeiro/orbix-piloto`, autenticada e condicionada ao módulo Financeiro.
- Consulta primeiro as empresas autorizadas e exige uma seleção válida antes dos lançamentos.
- Sem vínculo ou com falha de leitura, informa a pendência; não apresenta saldo zero como resultado.
- Carregamento oculta indicadores; troca de empresa descarta registros e respostas anteriores.
- Consulta somente leitura, sem fallback para demonstração ou armazenamento local.
- Exibe até 100 linhas e informa quando os indicadores incluem registros além das linhas visíveis.
- O status `paid` é informação do banco, não comprovação bancária/Pix nem lançamento no Mais Controle.

O seletor de empresas desta página usa `finance_companies`. O seletor global `useTenantStore` ainda é demonstrativo e não é fonte de autorização. Não assumir que o restante do ERP está isolado por empresa.

## Validação reproduzível

Usar Node 24 e o lockfile existente:

```bash
pnpm install --frozen-lockfile --ignore-scripts
pnpm run build
pnpm exec oxlint src/features/orbix-finance src/services/financial_transactions.ts
node --experimental-strip-types --test tests/finance-orbix-pilot.test.mjs
POCKETBASE_BIN=/caminho/pocketbase-0.26.6 node --experimental-strip-types --test tests/finance-isolation.test.mjs
```

O teste de isolamento cria banco temporário em loopback, senhas aleatórias e duas empresas fictícias; aplica a migração real sobre fixture legada, sem executar seeds históricos de usuários. Testa regras/snapshot, preservação do legado, empresas A/B, IDs e filtros diretos, convidados, ausência de vínculo, permissão negada em outra empresa, metas mensais, tentativa de criar/editar/baixar/excluir e autoatribuir permissão, leitor do piloto, revogação e empresa inativa. Remove o banco ao terminar. Não aceita URL remota.

Resultados desta etapa: build aprovado (avisos preexistentes sobre tamanho de bundle/imports); lint dos arquivos alterados sem avisos; cálculos e integração PocketBase aprovados. A sequência completa das migrações históricas não foi reaplicada e não está certificada.

O `tsc` global continua bloqueado pela configuração preexistente `paths: {"*/*": ...}` (TS5061). A checagem dirigida do módulo foi executada com configuração temporária que mantém somente o alias `@/*`; não foi alterado o arquivo de configuração do Skip.

O roteiro automatizado opcional `tests/finance-ui.test.mjs` usa respostas sintéticas e requer Playwright com Chromium instalado. **Ainda não validado**: a execução não passou da abertura do navegador; o download do Chromium retornou ZIP inválido neste ambiente. Não conta como aceite de tela, login real ou comportamento mobile.

## Aplicação em homologação

1. Manter esta PR em rascunho. Confirmar versão e diretórios efetivos do PocketBase no Skip.
2. Gerar backup consistente do banco e arquivos; demonstrar restauração em uma instância isolada antes da aplicação hospedada.
3. Usar cópia isolada do banco existente, revisar colisões com nomes/campos da nova migração e aplicar a 0025 pelo mecanismo do Skip. Não executar seeds antigos separadamente nem importar o snapshot parcial como substituto de todas as coleções.
4. Por administração confiável do PocketBase, cadastrar duas empresas fictícias ativas e seus vínculos com usuários de teste (`company_id`, `user_id`, `active=true`, `can_read=true`). Não usar superusuário no app.
5. Cadastrar apenas lançamentos fictícios atribuídos explicitamente à empresa correta. Verificar que legado sem empresa segue oculto. Não usar a migração para deduzir titularidade.
6. Repetir os testes HTTP na versão efetiva, verificar logins e a rota pelo navegador, incluindo falta de módulo, falta de vínculo, seleção, erros, atualização, celular e troca rápida de empresa.
7. Conferir impactos nas telas antigas: consultas passam a filtrar por empresa e escritas em `financial_transactions`/`dashboard_goals` passam a ser negadas. A tela antiga `Financial.tsx` ainda usa `financial_v2` e demonstração/localStorage; não é fonte oficial de saldo. O dashboard deve ser homologado para registros ocultos/metas sem vínculo.

Não existe downgrade automático da 0025: retornar regras amplas da 0024 reabriria acesso e apagaria atribuições. Para reversão, restaurar o backup revisado em isolamento e decidir o próximo passo. Não publicar o frontend apontando para o servidor antigo sem a nova migração: o piloto mostrará erro ao consultar empresas inexistentes.

## Pendências para integração completa

- Homologação hospedada, backup/restauração e validação de navegador.
- Modelo ORBIX → PocketBase para obras/centros de custo, fornecedores, parcelas, competência e chave de origem contra duplicidade; mapear o schema atual da fonte antes de importar.
- Permissões separadas de lançamento, edição, aprovação e baixa, com trilha de auditoria confiável no servidor. Nesta etapa todas as escritas normais estão bloqueadas.
- Remover dependência dos dados demonstrativos no financeiro e no tenant global; revisar isolamento dos demais módulos e possíveis expansões de relações antes de migrar dados.
- Importação reversível e conferência com comprovantes/contabilidade/Mais Controle antes de qualquer uso real.

## Referências de implementação

- https://pocketbase.io/docs/api-rules-and-filters/
- https://pocketbase.io/docs/js-migrations/

A documentação atual pode descrever versões posteriores; os testes locais executaram 0.26.6. A aprovação local não autoriza considerar a produção homologada.
