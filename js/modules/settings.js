import { theme } from '../core/theme.js';
import { toast } from '../core/utils.js';
import { pageHead, classChip, badge } from '../core/ui.js';
import { OFFICER } from '../data/sim.js';

export function createSettings() {
  let view;
  function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-ops';
    view.innerHTML = `
      ${pageHead({ title: 'Security & privacy', blurb: 'Role-based access, encryption posture and investigation permissions for the operations centre. Prototype indicators only.' })}
      <div class="set-grid">
        <section class="panel">
          <header class="panel-hd"><h3>Signed-in officer</h3></header>
          <div class="panel-bd">
            <div class="set-user"><span class="avatar">AB</span>
              <div><b>${OFFICER.name}</b><div class="t-low">${OFFICER.role} · ${OFFICER.organisation}</div>
              <div class="t-mono">${OFFICER.id} · ${OFFICER.clearance}</div></div>
            </div>
            <div class="set-row"><div><div class="set-label">Two-factor authentication</div><div class="set-hint">Required for all analyst roles</div></div>
              ${badge('ok', 'ENFORCED')}</div>
            <div class="set-row"><div><div class="set-label">Session encryption</div><div class="set-hint">TLS 1.3 in production · demo is local</div></div>
              ${badge('ok', 'TLS READY')}</div>
          </div>
        </section>
        <section class="panel">
          <header class="panel-hd"><h3>Role-based access</h3></header>
          <div class="panel-bd">
            ${[['Commander','Full operational control'],['Analyst','Investigations + metadata'],['Dispatcher','Emergency + units'],['Auditor','Read-only logs'],['Viewer','Dashboards only']].map(([r,h]) =>
              `<div class="set-row"><div><div class="set-label">${r}</div><div class="set-hint">${h}</div></div>
                ${r==='Analyst'?badge('ok','YOU'):badge('info','DEFINED')}</div>`).join('')}
          </div>
        </section>
        <section class="panel">
          <header class="panel-hd"><h3>Permissions</h3></header>
          <div class="panel-bd">
            <div class="set-row"><div class="set-label">View investigations</div>${badge('ok','ALLOWED')}</div>
            <div class="set-row"><div class="set-label">Export reports</div>${badge('med','GATED')}</div>
            <div class="set-row"><div class="set-label">Live telecom adapter</div>${badge('sim','NOT CONNECTED')}</div>
            <div class="set-row"><div class="set-label">Data retention</div><span class="set-code">90 days metadata</span></div>
          </div>
        </section>
        <section class="panel">
          <header class="panel-hd"><h3>Appearance</h3></header>
          <div class="panel-bd">
            <div class="theme-picker">
              <button class="theme-opt ${theme.preference==='dark'?'is-on':''}" data-th="dark"><div class="th-prev th-dark"><i></i><i></i><i></i></div><span class="th-name">Dark</span></button>
              <button class="theme-opt ${theme.preference==='light'?'is-on':''}" data-th="light"><div class="th-prev th-light"><i></i><i></i><i></i></div><span class="th-name">Light</span></button>
              <button class="theme-opt ${theme.preference==='system'?'is-on':''}" data-th="system"><div class="th-prev th-sys"><i></i><i></i><i></i></div><span class="th-name">System</span></button>
            </div>
            <p class="insp-note" style="margin-top:12px">${classChip('SIM')} This console never claims automatic access to telecom networks.</p>
          </div>
        </section>
      </div>`;
    host.appendChild(view);
    view.addEventListener('click', (e) => {
      const th = e.target.closest('[data-th]');
      if (th) { theme.set(th.dataset.th); toast('Theme · ' + th.dataset.th); }
    });
    return view;
  }
  return { mount, destroy() { view?.remove(); } };
}
