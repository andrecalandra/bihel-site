# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Painel de acessos (`/painel`)

Medição própria, sem cookies e sem guardar IP. O site envia visitas e cliques para `POST /api/collect`;
o painel (`/painel`) lê `GET /api/stats?days=7|30|90` com a senha em `Authorization: Bearer <senha>`.

- Configuração na Vercel: conectar um Redis (Upstash) ao projeto e definir `DASHBOARD_PASSWORD` (veja `.env.example`).
- Local: `npm run dev:api` (memória, senha `teste`) junto com `npm run dev`, depois abra `/painel.html`.
- Testes da API: `npm run test:api`.
- Eventos medidos: visita, `whatsapp_click`, `form_submit`, `service_open`, `section_view` (lista em `api/_lib.js`).
