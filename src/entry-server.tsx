/* oxlint-disable react/only-export-components -- arquivo só usado no build (SSR), sem Fast Refresh */
import { renderToStaticMarkup } from "react-dom/server";
import App from "./App";
import ServicePage from "./ServicePage";

export { SERVICES } from "./services";
export { SITE_URL, INDEXABLE } from "./site";

/** Usado só no build (Node), para gerar o HTML real que vai dentro de
 *  dist/index.html. No navegador, App() continua sendo renderizado
 *  normalmente pelo React a partir de main.tsx — isso aqui não afeta
 *  a interatividade, só garante que rastreadores sem JS (e o preview
 *  de link do WhatsApp/Facebook) vejam o conteúdo de verdade. */
export function render(): string {
  return renderToStaticMarkup(<App />);
}

/** HTML de uma página de serviço (/<slug>). */
export function renderService(slug: string): string {
  return renderToStaticMarkup(<ServicePage slug={slug} />);
}
