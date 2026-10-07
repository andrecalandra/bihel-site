// Aba "Leads" do painel: pedidos de orçamento recebidos pelo formulário do site.

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
  note: string;
}
type Status = "novo" | "contato" | "orcamento" | "fechado" | "perdido";

const STATUSES: [Status, string][] = [
  ["novo", "Novo"],
  ["contato", "Em contato"],
  ["orcamento", "Orçamento enviado"],
  ["fechado", "Fechado"],
  ["perdido", "Perdido"],
];
const LABEL = Object.fromEntries(STATUSES) as Record<Status, string>;

export class AuthError extends Error {}

interface Hooks {
  password: () => string;
  onAuthError: (message: string) => void;
}

let hooks: Hooks;
let leads: Lead[] = [];
let filter: "todos" | Status = "todos";
let query = "";

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

function matches(l: Lead): boolean {
  if (filter !== "todos" && l.status !== filter) return false;
  if (!query) return true;
  const hay = `${l.name} ${l.phone} ${l.email} ${l.service} ${l.message} ${l.note}`.toLowerCase();
  return hay.includes(query);
}

// ---------- tela ----------
function card(l: Lead): string {
  const options = STATUSES.map(([v, t]) => `<option value="${v}"${v === l.status ? " selected" : ""}>${t}</option>`).join("");
  const meta = [l.service, l.source, l.city].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join("");
  return `<article class="lead lead--${l.status}" data-id="${l.id}">
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
    <div class="lead__foot">
      <label>Situação <select data-status>${options}</select></label>
      <label class="lead__note">Observação <textarea data-note rows="2" maxlength="1000" placeholder="Ex.: liguei, enviei proposta de R$…">${esc(l.note)}</textarea></label>
      <span class="saved" data-saved hidden>Salvo ✓</span>
      <button type="button" class="del" data-del>Excluir</button>
    </div>
  </article>`;
}

function paintList() {
  const list = document.getElementById("lead-list");
  if (!list) return;
  const shown = leads.filter(matches);
  list.innerHTML = shown.length
    ? shown.map(card).join("")
    : `<p class="empty">${leads.length ? "Nenhum lead com esse filtro." : "Ainda não chegou nenhum pedido de orçamento. Quando alguém preencher o formulário do site, ele aparece aqui."}</p>`;
}

function paintChips() {
  const count = (s: Status) => leads.filter((l) => l.status === s).length;
  const chips = [["todos", "Todos", leads.length], ...STATUSES.map(([v, t]) => [v, t, count(v)])] as [string, string, number][];
  document.getElementById("lead-chips")!.innerHTML = chips
    .map(([v, t, n]) => `<button type="button" data-filter="${v}" aria-pressed="${v === filter}">${t} <b>${n}</b></button>`)
    .join("");
  const novos = count("novo");
  const badge = document.getElementById("leads-badge")!;
  badge.textContent = String(novos);
  badge.hidden = novos === 0;
}

function csvCell(value: string): string {
  // evita que uma planilha trate texto digitado por terceiros como fórmula
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}
function exportCsv() {
  const header = ["Data", "Nome", "Telefone", "E-mail", "Serviço", "Mensagem", "Origem", "Cidade", "Situação", "Observação"];
  const rows = leads.filter(matches).map((l) => [
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

function flash(el: HTMLElement | null, text = "Salvo ✓", problem = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("saved--bad", problem);
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 2500);
}

async function save(id: string, patch: Partial<Pick<Lead, "status" | "note">>, saved: HTMLElement | null) {
  try {
    const updated: Lead = await api("PATCH", "", { id, ...patch });
    leads = leads.map((l) => (l.id === id ? updated : l));
    flash(saved);
    return true;
  } catch (err) {
    if (err instanceof AuthError) hooks.onAuthError(err.message);
    else flash(saved, (err as Error).message, true);
    return false;
  }
}

function skeleton(root: HTMLElement) {
  root.innerHTML = `
    <div class="leads-bar">
      <div id="lead-chips" class="chips"></div>
      <div class="leads-tools">
        <input id="lead-search" type="search" placeholder="Buscar por nome, telefone, serviço…" aria-label="Buscar leads" />
        <button type="button" id="lead-export" class="tool-btn">Baixar planilha (CSV)</button>
      </div>
    </div>
    <div id="lead-list" class="lead-list"></div>
    <p class="note">Os dados dos leads ficam guardados por 12 meses e depois são apagados automaticamente.
      Use "Excluir" para atender um pedido de remoção feito pelo cliente.</p>`;

  root.addEventListener("click", async (e) => {
    const t = e.target as HTMLElement;
    const chip = t.closest<HTMLElement>("[data-filter]");
    if (chip) { filter = chip.dataset.filter as typeof filter; paintChips(); paintList(); return; }
    if (t.closest("#lead-export")) { exportCsv(); return; }
    const del = t.closest<HTMLElement>("[data-del]");
    if (del) {
      const lead = leads.find((l) => l.id === del.closest<HTMLElement>(".lead")?.dataset.id);
      if (!lead || !window.confirm(`Excluir o lead de ${lead.name}? Isso não pode ser desfeito.`)) return;
      try {
        await api("DELETE", `?id=${lead.id}`);
        leads = leads.filter((l) => l.id !== lead.id);
        paintChips();
        paintList();
      } catch (err) {
        if (err instanceof AuthError) hooks.onAuthError(err.message);
        else window.alert((err as Error).message);
      }
    }
  });
  root.addEventListener("input", (e) => {
    if ((e.target as HTMLElement).id === "lead-search") {
      query = (e.target as HTMLInputElement).value.trim().toLowerCase();
      paintList();
    }
  });
  root.addEventListener("change", async (e) => {
    const sel = (e.target as HTMLElement).closest<HTMLSelectElement>("[data-status]");
    if (!sel) return;
    const el = sel.closest<HTMLElement>(".lead")!;
    if (await save(el.dataset.id!, { status: sel.value as Status }, el.querySelector("[data-saved]"))) {
      paintChips();
      // mantém o cartão na tela até a pessoa terminar; só reaplica o filtro se ele deixar de combinar
      el.className = `lead lead--${sel.value}`;
      const pill = el.querySelector(".pill");
      if (pill) { pill.className = `pill pill--${sel.value}`; pill.textContent = LABEL[sel.value as Status]; }
    }
  });
  root.addEventListener("focusout", (e) => {
    const area = (e.target as HTMLElement).closest<HTMLTextAreaElement>("[data-note]");
    if (!area) return;
    const el = area.closest<HTMLElement>(".lead")!;
    const current = leads.find((l) => l.id === el.dataset.id);
    if (current && current.note !== area.value.trim()) void save(current.id, { note: area.value }, el.querySelector("[data-saved]"));
  });
}

let built = false;

export function initLeads(h: Hooks) {
  hooks = h;
}

/** Busca os leads e desenha a aba. Devolve a quantidade de leads novos. */
export async function loadLeads(): Promise<void> {
  const root = document.getElementById("leads-content")!;
  if (!built) { skeleton(root); built = true; }
  const data = await api("GET");
  leads = data.leads as Lead[];
  paintChips();
  paintList();
}
