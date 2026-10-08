// Testes dos leads (formulário de orçamento, anti-spam e gestão no painel). Rodar: `npm run test:api`
import test from "node:test";
import assert from "node:assert/strict";

process.env.DASHBOARD_PASSWORD = "senha-de-teste";
process.env.LEAD_MIN_SECONDS = "0"; // nos testes não esperamos 3 s pela chave do formulário
delete process.env.VERCEL;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.KV_REST_API_URL;

const { createServer } = await import("./dev-api.mjs");
const { resetMemoryStore, phoneLooksReal, contentFlags } = await import("../api/_lib.js");

const server = createServer();
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;
test.after(() => server.close());

const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1";
const SITE = "https://bihel-site.vercel.app";

const getToken = async () =>
  (await (await fetch(`${base}/api/lead-token`, { headers: { origin: SITE } })).json()).k;

// por padrão envia como o site faz: com a chave que a página recebeu ao abrir
const postLead = async (body, { ip = "200.9.9.9", origin = SITE, token = true } = {}) =>
  fetch(`${base}/api/lead`, {
    method: "POST",
    headers: { "content-type": "text/plain", "x-forwarded-for": ip, origin, "user-agent": UA, "x-vercel-ip-city": "Niter%C3%B3i" },
    body: JSON.stringify(token === true ? { ...body, k: await getToken() } : token ? { ...body, k: token } : body),
  });
