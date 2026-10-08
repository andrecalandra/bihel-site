// POST /api/lead — guarda um pedido de orçamento enviado pelo formulário do site.
// O site abre o WhatsApp por conta própria; este envio roda em paralelo, só para a equipe
// ter a lista de contatos no painel. Resposta sempre 204 (o visitante não espera por isso).
//
// Anti-spam em camadas:
//   descarta:  campo-isca preenchido, dados inválidos, mais de 3 envios/hora do mesmo IP;
//   suspeita:  sem chave da página, enviado rápido demais, chave reusada, telefone/nome/e-mail
//              estranhos, link na mensagem, telefone repetido em 24 h, enxurrada geral.
//   Os suspeitos ficam na coluna "Suspeitos" do painel (nenhum cliente real se perde).
import { randomBytes } from "node:crypto";
import {
  LEAD_RETENTION_DAYS, classifySource, cityOf, contentFlags, ipHash, originAllowed, parseLead,
  pipeline, readBody, readLeadToken, send, storeConfigured,
} from "./_lib.js";

const MAX_PER_HOUR_PER_IP = 3;
const MAX_PER_HOUR_TOTAL = 40;
const TOKEN_MAX_AGE_MS = 6 * 3600 * 1000;
const minAgeMs = () => Number(process.env.LEAD_MIN_SECONDS ?? 3) * 1000;

export default async function handler(req, res) {
  // x-lead-status só diz o que aconteceu (nenhum dado): ajuda a achar o motivo se um envio sumir
  const done = (why) => send(res, 204, undefined, { "X-Lead-Status": why });
  if (req.method !== "POST") return send(res, 405, { erro: "método não permitido" }, { Allow: "POST" });
  try {
    if (!originAllowed(req)) return done("origem-recusada");
    if (!storeConfigured()) return done("sem-banco");

    let payload;
    try {
      payload = JSON.parse(await readBody(req, 8192));
    } catch {
      return done("corpo-invalido");
    }
    // campo-isca escondido no formulário: só robôs preenchem
    if (payload?.website) return done("isca-preenchida");

    const lead = parseLead(payload);
    if (!lead) return done("dados-invalidos");

    const hour = Math.floor(Date.now() / 3600000);
    const ipKey = `rl:lead:${ipHash(req)}:${hour}`;
    const allKey = `rl:lead:all:${hour}`;
    const [perIp, , total] = await pipeline([
      ["INCR", ipKey], ["EXPIRE", ipKey, 3700], ["INCR", allKey], ["EXPIRE", allKey, 3700],
    ]);
    if (perIp > MAX_PER_HOUR_PER_IP) return done("limite-por-hora");

    const now = Date.now();
    const flags = [];

    // a página foi realmente aberta? (chave assinada, usada uma vez, nem rápida demais nem velha)
    const token = readLeadToken(payload.k);
    const digits = lead.phone.replace(/\D/g, "");
    const [tokenFresh, phoneFresh] = await pipeline([
      ["SET", `lead-tok:${token?.rand ?? "x"}`, "1", "NX", "EX", 21600],
      ["SET", `lead-dup:${digits.slice(-10)}`, "1", "NX", "EX", 86400],
    ]);
    if (!token) flags.push("sem-chave");
    else {
      if (now - token.ts < minAgeMs()) flags.push("rapido-demais");
      if (now - token.ts > TOKEN_MAX_AGE_MS) flags.push("chave-vencida");
      if (!tokenFresh) flags.push("chave-reusada");
    }
    flags.push(...contentFlags(lead));
    if (!phoneFresh) flags.push("telefone-repetido");
    if (total > MAX_PER_HOUR_TOTAL) flags.push("excesso-de-envios");

    const id = randomBytes(8).toString("hex");
    const record = {
      id,
      createdAt: now,
      ...lead,
      source: classifySource(payload.r, payload.u),
      city: cityOf(req),
      status: flags.length ? "suspeito" : "novo",
      flags,
      note: "",
    };
    await pipeline([
      ["SET", `lead:${id}`, JSON.stringify(record), "EX", LEAD_RETENTION_DAYS * 86400],
      ["ZADD", "leads", now, id],
    ]);
    return done(flags.length ? `gravado-suspeito:${flags.join(",")}` : "gravado");
  } catch (err) {
    console.error("lead:", err?.message);
    return done("erro-ao-gravar");
  }
}
