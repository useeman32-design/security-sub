import { api } from '../data/api.js';
import { pageHead, badge, fmtWhen } from '../core/ui.js';

export function createAudit() {
  let view;
  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-ops';
    const rows = await api.getAudit();
    view.innerHTML = `
      ${pageHead({ title: 'Audit logs', blurb: 'Every sensitive action is retained. Viewing an investigation, exporting, acknowledging alerts and authentication events are recorded.' })}
      <div class="panel"><div class="rg-scroll"><table class="rg-table">
        <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Object</th><th>Source</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr>
            <td class="t-mono">${fmtWhen(r.time, { withDate: true })}</td>
            <td>${r.actor}</td>
            <td>${badge('info', r.action)}</td>
            <td>${r.object}</td>
            <td class="t-mono">${r.ip}</td>
          </tr>`).join('')}
        </tbody>
      </table></div></div>`;
    host.appendChild(view);
    return view;
  }
  return { mount, destroy() { view?.remove(); } };
}
