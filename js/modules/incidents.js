import { api } from '../data/api.js';
import { $ } from '../core/utils.js';
import { pageHead, badge, sevClass, fmtWhen, esc, go, rowsHtml } from '../core/ui.js';
import { INCIDENT_TYPES } from '../data/sim.js';

export function createIncidents() {
  let view, rows = [], selected = null, q = '', type = '*', status = '*';

  function vis() {
    return rows.filter((r) => {
      if (type !== '*' && r.type !== type) return false;
      if (status !== '*' && r.status !== status) return false;
      if (q && !(r.id + r.lga + r.place + r.desc).toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function paint() {
    const list = vis();
    $('#inc-rows', view).innerHTML = list.map((r) => `
      <tr data-id="${r.id}" class="${selected?.id === r.id ? 'is-on' : ''}">
        <td class="t-mono">${r.id}</td>
        <td>${INCIDENT_TYPES[r.type]?.label || r.type}</td>
        <td>${fmtWhen(r.when, { withDate: true })}</td>
        <td>${r.lga}</td>
        <td>${badge(sevClass(r.sev), r.sev)}</td>
        <td>${badge(r.status === 'ACTIVE' ? 'high' : 'info', r.status)}</td>
      </tr>`).join('');
    const d = $('#inc-detail', view);
    if (!selected) {
      d.innerHTML = '<div class="op-empty"><b>Select an incident</b><p>Full record, related numbers, towers and units appear here.</p></div>';
      return;
    }
    const r = selected;
    d.innerHTML = `
      <div class="insp-hd"><b>${r.id}</b>${badge(sevClass(r.sev), r.sev)}</div>
      ${rowsHtml([
        ['Type', INCIDENT_TYPES[r.type]?.label],
        ['When', fmtWhen(r.when, { withDate: true })],
        ['LGA', r.lga],
        ['Place', r.place],
        ['Status', r.status],
        ['Units', r.units.join(', ') || '—'],
        ['Numbers', r.numbers.join(', ') || '—'],
        ['Towers', r.towers.join(', ') || '—'],
      ])}
      <p class="insp-note">${esc(r.desc)}</p>
      ${r.notes ? `<p class="insp-note">${esc(r.notes)}</p>` : ''}
      <div class="sel-actions" style="margin-top:10px">
        <button class="btn-ghost" data-go="command">Show on map</button>
        <button class="btn-ghost" data-go="case">Open case</button>
      </div>`;
  }

  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-ops';
    rows = await api.getIncidents();
    view.innerHTML = `
      ${pageHead({ title: 'Incident management', blurb: 'Operational register for kidnapping, banditry and related events in Zamfara. Linked numbers are investigated identifiers, not evidence of guilt.' })}
      <div class="rg-tools">
        <div class="mn-search"><input id="inc-q" type="search" placeholder="Search ID, LGA, place…" /></div>
        <label class="pr-sel"><span>Type</span>
          <select id="inc-type"><option value="*">All</option>
            ${Object.entries(INCIDENT_TYPES).map(([k,v]) => `<option value="${k}">${v.label}</option>`).join('')}
          </select></label>
        <label class="pr-sel"><span>Status</span>
          <select id="inc-st"><option value="*">All</option>
            ${['ACTIVE','RESPONDING','INVESTIGATING','MONITORING','ON SCENE','DISPATCHED','RESOLVED','CLOSED'].map((s)=>`<option>${s}</option>`).join('')}
          </select></label>
      </div>
      <div class="rg-body">
        <div class="panel rg-panel"><div class="rg-scroll">
          <table class="rg-table"><thead><tr>
            <th>ID</th><th>Type</th><th>When</th><th>LGA</th><th>Severity</th><th>Status</th>
          </tr></thead><tbody id="inc-rows"></tbody></table>
        </div></div>
        <aside class="rg-detail panel" id="inc-detail"></aside>
      </div>`;
    host.appendChild(view);
    paint();
    $('#inc-q', view).addEventListener('input', (e) => { q = e.target.value.toLowerCase(); paint(); });
    $('#inc-type', view).addEventListener('change', (e) => { type = e.target.value; paint(); });
    $('#inc-st', view).addEventListener('change', (e) => { status = e.target.value; paint(); });
    view.addEventListener('click', (e) => {
      const tr = e.target.closest('tr[data-id]');
      if (tr) { selected = rows.find((r) => r.id === tr.dataset.id); paint(); }
      const g = e.target.closest('[data-go]')?.dataset.go;
      if (g === 'command') go('command');
      if (g === 'case' && selected?.numbers[0]) go('case', { type: 'device', id: selected.numbers[0] });
    });
    return view;
  }

  return { mount, destroy() { view?.remove(); } };
}
