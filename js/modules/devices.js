import { api } from '../data/api.js';
import { store } from '../core/store.js';
import { $ } from '../core/utils.js';
import { pageHead, badge, sevClass, fmtWhen, go, confBar, rowsHtml } from '../core/ui.js';

export function createDevices() {
  let view, rows = [];
  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-ops';
    rows = await api.getDevices();
    view.innerHTML = `
      ${pageHead({ title: 'Device intelligence', blurb: 'Identifiers under lawful investigation. Status describes the case, not a finding of criminality. Locations are estimated cell areas.' })}
      <div class="card-grid">
        ${rows.map((d) => `
          <article class="panel dev-card" data-id="${d.id}">
            <header class="panel-hd"><h3>${d.id}</h3>${badge(sevClass(d.risk), d.risk)}</header>
            <div class="panel-bd">
              <div class="msisdn t-mono">${d.msisdn}</div>
              ${rowsHtml([
                ['Case', d.caseId],
                ['Status', d.status],
                ['Area', d.currentArea],
                ['Cell', d.currentTower],
                ['Last seen', fmtWhen(d.lastSeen, { withDate: true })],
              ])}
              ${confBar(d.confidence)}
              <div class="sel-actions">
                <button class="btn-ghost" data-go="calls">Call metadata</button>
                <button class="btn-ghost" data-go="location">Location</button>
                <button class="btn-ghost" data-go="case">Case file</button>
              </div>
            </div>
          </article>`).join('')}
      </div>`;
    host.appendChild(view);
    view.addEventListener('click', (e) => {
      const card = e.target.closest('.dev-card');
      if (!card) return;
      store.set({ investigationId: card.dataset.id });
      const g = e.target.closest('[data-go]')?.dataset.go;
      go(g || 'case', { type: 'device', id: card.dataset.id });
    });
    return view;
  }
  return { mount, destroy() { view?.remove(); } };
}
