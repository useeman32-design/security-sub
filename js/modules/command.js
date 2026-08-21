import { api } from '../data/api.js';
import { store } from '../core/store.js';
import { $, sparkline } from '../core/utils.js';
import { kpiCard, fmtWhen, badge, classChip, go, esc, confBar, sevClass, clockNow, rowsHtml } from '../core/ui.js';
import { mapChrome, bootMap, bindMapChrome, layerTreeHtml } from '../components/map-workspace.js';
import { INCIDENT_TYPES, towerById } from '../data/sim.js';

export function createCommand() {
  let view, nmap, ops, timer;
  let inc = [], ev = [], units = [], devices = [], alerts = [], emg = [];
  let filter = 'all';
  let selected = null;

  function flyTo(lat, lng, z = 10.4) {
    if (!nmap?.map || lat == null) return;
    nmap.lockView(true);
    nmap.map.flyTo([lat, lng], z, { duration: 0.65 });
  }

  function renderFeed() {
    const host = $('#rt-feed', view);
    if (!host) return;
    const rows = filter === 'all' ? ev : ev.filter((e) => e.kind === filter);
    host.innerHTML = rows.slice(0, 18).map((e) => `
      <button class="rt-item is-${e.kind}" data-ev="${e.id}" data-dev="${e.device || ''}" data-kind="${e.kind}">
        <span class="rt-t t-mono">${fmtWhen(e.time)}</span>
        <span class="rt-k">${e.title}</span>
        <span class="rt-b">${esc(e.body)}</span>
        <span class="rt-s">${e.status}${e.extra?.conf ? ' · conf ' + e.extra.conf + '%' : ''}${e.device ? ' · ' + e.device : ''}</span>
      </button>`).join('');
  }

  function renderInspector() {
    const host = $('#insp', view);
    if (!host) return;
    if (!selected) {
      host.innerHTML = `
        <div class="op-empty">
          <b>Select anything on the map or feed</b>
          <p>Incidents, towers, units, estimated device areas and LGAs open here. Locations are cell estimates, not GPS.</p>
        </div>`;
      return;
    }
    const { kind, data: d } = selected;
    if (kind === 'incident') {
      const full = inc.find((i) => i.id === d.id) || d;
      const type = INCIDENT_TYPES[full.type]?.label || full.name || full.type || 'Incident';
      host.innerHTML = `
        <div class="insp-hd"><b>${full.id || d.id}</b>${badge(sevClass(full.sev || 'high'), full.sev || full.status || 'OPEN')}</div>
        ${rowsHtml([
          ['Type', type],
          ['Status', full.status || '—'],
          ['LGA', full.lga || '—'],
          ['Place', full.place || 'Estimated point'],
          ['When', full.when ? fmtWhen(full.when, { withDate: true }) : '—'],
          ['Units', (full.units || []).join(', ') || '—'],
          ['Numbers', (full.numbers || []).join(', ') || '—'],
          ['Towers', (full.towers || []).join(', ') || '—'],
        ])}
        <p class="insp-note">${esc(full.desc || 'Point event on the operational picture.')}</p>
        <div class="sel-actions">
          <button class="btn-ghost" data-go="incidents">Incident file</button>
          ${full.numbers?.[0] ? `<button class="btn-primary" data-go="case" data-dev="${full.numbers[0]}">Open case</button>` : ''}
        </div>`;
      if (full.lat) flyTo(full.lat, full.lng);
      return;
    }
    if (kind === 'device') {
      host.innerHTML = `
        <div class="insp-hd"><b>${d.id}</b>${badge(sevClass(d.risk), d.risk)}</div>
        ${rowsHtml([
          ['Number', d.msisdn],
          ['Case', d.caseId],
          ['Status', d.status],
          ['Estimated area', d.currentArea],
          ['Cell', d.currentTower],
          ['Radius', '~' + d.radiusKm + ' km · not GPS'],
        ])}
        ${confBar(d.confidence)}
        <p class="insp-note">${esc(d.source)}</p>
        <div class="sel-actions">
          <button class="btn-ghost" data-go="location" data-dev="${d.id}">Location</button>
          <button class="btn-primary" data-go="case" data-dev="${d.id}">Investigation</button>
        </div>`;
      const tw = towerById(d.currentTower);
      if (tw) flyTo(tw.lat, tw.lng, 10.2);
      return;
    }
    if (kind === 'tower') {
      host.innerHTML = `
        <div class="insp-hd"><b>${d.id}</b>${badge('info', 'CELL')}</div>
        ${rowsHtml([
          ['Area', d.area],
          ['LGA', d.lga],
          ['Type', d.type],
          ['Source', 'Simulation · fictional ID'],
        ])}
        <p class="insp-note">Associating a device with this cell is an estimated area, never an exact coordinate.</p>`;
      flyTo(d.lat, d.lng, 10.6);
      return;
    }
    if (kind === 'unit') {
      host.innerHTML = `
        <div class="insp-hd"><b>${d.name}</b>${badge(d.status === 'AVAILABLE' ? 'ok' : 'med', d.status)}</div>
        ${rowsHtml([
          ['ID', d.id],
          ['Kind', d.kind],
          ['LGA', d.lga],
          ['Incident', d.incident || 'Unassigned'],
          ['Updated', d.updated],
        ])}
        <div class="sel-actions"><button class="btn-ghost" data-go="units">All units</button></div>`;
      flyTo(d.lat, d.lng, 10.6);
      return;
    }
    if (kind === 'lga') {
      host.innerHTML = `
        <div class="insp-hd"><b>${d.name}</b><span class="insp-kind">LGA</span></div>
        ${rowsHtml([
          ['State', d.state || 'Zamfara'],
          ['Incidents', String(inc.filter((i) => i.lga === d.name).length)],
        ])}
        <p class="insp-note">Click an incident marker or feed row for the operational record.</p>`;
      return;
    }
    if (kind === 'state') {
      host.innerHTML = `
        <div class="insp-hd"><b>Zamfara State</b>${badge('ok', 'AO')}</div>
        <p class="insp-note">Jurisdiction is locked to Zamfara. 14 LGAs, simulated telecom metadata, live incident picture.</p>
        ${classChip('SIM')}`;
    }
  }

  function renderIncidents() {
    const host = $('#inc-mini', view);
    if (!host) return;
    const open = inc.filter((i) => !['CLOSED', 'RESOLVED'].includes(i.status));
    host.innerHTML = open.slice(0, 8).map((i) => `
      <button class="mini-inc" data-inc="${i.id}">
        <b>${i.id}</b>
        <span>${INCIDENT_TYPES[i.type]?.label || i.type} · ${i.lga}</span>
        ${badge(sevClass(i.sev), i.sev)}
      </button>`).join('');
  }

  async function mount(host) {
    view = host;
    host.classList.add('view-command');
    [inc, ev, units, emg, devices, alerts] = await Promise.all([
      api.getIncidents(), api.getEvents(), api.getUnits(), api.getEmergency(),
      api.getDevices(), api.getAiAlerts(),
    ]);
    const trends = await api.getKpiTrends();
    const meta = await api.getMeta();
    const activeInc = inc.filter((i) => !['CLOSED', 'RESOLVED'].includes(i.status));
    const onlineU = units.filter((u) => u.status !== 'OFFLINE').length;

    host.innerHTML = `
      <div class="cmd">
        <div class="cmd-status">
          <span class="t-mono" id="cmd-clock">${clockNow()}</span>
          <span class="sep"></span>
          <b>Zamfara State · ZJSOC</b>
          <span class="obadge ob-ok">ONLINE</span>
          <span class="obadge ob-sim">TELECOM SIMULATED</span>
          <span class="t-low">Sync ${meta.lastSync}</span>
          <span class="spacer"></span>
          <span>Active <b class="t-red">${activeInc.length}</b></span>
          <span>P1 emergency <b class="t-red">${emg.filter((e) => e.pri === 'P1' && e.status !== 'RESOLVED').length}</b></span>
        </div>
        <div class="cmd-body">
          <div class="map-stage" id="cmd-map">
            <div class="map-canvas"></div>
            ${mapChrome()}
            <div class="map-ui kpi-overlay kpi-strip kpi-7">
              ${kpiCard({ label: 'Active incidents', value: activeInc.length, delta: 12, color: 'var(--red)', spark: sparkline(trends.incidents, { color: 'var(--red)' }), sub: 'Open cases' })}
              ${kpiCard({ label: 'High-risk LGAs', value: 6, delta: 8, color: 'var(--orange)', spark: sparkline(trends.highRisk, { color: 'var(--orange)' }), sub: 'Score ≥ 70' })}
              ${kpiCard({ label: 'Intel alerts', value: alerts.length, delta: 5, color: 'var(--gold)', spark: sparkline(trends.intel, { color: 'var(--gold)' }), sub: 'Need review' })}
              ${kpiCard({ label: 'Emergency', value: emg.filter((e) => e.status !== 'RESOLVED').length, delta: 14, color: 'var(--cyan)', spark: sparkline(trends.emergency, { color: 'var(--cyan)' }), sub: 'Open queue' })}
              ${kpiCard({ label: 'Numbers', value: devices.length, delta: 0, color: 'var(--blue)', spark: sparkline(trends.numbers, { color: 'var(--blue)' }), sub: 'Authorized' })}
              ${kpiCard({ label: 'Location events', value: 11, delta: 9, color: 'var(--purple)', spark: sparkline(trends.locations, { color: 'var(--purple)' }), sub: 'Cell areas' })}
              ${kpiCard({ label: 'Units online', value: onlineU, delta: -4, color: 'var(--green)', spark: sparkline(trends.units, { color: 'var(--green)' }), sub: `${units.length} total` })}
            </div>
          </div>
          <aside class="intel-rail">
            <section class="panel">
              <header class="panel-hd"><span class="accent-bar accent-cyan"></span><h3>Inspector</h3>
                <span class="spacer"></span>${classChip('SIM')}</header>
              <div class="panel-bd" id="insp"></div>
            </section>
            <section class="panel grow">
              <header class="panel-hd"><span class="accent-bar accent-red"></span>
                <h3>Real-time intelligence</h3></header>
              <div class="panel-bd">
                <div class="feed-filters" id="feed-filters">
                  ${['all','call','location','movement','risk','emergency','system'].map((k, i) =>
                    `<button class="${i === 0 ? 'is-on' : ''}" data-fk="${k}">${k}</button>`).join('')}
                </div>
                <div class="rt-feed" id="rt-feed"></div>
              </div>
            </section>
            <section class="panel">
              <header class="panel-hd"><span class="accent-bar accent-gold"></span>
                <h3>Active incidents</h3><span class="spacer"></span>
                <button class="ex-mini" data-go="incidents">All</button></header>
              <div class="panel-bd" id="inc-mini"></div>
            </section>
            <section class="panel">
              <header class="panel-hd"><h3>AI leads</h3>${classChip('AI')}</header>
              <div class="panel-bd" id="ai-box"></div>
            </section>
            <section class="panel">
              <header class="panel-hd"><h3>Map layers</h3></header>
              <div class="panel-bd" id="layer-tree">${layerTreeHtml()}</div>
            </section>
          </aside>
        </div>
      </div>`;

    renderFeed();
    renderIncidents();
    renderInspector();

    $('#ai-box', view).innerHTML = alerts.map((a) => `
      <article class="ai-card" data-ai="${a.id}" data-dev="${a.device || ''}">
        ${badge(sevClass(a.sev), a.sev)}
        <b>${esc(a.title)}</b>
        <p>${esc(a.reason)}</p>
        ${confBar(a.conf)}
        <div class="ai-ft">${a.verify}</div>
      </article>`).join('');

    const boot = await bootMap($('#cmd-map', view), {
      onSelect: (sel) => {
        if (!sel || !sel.data) { selected = { kind: 'state', data: { name: 'Zamfara' } }; renderInspector(); return; }
        if (sel.kind === 'incident') {
          const full = inc.find((i) => i.id === sel.data.id) || sel.data;
          selected = { kind: 'incident', data: full };
        } else {
          selected = sel;
        }
        renderInspector();
      },
      onLgaSelect: (sel) => { selected = sel; renderInspector(); },
    });
    nmap = boot.nmap;
    ops = boot.ops;
    bindMapChrome(view, nmap, ops);

    view.addEventListener('click', (e) => {
      const fk = e.target.closest('[data-fk]');
      if (fk) {
        filter = fk.dataset.fk;
        view.querySelectorAll('[data-fk]').forEach((x) => x.classList.toggle('is-on', x === fk));
        renderFeed();
        return;
      }
      const incBtn = e.target.closest('[data-inc]');
      if (incBtn) {
        const row = inc.find((i) => i.id === incBtn.dataset.inc);
        if (row) { selected = { kind: 'incident', data: row }; renderInspector(); }
        return;
      }
      const evBtn = e.target.closest('[data-ev]');
      if (evBtn) {
        if (evBtn.dataset.dev) {
          const d = devices.find((x) => x.id === evBtn.dataset.dev);
          if (d) { selected = { kind: 'device', data: d }; renderInspector(); }
        }
        return;
      }
      const ai = e.target.closest('[data-ai]');
      if (ai?.dataset.dev) {
        const d = devices.find((x) => x.id === ai.dataset.dev);
        if (d) { selected = { kind: 'device', data: d }; renderInspector(); }
        return;
      }
      const goBtn = e.target.closest('[data-go]');
      if (goBtn) {
        const id = goBtn.dataset.dev;
        if (id) store.set({ investigationId: id, pendingFocus: { type: 'device', id } });
        go(goBtn.dataset.go, id ? { type: 'device', id } : null);
      }
    });

    const ck = $('#cmd-clock', view);
    timer = setInterval(() => {
      if (ck) ck.textContent = clockNow();
      const pool = [
        { kind: 'location', title: 'LOCATION EVENT', body: 'INV-001 associated with Cell Tower ZM-104', status: 'ESTIMATED', device: 'INV-001', extra: { conf: 74, area: 'Remote corridor' } },
        { kind: 'call', title: 'CALL EVENT', body: 'Metadata: outbound event on investigated number', status: 'COMPLETED', device: 'INV-001' },
        { kind: 'system', title: 'SYNC', body: 'Simulation adapter poll · no live telecom connection', status: 'OK' },
        { kind: 'risk', title: 'RISK ALERT', body: 'Maru corridor still scoring HIGH · analyst verification required', status: 'LEAD', device: 'INV-001' },
      ];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      ev.unshift({ id: 'EV-L' + Date.now(), time: new Date().toISOString(), ...pick });
      if (ev.length > 30) ev.pop();
      renderFeed();
    }, 6500);

    return view;
  }

  return {
    mount,
    onShow() {
      requestAnimationFrame(() => nmap?.invalidate());
      setTimeout(() => nmap?.invalidate(), 200);
    },
    destroy() { clearInterval(timer); ops?.destroy(); nmap?.destroy(); },
  };
}
