# Status — migração Cloudflare

## Arquitetura alvo

- Cloudflare Workers + vinext para Next.js App Router.
- Cloudflare D1 para persistência.
- Cloudflare R2 para comprovantes, VSL/poster e artefatos.
- Cron Trigger de 1 minuto para SLA/distribuição.
- Wrangler para migrations, secrets, deploy e operações.

## Migrações feitas no código

- Removido `mysql2`.
- Queries adaptadas para SQLite/D1.
- Schema convertido para D1 em `migrations/0001_initial.sql`.
- Upload de comprovantes convertido de filesystem para R2.
- Download de comprovantes continua autenticado e autorizado.
- VSL/poster passam a ser servidos pelo Worker a partir do R2.
- Rotina de SLA passa a `scheduled()`.
- Backup passa a `wrangler d1 export`.
- Configuração Cloudflare adicionada em `wrangler.jsonc`.
- Vite/vinext configurados para o runtime Workers.
- Landing page reposicionada como marca própria David Oliveira, sem vínculo visual ou textual com administradora específica.
- Identidade visual atualizada para branco + bege, com copy de consultoria financeira, investimentos e consórcios.
- Testes configurados para resolver o binding `cloudflare:workers` fora do runtime Cloudflare.
- Correção de `insertId` para o retorno correto do adaptador D1.

## Arquivos de mídia

O ZIP recebido não contém `vsl-david.mp4` nem `vsl-poster.jpg`. A aplicação está preparada para buscá-los no R2.

## Antes do primeiro deploy

1. Criar D1 `david-consorcio`.
2. Preencher `database_id` em `wrangler.jsonc`.
3. Criar R2 `david-consorcio-storage`.
4. Configurar `AUTH_SECRET` como secret.
5. Ajustar `APP_URL`.
6. Aplicar `npm run db:migrate`.
7. Subir VSL/poster no R2.
8. Executar `npm run types`.
9. Executar `npm run build`.
10. Executar `npm run deploy`.

## Validação

Validação executada em 2026-09-17:

- `npm test` — 23 arquivos de teste, 41 testes, todos passando.
- `npm run typecheck` — aprovado.
- `npm run build` — aprovado com `vinext build`.

Observação: o build exibiu apenas aviso de proxy do ambiente local; não houve erro de aplicação.