const leadsApi = (method = "GET", { body, query = "", senha = "senha-de-teste" } = {}) =>
  fetch(`${base}/api/leads${query}`, {
    method,
    headers: { authorization: `Bearer ${senha}`, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
const list = async () => (await (await leadsApi()).json()).leads;

const GOOD = {
  name: "Maria Souza",
  phone: "(21) 97342-1865",
  email: "maria@email.com",
  service: "Autovistoria Predial",
  message: "Prédio com 40 apartamentos\nem Icaraí",
  r: "https://www.google.com/",
};

test("lead: grava, lista (mais novo primeiro), atualiza situação/nota e apaga", async () => {
  resetMemoryStore();
  assert.equal((await postLead(GOOD)).status, 204);
  await new Promise((r) => setTimeout(r, 5));
  assert.equal((await postLead({ ...GOOD, name: "João Lima", phone: "21 98153-6274" }, { ip: "200.8.8.8" })).status, 204);

  let leads = await list();
  assert.equal(leads.length, 2);
  assert.equal(leads[0].name, "João Lima");
  const maria = leads[1];
  assert.equal(maria.status, "novo");
  assert.deepEqual(maria.flags, []);
  assert.equal(maria.source, "Google e outros buscadores");
  assert.equal(maria.city, "Niterói");
  assert.equal(maria.message, "Prédio com 40 apartamentos\nem Icaraí");

  const upd = await leadsApi("PATCH", { body: { id: maria.id, status: "contato", note: "Liguei às 10h" } });
  assert.equal(upd.status, 200);
  assert.equal((await upd.json()).note, "Liguei às 10h");
  assert.equal((await leadsApi("PATCH", { body: { id: maria.id, status: "inventado" } })).status, 400);
  assert.equal((await leadsApi("PATCH", { body: { id: "0123456789abcdef", status: "novo" } })).status, 404);

  assert.equal((await leadsApi("DELETE", { query: `?id=${maria.id}` })).status, 200);
  assert.equal((await list()).length, 1);
});

test("lead: exige senha para listar e descarta envios inválidos, isca preenchida e origem estranha", async () => {
  resetMemoryStore();
  assert.equal((await leadsApi("GET", { senha: "errada" })).status, 401);
  await postLead({ ...GOOD, phone: "123" }); // curto demais: descartado
  await postLead({ ...GOOD, name: "" });
  await postLead({ ...GOOD, website: "http://spam" }); // robô
  await postLead(GOOD, { origin: "https://site-malicioso.com" });
  assert.equal((await list()).length, 0);
});

test("lead: no máximo 3 envios por hora do mesmo IP", async () => {
  resetMemoryStore();
  for (let i = 0; i < 6; i++) await postLead({ ...GOOD, name: "Pessoa Teste", phone: `2197${i}42-1865` }, { ip: "200.7.7.7" });
  assert.equal((await list()).length, 3);
});

test("lead: sem a chave da página vira suspeito (e não se perde)", async () => {
  resetMemoryStore();
  const res = await postLead(GOOD, { token: false });
  assert.match(res.headers.get("x-lead-status"), /gravado-suspeito:.*sem-chave/);
  const [l] = await list();
  assert.equal(l.status, "suspeito");
  assert.ok(l.flags.includes("sem-chave"));
  const falsa = await postLead(
    { ...GOOD, phone: "21 98153-6274" },
    { token: "1700000000000.0123456789abcdef.assinaturafalsa", ip: "200.5.5.5" },
  );
  assert.match(falsa.headers.get("x-lead-status"), /sem-chave/);
});

test("lead: rápido demais, chave reusada e telefone repetido viram suspeitos", async () => {
  resetMemoryStore();
  process.env.LEAD_MIN_SECONDS = "30";
  try {
    const rapido = await postLead(GOOD);
    assert.match(rapido.headers.get("x-lead-status"), /rapido-demais/);
  } finally {
    process.env.LEAD_MIN_SECONDS = "0";
  }
  resetMemoryStore();
  const k = await getToken();
  const primeiro = await postLead({ ...GOOD, phone: "21 98153-6274" }, { token: k, ip: "200.4.4.1" });
  assert.equal(primeiro.headers.get("x-lead-status"), "gravado");
  const reuso = await postLead({ ...GOOD, phone: "21 99417-3582" }, { token: k, ip: "200.4.4.2" });
  assert.match(reuso.headers.get("x-lead-status"), /chave-reusada/);
  const repetido = await postLead({ ...GOOD, phone: "21 98153-6274" }, { ip: "200.4.4.3" });
  assert.match(repetido.headers.get("x-lead-status"), /telefone-repetido/);
});

test("lead: telefone, nome, e-mail e link estranhos são detectados", () => {
  assert.equal(phoneLooksReal("(21) 97342-1865"), true);
  assert.equal(phoneLooksReal("+55 21 2620-4455"), true);
  assert.equal(phoneLooksReal("11111111111"), false);
  assert.equal(phoneLooksReal("(21) 99999-9999"), false);
  assert.equal(phoneLooksReal("21 98765-4321"), false);
  assert.equal(phoneLooksReal("00 91234-5678"), false);
  assert.equal(phoneLooksReal("21 88153-6274"), false); // celular sem o 9
  const ok = { name: "Maria Souza", phone: "21 97342-1865", email: "a@gmail.com", message: "" };
  assert.deepEqual(contentFlags(ok), []);
  assert.ok(contentFlags({ ...ok, name: "Qwrtpsdf" }).includes("nome-estranho"));
  assert.ok(contentFlags({ ...ok, name: "Casa 123 Ltda" }).includes("nome-estranho"));
  assert.ok(contentFlags({ ...ok, email: "x@mailinator.com" }).includes("email-descartavel"));
  assert.ok(contentFlags({ ...ok, message: "veja http://golpe.com" }).includes("link-na-mensagem"));
});

test("lead: 'Não é spam' (PATCH para novo) e 'Apagar todos' os suspeitos", async () => {
  resetMemoryStore();
  await postLead(GOOD, { token: false, ip: "200.3.3.1" });
  await postLead({ ...GOOD, phone: "21 98153-6274" }, { token: false, ip: "200.3.3.2" });
  await postLead({ ...GOOD, phone: "21 99417-3582" }, { ip: "200.3.3.3" }); // normal
  let leads = await list();
  assert.equal(leads.filter((l) => l.status === "suspeito").length, 2);
  const [primeiro] = leads.filter((l) => l.status === "suspeito");
  const liberado = await (await leadsApi("PATCH", { body: { id: primeiro.id, status: "novo" } })).json();
  assert.equal(liberado.status, "novo");
  const res = await leadsApi("DELETE", { query: "?status=suspeito" });
  assert.equal((await res.json()).removed, 1);
  leads = await list();
  assert.equal(leads.length, 2);
  assert.ok(leads.every((l) => l.status !== "suspeito"));
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
  await postLead({ ...GOOD, name: "Outra Pessoa", phone: "21 98153-6274" }, { ip: "200.6.6.6" });
  const b = await peek();
  assert.equal(b.total, 2);
  assert.notEqual(b.latest, a.latest);
  assert.equal((await leadsApi("GET", { query: "?peek=1", senha: "errada" })).status, 401);
});
