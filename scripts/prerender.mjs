// Injeta o HTML real (gerado a partir de <App/>) dentro de dist/index.html,
// no lugar da <div id="root"></div> vazia. Roda depois do build client + do
// build SSR (veja o script "build" no package.json).
//
// Por que isso existe: sem isso, qualquer rastreador que não executa
// JavaScript (preview de link do WhatsApp/Facebook, parte dos crawlers de
// busca) recebe uma página em branco — todo o conteúdo só existia depois do
// React montar no navegador.
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")));
let appHtml = render();

// O build SSR ignora o `base` relativo do vite.config.ts (Vite força "/"
// nesse modo). Corrige aqui para bater com o resto do HTML, que já usa
// caminhos relativos — necessário pro GitHub Pages, que serve em /bihel-site/.
appHtml = appHtml.replaceAll('="/assets/', '="./assets/');

const indexPath = path.join(distDir, "index.html");
const template = await readFile(indexPath, "utf-8");

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> não encontrada em dist/index.html — build mudou?');
}

const finalHtml = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
await writeFile(indexPath, finalHtml, "utf-8");
await rm(ssrDir, { recursive: true, force: true });

console.log(`Pré-renderização aplicada (${appHtml.length} caracteres de HTML injetados).`);
