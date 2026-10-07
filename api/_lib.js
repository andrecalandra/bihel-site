// Biblioteca compartilhada das funções /api/collect e /api/stats.
// Medição de audiência própria, sem cookies e sem guardar IP: o visitante vira um
// hash que muda todo dia (impossível de reverter) e só entra em contadores.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// ---------- datas (horário de Brasília, UTC-3, sem horário de verão) ----------
const TZ_MS = -3 * 3600 * 1000;
export const dayKey = (ts = Date.now()) => new Date(ts + TZ_MS).toISOString().slice(0, 10);
export const hourOf = (ts = Date.now()) => new Date(ts + TZ_MS).getUTCHours();
/** Lista de dias (YYYY-MM-DD) do mais antigo ao mais novo, terminando em `endTs`. */
export function lastDays(n, endTs = Date.now()) {
  return Array.from({ length: n }, (_, i) => dayKey(endTs - (n - 1 - i) * 86400000));
}

// ---------- armazenamento (Redis REST da Upstash, via integração da Vercel) ----------
const REST_URL = () => process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REST_TOKEN = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

/** Em produção sem Redis configurado não há onde guardar nada. */
export const storeConfigured = () => Boolean(REST_URL() && REST_TOKEN()) || !process.env.VERCEL;

export async function pipeline(commands) {
  if (REST_URL() && REST_TOKEN()) {
    const res = await fetch(`${REST_URL()}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REST_TOKEN()}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
    });
    if (!res.ok) throw new Error(`store ${res.status}`);
    const data = await res.json();
    return data.map((d) => {
      if (d.error) throw new Error(d.error);
      return d.result;
    });
  }
  return memoryPipeline(commands);
}

// Emulação mínima do Redis (só os comandos usados) para desenvolvimento local e testes.
const mem = { str: new Map(), hash: new Map(), hll: new Map(), zset: new Map() };
export function resetMemoryStore() {
  mem.str.clear();
  mem.hash.clear();
  mem.hll.clear();
  mem.zset.clear();
}
function memoryPipeline(commands) {
  return commands.map(([cmd, key, ...args]) => {
    switch (cmd.toUpperCase()) {
      case "INCR":
        mem.str.set(key, (Number(mem.str.get(key)) || 0) + 1);
        return mem.str.get(key);
      case "GET":
        return mem.str.has(key) ? String(mem.str.get(key)) : null;
      case "MGET":
        return [key, ...args].map((k) => (mem.str.has(k) ? String(mem.str.get(k)) : null));
      case "SET":
        mem.str.set(key, args[0]);
        return "OK";
      case "DEL":
        return [key, ...args].reduce((n, k) => n + Number(mem.str.delete(k)), 0);
      case "ZADD": {
        const z = mem.zset.get(key) ?? new Map();
        z.set(args[1], Number(args[0]));
        mem.zset.set(key, z);
        return 1;
      }
      case "ZREM": {
        const z = mem.zset.get(key);
        return args.reduce((n, m) => n + Number(Boolean(z?.delete(m))), 0);
      }
      case "ZREVRANGE": {
        const z = [...(mem.zset.get(key) ?? [])].sort((a, b) => b[1] - a[1]).map(([m]) => m);
        const stop = Number(args[1]);
        return z.slice(Number(args[0]), stop < 0 ? undefined : stop + 1);
      }
      case "EXPIRE":
        return 1;
      case "HINCRBY": {
        const h = mem.hash.get(key) ?? new Map();
        h.set(args[0], (Number(h.get(args[0])) || 0) + Number(args[1]));
        mem.hash.set(key, h);
        return h.get(args[0]);
      }
      case "HGETALL": {
        const h = mem.hash.get(key);
        return h ? [...h].flatMap(([k, v]) => [k, String(v)]) : [];
      }
      case "PFADD": {
        const s = mem.hll.get(key) ?? new Set();
        const before = s.size;
        args.forEach((a) => s.add(a));
        mem.hll.set(key, s);
        return s.size > before ? 1 : 0;
      }
      case "PFCOUNT": {
        const union = new Set();
        [key, ...args].forEach((k) => mem.hll.get(k)?.forEach((v) => union.add(v)));
        return union.size;
      }
      default:
        throw new Error(`comando não suportado no modo local: ${cmd}`);
    }
  });
}

/** Executa em lotes para não estourar o limite de um único pipeline. */
export async function pipelineChunked(commands, size = 400) {
  const out = [];
  for (let i = 0; i < commands.length; i += size) {
    out.push(...(await pipeline(commands.slice(i, i + size))));
  }
  return out;
}

export const RETENTION_SECONDS = 400 * 86400;

// ---------- anonimização ----------
const secret = () => process.env.ANALYTICS_SECRET || process.env.DASHBOARD_PASSWORD || "bihel-local";

export function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || String(req.headers["x-real-ip"] || "") || req.socket?.remoteAddress || "";
}

/** Hash diário: o mesmo visitante gera valores diferentes a cada dia e o IP nunca é guardado. */
export function visitorHash(req, day) {
  const daily = createHmac("sha256", secret()).update(day).digest("hex");
  return createHash("sha256")
    .update(`${daily}|${clientIp(req)}|${req.headers["user-agent"] || ""}`)
    .digest("hex")
    .slice(0, 32);
}

export function ipHash(req) {
  return createHash("sha256").update(`rl|${secret()}|${clientIp(req)}`).digest("hex").slice(0, 24);
}

// ---------- regras de negócio ----------
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|curl|wget|python|axios|node-fetch|go-http/i;
export const isBot = (ua) => !ua || BOT_RE.test(ua);

export const ALLOWED_EVENTS = new Set(["whatsapp_click", "form_submit", "service_open", "section_view"]);

/** Texto curto e seguro para virar chave de contador. */
export function cleanLabel(value, max = 60) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} .,&()\-:/]/gu, "")
    .trim()
    .slice(0, max);
}

const OWN_HOSTS = ["bihel-site.vercel.app", "bihel.com.br", "www.bihel.com.br"];
export function classifySource(referrer, utmSource) {
  const utm = cleanLabel(utmSource, 40).toLowerCase();
  let host = "";
  try {
    host = referrer ? new URL(referrer).hostname.replace(/^www\./, "").toLowerCase() : "";
  } catch {
    host = "";
  }
  const key = utm || host;
  if (!key || OWN_HOSTS.some((h) => h.replace(/^www\./, "") === host)) return "Direto (digitou o endereço ou link salvo)";
  if (/google|bing|duckduckgo|yahoo|ecosia|brave|search/.test(key)) return "Google e outros buscadores";
  if (/whatsapp|wa\.me/.test(key)) return "WhatsApp";
  if (/instagram|facebook|fb\.|meta|messenger/.test(key)) return "Instagram e Facebook";
  if (/linkedin/.test(key)) return "LinkedIn";
  if (/youtube|youtu\.be/.test(key)) return "YouTube";
  return "Outros sites";
}

export function classifyDevice(width) {
  const w = Number(width) || 0;
  if (w && w < 768) return "Celular";
  if (w && w < 1100) return "Tablet";
  return w ? "Computador" : "Não identificado";
}

export function cityOf(req) {
  const raw = req.headers["x-vercel-ip-city"];
  if (!raw) return "";
  try {
    return cleanLabel(decodeURIComponent(String(raw)), 40);
  } catch {
    return "";
  }
}

export function allowedHosts() {
  return (process.env.ANALYTICS_HOSTS || "bihel-site.vercel.app,www.bihel.com.br,bihel.com.br,localhost")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

export function originAllowed(req) {
  const origin = req.headers.origin || req.headers.referer;
  if (!origin) return true;
  try {
    return allowedHosts().includes(new URL(origin).hostname.toLowerCase());
  } catch {
    return false;
  }
}

// ---------- HTTP ----------
export function send(res, status, body, extra = {}) {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  for (const [k, v] of Object.entries(extra)) res.setHeader(k, v);
  if (body === undefined) return res.end();
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export async function readBody(req, limit = 4096) {
  if (typeof req.body === "string") return req.body.slice(0, limit);
  if (req.body && typeof req.body === "object") return JSON.stringify(req.body).slice(0, limit);
  let data = "";
  for await (const chunk of req) {
    data += chunk;
    if (data.length > limit) break;
  }
  return data.slice(0, limit);
}

export function passwordMatches(given) {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected || !given) return false;
  const a = createHash("sha256").update(String(given)).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/**
 * Confere a senha do painel (com trava de tentativas). Responde sozinho em caso de erro
 * e devolve false; quem chama só segue se receber true.
 */
export async function authorize(req, res) {
  if (!process.env.DASHBOARD_PASSWORD) {
    send(res, 503, { erro: "Painel sem senha configurada. Defina DASHBOARD_PASSWORD na Vercel." });
    return false;
  }
  if (!storeConfigured()) {
    send(res, 503, { erro: "Armazenamento não configurado. Conecte um banco Redis (Upstash) ao projeto na Vercel." });
    return false;
  }
  // trava tentativas de senha: 10 erros em 15 minutos por origem
  const failKey = `rl:auth:${ipHash(req)}`;
  const [fails] = await pipeline([["GET", failKey]]);
  if (Number(fails) >= 10) {
    send(res, 429, { erro: "Muitas tentativas. Aguarde alguns minutos." });
    return false;
  }
  const bearer = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!passwordMatches(bearer)) {
    await pipeline([["INCR", failKey], ["EXPIRE", failKey, 900]]);
    await new Promise((r) => setTimeout(r, 400));
    send(res, 401, { erro: "Senha incorreta." });
    return false;
  }
  return true;
}

// ---------- leads (pedidos de orçamento) ----------
export const LEAD_RETENTION_DAYS = 365;
export const LEAD_STATUSES = ["novo", "contato", "orcamento", "fechado", "perdido"];

/** Texto livre (mensagem/observação): mantém acentos e quebras de linha, tira caracteres de controle. */
export function cleanText(value, max) {
  return String(value ?? "")
    .normalize("NFC")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, max);
}

/** Valida e limpa o que veio do formulário. Devolve null se não der para aproveitar. */
export function parseLead(raw) {
  const name = cleanText(raw?.name, 80).replace(/\s+/g, " ");
  const phone = String(raw?.phone ?? "").replace(/[^\d+()\- ]/g, "").trim().slice(0, 25);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || digits.length < 8 || digits.length > 15) return null;
  const email = String(raw?.email ?? "").trim().slice(0, 120);
  return {
    name,
    phone,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "",
    service: cleanLabel(raw?.service, 80),
    message: cleanText(raw?.message, 1000),
  };
}

/** Segundos que faltam para o lead completar o prazo de guarda. */
export const leadTtl = (createdAt) =>
  Math.max(60, Math.floor((createdAt + LEAD_RETENTION_DAYS * 86400000 - Date.now()) / 1000));

