import { renderToStaticMarkup } from "react-dom/server";
import App from "./App";

/** Usado só no build (Node), para gerar o HTML real que vai dentro de
 *  dist/index.html. No navegador, App() continua sendo renderizado
 *  normalmente pelo React a partir de main.tsx — isso aqui não afeta
 *  a interatividade, só garante que rastreadores sem JS (e o preview
 *  de link do WhatsApp/Facebook) vejam o conteúdo de verdade. */
export function render(): string {
  return renderToStaticMarkup(<App />);
}
