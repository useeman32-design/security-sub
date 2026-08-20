import { api } from '../data/api.js';
import { icon } from '../core/icons.js';
import { $, sparkline, toast } from '../core/utils.js';
import { kpiCard, fmtWhen, badge, classChip, go, esc, confBar, sevClass, clockNow } from '../core/ui.js';
import { mapChrome, bootMap, bindMapChrome, layerTreeHtml } from '../components/map-workspace.js';
import { INCIDENT_TYPES } from '../data/sim.js';

export function createCommand() {
  let view, nmap, ops, timer;

  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-flush view-command';
    const [inc, ev, units, emg, devices, trends, meta, alerts] = await Promise.all([
      api.getIncidents(), api.getEvents(), api.getUnits(), api.getEmergency(),
      api.getDevices(), api.getKpiTrends(), api.getMeta(), api.getAiAlerts(),
    ]);
    const activeInc = inc.filter((i) => !['CLOSED', 'RESOLVED'].includes(i.status));
    const highLga = 6;
    const onlineU = units.filter((u) => u.status !== 'OFFLINE').length;

    view.innerHTML = `
      <div class="cmd">
        <div class="cmd-status">
          <span class="t-mono" id="cmd-clock"></span>
          <span class="sep"></span>
          <b>Zamfara State</b>
          <span class="obadge ob-ok">SYSTEM ONLINE</span>
          <span class="obadge ob-sim">TELECOM · SIMULATED</span>
          <span class="t-low">Last sync ${meta.lastSync}</span>
          <span class="spacer"></span>
          <span>Active incidents <b class="t-red">${activeInc.length}</b></span>
          <span>High-risk alerts <b class="t-red">${alerts.filter((a) => a.sev === 'HIGH').length}</b></span>
        </div>
        <div class="kpi-strip kpi-7">
          ${kpiCard({ label: 'Active incidents', value: activeInc.length, delta: 12, color: 'var(--red)', spark: sparkline(trends.incidents, { color: 'var(--red)' }), sub: 'Open operational cases' })}
          ${kpiCard({ label: 'High-risk areas', value: highLga, delta: 8, color: 'var(--orange)', spark: sparkline(trends.highRisk, { color: 'var(--orange)' }), sub: 'LGAs scoring ≥ 70' })}
          ${kpiCard({ label: 'Intel alerts', value: alerts.length, delta: 5, color: 'var(--gold)', spark: sparkline(trends.intel, { color: 'var(--gold)' }), sub: 'Requires analyst review' })}
          ${kpiCard({ label: 'Emergency calls', value: emg.filter((e) => e.status !== 'RESOLVED').length, delta: 14, color: 'var(--cyan)', spark: sparkline(trends.emergency, { color: 'var(--cyan)' }), sub: 'Open 112 / distress' })}
          ${kpiCard({ label: 'Investigated numbers', value: devices.length, delta: 0, color: 'var(--blue)', spark: sparkline(trends.numbers, { color: 'var(--blue)' }), sub: 'Authorized cases' })}
          ${kpiCard({ label: 'Location events', value: 11, delta: 9, color: 'var(--purple)', spark: sparkline(trends.locations, { color: 'var(--purple)' }), sub: 'Estimated cell areas' })}
          ${kpiCard({ label: 'Units online', value: onlineU, delta: -4, color: 'var(--green)', spark: sparkline(trends.units, { color: 'var(--green)' }), sub: `${units.length} registered` })}
        </div>
        <div class="cmd-body">
          <div class="map-stage" id="cmd-map">
            <div class="map-canvas"></div>
            ${mapChrome()}
          </div>
          <aside class="intel-rail">
            <section class="panel">
              <header class="panel-hd"><span class="accent-bar accent-red"></span>
                <h3>Real-time intelligence</h3><span class="spacer"></span>${classChip('SIM')}</header>
              <div class="panel-bd">
                <div class="feed-filters" id="feed-filters">
                  ${['all','call','location','movement','risk','emergency','system'].map((k,i) =>
                    `<button class="${i===0?'is-on':''}" data-fk="${k}">${k}</button>`).join('')}
                </div>
                <div class="rt-feed" id="rt-feed"></div>
              </div>
            </section>
            <section class="panel">
              <header class="panel-hd"><span class="accent-bar accent-gold"></span>
                <h3>AI-assisted leads</h3><span class="spacer"></span>${classChip('AI')}</header>
              <div class="panel-bd" id="ai-box"></div>
            </section>
            <section class="panel">
              <header class="panel-hd"><span class="accent-bar"></span>
                <h3>Layers</h3></header>
              <div class="panel-bd" id="layer-tree">${layerTreeHtml()}</div>
            </section>
          </aside>
        </div>
      </div>`;
    host.appendChild(view);

    const { nmap: nm, ops: op } = await bootMap($('#cmd-map', view), {
      onSelect: (sel) => {
        if (sel?.kind === 'device') go('calls', { type: 'device', id: sel.data.id });
        if (sel?.kind === 'unit') go('units', { type: 'unit', id: sel.data.id });
      },
      onLgaSelect: () => {},
    });
    nmap = nm; ops = op;
    bindMapChrome(view, nmap, ops);

    let filter = 'all';
    const renderFeed = (list) => {
      const rows = filter === 'all' ? list : list.filter((e) => e.kind === filter);
      $('#rt-feed', view).innerHTML = rows.map((e) => `
        <button class="rt-item is-${e.kind}" data-ev="${e.id}" data-dev="${e.device || ''}">
          <span class="rt-t t-mono">${fmtWhen(e.time)}</span>
          <span class="rt-k">${e.title}</span>
          <span class="rt-b">${esc(e.body)}</span>
          <span class="rt-s">${e.status}${e.extra?.conf ? ' · conf ' + e.extra.conf + '%' : ''}</span>
        </button>`).join('');
    };
    renderFeed(ev);
    $('#feed-filters', view).addEventListener('click', (e) => {
      const b = e.target.closest('[data-fk]');
      if (!b) return;
      filter = b.dataset.fk;
      view.querySelectorAll('[data-fk]').forEach((x) => x.classList.toggle('is-on', x === b));
      renderFeed(ev);
    });
    $('#rt-feed', view).addEventListener('click', (e) => {
      const it = e.target.closest('[data-ev]');
      if (!it) return;
      if (it.dataset.dev) go('case', { type: 'device', id: it.dataset.dev });
      else go('live');
    });

    $('#ai-box', view).innerHTML = alerts.slice(0, 3).map((a) => `
      <article class="ai-card">
        ${badge(sevClass(a.sev), a.sev + ' RISK')}
        <b>${esc(a.title)}</b>
        <p>${esc(a.reason)}</p>
        ${confBar(a.conf)}
        <div class="ai-ft">${a.verify} · ${classChip('AI')}</div>
      </article>`).join('');

    // Simulated live tick — prepends a heartbeat, never implies a real intercept.
    let n = 0;
    timer = setInterval(() => {
      n += 1;
      const now = new Date().toISOString();
      ev.unshift({
        id: 'EV-L' + n, time: now, kind: n % 3 === 0 ? 'system' : 'location',
        title: n % 3 === 0 ? 'SYSTEM' : 'LOCATION EVENT',
        body: n % 3 === 0 ? 'Simulation heartbeat · adapters green' : 'Device associated with Cell Tower ZM-104',
        status: n % 3 === 0 ? 'OK' : 'ESTIMATED',
        extra: n % 3 === 0 ? {} : { area: 'Remote corridor', conf: 74 },
      });
      if (ev.length > 24) ev.pop();
      renderFeed(ev);
    }, 7000);

    return view;
  }

  return {
    mount,
    onShow() { requestAnimationFrame(() => nmap?.invalidate()); },
    onHide() {},
    destroy() { clearInterval(timer); ops?.destroy(); nmap?.destroy(); view?.remove(); },
  };
}
