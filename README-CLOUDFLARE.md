# David Consórcio — Cloudflare 100%

Esta versão foi migrada de MySQL/Hostinger para Cloudflare Workers + D1 + R2.

## Arquitetura

- Next.js App Router executando em Cloudflare Workers via vinext.
- D1 para CRM, autenticação, leads, vendas, auditoria e configurações.
- R2 para comprovantes privados e VSL/poster.
- Cron Trigger a cada minuto para o SLA de 5 minutos.
- Wrangler para migrations, deploy e operações.
- Nenhum filesystem persistente é necessário em produção.

## 1. Instalação

Node.js 22+:

```bash
npm ci
```

## 2. Criar os recursos

```bash
npx wrangler login
npx wrangler d1 create david-consorcio
npx wrangler r2 bucket create david-consorcio-storage
```

Copie o `database_id` retornado pelo D1 para `wrangler.jsonc`.

O nome do binding deve permanecer `DB` e o bucket `STORAGE`.

## 3. Configurar secrets

```bash
npx wrangler secret put AUTH_SECRET
```

Informe um segredo aleatório de pelo menos 32 caracteres.

Edite `vars.APP_URL` no `wrangler.jsonc` com o domínio definitivo.

## 4. Banco

Aplicar a migration em produção:

```bash
npm run db:migrate
```

Para desenvolvimento local:

```bash
npm run db:migrate:local
```

O schema deployável está em `migrations/0001_initial.sql`.

## 5. VSL e poster

Os arquivos de mídia não estavam presentes no ZIP recebido. Quando tiver os arquivos, envie para R2:

```bash
npx wrangler r2 object put david-consorcio-storage/videos/vsl-david.mp4 --file ./vsl-david.mp4
npx wrangler r2 object put david-consorcio-storage/videos/vsl-poster.jpg --file ./vsl-poster.jpg
```

A landing page já aponta para as rotas do Worker que leem esses objetos.

## 6. Deploy

```bash
npm run types
npm run build
npm run deploy
```

O Worker inclui o `scheduled()` que processa:

1. SLAs vencidos;
2. redistribuição;
3. fila de leads aguardando distribuição.

O cron está configurado para `* * * * *`.

## 7. Primeiro Admin

O projeto anterior criava o primeiro usuário via `scripts/user-create.ts`, dependente de MySQL. Nesta versão a persistência é D1.

Para criar o primeiro Admin, gere primeiro um hash bcrypt usando a mesma versão de `bcryptjs` instalada e depois execute uma inserção via Wrangler. Exemplo:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('TROQUE-ESTA-SENHA',12).then(console.log)"
```

Depois:

```bash
npx wrangler d1 execute david-consorcio --remote --command "INSERT INTO users (name, username, password_hash, role, status, must_change_password) VALUES ('Administrador','admin','HASH_GERADO','ADMIN','ATIVO',1)"
```

Troque `HASH_GERADO` pelo resultado anterior.

## 8. Comprovantes

Comprovantes não são publicados diretamente. Eles são gravados no R2 em `sales/...` e recuperados somente pela rota autenticada de documentos.

A validação continua verificando tamanho e magic bytes para PDF/JPEG/PNG.

## 9. Backup

Não existe mais `mysqldump`, `UPLOAD_DIR` ou `BACKUP_DIR`.

O banco passa a ser administrado pelo ciclo de migrations/time travel do D1, e os objetos ficam no R2. Para operações de backup/exportação do D1 use Wrangler/D1 no ambiente de operação.

## 10. Desenvolvimento

```bash
npm run dev
```

Para testar o Worker/Bindings localmente:

```bash
npx wrangler dev
```

## Observações

- `database/schema.sql` foi mantido apenas como referência histórica; a fonte de deploy é `migrations/`.
- O código não usa `mysql2`.
- Não há dependência de disco local em produção.
- `AUTH_SECRET` deve ser configurado como secret do Worker.

## Correção para Workers Builds (GitHub)

O Worker de entrada também existe na raiz como `worker.ts`, e o `wrangler.jsonc` aponta para `./worker.ts`. Isso evita problemas de sincronização/empacotamento de diretórios no Workers Builds ao criar o repositório Git de destino.

O deploy continua usando `npx @vinext/cloudflare deploy`.
