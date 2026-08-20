import { api } from '../data/api.js';
import { store } from '../core/store.js';
import { $ } from '../core/utils.js';
import { pageHead, confBar, fmtWhen, classChip, rowsHtml, badge, sevClass } from '../core/ui.js';
import { mapChrome, bootMap, bindMapChrome } from '../components/map-workspace.js';

export function createLocation() {
  let view, nmap, ops;

  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-flush view-command';
    const id = store.get('investigationId') || 'INV-001';
    const [dev, loc] = await Promise.all([api.getDevice(id), api.getLocations(id)]);
    const cur = loc[loc.length - 1];
    view.innerHTML = `
      <div class="cmd loc-cmd">
        ${pageHead({
          kicker: 'LOCATION INTELLIGENCE',
          title: `Estimated area · ${dev.id}`,
          blurb: 'Cell-tower association with an uncertainty radius. Never treat the centroid as an exact GPS coordinate.',
        })}
        <div class="cmd-body">
          <div class="map-stage" id="loc-map">
            <div class="map-canvas"></div>
            ${mapChrome()}
          </div>
          <aside class="intel-rail">
            <section class="panel">
              <header class="panel-hd"><span class="accent-bar accent-gold"></span><h3>Current estimate</h3></header>
              <div class="panel-bd">
                ${badge(sevClass(dev.risk), dev.risk)}
                ${rowsHtml([
                  ['Number', dev.msisdn],
                  ['Estimated location', cur?.area || dev.currentArea],
                  ['Cell tower', dev.currentTower],
                  ['Accuracy', 'Approx. ' + dev.radiusKm + ' km radius'],
                  ['Heading', dev.heading],
                  ['Last update', fmtWhen(dev.lastSeen, { withDate: true })],
                ])}
                ${confBar(dev.confidence)}
                <p class="insp-note">${dev.source}</p>
                ${classChip('SIM')}
              </div>
            </section>
            <section class="panel">
              <header class="panel-hd"><h3>Previous cells</h3></header>
              <div class="panel-bd">
                <div class="trail-list">
                  ${loc.slice().reverse().map((p) => `
                    <div class="trail-step">
                      <b>${p.cell}</b>
                      <i>${p.area}</i>
                      <span>${fmtWhen(p.time, { withDate: true })} · ~${p.radiusKm} km · ${p.conf}%</span>
                    </div>`).join('')}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>`;
    host.appendChild(view);
    const boot = await bootMap($('#loc-map', view));
    nmap = boot.nmap; ops = boot.ops;
    bindMapChrome(view, nmap, ops);
    await ops.renderDevices(id);
    await ops.renderTrails(id);
    if (cur) ops.flyEstimated(cur.lat, cur.lng, cur.radiusKm);
    return view;
  }

  return {
    mount,
    onShow() { requestAnimationFrame(() => nmap?.invalidate()); },
    destroy() { ops?.destroy(); nmap?.destroy(); view?.remove(); },
  };
}
