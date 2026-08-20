import { api } from '../data/api.js';
import { $ } from '../core/utils.js';
import { pageHead, fmtWhen, esc, classChip, go, badge, sevClass } from '../core/ui.js';

export function createLive() {
  let view, timer, events = [], filter = 'all';

  function render() {
    const rows = filter === 'all' ? events : events.filter((e) => e.kind === filter);
    $('#live-list', view).innerHTML = rows.map((e) => `
      <button class="rt-item is-${e.kind} is-wide" data-dev="${e.device || ''}">
        <span class="rt-t t-mono">${fmtWhen(e.time, { withDate: true })}</span>
        <span class="rt-k">${e.title}</span>
        <span class="rt-b">${esc(e.body)}</span>
        <span class="rt-s">${e.status} ${e.device ? '· ' + e.device : ''}</span>
      </button>`).join('');
  }

  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-ops';
    events = await api.getEvents();
    view.innerHTML = `
      ${pageHead({
        kicker: 'LIVE INTELLIGENCE',
        title: 'Authorized event stream',
        blurb: 'Metadata events supplied by the simulation adapter. Click any row to open the related investigation. No call content is available in this platform.',
        actions: classChip('META'),
      })}
      <div class="feed-filters" id="lf">
        ${['all','call','location','movement','risk','emergency','system'].map((k,i) =>
          `<button class="${i===0?'is-on':''}" data-fk="${k}">${k}</button>`).join('')}
      </div>
      <div class="live-split">
        <div class="panel"><div class="panel-bd"><div id="live-list" class="rt-feed"></div></div></div>
        <aside class="panel">
          <header class="panel-hd"><span class="accent-bar"></span><h3>Monitor notice</h3></header>
          <div class="panel-bd">
            <p class="t-dim" style="line-height:1.55">This stream is a <b>simulation</b> of an authorized integration. Connecting a lawful feed later replaces <code>js/data/api.js</code> only. The UI already distinguishes simulation, authorized live data, analyst-verified intelligence and AI-generated leads.</p>
            <div style="margin-top:12px">${classChip('SIM')} ${classChip('META')}</div>
          </div>
        </aside>
      </div>`;
    host.appendChild(view);
    render();
    $('#lf', view).addEventListener('click', (e) => {
      const b = e.target.closest('[data-fk]');
      if (!b) return;
      filter = b.dataset.fk;
      view.querySelectorAll('[data-fk]').forEach((x) => x.classList.toggle('is-on', x === b));
      render();
    });
    view.addEventListener('click', (e) => {
      const it = e.target.closest('[data-dev]');
      if (it?.dataset.dev) go('case', { type: 'device', id: it.dataset.dev });
    });
    timer = setInterval(() => {
      events.unshift({
        id: 't' + Date.now(), time: new Date().toISOString(), kind: 'system',
        title: 'SYNC', body: 'Simulation adapter poll · no live telecom connection', status: 'OK',
      });
      render();
    }, 9000);
    return view;
  }

  return { mount, destroy() { clearInterval(timer); view?.remove(); } };
}
