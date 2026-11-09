# Piloto financeiro ORBIX — implantação verificada

## Resultado em 09/11/2026

Isolamento aplicado no **Skip Cloud principal**, backend gerenciado shrd03. A configuração do destino foi preservada.

O painel de migrações foi inspecionado diretamente: ledger com 27 entradas, tendo **0026_finance_company_isolation** no topo, com data 09/11/2026 e horário 11:01:43 exibido pela interface. A tentativa alternativa criou temporariamente um arquivo 0027; a resposta do agente chamou a implantação de 0027, mas isso não corresponde ao nome persistido no ledger. O repositório mantém a 0026 e não deve adicionar outra execução equivalente.

## Evidências

- finance_companies e finance_memberships existem no backend principal.
- Consulta correlaciona empresa ativa, vínculo ativo, usuário solicitante e can_read na mesma coleção finance_memberships.
- Create/update/delete normais são null nas quatro coleções financeiras. Usuários comuns não podem se autoatribuir empresas ou permissões.
- company_id required em financial_transactions e dashboard_goals; relações e índices por empresa presentes. Metas usam índice único parcial por empresa+mês.
- Snapshot gerenciado comparado com o contrato da migração, incluindo todas as regras e índices.
- Cliente HTTP externo anônimo: quatro coleções retornam 200 com totalItems=0. Backups retornam 403.
- Execução nativa confirmou preservação de 8 lançamentos e 1 meta sem empresa, e backups 8/1 intactos. Nenhum seed, conta, vínculo ou fixture adicionado no principal. Não atribuir esses legados à MAD sem revisão de origem e titularidade.
- Teste A/B autenticado, IDs cruzados 404, escrita 403 e revogação com token existente: realizados na cópia isolada; não repetidos no principal.

## Código e QA

Preview nativo **0.0.177 / 80a744a**, com lint, typecheck e build aprovados. Correções finais de TypeScript preservam o comportamento. Testes locais aplicam a migração real em PocketBase 0.26.6 descartável: 18 cenários (19 resultados incluindo o teste agrupador). Interface: seis cenários aprovados na etapa anterior.

O contrato alvo fica em `tests/fixtures/finance-schema.target.json`; `src/lib/pocketbase/schema.json` continua sendo regenerado pelo Skip. Não armazenar contratos auxiliares dentro da pasta de backend gerenciada.

## Limites e publicação

Frontend **publicado** pela interface em 09/11/2026, versão 0.0.177 / 80a744a. A interface confirmou “Tudo no ar” e passou de Publicar para Visualizar. URL aberta e verificada: `https://plataforma-saas-bf8b5.goskip.app/?v=80a744a`. Visita à rota protegida `/app/financeiro/orbix-piloto` redirecionou para `https://plataforma-saas-bf8b5.goskip.app/login` sem sessão. Não foi efetuado login real do proprietário no aplicativo publicado nesta etapa. O piloto é consulta: sem importação do Supabase e sem criação/aprovação/baixa financeira comum. Sem vínculo autorizado, a interface apresenta a pendência e não saldo financeiro zero.

O backup é lógico e restrito às duas coleções afetadas; não é backup integral de banco, usuários e arquivos. O down da migração é bloqueado: qualquer reversão exige restauração revisada em isolamento.

Supabase conectado para a origem ORBIX; o destino permanece **Skip Cloud**. Cobertura da migração integral em ORBIX_MIGRACAO_INTEGRAL.md.
