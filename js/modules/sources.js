import { api } from '../data/api.js';
import { pageHead, badge } from '../core/ui.js';

export function createSources() {
  let view;
  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-ops';
    const rows = await api.getSources();
    view.innerHTML = `
      ${pageHead({ title: 'Data sources', blurb: 'Adapters behind js/data/api.js. Swapping simulation for an authorized live feed changes status here — the rest of the UI stays the same.' })}
      <div class="card-grid">
        ${rows.map((s) => {
          const k = s.status === 'CONNECTED' ? 'ok' : s.status === 'SIMULATION' ? 'sim' : 'info';
          return `<article class="panel">
            <header class="panel-hd"><h3>${s.name}</h3>${badge(k, s.status)}</header>
            <div class="panel-bd">
              <div class="insp-r"><span>Last updated</span><b>${s.updated}</b></div>
              <div class="insp-r"><span>Used by</span><b>${s.usedBy.join(', ')}</b></div>
              <p class="insp-note">Id <span class="t-mono">${s.id}</span></p>
            </div>
          </article>`;
        }).join('')}
      </div>`;
    host.appendChild(view);
    return view;
  }
  return { mount, destroy() { view?.remove(); } };
}
