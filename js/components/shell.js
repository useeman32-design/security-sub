/**
 * Persistent application shell — Zamfara SIC
 */

import { icon, brandMark } from '../core/icons.js';
import { store } from '../core/store.js';
import { $, $$ } from '../core/utils.js';
import { clockNow, classChip, esc } from '../core/ui.js';
import { api } from '../data/api.js';

export const NAV = [
  { group: 'Command', items: [
    { id: 'command',  label: 'Command Center',      ico: 'overview' },
    { id: 'live',     label: 'Live Intelligence',   ico: 'activity' },
    { id: 'incidents',label: 'Incidents',           ico: 'risk' },
    { id: 'emergency',label: 'Emergency Calls',     ico: 'bell' },
  ]},
  { group: 'Intelligence', items: [
    { id: 'calls',    label: 'Call Intelligence',   ico: 'phone' },
    { id: 'devices',  label: 'Device Intelligence', ico: 'radio' },
    { id: 'location', label: 'Location Tracking',   ico: 'pin' },
    { id: 'movement', label: 'Movement Analysis',   ico: 'pulse' },
    { id: 'risk',     label: 'Risk & Threat Map',   ico: 'prospectivity' },
  ]},
  { group: 'Operations', items: [
    { id: 'units',    label: 'Security Units',      ico: 'shield' },
    { id: 'reports',  label: 'Intelligence Reports',ico: 'reports' },
    { id: 'analytics',label: 'Analytics',           ico: 'grid' },
    { id: 'case',     label: 'Investigation',       ico: 'target' },
  ]},
  { group: 'Governance', items: [
    { id: 'sources',  label: 'Data Sources',        ico: 'data' },
    { id: 'audit',    label: 'Audit Logs',          ico: 'hash' },
    { id: 'settings', label: 'Settings',            ico: 'settings' },
  ]},
];

