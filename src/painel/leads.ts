// Aba "Leads" do painel: pedidos de orçamento recebidos pelo formulário do site.
// Dois jeitos de ver: Quadro (colunas por situação, arrastar para mudar) e Lista.
// A tela se atualiza sozinha e avisa quando chega lead novo.

interface Lead {
  id: string;
  createdAt: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  source: string;
  city: string;
  status: Status;
  flags?: string[];
  note: string;
}
type Status = "novo" | "contato" | "orcamento" | "fechado" | "perdido" | "suspeito";
type Mode = "quadro" | "lista";

const STATUSES: [Status, string][] = [
  ["novo", "Novo"],
  ["contato", "Em contato"],
  ["orcamento", "Orçamento enviado"],
  ["fechado", "Fechado"],
  ["perdido", "Perdido"],
  ["suspeito", "Suspeitos"],
];
const LABEL = Object.fromEntries(STATUSES) as Record<Status, string>;
const FLAG_LABEL: Record<string, string> = {
  "sem-chave": "enviado sem abrir a página do site",
  "rapido-demais": "preenchido rápido demais",
  "chave-vencida": "página aberta há muitas horas",
  "chave-reusada": "mesmo envio repetido",
  "telefone-estranho": "telefone fora do padrão brasileiro",
  "nome-estranho": "nome com aparência estranha",
  "email-descartavel": "e-mail temporário",
  "link-na-mensagem": "link na mensagem",
  "telefone-repetido": "telefone já enviado nas últimas 24 h",
  "excesso-de-envios": "muitos envios ao mesmo tempo",
};

const POLL_MS = 45_000;
const PAGE_BOARD = 6; // cards por coluna antes de "Ver mais"
const PAGE_LIST = 12;
const MODE_KEY = "bihel_painel_leads_modo";

export class AuthError extends Error {}

interface Hooks {
  password: () => string;
  onAuthError: (message: string) => void;
}

let hooks: Hooks;
let leads: Lead[] = [];
let mode: Mode = "quadro";
let filter: "todos" | Status = "todos"; // só na Lista
let query = "";
let visible: Record<string, number> = {};
let fresh = new Set<string>();
let known: Set<string> | null = null; // null = ainda não carregou nada (não avisa na primeira vez)
let signature = "";
let timer: number | undefined;
let pendingRepaint = false;
let built = false;
let baseTitle = "";

