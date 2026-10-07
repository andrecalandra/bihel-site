import "./painel.css";

interface Ranked { name: string; count: number; contacts?: number }
interface Daily { date: string; views: number; visitors: number; contacts: number }
interface Stats {
  range: { days: number; from: string; to: string; today: string };
  totals: { visitors: number; views: number; contacts: number; whatsappClicks: number; forms: number };
  previous: { visitors: number; views: number; contacts: number };
  daily: Daily[];
  sources: Ranked[];
  devices: Ranked[];
  cities: Ranked[];
  hours: number[];
  sections: Ranked[];
  services: Ranked[];
  contactWhere: Ranked[];
  generatedAt: string;
}

const PASS_KEY = "bihel_painel_senha";
const OPT_OUT_KEY = "bihel_sem_registro";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const login = $("login");
const dashboard = $("dashboard");
const content = $("content");
const statusEl = $("status");
const tip = $("tip");
const logoutBtn = $("logout");

let days = 7;
let password = "";

const nf = new Intl.NumberFormat("pt-BR");
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const plural = (n: number, one: string, many: string) => `${nf.format(n)} ${n === 1 ? one : many}`;

function readSaved(): string {
  try { return window.localStorage.getItem(PASS_KEY) || window.sessionStorage.getItem(PASS_KEY) || ""; } catch { return ""; }
}
function save(pass: string, remember: boolean) {
  try { (remember ? window.localStorage : window.sessionStorage).setItem(PASS_KEY, pass); } catch { /* sem storage */ }
}
function forget() {
  try { window.localStorage.removeItem(PASS_KEY); window.sessionStorage.removeItem(PASS_KEY); } catch { /* sem storage */ }
}

function show(view: "login" | "dashboard" | "status", message = "", problem = false) {
  login.hidden = view !== "login";
  dashboard.hidden = view !== "dashboard";
  statusEl.hidden = view !== "status";
  logoutBtn.hidden = view !== "dashboard";
  statusEl.textContent = message;
  statusEl.classList.toggle("problem", problem);
}

class AuthError extends Error {}

async function fetchStats(): Promise<Stats> {
  let res: Response;
  try {
    res = await fetch(`/api/stats?days=${days}`, { headers: { Authorization: `Bearer ${password}` }, cache: "no-store" });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique a internet e tente de novo.");
  }
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) throw new AuthError(body.erro || "Senha incorreta.");
  if (!res.ok) throw new Error(body.erro || "Não foi possível carregar os números agora.");
  return body as Stats;
}

function delta(now: number, before: number): string {
  if (before === 0 && now === 0) return `<span class="kpi__delta">sem dados no período anterior</span>`;
  if (before === 0) return `<span class="kpi__delta up">novo neste período</span>`;
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return `<span class="kpi__delta">igual ao período anterior</span>`;
  return `<span class="kpi__delta ${pct > 0 ? "up" : "down"}">${pct > 0 ? "▲" : "▼"} ${Math.abs(pct)}% vs. período anterior</span>`;
}

function kpi(label: string, value: number, now: number, before: number, accent = false) {
  return `<div class="kpi${accent ? " kpi--accent" : ""}">
    <div class="kpi__label">${label}</div>
    <div class="kpi__value">${nf.format(value)}</div>
    ${delta(now, before)}
  </div>`;
}

function rank(items: Ranked[], emptyText: string, sub?: (i: Ranked) => string): string {
  if (!items.length) return `<p class="empty">${emptyText}</p>`;
  const max = Math.max(...items.map((i) => i.count), 1);
  return `<ul class="rank">${items
    .map((i) => {
      const extra = sub?.(i);
      return `<li><span class="rank__name">${esc(i.name)}</span><span class="rank__num">${nf.format(i.count)}</span>
        <span class="rank__track"><span class="rank__fill" style="width:${Math.max(3, (i.count / max) * 100)}%;display:block"></span></span>
        ${extra ? `<span class="rank__sub">${extra}</span>` : ""}</li>`;
    })
    .join("")}</ul>`;
}

const fmtDay = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};
const fmtWeekday = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long" });

