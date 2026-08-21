import { api } from '../data/api.js';
import { $ } from '../core/utils.js';
import { pageHead, confBar, classChip } from '../core/ui.js';
import { mapChrome, bootMap, bindMapChrome } from '../components/map-workspace.js';

export function createRisk() {
  let view, nmap, ops;
  async function mount(host) {
    view = host;
    host.classList.add('view-command');
    const lgas = await api.getLgaIndex();
    view.innerHTML = `
      <div class="cmd">
        ${pageHead({
          kicker: 'RISK & THREAT MAP',
          title: 'Zamfara risk surface',
          blurb: 'Score 0–100 influenced by recent incidents, historical activity, movement patterns and proximity to known high-risk areas. Not a verdict on any person.',
        })}
        <div class="cmd-body">
          <div class="map-stage" id="rk-map">
            <div class="map-canvas"></div>
            ${mapChrome()}
          </div>
          <aside class="intel-rail">
            <section class="panel">
              <header class="panel-hd"><h3>LGA risk scores</h3><span class="spacer"></span>${classChip('SIM')}</header>
              <div class="panel-bd" id="rk-list"></div>
            </section>
          </aside>
        </div>
      </div>`;
    $('#rk-list', view).innerHTML = lgas.slice().sort((a,b)=>b.risk-a.risk).map((l) => `
      <div class="risk-row">
        <div class="risk-top">
          <span class="risk-name">${l.name}</span>
          <span class="risk-val"><span class="n" style="color:${l.risk>=80?'var(--red)':l.risk>=60?'var(--orange)':'var(--gold)'}">${l.risk}</span>/100</span>
        </div>
        ${confBar(l.conf)}
        <p class="insp-note">Score influenced by recent incidents, historical activity, movement patterns and proximity to known high-risk areas.</p>
      </div>`).join('');
    const boot = await bootMap($('#rk-map', view));
    nmap = boot.nmap; ops = boot.ops;
    bindMapChrome(view, nmap, ops);
    nmap.setRiskZones(true);
    return view;
  }
  return {
    mount,
    onShow() { requestAnimationFrame(() => nmap?.invalidate()); },
    destroy() { ops?.destroy(); nmap?.destroy(); view?.remove(); },
  };
}
