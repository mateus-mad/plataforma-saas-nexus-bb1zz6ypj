# ORBIX → Skip — cobertura da migração integral

## Fonte e limites

Inventário extraído de `src/integrations/supabase/types.ts` do ERP.ORBIX, projeto `b048ac29-e657-4a32-9fca-ca231661cbf8`, commit `ddbfa261804a740458b89c0234f454205df5e828`, consultado em 09/11/2026. Há **246 tabelas e uma visão** no schema gerado. Não é confirmação do schema vivo, de existência de dados ou de que todas as funções estejam operacionais. O manifesto `ORBIX_INVENTARIO_SCHEMA.json` conserva nomes, tipos de campos e relações declaradas.

O guia inicial abrangia somente o piloto financeiro de leitura; o pedido atual amplia a meta para migração integral. Não confundir a publicação desse piloto com transferência de todo o ERP.

## Cobertura por domínio

Agrupamento técnico preliminar por nome de tabela, sujeito à validação do banco vivo:

| Domínio                              | Tabelas de origem | Situação no Skip                                        |
| ------------------------------------ | ----------------: | ------------------------------------------------------- |
| Orçamento e suprimentos              |                66 | Mapeamento e dados pendentes; não migrado integralmente |
| CRM e comercial                      |                29 | Mapeamento e dados pendentes; não migrado integralmente |
| Financeiro                           |                15 | Mapeamento e dados pendentes; não migrado integralmente |
| Pessoas, RH e ponto                  |                37 | Mapeamento e dados pendentes; não migrado integralmente |
| Frota, equipamentos e oficina        |                32 | Mapeamento e dados pendentes; não migrado integralmente |
| Obras e planejamento                 |                 6 | Mapeamento e dados pendentes; não migrado integralmente |
| Documentos                           |                10 | Mapeamento e dados pendentes; não migrado integralmente |
| Assistente pessoal                   |                13 | Mapeamento e dados pendentes; não migrado integralmente |
| Identidade, segurança e configuração |                19 | Mapeamento e dados pendentes; não migrado integralmente |
| Outros cadastros e operações         |                19 | Mapeamento e dados pendentes; não migrado integralmente |

A visão `budget_offline_sync_queue` deve ser reconstruída a partir de definição SQL verificada, não copiada como uma tabela de registros.

## Acesso necessário e estado atual

O Lovable informa Supabase habilitado, mas consultas SQL retornam `database_not_managed`: o banco externo não é acessível por esse endpoint. A conexão oficial Supabase foi localizada e oferecida ao proprietário. Não usar chaves privilegiadas no frontend, chat ou repositório. A autenticação recuperada do aplicativo Nexus não concede acesso administrativo ao banco Supabase do ORBIX.

Sem essa conexão não é possível confirmar contagens, empresas, titularidade, RLS, arquivos, funções, gatilhos ou valores para conciliação. Nenhum registro financeiro, RH ou documento real foi copiado neste levantamento.

## Ordem de execução e aceite

1. Inspecionar schema vivo, RLS, vínculos de empresa, contagens e armazenamento via conexão autorizada; obter backup consistente da fonte e do destino antes de transferir dados. Não desativar origem.
2. Construir correspondência explícita de empresas e usuários, seguida de cadastros e relações dependentes. IDs UUID da origem não são os IDs PocketBase; conservar `source_system`, `source_table` e `source_id`, com unicidade por empresa.
3. Modelar cada domínio sem perder campos. No financeiro, preservar valor nominal, valor pago parcial, desconto, juros, aprovação, documentos, contas, centro de custo, obra e datas. Não reduzir tudo a `paid/pending`.
4. Importar primeiro em homologação com relatório por lote, hash e contagens. Reexecutar o lote deve ser idempotente, sem duplicações. Nunca converter senhas/hashes, tokens ou sessões em credenciais do destino.
5. Conferir relações, somas por empresa/período/status, datas civis, anexos permanentes e permissões. Exportações CSV isoladas não substituem definições RLS e armazenamento.
6. Homologar fluxos por módulo e papel. Depois da conferência final, executar corte controlado, publicar e monitorar. A origem deve permanecer disponível até a validação da migração.

O piloto atual testa isolamento de consulta e bloqueia escrita financeira comum. Criação, edição, aprovação, estorno e baixa precisam de regras de servidor e trilha de auditoria próprias antes de liberar esses fluxos. Nenhum teste deve gerar pagamento real.
