// Confere se o site no ar está pronto para o Google. Uso:
//   node scripts/verificar-lancamento.mjs                       (confere https://www.bihel.com.br)
//   node scripts/verificar-lancamento.mjs https://outro.site     (outro endereço)
//   node scripts/verificar-lancamento.mjs --dominios             (também confere vercel.app e bihel.com.br sem www)
const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith("http")) ?? "https://www.bihel.com.br").replace(/\/$/, "");
const checkHosts = args.includes("--dominios");

let falhas = 0;
const ok = (msg) => console.log(`  ✓ ${msg}`);
const bad = (msg) => {
  falhas++;
  console.log(`  ✗ ${msg}`);
};
const check = (cond, good, wrong) => (cond ? ok(good) : bad(wrong));

const get = (url, opts = {}) => fetch(url, { redirect: "manual", headers: { "user-agent": "verificar-lancamento/1.0" }, ...opts });

console.log(`\nVerificando ${base}\n`);

console.log("Página inicial");
const home = await get(`${base}/`);
const html = await home.text();
check(home.status === 200, "responde 200", `respondeu ${home.status} (esperado 200)`);
const robotsHeader = home.headers.get("x-robots-tag") ?? "";
check(!/noindex/i.test(robotsHeader), "sem bloqueio no cabeçalho (X-Robots-Tag)", `ainda bloqueada pelo cabeçalho: ${robotsHeader}`);
check(!/<meta[^>]+name="robots"[^>]+noindex/i.test(html), "sem bloqueio no HTML (meta robots)", "ainda tem <meta name=robots noindex> no HTML");
check(html.includes(`<link rel="canonical" href="${base}/"`), "canonical aponta para o domínio", "canonical não aponta para este domínio");
check(html.includes(`property="og:url" content="${base}/"`), "og:url correto", "og:url não aponta para este domínio");
check(!html.includes("vercel.app"), "nenhuma referência a vercel.app no HTML", "ainda há referência a vercel.app no HTML");
check(/Autovistoria Predial/.test(html) && /Onde estamos/.test(html), "conteúdo novo presente (serviços e mapa)", "conteúdo não parece ser o do site novo");

console.log("\nSitemap e robots.txt");
const sm = await get(`${base}/sitemap.xml`);
const smText = await sm.text();
check(sm.status === 200 && smText.includes(`<loc>${base}/</loc>`), "sitemap.xml existe e lista a página inicial", `sitemap.xml com problema (status ${sm.status})`);
const rb = await get(`${base}/robots.txt`);
const rbText = await rb.text();
check(rb.status === 200 && rbText.includes(`Sitemap: ${base}/sitemap.xml`), "robots.txt aponta para o sitemap", "robots.txt sem a linha Sitemap");
check(!/Disallow:\s*\/\s*$/m.test(rbText), "robots.txt não bloqueia o site todo", "robots.txt bloqueia tudo (Disallow: /)");

console.log("\nPáginas dos serviços (listadas no sitemap)");
const pageUrls = [...smText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u !== `${base}/`);
check(pageUrls.length >= 5, `${pageUrls.length} páginas de serviço no sitemap`, `só ${pageUrls.length} páginas de serviço no sitemap (esperado 5)`);
for (const url of pageUrls) {
  const name = url.replace(`${base}/`, "/");
  const r = await get(url.replace(base, base));
  const page = await r.text();
  const header = r.headers.get("x-robots-tag") ?? "";
  const okPage =
    r.status === 200 &&
    !/noindex/i.test(header) &&
    !/<meta[^>]+name="robots"[^>]+noindex/i.test(page) &&
    page.includes(`<link rel="canonical" href="${url}"`) &&
    /<h1[^>]*>[^<]+<\/h1>/.test(page);
  check(okPage, `${name}: abre, canonical certo, com título H1 e sem bloqueio`, `${name}: problema (status ${r.status}, ${header || "sem cabeçalho"})`);
}

console.log("\nRedirecionamentos dos endereços antigos");
for (const [from, to] of [
  ["/sobre-nos", "/#sobre"],
  ["/servicos/inspecao-predial", "/#servicos"],
  ["/contato", "/#orcamento"],
  ["/blog", "/"],
]) {
  const r = await get(`${base}${from}`);
  const loc = r.headers.get("location") ?? "";
  check([301, 308].includes(r.status) && loc.endsWith(to), `${from} → ${to} (${r.status})`, `${from} respondeu ${r.status} ${loc} (esperado redirecionar para ${to})`);
}
const nope = await get(`${base}/pagina-que-nao-existe-xyz`);
check(nope.status === 404, "endereço inexistente responde 404", `endereço inexistente respondeu ${nope.status} (esperado 404)`);

console.log("\nÁreas que não devem aparecer no Google");
const painel = await get(`${base}/crm-insights`);
check(painel.status === 200 && /noindex/i.test(painel.headers.get("x-robots-tag") ?? ""), "/crm-insights com noindex", "/crm-insights sem noindex no cabeçalho");
const priv = await get(`${base}/privacidade`);
check(priv.status === 200, "/privacidade abre", `/privacidade respondeu ${priv.status}`);
const stats = await get(`${base}/api/stats?days=7`);
check(stats.status === 401 || stats.status === 503, `/api/stats protegida (${stats.status})`, `/api/stats respondeu ${stats.status} sem senha (esperado 401)`);

if (checkHosts) {
  console.log("\nOutros endereços do site");
  for (const host of ["https://bihel-site.vercel.app", "https://bihel.com.br"]) {
    const r = await get(`${host}/`);
    const loc = r.headers.get("location") ?? "";
    check([301, 307, 308].includes(r.status) && loc.startsWith(base), `${host} redireciona para ${base}`, `${host} respondeu ${r.status} ${loc} (esperado redirecionar para ${base})`);
  }
}

console.log(falhas ? `\n${falhas} problema(s) encontrado(s).\n` : "\nTudo certo.\n");
process.exit(falhas ? 1 : 0);