const $ = (id: string) => document.getElementById(id)!;
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function api(method: string, path = "", body?: unknown) {
  let res: Response;
  try {
    res = await fetch(`/api/leads${path}`, {
      method,
      cache: "no-store",
      headers: { Authorization: `Bearer ${hooks.password()}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique a internet e tente de novo.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new AuthError(data.erro || "Senha incorreta.");
  if (!res.ok) throw new Error(data.erro || "Não foi possível concluir agora.");
  return data;
}

// ---------- formatação ----------
const pad = (n: number) => String(n).padStart(2, "0");
function when(ts: number): string {
  const d = new Date(ts);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const day = (x: Date) => x.toDateString();
  if (day(d) === day(new Date())) return `hoje, ${time}`;
  if (day(d) === day(new Date(Date.now() - 86400000))) return `ontem, ${time}`;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}, ${time}`;
}
const whatsappLink = (phone: string) => {
  let digits = phone.replace(/\D/g, "");
  if (digits.length <= 11) digits = `55${digits}`;
  return `https://wa.me/${digits}`;
};

function matches(l: Lead, useFilter: boolean): boolean {
  if (useFilter && filter !== "todos" && l.status !== filter) return false;
  if (!query) return true;
  const hay = `${l.name} ${l.phone} ${l.email} ${l.service} ${l.message} ${l.note}`.toLowerCase();
  return hay.includes(query);
}

// ---------- desenho ----------
/** Cartão completo (usado na Lista e na janela de detalhes). */
function card(l: Lead): string {
  const options = STATUSES.map(([v, t]) => `<option value="${v}"${v === l.status ? " selected" : ""}>${t}</option>`).join("");
  const meta = [l.service, l.source, l.city].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join("");
  return `<article class="lead lead--${l.status}${fresh.has(l.id) ? " is-fresh" : ""}" data-id="${l.id}">
    <header class="lead__head">
      <h3>${esc(l.name)}</h3>
      <span class="pill pill--${l.status}">${LABEL[l.status]}</span>
      <time>${when(l.createdAt)}</time>
    </header>
    <div class="lead__meta">${meta}</div>
    <div class="lead__actions">
      <a class="act act--wa" href="${whatsappLink(l.phone)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <a class="act" href="tel:${esc(l.phone.replace(/[^\d+]/g, ""))}">Ligar ${esc(l.phone)}</a>
      ${l.email ? `<a class="act" href="mailto:${esc(l.email)}">${esc(l.email)}</a>` : ""}
    </div>
    ${l.message ? `<p class="lead__msg">${esc(l.message)}</p>` : ""}
    ${l.status === "suspeito" ? `<p class="lead__flags">⚠ Pode ser envio falso: ${esc((l.flags ?? []).map((f) => FLAG_LABEL[f] ?? f).join("; ") || "sem detalhes")}.
      <button type="button" data-notspam>Não é spam, mover para Novo</button></p>` : ""}
    <div class="lead__foot">
      <label>Situação <select data-status>${options}</select></label>
      <label class="lead__note">Observação <textarea data-note rows="2" maxlength="1000" placeholder="Ex.: liguei, enviei proposta de R$…">${esc(l.note)}</textarea></label>
      <span class="saved" data-saved hidden>Salvo ✓</span>
      <button type="button" class="del" data-del>Excluir</button>
    </div>
  </article>`;
}

/** Cartão compacto do quadro. */
function kcard(l: Lead): string {
  return `<div class="kcard${fresh.has(l.id) ? " is-fresh" : ""}" draggable="true" data-id="${l.id}" tabindex="0" role="button" aria-label="Abrir ${esc(l.name)}">
    <div class="kcard__top"><b>${esc(l.name)}</b><time>${when(l.createdAt)}</time></div>
    ${l.status === "suspeito" ? `<span class="kcard__warn">⚠ ${esc((l.flags ?? []).map((f) => FLAG_LABEL[f] ?? f)[0] ?? "suspeito")}</span>` : ""}
    ${l.service ? `<span class="kcard__svc">${esc(l.service)}</span>` : ""}
    ${l.message ? `<p class="kcard__msg">${esc(l.message)}</p>` : ""}
    <div class="kcard__row">
      <a class="act act--wa act--sm" href="${whatsappLink(l.phone)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      ${l.note ? `<span class="kcard__note" title="Tem observação">📝</span>` : ""}
    </div>
  </div>`;
}

function more(key: string, rest: number): string {
  return rest > 0 ? `<button type="button" class="more" data-more="${key}">Ver mais ${rest}</button>` : "";
}

function paintBoard() {
  const shown = leads.filter((l) => matches(l, false));
  $("lead-board").innerHTML = STATUSES.map(([s, label]) => {
    const col = shown.filter((l) => l.status === s);
    const limit = visible[s] ?? PAGE_BOARD;
    const body = col.length
      ? col.slice(0, limit).map(kcard).join("") + more(s, col.length - limit)
      : `<p class="kempty">${query ? "Nenhum resultado" : "Arraste um lead até aqui"}</p>`;
    return `<section class="kcol kcol--${s}" data-col="${s}" aria-label="${label}">
      <header><h3>${label}</h3>${s === "suspeito" && col.length ? `<button type="button" class="clear" data-clearspam title="Apagar todos os suspeitos">Apagar todos</button>` : ""}<span class="kcount">${col.length}</span></header>
      <div class="kcol__body">${body}</div>
    </section>`;
  }).join("");
}

function paintList() {
  const shown = leads.filter((l) => matches(l, true));
  const limit = visible.lista ?? PAGE_LIST;
  $("lead-list").innerHTML = shown.length
    ? shown.slice(0, limit).map(card).join("") + more("lista", shown.length - limit)
    : `<p class="empty">${leads.length ? "Nenhum lead com esse filtro." : "Ainda não chegou nenhum pedido de orçamento. Quando alguém preencher o formulário do site, ele aparece aqui."}</p>`;
}

function paintChips() {
  const count = (s: Status) => leads.filter((l) => l.status === s).length;
  const chips = [["todos", "Todos", leads.length], ...STATUSES.map(([v, t]) => [v, t, count(v)])] as [string, string, number][];
  $("lead-chips").innerHTML = chips
    .map(([v, t, n]) => `<button type="button" data-filter="${v}" aria-pressed="${v === filter}">${t} <b>${n}</b></button>`)
    .join("");
  const novos = count("novo");
  const badge = $("leads-badge");
  badge.textContent = String(novos);
  badge.hidden = novos === 0;
  baseTitle ||= document.title;
  document.title = novos ? `(${novos}) ${baseTitle}` : baseTitle;
}

function paintAll() {
  paintChips();
  $("lead-chips").hidden = mode !== "lista";
  $("lead-board").hidden = mode !== "quadro";
  $("lead-list").hidden = mode !== "lista";
  document.querySelectorAll<HTMLElement>("[data-lmode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lmode === mode)));
  if (mode === "quadro") paintBoard(); else paintList();
}

/** Redesenha sem atrapalhar quem está escrevendo uma observação na Lista. */
function repaint() {
  const active = document.activeElement as HTMLElement | null;
  if (mode === "lista" && active?.matches("textarea[data-note]") && $("lead-list").contains(active)) {
    pendingRepaint = true;
    paintChips();
    return;
  }
  pendingRepaint = false;
  paintAll();
}

// ---------- planilha ----------
function csvCell(value: string): string {
  // evita que uma planilha trate texto digitado por terceiros como fórmula
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}
function exportCsv() {
  const header = ["Data", "Nome", "Telefone", "E-mail", "Serviço", "Mensagem", "Origem", "Cidade", "Situação", "Observação"];
  const rows = leads.filter((l) => matches(l, mode === "lista")).map((l) => [
    new Date(l.createdAt).toLocaleString("pt-BR"), l.name, l.phone, l.email, l.service, l.message, l.source, l.city, LABEL[l.status], l.note,
  ]);
  const text = [header, ...rows].map((r) => r.map(csvCell).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  const d = new Date();
  a.href = url;
  a.download = `leads-bihel-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- avisos ----------
let toastTimer: number | undefined;
function toast(text: string, problem = false) {
  const el = $("lead-toast");
  el.textContent = text;
  el.classList.toggle("toast--bad", problem);
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { el.hidden = true; }, problem ? 6000 : 8000);
}

function flash(el: HTMLElement | null, text = "Salvo ✓", problem = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("saved--bad", problem);
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 2500);
}

// ---------- ações ----------
async function save(id: string, patch: Partial<Pick<Lead, "status" | "note">>): Promise<boolean> {
  try {
    const updated: Lead = await api("PATCH", "", { id, ...patch });
    leads = leads.map((l) => (l.id === id ? updated : l));
    return true;
  } catch (err) {
    if (err instanceof AuthError) hooks.onAuthError(err.message);
    else toast((err as Error).message, true);
    return false;
  }
}

async function moveLead(id: string, status: Status) {
  const lead = leads.find((l) => l.id === id);
  if (!lead || lead.status === status) return;
  const before = lead.status;
  lead.status = status; // atualiza na hora; volta atrás se o servidor recusar
  visible[status] = Math.max(visible[status] ?? PAGE_BOARD, 1);
  repaint();
  if (!(await save(id, { status }))) {
    lead.status = before;
    repaint();
  }
}

const dialog = () => $("lead-dialog") as HTMLDialogElement;
function openLead(id: string) {
  const lead = leads.find((l) => l.id === id);
  if (!lead) return;
  fresh.delete(id);
  $("lead-dialog-body").innerHTML = card(lead);
  const d = dialog();
  if (!d.open) d.showModal();
}

// ---------- atualização automática ----------
const sig = (p: { total: number; latest: string }) => `${p.total}|${p.latest}`;

async function refresh(initial = false) {
  const peek = await api("GET", "?peek=1");
  signature = sig(peek);
  const data = await api("GET");
  const next = data.leads as Lead[];
  if (known) {
    const arrived = next.filter((l) => !known!.has(l.id) && l.status === "novo");
    next.filter((l) => !known!.has(l.id)).forEach((l) => fresh.add(l.id));
    if (arrived.length) {
      toast(arrived.length === 1 ? `Chegou um novo lead: ${arrived[0].name}` : `Chegaram ${arrived.length} novos leads`);
    }
  }
  known = new Set(next.map((l) => l.id));
  leads = next;
  if (initial) visible = {};
  $("lead-updated").textContent = `Atualizado às ${pad(new Date().getHours())}:${pad(new Date().getMinutes())}`;
  repaint();
}

async function tick() {
  if (document.hidden || !hooks.password() || !built) return;
  try {
    const peek = await api("GET", "?peek=1");
    if (sig(peek) !== signature) await refresh();
  } catch (err) {
    if (err instanceof AuthError) hooks.onAuthError(err.message);
    /* falha de rede: tenta de novo no próximo ciclo */
  }
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && timer !== undefined) void tick();
});

// ---------- montagem ----------
function skeleton(root: HTMLElement) {
  root.innerHTML = `
    <div class="leads-bar">
      <div class="leads-top">
        <div class="seg" role="group" aria-label="Modo de exibição">
          <button type="button" data-lmode="quadro" aria-pressed="true">Quadro</button>
          <button type="button" data-lmode="lista" aria-pressed="false">Lista</button>
        </div>
        <span id="lead-updated" class="muted"></span>
      </div>
      <div id="lead-chips" class="chips"></div>
      <div class="leads-tools">
        <input id="lead-search" type="search" placeholder="Buscar por nome, telefone, serviço…" aria-label="Buscar leads" />
        <button type="button" id="lead-export" class="tool-btn">Baixar planilha (CSV)</button>
      </div>
    </div>
    <div id="lead-board" class="board"></div>
    <div id="lead-list" class="lead-list" hidden></div>
    <p class="note">Esta tela se atualiza sozinha. Os dados dos leads ficam guardados por 12 meses e depois são apagados
      automaticamente. Use "Excluir" para atender um pedido de remoção feito pelo cliente.</p>
    <dialog id="lead-dialog" class="lead-dialog" aria-label="Detalhes do lead">
      <button type="button" class="dialog-x" data-close aria-label="Fechar">×</button>
      <div id="lead-dialog-body"></div>
    </dialog>
    <div id="lead-toast" class="toast" role="status" hidden></div>`;

  root.addEventListener("click", async (e) => {
    const t = e.target as HTMLElement;
    const modeBtn = t.closest<HTMLElement>("[data-lmode]");
    if (modeBtn) {
      mode = modeBtn.dataset.lmode as Mode;
      try { window.localStorage.setItem(MODE_KEY, mode); } catch { /* sem storage */ }
      paintAll();
      return;
    }
    const chip = t.closest<HTMLElement>("[data-filter]");
    if (chip) { filter = chip.dataset.filter as typeof filter; visible.lista = PAGE_LIST; paintAll(); return; }
    const moreBtn = t.closest<HTMLElement>("[data-more]");
    if (moreBtn) {
      const key = moreBtn.dataset.more!;
      visible[key] = (visible[key] ?? (key === "lista" ? PAGE_LIST : PAGE_BOARD)) + (key === "lista" ? PAGE_LIST : PAGE_BOARD);
      paintAll();
      return;
    }
    if (t.closest("#lead-export")) { exportCsv(); return; }
    if (t === dialog() || t.closest("[data-close]")) { dialog().close(); return; }

    const notSpam = t.closest<HTMLElement>("[data-notspam]");
    if (notSpam) {
      const id = notSpam.closest<HTMLElement>("[data-id]")?.dataset.id;
      if (id) { if (dialog().open) dialog().close(); void moveLead(id, "novo"); }
      return;
    }
    if (t.closest("[data-clearspam]")) {
      const n = leads.filter((l) => l.status === "suspeito").length;
      if (!n || !window.confirm(`Apagar ${n} lead(s) suspeito(s)? Isso não pode ser desfeito.`)) return;
      try {
        await api("DELETE", "?status=suspeito");
        leads = leads.filter((l) => l.status !== "suspeito");
        known = new Set(leads.map((l) => l.id));
        repaint();
        signature = sig(await api("GET", "?peek=1"));
        toast("Suspeitos apagados.");
      } catch (err) {
        if (err instanceof AuthError) hooks.onAuthError(err.message);
        else toast((err as Error).message, true);
      }
      return;
    }

    const del = t.closest<HTMLElement>("[data-del]");
    if (del) {
      const lead = leads.find((l) => l.id === del.closest<HTMLElement>("[data-id]")?.dataset.id);
      if (!lead || !window.confirm(`Excluir o lead de ${lead.name}? Isso não pode ser desfeito.`)) return;
      try {
        await api("DELETE", `?id=${lead.id}`);
        leads = leads.filter((l) => l.id !== lead.id);
        known?.delete(lead.id);
        if (dialog().open) dialog().close();
        repaint();
        const peek = await api("GET", "?peek=1");
        signature = sig(peek);
      } catch (err) {
        if (err instanceof AuthError) hooks.onAuthError(err.message);
        else toast((err as Error).message, true);
      }
      return;
    }

    // clique num cartão do quadro (fora do botão de WhatsApp) abre os detalhes
    const k = t.closest<HTMLElement>(".kcard");
    if (k && !t.closest("a")) openLead(k.dataset.id!);
  });

  root.addEventListener("keydown", (e) => {
    const k = (e.target as HTMLElement).closest<HTMLElement>(".kcard");
    if (k && e.target === k && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openLead(k.dataset.id!); }
  });

  root.addEventListener("input", (e) => {
    if ((e.target as HTMLElement).id === "lead-search") {
      query = (e.target as HTMLInputElement).value.trim().toLowerCase();
      visible = {};
      paintAll();
    }
  });

  root.addEventListener("change", async (e) => {
    const sel = (e.target as HTMLElement).closest<HTMLSelectElement>("[data-status]");
    if (!sel) return;
    const el = sel.closest<HTMLElement>("[data-id]")!;
    const status = sel.value as Status;
    const lead = leads.find((l) => l.id === el.dataset.id);
    if (!lead) return;
    if (await save(lead.id, { status })) {
      flash(el.querySelector("[data-saved]"));
      el.className = `lead lead--${status}`;
      const pill = el.querySelector(".pill");
      if (pill) { pill.className = `pill pill--${status}`; pill.textContent = LABEL[status]; }
      // no quadro o cartão muda de coluna; na Lista ele fica no lugar até a pessoa terminar
      if (mode === "quadro") paintBoard();
      paintChips();
    }
  });

  root.addEventListener("focusout", async (e) => {
    const area = (e.target as HTMLElement).closest<HTMLTextAreaElement>("[data-note]");
    if (!area) return;
    const el = area.closest<HTMLElement>("[data-id]")!;
    const current = leads.find((l) => l.id === el.dataset.id);
    if (current && current.note !== area.value.trim()) {
      if (await save(current.id, { note: area.value })) {
        flash(el.querySelector("[data-saved]"));
        if (mode === "quadro") paintBoard();
      }
    }
    if (pendingRepaint) setTimeout(() => { if (pendingRepaint) repaint(); }, 0);
  });

  // arrastar e soltar entre colunas (computador)
  let dragId = "";
  root.addEventListener("dragstart", (e) => {
    const k = (e.target as HTMLElement).closest<HTMLElement>(".kcard");
    if (!k) return;
    dragId = k.dataset.id!;
    e.dataTransfer?.setData("text/plain", dragId);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
    k.classList.add("is-dragging");
  });
  root.addEventListener("dragend", () => {
    dragId = "";
    root.querySelectorAll(".is-dragging, .is-over").forEach((n) => n.classList.remove("is-dragging", "is-over"));
  });
  root.addEventListener("dragover", (e) => {
    const col = (e.target as HTMLElement).closest<HTMLElement>(".kcol");
    if (!col || !dragId) return;
    e.preventDefault();
    root.querySelectorAll(".is-over").forEach((n) => n !== col && n.classList.remove("is-over"));
    col.classList.add("is-over");
  });
  root.addEventListener("drop", (e) => {
    const col = (e.target as HTMLElement).closest<HTMLElement>(".kcol");
    if (!col || !dragId) return;
    e.preventDefault();
    const id = dragId;
    dragId = "";
    void moveLead(id, col.dataset.col as Status);
  });
}

export function initLeads(h: Hooks) {
  hooks = h;
}

/** Para a atualização automática e limpa o que estava na tela (ao sair do painel). */
export function stopLeads() {
  clearInterval(timer);
  timer = undefined;
  leads = [];
  known = null;
  signature = "";
  fresh = new Set();
  visible = {};
  if (baseTitle) document.title = baseTitle;
  if (built) {
    if (dialog().open) dialog().close();
    paintAll();
  }
}

/** Busca os leads, desenha a aba e liga a atualização automática. */
export async function loadLeads(): Promise<void> {
  const root = $("leads-content");
  if (!built) {
    try {
      const saved = window.localStorage.getItem(MODE_KEY);
      mode = saved === "lista" || saved === "quadro" ? saved : window.innerWidth < 900 ? "lista" : "quadro";
    } catch {
      mode = window.innerWidth < 900 ? "lista" : "quadro";
    }
    skeleton(root);
    built = true;
  }
  await refresh(true);
  if (timer === undefined) timer = window.setInterval(() => void tick(), POLL_MS);
}
