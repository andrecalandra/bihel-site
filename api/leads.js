// /api/leads — lista e gerencia os pedidos de orçamento. Protegido por senha.
//   GET                      → { leads: [...], total }   (?peek=1 → { total, latest } só para checar novidades)
//   PATCH  { id, status?, note? } → lead atualizado
//   DELETE ?id=... | ?status=suspeito → apaga um lead / todos os suspeitos
import {
  LEAD_STATUSES, authorize, cleanText, leadTtl, pipeline, readBody, send,
} from "./_lib.js";

const ID_RE = /^[a-f0-9]{16}$/;
const MAX_LEADS = 500;

export default async function handler(req, res) {
  if (!["GET", "PATCH", "DELETE"].includes(req.method)) {
    return send(res, 405, { erro: "método não permitido" }, { Allow: "GET, PATCH, DELETE" });
  }
  try {
    if (!(await authorize(req, res))) return;

    if (req.method === "GET") {
      // consulta leve (o painel faz a cada ~45 s): só diz se chegou ou saiu algum lead
      if (new URL(req.url, "http://x").searchParams.get("peek")) {
        const [total, latest] = await pipeline([["ZCARD", "leads"], ["ZREVRANGE", "leads", 0, 0]]);
        return send(res, 200, { total: Number(total) || 0, latest: latest?.[0] || "" });
      }
      const [ids] = await pipeline([["ZREVRANGE", "leads", 0, MAX_LEADS - 1]]);
      if (!ids?.length) return send(res, 200, { leads: [], total: 0 });
      const [raw] = await pipeline([["MGET", ...ids.map((id) => `lead:${id}`)]]);
      const leads = [];
      const expired = [];
      raw.forEach((value, i) => {
        if (!value) return expired.push(ids[i]); // passou do prazo de guarda e já foi apagado
        try {
          leads.push(JSON.parse(value));
        } catch {
          expired.push(ids[i]);
        }
      });
      if (expired.length) await pipeline([["ZREM", "leads", ...expired]]);
      return send(res, 200, { leads, total: leads.length });
    }

    if (req.method === "PATCH") {
      let body;
      try {
        body = JSON.parse(await readBody(req));
      } catch {
        return send(res, 400, { erro: "Pedido inválido." });
      }
      if (!ID_RE.test(String(body?.id))) return send(res, 400, { erro: "Lead inválido." });
      if (body.status !== undefined && !LEAD_STATUSES.includes(body.status)) {
        return send(res, 400, { erro: "Situação inválida." });
      }
      const [current] = await pipeline([["GET", `lead:${body.id}`]]);
      if (!current) return send(res, 404, { erro: "Lead não encontrado." });
      const lead = JSON.parse(current);
      if (body.status !== undefined) lead.status = body.status;
      if (body.note !== undefined) lead.note = cleanText(body.note, 1000);
      await pipeline([["SET", `lead:${lead.id}`, JSON.stringify(lead), "EX", leadTtl(lead.createdAt)]]);
      return send(res, 200, lead);
    }

    // DELETE ?status=suspeito → esvazia a coluna de suspeitos de uma vez
    const params = new URL(req.url, "http://x").searchParams;
    if (params.get("status") === "suspeito") {
      const [ids] = await pipeline([["ZREVRANGE", "leads", 0, MAX_LEADS - 1]]);
      if (!ids?.length) return send(res, 200, { ok: true, removed: 0 });
      const [raw] = await pipeline([["MGET", ...ids.map((x) => `lead:${x}`)]]);
      const doomed = ids.filter((_, i) => {
        try {
          return raw[i] && JSON.parse(raw[i]).status === "suspeito";
        } catch {
          return false;
        }
      });
      if (doomed.length) await pipeline([["DEL", ...doomed.map((x) => `lead:${x}`)], ["ZREM", "leads", ...doomed]]);
      return send(res, 200, { ok: true, removed: doomed.length });
    }

    // DELETE ?id=...
    const id = params.get("id") || "";
    if (!ID_RE.test(id)) return send(res, 400, { erro: "Lead inválido." });
    await pipeline([["DEL", `lead:${id}`], ["ZREM", "leads", id]]);
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error("leads:", err?.message);
    return send(res, 500, { erro: "Não foi possível acessar os leads agora." });
  }
}
