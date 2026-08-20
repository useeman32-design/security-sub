import { api } from '../data/api.js';
import { pageHead, classChip } from '../core/ui.js';
import { INCIDENT_TYPES } from '../data/sim.js';

function barChart(rows, { w = 520, h = 180 } = {}) {
  const max = Math.max(...rows.map((r) => r.v), 1);
  const bw = (w - 40) / rows.length;
  return `<svg class="chart" viewBox="0 0 ${w} ${h}">
    ${rows.map((r, i) => {
      const bh = (r.v / max) * (h - 36);
      const x = 20 + i * bw, y = h - 22 - bh;
      return `<rect x="${x + 6}" y="${y}" width="${bw - 14}" height="${bh}" rx="3" fill="${r.c || '#2dd8c3'}" opacity=".85"/>
        <text x="${x + bw/2}" y="${h - 8}" text-anchor="middle" fill="#64787c" font-size="8">${r.l}</text>
        <text x="${x + bw/2}" y="${y - 4}" text-anchor="middle" fill="#e8f2f2" font-size="9">${r.v}</text>`;
    }).join('')}
  </svg>`;
}

export function createAnalytics() {
  let view;
  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-ops';
    const [inc, emg, lgas, calls] = await Promise.all([
      api.getIncidents(), api.getEmergency(), api.getLgaIndex(), api.getCalls(),
    ]);
    const byLga = lgas.map((l) => ({ l: l.name.split(' ')[0], v: inc.filter((i) => i.lga === l.name).length, c: l.risk >= 80 ? '#ff4d5e' : '#f5b942' }))
      .sort((a,b)=>b.v-a.v).slice(0, 8);
    const days = ['13','14','15','16','17','18','19','20','21'];
    const byDay = days.map((d) => ({ l: d + ' Aug', v: inc.filter((i) => i.when.slice(8,10) === d).length, c: '#2dd8c3' }));
    const byType = Object.keys(INCIDENT_TYPES).map((k) => ({ l: INCIDENT_TYPES[k].label.split(' ')[0], v: inc.filter((i)=>i.type===k).length, c: INCIDENT_TYPES[k].hex }));
    const resolved = inc.filter((i) => ['RESOLVED','CLOSED'].includes(i.status)).length;

    view.innerHTML = `
      ${pageHead({ title: 'Analytics', blurb: 'Simulation statistics for demonstration. Charts will bind to the same api.js methods when live services exist.', actions: classChip('SIM') })}
      <div class="stat-trio" style="margin-bottom:14px">
        <div class="st3"><span class="st3-n">${inc.length}</span><span class="st3-k">Incidents in window</span></div>
        <div class="st3"><span class="st3-n">${emg.length}</span><span class="st3-k">Emergency calls</span></div>
        <div class="st3"><span class="st3-n">${Math.round(resolved/inc.length*100)}%</span><span class="st3-k">Resolution rate</span></div>
      </div>
      <div class="chart-grid">
        <section class="panel"><header class="panel-hd"><h3>Incidents by LGA</h3></header><div class="panel-bd">${barChart(byLga)}</div></section>
        <section class="panel"><header class="panel-hd"><h3>Incidents over time</h3></header><div class="panel-bd">${barChart(byDay)}</div></section>
        <section class="panel"><header class="panel-hd"><h3>By type</h3></header><div class="panel-bd">${barChart(byType)}</div></section>
        <section class="panel"><header class="panel-hd"><h3>Communication events</h3></header>
          <div class="panel-bd">${barChart([
            { l: 'INV-001', v: calls.filter(c=>c.device==='INV-001').length, c:'#f5b942' },
            { l: 'INV-002', v: calls.filter(c=>c.device==='INV-002').length, c:'#ff8a3d' },
            { l: 'INV-003', v: calls.filter(c=>c.device==='INV-003').length, c:'#ff4d5e' },
            { l: 'INV-005', v: calls.filter(c=>c.device==='INV-005').length, c:'#4d9dff' },
          ])}<p class="insp-note">Metadata counts only — not conversation volume.</p></div></section>
      </div>`;
    host.appendChild(view);
    return view;
  }
  return { mount, destroy() { view?.remove(); } };
}