function summary(s: Stats): string {
  const t = s.totals;
  if (t.views === 0) {
    return "Ainda <strong>não há visitas registradas</strong> neste período. Assim que as pessoas começarem a acessar o site, os números aparecem aqui.";
  }
  const top = s.sources[0];
  const best = [...s.daily].sort((a, b) => b.visitors - a.visitors)[0];
  const peak = s.hours.indexOf(Math.max(...s.hours));
  const parts = [
    `Nos últimos ${s.range.days} dias, o site recebeu <strong>${plural(t.visitors, "visitante", "visitantes")}</strong>`,
    t.contacts > 0
      ? `e <strong>${plural(t.contacts, "pessoa chamou", "pessoas chamaram")} no WhatsApp ou enviou o formulário</strong>`
      : `e <strong>ninguém clicou no WhatsApp ou enviou o formulário</strong> ainda`,
  ];
  let text = parts.join(" ") + ".";
  if (top) text += ` A principal origem das visitas foi: <strong>${esc(top.name)}</strong>.`;
  if (best && best.visitors > 0) text += ` O dia mais movimentado foi <strong>${fmtWeekday(best.date)} (${fmtDay(best.date)})</strong>`;
  if (best && best.visitors > 0 && s.hours[peak] > 0) text += `, e o horário de pico é por volta das <strong>${peak}h</strong>.`;
  else if (best && best.visitors > 0) text += ".";
  return text;
}

function dailyChart(daily: Daily[]): string {
  const max = Math.max(...daily.map((d) => d.visitors), 1);
  const bars = daily
    .map((d) => {
      const label = `${fmtWeekday(d.date)}, ${fmtDay(d.date)}: ${plural(d.visitors, "visitante", "visitantes")}`;
      return `<div class="bar${d.visitors ? "" : " bar--zero"}" tabindex="0" data-tip="${esc(label)}" aria-label="${esc(label)}"><i style="height:${(d.visitors / max) * 100}%"></i></div>`;
    })
    .join("");
  const first = daily[0]?.date, last = daily[daily.length - 1]?.date;
  return `<div class="chart">${bars}</div><div class="chart__axis"><span>${first ? fmtDay(first) : ""}</span><span>${last ? fmtDay(last) : ""}</span></div>`;
}

function hoursChart(hours: number[]): string {
  const max = Math.max(...hours, 1);
  const bars = hours
    .map((n, h) => {
      const label = `${h}h às ${h + 1}h: ${plural(n, "acesso", "acessos")}`;
      return `<div class="bar${n ? "" : " bar--zero"}" tabindex="0" data-tip="${label}" aria-label="${label}"><i style="height:${(n / max) * 100}%"></i></div>`;
    })
    .join("");
  return `<div class="chart chart--hours">${bars}</div><div class="chart__axis"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span></div>`;
}

function table(s: Stats): string {
  const rows = [...s.daily]
    .reverse()
    .map((d) => `<tr><td>${fmtWeekday(d.date)}, ${fmtDay(d.date)}</td><td>${nf.format(d.visitors)}</td><td>${nf.format(d.views)}</td><td>${nf.format(d.contacts)}</td></tr>`)
    .join("");
  return `<details><summary>Ver números dia a dia (tabela)</summary>
    <table><thead><tr><th>Dia</th><th>Visitantes</th><th>Visualizações</th><th>Contatos</th></tr></thead><tbody>${rows}</tbody></table></details>`;
}

function isOptedOut(): boolean {
  try { return window.localStorage.getItem(OPT_OUT_KEY) === "1"; } catch { return false; }
}

