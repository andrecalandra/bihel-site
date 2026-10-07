// POST /api/collect — recebe visitas e eventos do site (via sendBeacon, texto JSON).
import {
  ALLOWED_EVENTS, RETENTION_SECONDS, classifyDevice, classifySource, cityOf, cleanLabel, dayKey,
  hourOf, ipHash, isBot, originAllowed, pipeline, readBody, send, storeConfigured, visitorHash,
} from "./_lib.js";

const RATE_LIMIT_PER_MINUTE = 90;

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { erro: "método não permitido" }, { Allow: "POST" });
  // Respostas sempre 204: o site não precisa saber (nem esperar) se a medição funcionou.
  try {
    if (!originAllowed(req) || isBot(req.headers["user-agent"]) || !storeConfigured()) return send(res, 204);

    let payload;
    try {
      payload = JSON.parse(await readBody(req));
    } catch {
      return send(res, 204);
    }
    const isPageview = payload?.t === "pv";
    const isEvent = payload?.t === "ev" && ALLOWED_EVENTS.has(payload?.n);
    if (!isPageview && !isEvent) return send(res, 204);

    // limite de eventos por minuto por visitante (evita inflar os números de propósito)
    const minute = Math.floor(Date.now() / 60000);
    const [count] = await pipeline([["INCR", `rl:${ipHash(req)}:${minute}`], ["EXPIRE", `rl:${ipHash(req)}:${minute}`, 90]]);
    if (count > RATE_LIMIT_PER_MINUTE) return send(res, 204);

    const day = dayKey();
    const vid = visitorHash(req, day);
    const cmds = [];
    const touched = new Set();
    const add = (cmd) => {
      cmds.push(cmd);
      touched.add(cmd[1]);
    };

    if (isPageview) {
      add(["INCR", `pv:${day}`]);
      add(["PFADD", `hll:v:${day}`, vid]);
      add(["HINCRBY", `ref:${day}`, classifySource(payload.r, payload.u), 1]);
      add(["HINCRBY", `dev:${day}`, classifyDevice(payload.w), 1]);
      add(["HINCRBY", `hour:${day}`, String(hourOf()), 1]);
      const city = cityOf(req);
      if (city) add(["HINCRBY", `city:${day}`, city, 1]);
    } else {
      const detail = cleanLabel(payload.d);
      const service = cleanLabel(payload.s);
      add(["HINCRBY", `ev:${day}`, payload.n, 1]);
      if (payload.n === "whatsapp_click") {
        add(["PFADD", `hll:c:${day}`, vid]);
        if (detail) add(["HINCRBY", `wa:${day}`, detail, 1]);
        if (service) add(["HINCRBY", `svcwa:${day}`, service, 1]);
      } else if (payload.n === "service_open" && detail) {
        add(["HINCRBY", `svc:${day}`, detail, 1]);
      } else if (payload.n === "section_view" && detail) {
        add(["HINCRBY", `sec:${day}`, detail, 1]);
      }
    }

    for (const key of touched) cmds.push(["EXPIRE", key, RETENTION_SECONDS]);
    await pipeline(cmds);
  } catch (err) {
    console.error("collect:", err?.message);
  }
  return send(res, 204);
}
