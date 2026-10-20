// Gera o HTML real do site depois do build:
//  1) injeta o conteúdo de <App/> dentro de dist/index.html (no lugar da <div id="root"></div> vazia);
//  2) cria uma página para cada serviço (dist/<slug>.html, servida como /<slug> pela Vercel);
//  3) quando o site está liberado para o Google (INDEXABLE em src/site.ts), gera dist/sitemap.xml.
// Roda depois do build client + do build SSR (veja o script "build" no package.json).
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

const { render, renderService, SERVICES, SITE_URL, INDEXABLE } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js"))
);

// O build SSR ignora o `base` relativo do vite.config.ts (Vite força "/"
// nesse modo). Corrige aqui para bater com o resto do HTML, que já usa
// caminhos relativos — necessário pro GitHub Pages, que serve em /bihel-site/.
const fixAssets = (html) => html.replaceAll('="/assets/', '="./assets/');

const indexPath = path.join(distDir, "index.html");
const template = await readFile(indexPath, "utf-8");

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> não encontrada em dist/index.html — build mudou?');
}

// ---------- 1) páginas dos serviços (a partir do index.html ainda "limpo") ----------
const attr = (v) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

function replaceOnce(html, regex, replacement, label) {
  if (!regex.test(html)) throw new Error(`prerender: não achei ${label} no index.html — o modelo mudou?`);
  return html.replace(regex, replacement);
}

for (const s of SERVICES) {
  const url = `${SITE_URL}/${s.slug}`;
  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${attr(s.pageTitle)}</title>`, "<title>");
  html = replaceOnce(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${attr(s.metaDescription)}$2`, "meta description");
  html = replaceOnce(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${attr(s.metaDescription)}$2`, "og:description");
  html = replaceOnce(html, /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${attr(s.metaDescription)}$2`, "twitter:description");
  html = replaceOnce(html, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${attr(s.pageTitle)}$2`, "og:title");
  html = replaceOnce(html, /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${attr(s.pageTitle)}$2`, "twitter:title");
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, "canonical");
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, "og:url");

  // bloqueio de indexação só enquanto o site não estiver liberado (src/site.ts)
  html = html.replace(/\s*<meta name="robots"[^>]*>/g, "");
  if (!INDEXABLE) html = html.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex, nofollow" />');

  const ld = [
    jsonLd({
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.h1,
      serviceType: s.title,
      description: s.metaDescription,
      url,
      provider: { "@type": "ProfessionalService", name: "Bihel Engenharia", url: `${SITE_URL}/` },
    }),
    jsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Serviços", item: `${SITE_URL}/#servicos` },
        { "@type": "ListItem", position: 3, name: s.title, item: url },
      ],
    }),
  ].join("\n    ");
  html = html.replace("</head>", `    ${ld}\n  </head>`);

  const body = fixAssets(renderService(s.slug));
  html = html.replace('<div id="root"></div>', `<div id="root" data-service="${s.slug}">${body}</div>`);
  await writeFile(path.join(distDir, `${s.slug}.html`), html, "utf-8");
}

// ---------- 2) home ----------
const appHtml = fixAssets(render());
await writeFile(indexPath, template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`), "utf-8");

// ---------- 3) sitemap (só quando o site está liberado para o Google) ----------
if (INDEXABLE) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [`${SITE_URL}/`, ...SERVICES.map((s) => `${SITE_URL}/${s.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u, i) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${i === 0 ? "1.0" : "0.8"}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`;
  await writeFile(path.join(distDir, "sitemap.xml"), xml, "utf-8");
}

await rm(ssrDir, { recursive: true, force: true });

console.log(
  `Pré-renderização aplicada: home (${appHtml.length} caracteres) + ${SERVICES.length} páginas de serviço${INDEXABLE ? " + sitemap.xml" : ""}.`,
);
