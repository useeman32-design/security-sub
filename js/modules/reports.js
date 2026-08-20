import { api } from '../data/api.js';
import { toast } from '../core/utils.js';
import { pageHead, badge, fmtWhen, classChip } from '../core/ui.js';

export function createReports() {
  let view;
  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-ops';
    const rows = await api.getReports();
    view.innerHTML = `
      ${pageHead({ title: 'Intelligence reports', blurb: 'Draft and issued products. Exports are classified according to the underlying data — simulation, authorized live, analyst-verified or AI lead.' })}
      <div class="card-grid">
        ${rows.map((r) => `
          <article class="panel">
            <header class="panel-hd"><h3>${r.id}</h3>${badge(r.status === 'DRAFT' ? 'med' : 'ok', r.status)}</header>
            <div class="panel-bd">
              <b>${r.title}</b>
              <p class="t-low" style="margin:8px 0">${r.author} · ${fmtWhen(r.when, { withDate: true })}</p>
              ${classChip(r.class.includes('AI') ? 'AI' : r.class.includes('SIM') ? 'SIM' : 'VERIFIED')}
              <div class="sel-actions" style="margin-top:12px">
                <button class="btn-ghost" data-ex="pdf">Preview PDF</button>
                <button class="btn-ghost" data-ex="xlsx">Excel</button>
                <button class="btn-ghost" data-ex="csv">CSV</button>
              </div>
            </div>
          </article>`).join('')}
      </div>`;
    host.appendChild(view);
    view.addEventListener('click', (e) => {
      if (e.target.closest('[data-ex]')) toast('Export is permission-gated and disabled in the simulation prototype');
    });
    return view;
  }
  return { mount, destroy() { view?.remove(); } };
}
