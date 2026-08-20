import { api } from '../data/api.js';
import { store } from '../core/store.js';
import { $ } from '../core/utils.js';
import { pageHead, badge, sevClass, fmtWhen, classChip, confBar, go, rowsHtml, esc } from '../core/ui.js';
import { mapChrome, bootMap, bindMapChrome } from '../components/map-workspace.js';
import { INCIDENT_TYPES } from '../data/sim.js';

export function createCase() {
  let view, nmap, ops;

  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-flush view-command';
    const focus = store.get('pendingFocus');
    const id = (focus?.type === 'device' && focus.id) || store.get('investigationId') || 'INV-001';
    store.set({ pendingFocus: null, investigationId: id });
    api.logAudit({ action: 'VIEW', object: `Officer viewed investigation workspace ${id}` });

    const [dev, calls, loc, inc, ai, net] = await Promise.all([
      api.getDevice(id), api.getCalls(id), api.getLocations(id),
      api.getIncidents(), api.getAiAlerts(), api.getNetwork(id),
    ]);
    const related = inc.filter((i) => i.numbers.includes(id));
    const timeline = [
      ...loc.map((p) => ({ t: p.time, k: 'location', title: p.cell + ' · ' + p.area, sub: `~${p.radiusKm} km · ${p.conf}%` })),
      ...calls.map((c) => ({ t: c.time, k: 'call', title: `${c.dir} ${c.other}`, sub: `${c.dur} · ${c.cell} · metadata` })),
      ...related.map((i) => ({ t: i.when, k: 'incident', title: i.id + ' · ' + (INCIDENT_TYPES[i.type]?.label), sub: i.place })),
      ...ai.filter((a) => a.device === id).map((a) => ({ t: a.time, k: 'ai', title: a.title, sub: a.verify })),
    ].sort((a, b) => new Date(a.t) - new Date(b.t));

    view.innerHTML = `
      <div class="cmd">
        ${pageHead({
          kicker: 'INVESTIGATION WORKSPACE',
          title: `${dev.caseId} · ${dev.msisdn}`,
          blurb: 'Combined case file. Automated scores are intelligence leads and require analyst verification. Nobody is labelled a criminal from a model output.',
          actions: `${badge(sevClass(dev.risk), dev.risk)} ${classChip('SIM')}`,
        })}
        <div class="cmd-body">
          <div class="map-stage" id="cs-map"><div class="map-canvas"></div>${mapChrome()}</div>
          <aside class="intel-rail">
            <section class="panel">
              <header class="panel-hd"><h3>Subject profile</h3></header>
              <div class="panel-bd">
                ${rowsHtml([
                  ['Identifier', dev.id],
                  ['Status', dev.status],
                  ['Area', dev.currentArea],
                  ['Cell', dev.currentTower],
                ])}
                ${confBar(dev.confidence)}
                <p class="insp-note">${esc(dev.notes)}</p>
                <div class="sel-actions">
                  <button class="btn-ghost" data-r="calls">Calls</button>
                  <button class="btn-ghost" data-r="location">Location</button>
                  <button class="btn-ghost" data-r="movement">Movement</button>
                </div>
              </div>
            </section>
            <section class="panel">
              <header class="panel-hd"><h3>Case timeline</h3></header>
              <div class="panel-bd"><div class="trail-list">
                ${timeline.map((e) => `
                  <div class="trail-step is-${e.k}">
                    <b>${fmtWhen(e.t, { withDate: true })}</b>
                    <i>${esc(e.title)}</i>
                    <span>${esc(e.sub)}</span>
                  </div>`).join('')}
              </div></div>
            </section>
            <section class="panel">
              <header class="panel-hd"><h3>Related incidents</h3></header>
              <div class="panel-bd">
                ${related.length ? related.map((i) => `<div class="mrow"><div class="mrow-body"><div class="mrow-k">${i.id}</div><div class="t-low">${i.place}</div></div>${badge(sevClass(i.sev), i.sev)}</div>`).join('') : '<p class="t-low">No linked incidents.</p>'}
              </div>
            </section>
            <section class="panel">
              <header class="panel-hd"><h3>Network</h3></header>
              <div class="panel-bd">${net.map((n) => `<div class="insp-r"><span>${n.label}</span><b>${n.n} events</b></div>`).join('')}</div>
            </section>
          </aside>
        </div>
      </div>`;
    host.appendChild(view);
    view.addEventListener('click', (e) => {
      const r = e.target.closest('[data-r]')?.dataset.r;
      if (r) go(r, { type: 'device', id: id });
    });
    const boot = await bootMap($('#cs-map', view));
    nmap = boot.nmap; ops = boot.ops;
    bindMapChrome(view, nmap, ops);
    await ops.renderTrails(id);
    await ops.renderDevices(id);
    return view;
  }

  return {
    mount,
    onShow() { requestAnimationFrame(() => nmap?.invalidate()); },
    destroy() { ops?.destroy(); nmap?.destroy(); view?.remove(); },
  };
}
