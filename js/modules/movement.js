import { api } from '../data/api.js';
import { store } from '../core/store.js';
import { $, toast } from '../core/utils.js';
import { pageHead, fmtWhen, confBar, classChip } from '../core/ui.js';
import { mapChrome, bootMap, bindMapChrome } from '../components/map-workspace.js';

export function createMovement() {
  let view, nmap, ops, stop;

  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-flush view-command';
    const id = store.get('investigationId') || 'INV-001';
    const [dev, loc] = await Promise.all([api.getDevice(id), api.getLocations(id)]);
    view.innerHTML = `
      <div class="cmd">
        ${pageHead({
          kicker: 'MOVEMENT ANALYSIS',
          title: `Tower sequence · ${dev.id}`,
          blurb: 'Playback animates estimated cell-to-cell association. Distances are great-circle between cell centroids, not a tracked path.',
        })}
        <div class="cmd-body">
          <div class="map-stage" id="mv-map">
            <div class="map-canvas"></div>
            ${mapChrome()}
            <div class="map-ui play-bar glass-bar">
              <button class="btn-primary" id="btn-play">Play movement</button>
              <input type="range" id="time-sl" min="0" max="${Math.max(0, loc.length-1)}" value="${loc.length-1}" />
              <span class="t-mono" id="sl-lab">${loc.at(-1)?.cell || ''}</span>
            </div>
          </div>
          <aside class="intel-rail">
            <section class="panel">
              <header class="panel-hd"><h3>Sequence</h3><span class="spacer"></span>${classChip('SIM')}</header>
              <div class="panel-bd" id="seq"></div>
            </section>
          </aside>
        </div>
      </div>`;
    host.appendChild(view);

    const seq = loc.map((p, i) => {
      const prev = loc[i - 1];
      let dist = '—', dur = '—';
      if (prev) {
        const R = 6371;
        const dLat = (p.lat - prev.lat) * Math.PI/180, dLng = (p.lng - prev.lng) * Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(prev.lat*Math.PI/180)*Math.cos(p.lat*Math.PI/180)*Math.sin(dLng/2)**2;
        dist = (2 * R * Math.asin(Math.sqrt(a))).toFixed(1) + ' km';
        dur = Math.round((new Date(p.time) - new Date(prev.time)) / 60000) + ' min';
      }
      return { ...p, dist, dur };
    });
    $('#seq', view).innerHTML = seq.map((p, i) => `
      <div class="trail-step">
        <b>${p.cell}</b> ${i < seq.length-1 ? '<span class="arr">↓</span>' : ''}
        <i>${p.area}</i>
        <span>${fmtWhen(p.time, { withDate: true })} · dwell/hop ${p.dur} · ${p.dist} · conf ${p.conf}%</span>
        ${confBar(p.conf)}
      </div>`).join('');

    const boot = await bootMap($('#mv-map', view));
    nmap = boot.nmap; ops = boot.ops;
    bindMapChrome(view, nmap, ops);
    await ops.renderTrails(id);
    if (loc[0]) ops.flyEstimated(loc[0].lat, loc[0].lng, 12);

    $('#btn-play', view).addEventListener('click', () => {
      stop?.();
      toast('Playing estimated trail — not a GPS track');
      stop = ops.playMovement(loc, {
        duration: 9000,
        onTick: ({ i }) => {
          $('#time-sl', view).value = i;
          $('#sl-lab', view).textContent = loc[i].cell;
        },
      });
    });
    $('#time-sl', view).addEventListener('input', (e) => {
      const p = loc[+e.target.value];
      if (p) {
        $('#sl-lab', view).textContent = p.cell;
        nmap.map.setView([p.lat, p.lng], 10, { animate: false });
      }
    });
    return view;
  }

  return {
    mount,
    onShow() { requestAnimationFrame(() => nmap?.invalidate()); },
    destroy() { stop?.(); ops?.destroy(); nmap?.destroy(); view?.remove(); },
  };
}
