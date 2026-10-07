// Testes do coletor e da API do painel. Rodar: `npm run test:api`
import test from "node:test";
import assert from "node:assert/strict";

process.env.DASHBOARD_PASSWORD = "senha-de-teste";
delete process.env.VERCEL;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.KV_REST_API_URL;

const { createServer } = await import("./dev-api.mjs");
const { resetMemoryStore } = await import("../api/_lib.js");

const server = createServer();
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;
test.after(() => server.close());

const CHROME = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1";
const CHROME_2 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36";

const collect = (body, { ua = CHROME, ip = "200.1.1.1", origin = "https://bihel-site.vercel.app" } = {}) =>
  fetch(`${base}/api/collect`, {
    method: "POST",
    headers: { "content-type": "text/plain", "user-agent": ua, "x-forwarded-for": ip, origin, "x-vercel-ip-city": "Niter%C3%B3i" },
    body: JSON.stringify(body),
  });
const stats = (days = 7, senha = "senha-de-teste") =>
  fetch(`${base}/api/stats?days=${days}`, { headers: { authorization: `Bearer ${senha}` } });

test("coleta visitas, eventos e agrega no painel", async () => {
  resetMemoryStore();
  assert.equal((await collect({ t: "pv", p: "/", r: "https://www.google.com/", w: 390 })).status, 204);
  assert.equal((await collect({ t: "pv", p: "/", r: "", w: 1400 }, { ua: CHROME_2, ip: "200.2.2.2" })).status, 204);
  await collect({ t: "ev", n: "section_view", d: "servicos" });
  await collect({ t: "ev", n: "service_open", d: "Inspeção Predial" });
  await collect({ t: "ev", n: "whatsapp_click", d: "Cabeçalho", s: "Inspeção Predial" });
  await collect({ t: "ev", n: "form_submit", d: "Inspeção Predial" });

  const res = await stats();
  assert.equal(res.status, 200);
  const s = await res.json();
  assert.equal(s.totals.views, 2);
  assert.equal(s.totals.visitors, 2);
  assert.equal(s.totals.contacts, 1);
  assert.equal(s.totals.whatsappClicks, 1);
  assert.equal(s.totals.forms, 1);
  assert.deepEqual(s.devices.map((d) => d.name).sort(), ["Celular", "Computador"]);
  assert.equal(s.sources.find((x) => x.name === "Google e outros buscadores").count, 1);
  assert.equal(s.sources.find((x) => x.name.startsWith("Direto")).count, 1);
  assert.equal(s.cities[0].name, "Niterói");
  assert.equal(s.sections[0].name, "Serviços");
  assert.deepEqual(s.services[0], { name: "Inspeção Predial", count: 1, contacts: 1 });
  assert.equal(s.contactWhere[0].name, "Cabeçalho");
  assert.equal(s.daily.at(-1).visitors, 2);
  assert.equal(s.daily.length, 7);
});

test("o mesmo visitante contado duas vezes no dia vira um só", async () => {
  resetMemoryStore();
  await collect({ t: "pv", p: "/", w: 390 });
  await collect({ t: "pv", p: "/", w: 390 });
  const s = await (await stats()).json();
  assert.equal(s.totals.views, 2);
  assert.equal(s.totals.visitors, 1);
});

test("ignora robôs, origens não autorizadas e eventos desconhecidos", async () => {
  resetMemoryStore();
  await collect({ t: "pv", p: "/", w: 390 }, { ua: "Googlebot/2.1" });
  await collect({ t: "pv", p: "/", w: 390 }, { ua: "Lighthouse HeadlessChrome" });
  await collect({ t: "pv", p: "/", w: 390 }, { origin: "https://site-malicioso.com" });
  await collect({ t: "ev", n: "evento_inventado", d: "x" });
  await collect({ t: "pv" , p: "/" }, { ua: CHROME_2, ip: "9.9.9.9" }); // este é válido
  const s = await (await stats()).json();
  assert.equal(s.totals.views, 1);
  assert.equal(s.totals.whatsappClicks, 0);
});

test("limpa rótulos perigosos antes de guardar", async () => {
  resetMemoryStore();
  await collect({ t: "ev", n: "service_open", d: "<script>alert(1)</script>Laudo" });
  const s = await (await stats()).json();
  assert.ok(!s.services[0].name.includes("<"));
  assert.ok(s.services[0].name.includes("Laudo"));
});

