// GET /api/stats?days=7|30|90 — números do painel. Protegido por senha (DASHBOARD_PASSWORD).
import {
  authorize, dayKey, lastDays, pipelineChunked, send,
} from "./_lib.js";

const PERIODS = new Set([7, 30, 90]);
const SECTION_NAMES = {
  sobre: "Sobre a Bihel",
  servicos: "Serviços",
  diferenciais: "Diferenciais",
  equipe: "Equipe",
  depoimentos: "Depoimentos",
  orcamento: "Formulário de orçamento",
};

const toObject = (flat) => {
  const out = {};
  for (let i = 0; i < (flat?.length ?? 0); i += 2) out[flat[i]] = Number(flat[i + 1]) || 0;
  return out;
};
const merge = (target, source) => {
  for (const [k, v] of Object.entries(source)) target[k] = (target[k] || 0) + v;
};
const ranked = (obj, limit = 10) =>
  Object.entries(obj)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { erro: "método não permitido" }, { Allow: "GET" });
  try {
    if (!(await authorize(req, res))) return;

    const days = Number(new URL(req.url, "http://x").searchParams.get("days")) || 7;
    if (!PERIODS.has(days)) return send(res, 400, { erro: "Período inválido." });

    const now = Date.now();
    const current = lastDays(days, now);
    const previous = lastDays(days, now - days * 86400000);

    const per = ["pv", "v", "c", "ref", "dev", "hour", "city", "ev", "wa", "svc", "sec", "svcwa"];
    const cmds = [];
    for (const d of current) {
      cmds.push(["GET", `pv:${d}`], ["PFCOUNT", `hll:v:${d}`], ["PFCOUNT", `hll:c:${d}`]);
      for (const k of ["ref", "dev", "hour", "city", "ev", "wa", "svc", "sec", "svcwa"]) cmds.push(["HGETALL", `${k}:${d}`]);
    }
    for (const d of previous) cmds.push(["GET", `pv:${d}`], ["PFCOUNT", `hll:v:${d}`], ["PFCOUNT", `hll:c:${d}`]);
    const out = await pipelineChunked(cmds);

    const daily = [];
    const sources = {}, devices = {}, cities = {}, events = {}, where = {}, services = {}, sections = {}, svcContacts = {};
    const hours = Array(24).fill(0);
    let offset = 0;
    for (const date of current) {
      const slice = out.slice(offset, offset + per.length);
      offset += per.length;
      daily.push({ date, views: Number(slice[0]) || 0, visitors: Number(slice[1]) || 0, contacts: Number(slice[2]) || 0 });
      merge(sources, toObject(slice[3]));
      merge(devices, toObject(slice[4]));
      for (const [h, n] of Object.entries(toObject(slice[5]))) hours[Number(h)] += n;
      merge(cities, toObject(slice[6]));
      merge(events, toObject(slice[7]));
      merge(where, toObject(slice[8]));
      merge(services, toObject(slice[9]));
      merge(sections, toObject(slice[10]));
      merge(svcContacts, toObject(slice[11]));
    }
    let prev = { views: 0, visitors: 0, contacts: 0 };
    for (let i = 0; i < previous.length; i++) {
      prev = {
        views: prev.views + (Number(out[offset + i * 3]) || 0),
        visitors: prev.visitors + (Number(out[offset + i * 3 + 1]) || 0),
        contacts: prev.contacts + (Number(out[offset + i * 3 + 2]) || 0),
      };
    }

    const sum = (key) => daily.reduce((acc, d) => acc + d[key], 0);
    return send(res, 200, {
      range: { days, from: current[0], to: current[current.length - 1], today: dayKey(now) },
      totals: {
        visitors: sum("visitors"),
        views: sum("views"),
        contacts: sum("contacts"),
        whatsappClicks: events.whatsapp_click || 0,
        forms: events.form_submit || 0,
      },
      previous: prev,
      daily,
      sources: ranked(sources),
      devices: ranked(devices),
      cities: ranked(cities, 8),
      hours,
      sections: ranked(
        Object.fromEntries(Object.entries(sections).map(([k, v]) => [SECTION_NAMES[k] || k, v])), 8
      ),
      services: ranked(services, 8).map((s) => ({ ...s, contacts: svcContacts[s.name] || 0 })),
      contactWhere: ranked(where, 8),
      generatedAt: new Date(now).toISOString(),
    });
  } catch (err) {
    console.error("stats:", err?.message);
    return send(res, 500, { erro: "Não foi possível ler os números agora." });
  }
}
