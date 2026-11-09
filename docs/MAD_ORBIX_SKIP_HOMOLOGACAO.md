# MAD Engenharia — bloqueios de homologação do piloto ORBIX → Skip

## Situação
Esta branch é experimental. **Não publicar nem fazer merge antes de corrigir a autorização de leitura do financeiro no servidor.** Nenhuma baixa financeira, Pix ou aprovação deve depender deste painel.

## Evidências do código exportado
- Banco: PocketBase/SQLite, coleção `financial_transactions`.
- A configuração `src/lib/pocketbase/schema.json` declara `list`, `view`, `create`, `update` e `delete` como `@request.auth.id != ''`. Portanto, **qualquer usuário autenticado pode acessar e modificar registros** segundo esse arquivo de configuração.
- Campos existentes: description, type, amount, due_date, payment_date, status, relacionamento_id, user_id e notes. A coleção ainda não possui vínculo explícito obrigatório a empresa, obra ou centro de custo.
- O frontend tem uma proteção de rota do módulo Financeiro, mas proteção de tela **não substitui** regras de autorização do PocketBase.
- A tela financeira anterior usa `financial_v2` com dados de demonstração. Ela permanece intacta.

## Critérios para liberar um piloto com dados reais
1. Definir e implementar modelo obrigatório de empresa/tenant e política de acesso por vínculo de usuário, com as regras aplicadas **no backend**, não apenas no React.
2. Separar acesso de consulta, lançamento, aprovação e baixa, usando permissões de perfil. Negar alterações por padrão.
3. Testar com duas contas de empresas diferentes que a conta A não consegue consultar nem alterar registros da B, inclusive por chamada HTTP direta.
4. Impedir baixa financeira sem autorização correspondente; registrar trilha de auditoria com usuário, data, valor anterior e novo.
5. Conferir status com comprovante bancário e lançamentos no Mais Controle, nunca inferir quitação por `status = paid`.
6. Confirmar que a exportação/restauração do banco e dos arquivos associados funcionam.
7. Executar build e smoke test da nova rota `/app/financeiro/orbix-piloto` em ambiente de teste.
8. Somente depois reconsiderar merge/publicação; esta PR deve permanecer em rascunho enquanto qualquer item estiver pendente.

## Controles do protótipo
- A função de consulta chama apenas `getFullList`; não cria, edita ou exclui registros.
- A rota é protegida pelo controle de acesso do módulo Financeiro do Skip.
- O componente informa explicitamente que não é conciliação financeira nem confirmação de Pix.
- Nenhum dado real foi copiado do Supabase do ORBIX ou migrado do PocketBase.

## Regra de decisão
A solução de menor custo é corrigir e validar a base existente antes de criar outro banco, contratar outra assinatura ou fundir ERPs inteiros.