export function buildShell(mountPoint) {
  mountPoint.innerHTML = `
    <div class="app" id="app">
      <header class="topbar" role="banner">
        <div class="brand">
          ${brandMark(30)}
          <div class="brand-text">
            <span class="l1">Zamfara SIC</span>
            <span class="l2">Command Platform</span>
          </div>
        </div>

        <div class="gsearch">
          <span class="s-icon">${icon('search', { size: 14 })}</span>
          <input type="text" id="global-search" placeholder="Search LGA, incident, number, unit, tower…" autocomplete="off" aria-label="Global search" />
          <span class="kbd"><span>⌘</span><span>K</span></span>
        </div>

        <div class="spacer"></div>

        <div class="topbar-tools">
          <span class="pill t-mono" id="clock-pill">${clockNow()}</span>
          <button class="pill loc-pill" id="loc-pill" title="Jurisdiction">
            ${icon('pin', { size: 12 })}<span class="loc-name" id="loc-name">Zamfara</span>
            <span class="t-mono" style="font-size:9px;color:var(--text-faint)" id="loc-scope">STATE</span>
          </button>
          <span class="pill pill-live" id="sys-pill" title="System status">
            <span class="live-dot"></span><span id="sys-text">ONLINE</span>
          </span>
          <span class="pill pill-sim" id="tel-pill" title="Telecom intelligence">SIMULATED</span>
          <span class="tb-divider"></span>
          <button class="icon-btn theme-btn" title="Toggle theme" id="btn-theme" aria-label="Toggle theme">
            <span class="ico-moon">${icon('moon', { size: 16 })}</span>
            <span class="ico-sun">${icon('sun', { size: 16 })}</span>
          </button>
          <button class="icon-btn has-dot" title="Alert centre" id="btn-bell">
            ${icon('bell', { size: 17 })}<span class="dot"></span>
          </button>
          <button class="icon-btn" title="Settings" id="btn-settings-top">${icon('settings', { size: 17 })}</button>
          <span class="tb-divider"></span>
          <button class="user-btn" id="btn-user">
            <span class="avatar">AB</span>
            <span class="user-meta">
              <span class="un">A. Bello</span>
              <span class="ur">Intel Analyst</span>
            </span>
            ${icon('chevron', { size: 13, cls: 't-low' })}
          </button>
        </div>
      </header>

      <nav class="sidebar" role="navigation" aria-label="Modules">
        <div class="nav-scroll">
          ${NAV.map((g) => `
            <div class="nav-group">
              <div class="nav-group-label">${g.group}</div>
              ${g.items.map((it) => `
                <button class="nav-item" data-route="${it.id}" title="${it.label}">
                  ${icon(it.ico, { size: 16, cls: 'ico' })}
                  <span class="lbl">${it.label}</span>
                </button>`).join('')}
            </div>`).join('')}
        </div>

        <div class="sidebar-ft">
          <div class="officer-card">
            <span class="avatar">AB</span>
            <div>
              <b>Maj. Aisha Bello</b>
              <i>Intelligence Analyst</i>
              <i>ZJSOC · Gusau</i>
            </div>
          </div>
          <div class="sys-mini">
            <div class="r"><span class="k">Link</span><span class="v" style="color:var(--green)">SECURE</span></div>
            <div class="r"><span class="k">Telecom</span><span class="v" id="sm-tel">SIMULATION</span></div>
            <div class="r"><span class="k">Last Sync</span><span class="v" id="sm-sync">08:42</span></div>
            <div class="r"><span class="k">Status</span><span class="v" id="sm-lat">ONLINE</span></div>
          </div>
          <button class="rail-toggle" id="rail-toggle" title="Collapse sidebar">
            ${icon('chevronL', { size: 13 })}<span class="rt-label">Collapse</span>
          </button>
        </div>
      </nav>

      <main class="stage" id="stage" role="main">
        <div class="route-bar" id="route-bar"></div>
        <div class="sim-banner" id="sim-banner">
          ${classChip('SIM')}
          <span>Prototype uses fictional telecom metadata. No call content. Cell areas are estimates, not GPS.</span>
        </div>
      </main>

      <aside class="alert-drawer" id="alert-drawer" hidden>
        <header>
          <h3>Alert centre</h3>
          <button class="icon-btn" id="alert-close">${icon('plus', { size: 14 })}</button>
        </header>
        <div class="alert-list" id="alert-list"></div>
      </aside>
    </div>`;

  const app = $('#app', mountPoint);

  $('#rail-toggle', app).addEventListener('click', () => {
    const c = !store.get('railCollapsed');
    store.set({ railCollapsed: c });
    app.classList.toggle('is-rail', c);
    setTimeout(() => dispatchEvent(new Event('resize')), 240);
  });

  store.subscribe('drill', (d) => {
    $('#loc-name', app).textContent = d.state || 'Zamfara';
    $('#loc-scope', app).textContent = d.lga ? 'LGA' : 'STATE';
  });

  setInterval(() => {
    const el = $('#clock-pill', app);
    if (el) el.textContent = clockNow();
  }, 1000);

  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $('#global-search', app).focus();
    }
    if (e.key === 'Escape') {
      $('#global-search', app).blur();
      $('#alert-drawer', app).hidden = true;
    }
  });

  const drawer = $('#alert-drawer', app);
  $('#btn-bell', app).addEventListener('click', async () => {
    drawer.hidden = !drawer.hidden;
    if (!drawer.hidden) {
      const alerts = await api.getAlerts();
      $('#alert-list', app).innerHTML = alerts.map((a) => `
        <article class="alert-item sev-${a.sev.toLowerCase()}">
          <b>${esc(a.title)}</b>
          <p>${esc(a.body)}</p>
          <div class="alert-meta">
            <span>${a.time}</span>
            <span class="obadge ob-${a.sev === 'HIGH' ? 'high' : a.sev === 'MEDIUM' ? 'med' : a.sev === 'RESOLVED' ? 'ok' : 'info'}">${a.sev}</span>
          </div>
          <div class="alert-acts">
            <button data-act="ack">Acknowledge</button>
            <button data-act="assign">Assign</button>
            <button data-act="esc">Escalate</button>
            <button data-act="case">View investigation</button>
          </div>
        </article>`).join('');
    }
  });
  $('#alert-close', app).addEventListener('click', () => { drawer.hidden = true; });
  $('#alert-close', app).style.transform = 'rotate(45deg)';

  $('#alert-list', app).addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act) return;
    if (act === 'case') location.hash = '#/case';
    drawer.hidden = true;
  });

  /* global search */
  const gs = $('#global-search', app);
  let panel;
  gs.addEventListener('input', async () => {
    const q = gs.value.trim().toLowerCase();
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'gs-panel';
      gs.parentElement.appendChild(panel);
    }
    if (q.length < 2) { panel.hidden = true; return; }
    const [inc, dev, units, towers, lgas] = await Promise.all([
      api.getIncidents(), api.getDevices(), api.getUnits(), api.getTowers(), api.getLgaIndex(),
    ]);
    const hits = [
      ...inc.filter((x) => (x.id + x.lga + x.place).toLowerCase().includes(q)).slice(0, 4).map((x) => ({ t: x.id, s: x.place + ' · ' + x.lga, k: 'INCIDENT', r: 'incidents', c: '#ff4d5e' })),
      ...dev.filter((x) => (x.id + x.msisdn + x.caseId).toLowerCase().includes(q)).slice(0, 4).map((x) => ({ t: x.msisdn, s: x.id + ' · ' + x.caseId, k: 'DEVICE', r: 'calls', c: '#f5b942', id: x.id })),
      ...units.filter((x) => (x.id + x.name).toLowerCase().includes(q)).slice(0, 3).map((x) => ({ t: x.name, s: x.status, k: 'UNIT', r: 'units', c: '#00e676' })),
      ...towers.filter((x) => (x.id + x.area).toLowerCase().includes(q)).slice(0, 3).map((x) => ({ t: x.id, s: x.area, k: 'TOWER', r: 'location', c: '#4d9dff' })),
      ...lgas.filter((x) => x.name.toLowerCase().includes(q)).slice(0, 3).map((x) => ({ t: x.name, s: 'LGA · risk ' + x.risk, k: 'LGA', r: 'risk', c: '#2dd8c3' })),
    ];
    panel.hidden = false;
    panel.innerHTML = hits.length ? hits.map((h) => `
      <button class="gs-row" data-r="${h.r}" data-id="${h.id || ''}" style="--gc:${h.c}">
        <span class="gs-ico"></span>
        <span class="gs-txt"><span class="gs-t">${esc(h.t)}</span><span class="gs-s">${esc(h.s)}</span></span>
        <span class="gs-kind">${h.k}</span>
      </button>`).join('') : `<div class="gs-empty">No matches in simulation data</div>`;
  });
  app.addEventListener('click', (e) => {
    const row = e.target.closest('.gs-row');
    if (row) {
      if (row.dataset.id) store.set({ investigationId: row.dataset.id, pendingFocus: { type: 'device', id: row.dataset.id } });
      location.hash = '#/' + row.dataset.r;
      if (panel) panel.hidden = true;
      gs.value = '';
    }
  });

  return {
    app,
    stage: $('#stage', app),
    routeBar: $('#route-bar', app),
    setActive(id) {
      $$('.nav-item', app).forEach((n) => n.classList.toggle('is-active', n.dataset.route === id));
    },
    onNav(fn) {
      app.addEventListener('click', (e) => {
        const b = e.target.closest('[data-route]');
        if (b) fn(b.dataset.route);
      });
      $('#btn-settings-top', app).addEventListener('click', () => fn('settings'));
    },
  };
}
