import { api } from '../data/api.js';
import { store } from '../core/store.js';
import { $, toast } from '../core/utils.js';
import { pageHead, badge, sevClass, fmtWhen, esc, classChip, confBar, go, rowsHtml } from '../core/ui.js';
import { towerById } from '../data/sim.js';

export function createCalls() {
  let view, device, calls = [], net = [];

  function graph(nodes, center) {
    const w = 420, h = 280, cx = w/2, cy = h/2;
    const max = Math.max(...nodes.map((n) => n.n), 1);
    const parts = nodes.map((n, i) => {
      const a = (i / nodes.length) * Math.PI * 2 - Math.PI/2;
      const r = 95;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      const rs = 10 + (n.n / max) * 14;
      const col = n.risk === 'HIGH' ? '#ff4d5e' : n.risk === 'MEDIUM' ? '#ff8a3d' : n.risk === 'LOW' ? '#00e676' : '#93a8ab';
      return { n, x, y, rs, col };
    });
    return `<svg class="net-svg" viewBox="0 0 ${w} ${h}">
      ${parts.map((p) => `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="${p.col}" stroke-opacity=".35" stroke-width="${1 + p.n}"/>`).join('')}
      <circle cx="${cx}" cy="${cy}" r="22" fill="rgba(245,185,66,.15)" stroke="#f5b942" />
      <text x="${cx}" y="${cy+4}" text-anchor="middle" fill="#f5b942" font-size="9" font-family="JetBrains Mono">${center.id}</text>
      ${parts.map((p) => `<g>
        <circle cx="${p.x}" cy="${p.y}" r="${p.rs}" fill="${p.col}" fill-opacity=".2" stroke="${p.col}"/>
        <text x="${p.x}" y="${p.y + p.rs + 12}" text-anchor="middle" fill="#93a8ab" font-size="8">${esc(p.n.label)}</text>
        <text x="${p.x}" y="${p.y+3}" text-anchor="middle" fill="#e8f2f2" font-size="8">${p.n.n}×</text>
      </g>`).join('')}
    </svg>`;
  }

  async function load(id) {
    device = await api.getDevice(id);
    calls = await api.getCalls(id);
    net = await api.getNetwork(id);
    store.set({ investigationId: id });
    api.logAudit({ action: 'VIEW', object: `Officer viewed investigation ${device.caseId}` });
    paint();
  }

  function paint() {
    if (!device) return;
    const tw = towerById(device.currentTower);
    $('#num-profile', view).innerHTML = `
      <div class="insp-hd"><b>${device.msisdn}</b> ${badge(sevClass(device.risk), device.risk)}</div>
      ${rowsHtml([
        ['Investigation', device.caseId],
        ['Status', device.status],
        ['First observed', fmtWhen(device.firstSeen, { withDate: true })],
        ['Last observed', fmtWhen(device.lastSeen, { withDate: true })],
        ['Estimated area', device.currentArea],
        ['Cell', device.currentTower],
        ['Radius', '~' + device.radiusKm + ' km (not GPS)'],
      ])}
      ${confBar(device.confidence)}
      <p class="insp-note">${device.source}</p>
      ${classChip('META')} ${classChip('SIM')}`;

    $('#cdr-rows', view).innerHTML = calls.map((c) => `
      <tr>
        <td class="t-mono">${fmtWhen(c.time)}</td>
        <td>${c.dir}</td>
        <td class="t-mono">${c.other}</td>
        <td class="t-mono">${c.dur}</td>
        <td>${c.cell}</td>
        <td>${towerById(c.cell)?.area || '—'}</td>
        <td>${c.live ? badge('high','LIVE') : badge('info', c.status)}</td>
      </tr>`).join('');

    $('#net-box', view).innerHTML = graph(net, device);

    const live = calls.find((c) => c.live);
    $('#live-mon', view).innerHTML = live ? `
      <div class="live-mon">
        <div class="live-mon-hd"><span class="live-dot"></span> AUTHORIZED REAL-TIME EVENT MONITOR
          ${classChip('AUTH')} ${classChip('META')}</div>
        ${rowsHtml([
          ['Investigated number', device.msisdn],
          ['Event', 'Communication active (metadata)'],
          ['Direction', live.dir],
          ['Other party', live.other],
          ['Started', fmtWhen(live.time)],
          ['Duration', live.dur],
          ['Associated cell', live.cell],
          ['Estimated area', tw?.area || device.currentArea],
          ['Location confidence', device.confidence + '%'],
        ])}
        <p class="insp-note">No audio, no transcripts, no conversation content.</p>
      </div>` : `<div class="op-empty"><b>SIMULATION MODE — LIVE TELECOM FEED NOT CONNECTED</b>
        <p>Start monitoring arms a metadata subscription when an authorized adapter is present.</p></div>`;
  }

  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-ops';
    const devices = await api.getDevices();
    const focus = store.get('pendingFocus');
    const startId = (focus?.type === 'device' && focus.id) || store.get('investigationId') || 'INV-001';
    store.set({ pendingFocus: null });

    view.innerHTML = `
      ${pageHead({
        kicker: 'CALL INTELLIGENCE',
        title: 'Investigated number workspace',
        blurb: 'Call detail records are metadata only: time, direction, duration, cell. This platform cannot display or obtain conversation content.',
        actions: classChip('META'),
      })}
      <div class="call-search">
        <input id="msisdn" class="big-in" placeholder="+234 XXX XXX XXXX" value="${devices.find((d)=>d.id===startId)?.msisdn || ''}" />
        <button class="btn-primary" id="btn-search">Search</button>
        <button class="btn-ghost" id="btn-mon">Start monitoring</button>
        <button class="btn-ghost" id="btn-add">Add to investigation</button>
        <button class="btn-ghost" id="btn-exp">Export report</button>
      </div>
      <div class="call-grid">
        <section class="panel" id="num-profile"></section>
        <section class="panel">
          <header class="panel-hd"><span class="accent-bar accent-cyan"></span><h3>Inbound / outbound timeline</h3>
            <span class="spacer"></span><span class="panel-x">metadata only</span></header>
          <div class="rg-scroll"><table class="rg-table">
            <thead><tr><th>Time</th><th>Direction</th><th>Other party</th><th>Duration</th><th>Cell</th><th>Location</th><th>Status</th></tr></thead>
            <tbody id="cdr-rows"></tbody>
          </table></div>
        </section>
        <section class="panel">
          <header class="panel-hd"><span class="accent-bar accent-gold"></span><h3>Communication network</h3></header>
          <div class="panel-bd" id="net-box"></div>
        </section>
        <section class="panel" id="live-mon"></section>
      </div>`;
    host.appendChild(view);
    await load(startId);

    const resolve = () => {
      const raw = $('#msisdn', view).value.replace(/\s/g, '');
      const hit = devices.find((d) => d.msisdn.replace(/\s/g, '') === raw || d.id === raw.toUpperCase());
      if (hit) load(hit.id);
      else toast('Number is not on an authorized investigation list (simulation)');
    };
    $('#btn-search', view).addEventListener('click', resolve);
    $('#msisdn', view).addEventListener('keydown', (e) => { if (e.key === 'Enter') resolve(); });
    $('#btn-mon', view).addEventListener('click', () => toast('Monitoring would subscribe to an authorized adapter — currently simulation mode'));
    $('#btn-add', view).addEventListener('click', () => { go('case', { type: 'device', id: device.id }); });
    $('#btn-exp', view).addEventListener('click', () => toast('Export requires export permission and a live case — blocked in demo'));
    return view;
  }

  return { mount, destroy() { view?.remove(); } };
}
