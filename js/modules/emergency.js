import { api } from '../data/api.js';
import { $ } from '../core/utils.js';
import { pageHead, badge, sevClass, fmtWhen, go } from '../core/ui.js';
import { mapChrome, bootMap, bindMapChrome } from '../components/map-workspace.js';

export function createEmergency() {
  let view, nmap, ops;
  async function mount(host) {
    view = host;
    host.classList.add('view-command');
    const rows = await api.getEmergency();
    view.innerHTML = `
      <div class="cmd">
        ${pageHead({ title: 'Emergency calls', blurb: 'Incoming distress queue. Caller identifiers shown only where the simulation marks them as legally available. Locations are estimated cell areas.' })}
        <div class="cmd-body">
          <div class="map-stage" id="em-map"><div class="map-canvas"></div>${mapChrome()}</div>
          <aside class="intel-rail">
            <section class="panel">
              <header class="panel-hd"><span class="accent-bar accent-red"></span><h3>Queue</h3></header>
              <div class="panel-bd" id="em-list"></div>
            </section>
          </aside>
        </div>
      </div>`;
    $('#em-list', view).innerHTML = rows.map((e) => `
      <article class="em-card">
        <div class="em-top"><b>${e.id}</b> ${badge(e.pri === 'P1' ? 'high' : e.pri === 'P2' ? 'med' : 'low', e.pri)}</div>
        <div>${e.type} · ${e.lga}</div>
        <div class="t-low">${fmtWhen(e.time, { withDate: true })} · caller ${e.caller}</div>
        <div>Est. radius ~${e.radiusKm} km · conf ${e.conf}%</div>
        <div>Unit ${e.unit || '—'} · ${badge('info', e.status)}</div>
      </article>`).join('');
    const boot = await bootMap($('#em-map', view));
    nmap = boot.nmap; ops = boot.ops;
    bindMapChrome(view, nmap, ops);
    return view;
  }
  return {
    mount,
    onShow() { requestAnimationFrame(() => nmap?.invalidate()); },
    destroy() { ops?.destroy(); nmap?.destroy(); },
  };
}
