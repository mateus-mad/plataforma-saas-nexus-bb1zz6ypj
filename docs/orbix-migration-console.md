# Console de migração com autorização por lote

O console oferece conferência e entrada de registros e ZIPs protegidos quando o
importador do painel não atende ao fluxo. Usa o cliente PocketBase já configurado
no aplicativo; nenhuma chave administrativa, senha ou sessão é copiada.

O pacote JSON contém manifesto, registros com payload textual, índice de arquivos
e hashes dos ZIPs. O cliente valida todo o pacote e concilia o conteúdo existente
antes de gravar. Origens iguais são preservadas; divergências interrompem a entrada.
Reenvios retomam os itens ausentes e os números decimais permanecem no texto original.

O registro de operadores começa vazio. Somente a administração pode criar ou revogar
um operador. Cada vínculo vale para uma conta e um lote; leitura e envio exigem vínculo
ativo com as capacidades correspondentes. Nenhuma conta é ativada pelo código.
Registros e metadados de arquivos permanecem imutáveis pela API comum. O pedido de
atualização do lote aceita somente o primeiro envio de cada ZIP; mudanças nos campos
do manifesto e substituição ou remoção de arquivos são bloqueadas no servidor.

## Implantação controlada

1. Revisar e aprovar a conta e o lote que receberão acesso aos dados privados.
2. Preservar o estado do destino e conferir o ledger antes de aplicar as migrações.
3. Criar o registro vazio de operadores pela migração `0030`.
4. Registrar os três handlers de `orbix_staging_integrity.pb.js` pelo mecanismo
   gerenciado. Verificar validação de hash, bloqueio de credenciais e imutabilidade.
5. Aplicar `0031`, conferindo as condições de acesso, a proteção efetiva dos arquivos
   e o tamanho e MIME aceitos. Sem operador ativo, a API continua sem fornecer dados.
6. Publicar a tela e verificar o estado sem autorização antes de ativar qualquer conta.
7. Ativar somente o vínculo aprovado, depois conferir acesso e recusas com sessão real.
8. Conferir o pacote, retomar a importação, enviar os ZIPs e comparar os bytes gravados
   com os hashes do manifesto. Revogar o envio quando essa etapa estiver encerrada.

As permissões e hooks devem ser conferidos juntos antes da ativação. Nunca cadastrar
operadores antes da validação do servidor. Em caso de interrupção, preservar os dados,
identificar o que entrou e retomar; não executar rollback de coleções populadas.

## Verificação

`tests/orbix-migration-console.test.mjs` usa um PocketBase local descartável com
contas e arquivos sintéticos. Verifica isolamento por lote, tentativa de autoatribuição,
credenciais excluídas, hash, reenvio, arquivos privados, imutabilidade e revogação.
`tests/orbix-migration-ui.test.mjs` verifica a tela com respostas sintéticas.

Este código não contém dados reais, contagens operacionais, identificadores de projetos,
nomes de contas ou arquivos da origem. Relatórios e pacotes reais permanecem privados.
A entrada técnica não substitui a adaptação e a homologação dos módulos operacionais.