test("painel exige senha e valida o período", async () => {
  assert.equal((await stats(7, "errada")).status, 401);
  const noAuth = await fetch(`${base}/api/stats?days=7`);
  assert.equal(noAuth.status, 401);
  assert.equal((await stats(5)).status, 400);
  assert.equal((await stats(30)).status, 200);
});

test("limita eventos em excesso por visitante", async () => {
  resetMemoryStore();
  for (let i = 0; i < 100; i++) await collect({ t: "pv", p: "/", w: 390 }, { ip: "7.7.7.7" });
  const s = await (await stats()).json();
  assert.ok(s.totals.views <= 90, `views=${s.totals.views}`);
});

// ---------- leads ----------
const postLead = (body, { ip = "200.9.9.9", origin = "https://bihel-site.vercel.app" } = {}) =>
  fetch(`${base}/api/lead`, {
    method: "POST",
    headers: { "content-type": "text/plain", "x-forwarded-for": ip, origin, "user-agent": CHROME, "x-vercel-ip-city": "Niter%C3%B3i" },
    body: JSON.stringify(body),
  });
const leadsApi = (method = "GET", { body, query = "", senha = "senha-de-teste" } = {}) =>
  fetch(`${base}/api/leads${query}`, {
    method,
    headers: { authorization: `Bearer ${senha}`, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
const GOOD = { name: "Maria Souza", phone: "(21) 99999-9999", email: "maria@email.com", service: "Inspeção Predial", message: "Prédio com 40 apartamentos\nem Icaraí", r: "https://www.google.com/" };

test("lead: grava, lista (mais novo primeiro), atualiza situação/nota e apaga", async () => {
  resetMemoryStore();
  assert.equal((await postLead(GOOD)).status, 204);
  await new Promise((r) => setTimeout(r, 5));
  assert.equal((await postLead({ ...GOOD, name: "João Lima", phone: "21988887777" }, { ip: "200.8.8.8" })).status, 204);

  let { leads, total } = await (await leadsApi()).json();
  assert.equal(total, 2);
  assert.equal(leads[0].name, "João Lima");
  const maria = leads[1];
  assert.equal(maria.status, "novo");
  assert.equal(maria.source, "Google e outros buscadores");
  assert.equal(maria.city, "Niterói");
  assert.equal(maria.message, "Prédio com 40 apartamentos\nem Icaraí");

  const upd = await leadsApi("PATCH", { body: { id: maria.id, status: "contato", note: "Liguei às 10h" } });
  assert.equal(upd.status, 200);
  assert.equal((await upd.json()).note, "Liguei às 10h");
  assert.equal((await leadsApi("PATCH", { body: { id: maria.id, status: "inventado" } })).status, 400);
  assert.equal((await leadsApi("PATCH", { body: { id: "0123456789abcdef", status: "novo" } })).status, 404);

  assert.equal((await leadsApi("DELETE", { query: `?id=${maria.id}` })).status, 200);
  ({ leads, total } = await (await leadsApi()).json());
  assert.equal(total, 1);
});

test("lead: exige senha para listar e ignora envios inválidos, isca preenchida e origem estranha", async () => {
  resetMemoryStore();
  assert.equal((await leadsApi("GET", { senha: "errada" })).status, 401);
  await postLead({ ...GOOD, phone: "123" }); // telefone curto demais
  await postLead({ ...GOOD, name: "" });
  await postLead({ ...GOOD, website: "http://spam" }); // robô
  await postLead(GOOD, { origin: "https://site-malicioso.com" });
  assert.equal((await (await leadsApi()).json()).total, 0);
});

test("lead: limita envios repetidos pelo mesmo IP", async () => {
  resetMemoryStore();
  for (let i = 0; i < 9; i++) await postLead({ ...GOOD, name: `Pessoa ${i}` }, { ip: "200.7.7.7" });
  assert.equal((await (await leadsApi()).json()).total, 6);
});

test("lead: consulta leve (peek) avisa quando chega ou sai lead", async () => {
  resetMemoryStore();
  const peek = async () => (await leadsApi("GET", { query: "?peek=1" })).json();
  assert.deepEqual(await peek(), { total: 0, latest: "" });
  await postLead(GOOD);
  const a = await peek();
  assert.equal(a.total, 1);
  assert.match(a.latest, /^[a-f0-9]{16}$/);
  await new Promise((r) => setTimeout(r, 5));
  await postLead({ ...GOOD, name: "Outra Pessoa" }, { ip: "200.6.6.6" });
  const b = await peek();
  assert.equal(b.total, 2);
  assert.notEqual(b.latest, a.latest);
  assert.equal((await leadsApi("GET", { query: "?peek=1", senha: "errada" })).status, 401);
});
