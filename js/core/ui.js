import { icon } from './icons.js';
import { store } from './store.js';

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export function go(route, focus) {
  if (focus) store.set({ pendingFocus: focus });
  location.hash = '#/' + route;
}

export function clockNow() {
  return new Date().toLocaleString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    timeZone: 'Africa/Lagos',
  }) + ' WAT';
}

export function fmtWhen(iso, { withDate = false } = {}) {
  if (!iso) return '—';
  const d = new Date(iso);
  const t = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: withDate ? undefined : '2-digit', hour12: false, timeZone: 'Africa/Lagos' });
  if (!withDate) return t;
  const day = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'Africa/Lagos' });
  return `${day} ${t}`;
}

export function badge(kind, text) {
  return `<span class="obadge ob-${kind}">${esc(text)}</span>`;
}

export function confBar(n) {
  const c = n >= 80 ? 'var(--green)' : n >= 65 ? 'var(--gold)' : 'var(--orange)';
  return `<div class="conf"><span>Confidence ${n}%</span>
    <i class="meter"><i style="width:${n}%;background:${c}"></i></i></div>`;
}

export function classChip(kind) {
  const map = {
    SIM: { k: 'sim', t: 'SIMULATION DATA' },
    LIVE: { k: 'live', t: 'AUTHORIZED LIVE DATA' },
    VERIFIED: { k: 'ok', t: 'ANALYST VERIFIED INTELLIGENCE' },
    AI: { k: 'ai', t: 'AI-GENERATED LEAD' },
    META: { k: 'meta', t: 'METADATA ONLY — NO CALL CONTENT' },
    AUTH: { k: 'auth', t: 'AUTHORIZED DATA FEED' },
  };
  const m = map[kind] || map.SIM;
  return `<span class="class-chip cc-${m.k}">${m.t}</span>`;
}

export function pageHead({ kicker, title, blurb, actions = '' }) {
  return `
    <header class="op-head">
      <div>
        <div class="op-kicker">${kicker || 'ZAMFARA SIC'}</div>
        <h1>${title}</h1>
        <p>${blurb}</p>
      </div>
      <div class="op-head-act">${actions}${classChip('SIM')}</div>
    </header>`;
}

export function kpiCard({ label, value, delta, color = 'var(--green)', spark = '', sub = '' }) {
  const dcls = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const dtxt = delta > 0 ? `▲ ${delta}%` : delta < 0 ? `▼ ${Math.abs(delta)}%` : '▬ 0%';
  return `
    <article class="kpi" style="--kpi-c:${color}">
      <div class="kpi-top">
        <span class="kpi-label">${label}</span>
        <span class="delta ${dcls}">${dtxt}</span>
      </div>
      <div class="kpi-mid">
        <span class="kpi-n">${value}</span>
        ${spark ? `<span class="kpi-spark">${spark}</span>` : ''}
      </div>
      <div class="kpi-foot"><span class="ctx">${sub}</span></div>
    </article>`;
}

export function empty(title, sub, ico = 'info') {
  return `<div class="op-empty">
    <div class="op-empty-g">${icon(ico, { size: 22 })}</div>
    <b>${title}</b><p>${sub}</p>
  </div>`;
}

export function rowsHtml(pairs) {
  return `<div class="insp-rows">${pairs.map(([k, v]) =>
    `<div class="insp-r"><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;
}

export function sevClass(s) {
  const x = String(s || '').toLowerCase();
  if (x.includes('critical') || x === 'high' || x === 'p1') return 'high';
  if (x.includes('med') || x === 'p2' || x === 'medium') return 'med';
  if (x.includes('low') || x === 'p3' || x.includes('info') || x.includes('resolv')) return 'low';
  return 'med';
}
