# David Oliveira — Consultoria Financeira e Consórcios

Plataforma Cloudflare para LP com VSL, captação de leads, round-robin de
consultores, SLA de 5 minutos, CRM, integração BERN MKT por CSV, vendas com
comprovante privado e aprovação manual do Admin.

## Desenvolvimento

```bash
npm ci
npm run test
npm run typecheck
npm run build
```

## Deploy

Use o guia [README-CLOUDFLARE.md](./README-CLOUDFLARE.md).

## Identidade visual

A implementação usa bege + branco, com texto em marrom escuro apenas para legibilidade.
O posicionamento é marca própria de David Oliveira, sem vínculo visual ou textual com
administradora específica.


## Cloudflare

A versão atual deste repositório foi preparada para Cloudflare Workers + D1 + R2. Consulte `README-CLOUDFLARE.md` para criação dos recursos, migrations, secrets, mídia e deploy.
