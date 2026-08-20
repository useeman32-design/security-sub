import { api } from '../data/api.js';
import { $ } from '../core/utils.js';
import { pageHead, badge, sevClass, go } from '../core/ui.js';
import { mapChrome, bootMap, bindMapChrome } from '../components/map-workspace.js';

export function createUnits() {
  let view, nmap, ops;
  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-flush view-command';
    const rows = await api.getUnits();
    view.innerHTML = `
      <div class="cmd">
        ${pageHead({ title: 'Security units', blurb: 'Approximate last-reported positions for deployed elements. Offline units are shown for accountability, not as a live track.' })}
        <div class="cmd-body">
          <div class="map-stage" id="un-map"><div class="map-canvas"></div>${mapChrome()}</div>
          <aside class="intel-rail">
            <section class="panel">
              <header class="panel-hd"><h3>Order of battle</h3></header>
              <div class="panel-bd">
                ${rows.map((u) => `
                  <div class="mrow">
                    <div class="mrow-body">
                      <div class="mrow-k">${u.id} · ${u.name}</div>
                      <div class="t-low">${u.kind} · ${u.lga} · ${u.incident || 'unassigned'} · ${u.updated}</div>
                    </div>
                    ${badge(u.status === 'AVAILABLE' ? 'ok' : u.status === 'OFFLINE' ? 'info' : 'med', u.status)}
                  </div>`).join('')}
              </div>
            </section>
          </aside>
        </div>
      </div>`;
    host.appendChild(view);
    const boot = await bootMap($('#un-map', view));
    nmap = boot.nmap; ops = boot.ops;
    bindMapChrome(view, nmap, ops);
    return view;
  }
  return {
    mount,
    onShow() { requestAnimationFrame(() => nmap?.invalidate()); },
    destroy() { ops?.destroy(); nmap?.destroy(); view?.remove(); },
  };
}
