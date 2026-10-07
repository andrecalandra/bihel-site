// POST /api/lead — guarda um pedido de orçamento enviado pelo formulário do site.
// O site abre o WhatsApp por conta própria; este envio roda em paralelo, só para a equipe
// ter a lista de contatos no painel. Resposta sempre 204 (o visitante não espera por isso).
import { randomBytes } from "node:crypto";
import {
  LEAD_RETENTION_DAYS, classifySource, cityOf, ipHash, originAllowed, parseLead,
  pipeline, readBody, send, storeConfigured,
} from "./_lib.js";

const MAX_PER_HOUR = 6;

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { erro: "método não permitido" }, { Allow: "POST" });
  try {
    if (!originAllowed(req) || !storeConfigured()) return send(res, 204);

    let payload;
    try {
      payload = JSON.parse(await readBody(req, 8192));
    } catch {
      return send(res, 204);
    }
    // campo-isca escondido no formulário: só robôs preenchem
    if (payload?.website) return send(res, 204);

    const lead = parseLead(payload);
    if (!lead) return send(res, 204);

    const hourKey = `rl:lead:${ipHash(req)}:${Math.floor(Date.now() / 3600000)}`;
    const [count] = await pipeline([["INCR", hourKey], ["EXPIRE", hourKey, 3700]]);
    if (count > MAX_PER_HOUR) return send(res, 204);

    const createdAt = Date.now();
    const id = randomBytes(8).toString("hex");
    const record = {
      id,
      createdAt,
      ...lead,
      source: classifySource(payload.r, payload.u),
      city: cityOf(req),
      status: "novo",
      note: "",
    };
    await pipeline([
      ["SET", `lead:${id}`, JSON.stringify(record), "EX", LEAD_RETENTION_DAYS * 86400],
      ["ZADD", "leads", createdAt, id],
    ]);
  } catch (err) {
    console.error("lead:", err?.message);
  }
  return send(res, 204);
}