function render(s: Stats) {
  const t = s.totals;
  const rate = t.visitors ? Math.round((t.contacts / t.visitors) * 1000) / 10 : 0;
  const prevRate = s.previous.visitors ? (s.previous.contacts / s.previous.visitors) * 100 : 0;
  content.innerHTML = `
    <p class="summary">${summary(s)}</p>
    <div class="kpis">
      ${kpi("Visitantes", t.visitors, t.visitors, s.previous.visitors)}
      ${kpi("Páginas vistas", t.views, t.views, s.previous.views)}
      ${kpi("Chamaram no WhatsApp ou enviaram formulário", t.contacts, t.contacts, s.previous.contacts, true)}
      <div class="kpi">
        <div class="kpi__label">Taxa de contato</div>
        <div class="kpi__value">${nf.format(rate)}%</div>
        ${delta(Math.round(rate * 10), Math.round(prevRate * 10))}
      </div>
    </div>
    <div class="grid">
      <div class="card card--wide"><h2>Visitantes por dia</h2><p class="hint">Passe o mouse (ou toque) em uma coluna para ver o dia.</p>${dailyChart(s.daily)}</div>
      <div class="card"><h2>De onde as pessoas vêm</h2><p class="hint">Como chegaram até o site.</p>${rank(s.sources, "Sem visitas ainda.")}</div>
      <div class="card"><h2>Em que aparelho acessam</h2><p class="hint">Celular, computador ou tablet.</p>${rank(s.devices, "Sem visitas ainda.")}</div>
      <div class="card"><h2>Onde clicaram para chamar no WhatsApp</h2><p class="hint">Qual botão do site gera mais contatos.</p>${rank(s.contactWhere, "Ninguém clicou no WhatsApp ainda.")}</div>
      <div class="card"><h2>Serviços mais abertos</h2><p class="hint">Quais serviços despertam mais interesse.</p>${rank(s.services, "Ninguém abriu um serviço ainda.", (i) => (i.contacts ? `${plural(i.contacts, "pessoa pediu", "pessoas pediram")} orçamento` : "nenhum pedido de orçamento"))}</div>
      <div class="card"><h2>Até onde as pessoas leem</h2><p class="hint">Quantas visitas chegaram a cada parte da página.</p>${rank(s.sections, "Sem dados ainda.")}</div>
      <div class="card"><h2>Cidades</h2><p class="hint">Aproximado, pela região de acesso.</p>${rank(s.cities, "Sem dados de cidade ainda.")}</div>
      <div class="card card--wide"><h2>Horários de maior movimento</h2><p class="hint">Horário de Brasília.</p>${hoursChart(s.hours)}</div>
    </div>
    ${table(s)}
    <p class="note">
      Os números não identificam ninguém: não guardamos IP nem usamos cookies nesta medição, e cada visitante conta uma vez por dia.
      Quem recusa os cookies no aviso do site não é contado.<br />
      <button type="button" id="optout"></button>
    </p>`;
  $("updated").textContent = `Atualizado às ${new Date(s.generatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

  const optBtn = $("optout");
  const paintOpt = () => {
    optBtn.textContent = isOptedOut()
      ? "Minhas visitas NÃO estão sendo contadas neste aparelho. Clique para voltar a contar."
      : "Não contar as minhas visitas neste aparelho (útil para a equipe da Bihel).";
  };
  paintOpt();
  optBtn.addEventListener("click", () => {
    try {
      if (isOptedOut()) window.localStorage.removeItem(OPT_OUT_KEY);
      else window.localStorage.setItem(OPT_OUT_KEY, "1");
    } catch { /* sem storage */ }
    paintOpt();
  });
}

async function load() {
  content.setAttribute("aria-busy", "true");
  try {
    const stats = await fetchStats();
    show("dashboard");
    render(stats);
  } catch (err) {
    if (err instanceof AuthError) {
      forget();
      show("login");
      showLoginError(err.message);
    } else {
      show("status", (err as Error).message, true);
    }
  } finally {
    content.removeAttribute("aria-busy");
  }
}

function showLoginError(message: string) {
  const el = $("login-error");
  el.textContent = message;
  el.hidden = !message;
}

$("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = (event.target as HTMLFormElement).querySelector("button[type=submit]") as HTMLButtonElement;
  password = ($("password") as HTMLInputElement).value;
  showLoginError("");
  submit.disabled = true;
  show("status", "Carregando…");
  await load();
  submit.disabled = false;
  if (!dashboard.hidden) save(password, ($("remember") as HTMLInputElement).checked);
});

logoutBtn.addEventListener("click", () => {
  forget();
  password = "";
  ($("password") as HTMLInputElement).value = "";
  show("login");
});

document.querySelectorAll<HTMLButtonElement>(".tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    days = Number(btn.dataset.days);
    document.querySelectorAll(".tabs button").forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
    void load();
  });
});

// dica ao passar o mouse / focar nas colunas
const place = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  tip.textContent = el.dataset.tip || "";
  tip.hidden = false;
  const half = tip.offsetWidth / 2 + 8;
  tip.style.left = `${Math.min(window.innerWidth - half, Math.max(half, r.left + r.width / 2))}px`;
  tip.style.top = `${r.top}px`;
};
content.addEventListener("mouseover", (e) => {
  const bar = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]");
  if (bar) place(bar); else tip.hidden = true;
});
content.addEventListener("mouseleave", () => { tip.hidden = true; });
content.addEventListener("focusin", (e) => {
  const bar = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]");
  if (bar) place(bar);
});
content.addEventListener("focusout", () => { tip.hidden = true; });
content.addEventListener("click", (e) => {
  const bar = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]");
  if (bar) place(bar); else tip.hidden = true;
});

password = readSaved();
if (password) {
  show("status", "Carregando…");
  void load();
} else {
  show("login");
}
