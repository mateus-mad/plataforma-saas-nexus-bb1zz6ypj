# Entrada restrita para migração

As migrações criam três coleções técnicas, sem registros embutidos:

- `_orbix_import_batches`: identificação do lote e arquivos ZIP protegidos.
- `_orbix_source_records`: identificação de origem, conteúdo JSON textual e hash.
- `_orbix_source_files`: caminho original, tamanho, hash e metadados do arquivo.

Todas as regras de API são null. O acesso fica restrito ao console administrativo.
Nenhum usuário, vínculo, senha, token, endpoint público ou permissão de aplicativo é criado.

A relação obrigatória ao lote não usa exclusão em cascata. Índices únicos impedem
repetir uma origem dentro do mesmo lote. Conteúdo JSON é armazenado como texto
para preservar a representação de valores numéricos.

Os arquivos ZIP aceitam apenas application/zip e devem permanecer protegidos.
Antes de enviar arquivos privados, conferir a configuração efetiva do destino.
Importações precisam de conferência por origem e hash; reenvios devem conter
somente registros comprovadamente ausentes. O console gera IDs próprios.

Rollback de estruturas populadas é bloqueado para preservar proveniência e índices.
Os testes locais usam dados sintéticos e banco descartável para verificar acesso,
integridade textual, relações, duplicações e proteção contra rollback.

Dados, exportações, identificadores de projetos, contagens reais e relatórios privados
não fazem parte deste repositório. Entrada técnica de registros é uma etapa distinta
da adaptação funcional dos módulos. O destino usa Skip Cloud; Supabase é a origem.
