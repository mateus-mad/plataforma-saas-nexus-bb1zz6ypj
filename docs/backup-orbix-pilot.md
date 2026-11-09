# Backup lógico restrito — preparação para o piloto ORBIX → Skip

> **Status:** etapa de BACKUP concluída. A migração de isolamento ORBIX (A/B isolation,
> 403 em PATCH/DELETE, revogação de token) **NÃO** foi criada nem aplicada nesta etapa.
> Ela está planejada como **0026** (o número 0025 foi usado por este backup).

## 1. O que este backup cobre (e o que NÃO cobre)

Este backup é **restrito a exatamente duas coleções**, afetadas pela futura migração
de isolamento:

| Coleção original         | Coleção de backup                |
| ------------------------ | -------------------------------- |
| `financial_transactions` | `_backup_financial_transactions` |
| `dashboard_goals`        | `_backup_dashboard_goals`        |

**Este NÃO é um backup integral do projeto.** Não cobre:

- `users` (contas, senhas, tokens de autenticação);
- arquivos (`files`) e qualquer binário;
- qualquer outra coleção (`relacionamentos`, `time_entries`, `work_sites`,
  `configurations`, `audit_logs`, etc.);
- segredos/variáveis de ambiente;
- configurações de coleções além das regras (ex.: hooks).

## 2. Migração aplicada

- **Arquivo:** `pocketbase/migrations/0025_backup_collections.js`
- **O que faz:**
  1. Cria as duas coleções de backup como espelhos das originais — mesmos campos,
     tipos, constraints e índices (prefixo `idx_bkp_`) — com **todas as regras
     null** (`listRule`, `viewRule`, `createRule`, `updateRule`, `deleteRule` =
     `null`), ou seja, invisíveis à API: somente superusuários acessam.
  2. Copia **todos os registros completos** (todos os campos, incluindo metadados de
     extração), preservando `id`, `created` e `updated`. Nenhum usuário, senha, token
     ou segredo é copiado.
  3. É **idempotente**: em reaplicação, substitui o conteúdo do backup pelo estado
     atual das originais (upsert por `id`, removendo do backup registros que não
     existem mais na original). **Nunca escreve nas coleções originais.**
  4. É **no-op em banco vazio**: sem as coleções originais, nada é criado nem
     copiado.
- **Down:** remove as coleções `_restore_test_*` e `_backup_*` (e apenas elas).

## 3. Verificação de restaurabilidade lógica

A própria migração executa a verificação a cada aplicação:

1. Cria coleções temporárias `_restore_test_financial_transactions` e
   `_restore_test_dashboard_goals` (mesma estrutura, regras null).
2. Restaura o conteúdo do backup nelas (todos os campos).
3. Compara com as originais: **contagem** (deve ser igual) e **conteúdo campo a
   campo** (`id`, campos de dados, `created`, `updated` — via `getString`, que
   normaliza datas).
4. **Qualquer divergência falha a migração** (a migração não é marcada como
   aplicada enquanto o backup não for fiel).
5. Ao final, remove as coleções temporárias `_restore_test_*`. As coleções de
   backup permanentes ficam.

Resultado registrado no log da aplicação da migração
(`[backup-orbix] restauração verificada: ...`).

### Como restaurar manualmente (procedimento lógico)

Caso seja necessário restaurar as originais a partir do backup (ex.: após um
incidente durante a migração de isolamento):

1. Abrir o console do backend Skip Cloud (ou uma migração/hook pontual, revisada
   caso a caso — nunca uma migração de dados correntes genérica).
2. Para cada registro em `_backup_financial_transactions` / `_backup_dashboard_goals`:
   - se o `id` não existir na original, recriar o registro com todos os campos do
     backup (mesma lógica de upsert por `id` usada na migração 0025);
   - se existir com conteúdo divergente, sobrescrever os campos com os valores do
     backup.
3. Reaplicar a migração 0025 (é idempotente e revalida o par original↔backup).
4. Conferir as contagens via painel (Collections tab) ou consulta.

Importante: a restauração é **lógica** (registros). Não cobre arquivos nem usuários
(que não estão no backup — ver limites acima).

## 4. Checkpoint de código

Etapa executada a partir do commit corrente do branch `main`:

- **SHA:** `f612c0c3fb9ff7ed5e40673f82ea243df58ad515`

Confirmar a qualquer momento com `git log -1 --format=%H` (o commit desta etapa é
filho direto deste checkpoint).

## 5. Backend gerenciado — sem mudanças de configuração

- Backend do projeto principal: `plataforma-saas-bf8b5.shrd03.internal.goskip.dev`.
- Nenhuma configuração de coleção, regra de acesso (além das novas coleções de
  backup, todas com regras `null`), endpoint, chave pública ou permissão ampla foi
  criada ou alterada nesta etapa.
- Nenhum teste HTTP externo foi repetido (já concluídos pelo proprietário em
  homologação).
- Nenhum dado fictício foi copiado — somente os registros reais das duas coleções.

## 6. Próxima etapa (fora do escopo desta interação)

- Migração **0026** de isolamento ORBIX (aditiva), a ser criada e aplicada
  separadamente, com autorização explícita do proprietário.
