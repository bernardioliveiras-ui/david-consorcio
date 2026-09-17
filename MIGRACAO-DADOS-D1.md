# Migração de dados MySQL → D1

A conversão de infraestrutura foi feita, mas o ZIP não contém uma exportação dos dados de produção do MySQL. Portanto, nenhum dado existente foi inventado ou copiado.

O D1 usa SQLite. Um dump MySQL não deve ser aplicado diretamente sem conversão.

Fluxo recomendado:

1. Exportar os dados do MySQL de produção.
2. Converter o dump para SQL compatível com SQLite/D1.
3. Preservar os IDs atuais quando possível.
4. Importar as tabelas na ordem das dependências.
5. Validar contagens e relacionamentos.
6. Migrar os comprovantes do filesystem antigo para os objetos equivalentes no R2.
7. Somente depois apontar o domínio para o Worker.

O schema D1 final está em `migrations/0001_initial.sql`.

Para importar SQL compatível:

```bash
npx wrangler d1 execute david-consorcio --remote --file ./migration-data.sql
```

O Wrangler também permite exportar D1 para SQL:

```bash
npx wrangler d1 export david-consorcio --remote --output ./d1-export.sql
```

Não coloque senhas, tokens ou dumps de produção no Git.
