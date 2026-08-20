/**
 * EXPLORE MAP — the central workspace
 * ===================================
 * The one and only map in the system. Every other module hands off to this
 * route rather than embedding a second Leaflet instance.
 *
 * Ported from the minerals platform in reduced form: the map component,
 * layer tree, drill path and inspector are the same code and the same
 * behaviour. The heavy analytical docks were left out deliberately — add
 * them back as the security modules need them.
 */

import { NigeriaMap } from '../components/map.js';
import { LAYER_GROUPS, applyLayer } from '../data/layers.js';
import { api } from '../data/api.js';
import { store } from '../core/store.js';
import { icon } from '../core/icons.js';
import { $, $$, toast } from '../core/utils.js';

export function createExplore() {
  let view, nmap, selected = null;

  const layerTree = () => {
    const st = store.get('layers') || {};
    return LAYER_GROUPS.map((g) => `
      <div class="lt-group">
        <div class="lt-gt">${g.group}</div>
        ${g.items.map((it) => {
          const on = it.soon ? false : st[it.id] ?? !!it.def;
          return `
          <button class="lt-item ${on ? 'is-on' : ''} ${it.soon ? 'is-soon' : ''}"
                  data-layer="${it.id}" role="switch" aria-checked="${on}">
            <span class="lt-eye">${icon('eye', { size: 13 })}</span>
            <span class="lt-sw" style="background:${it.color}"></span>
            <span class="lt-label">${it.label}</span>
            ${it.soon ? '<span class="lt-soon">SOON</span>' : ''}
          </button>
          ${it.hint ? `<div class="lt-hint">${it.hint}</div>` : ''}`;
        }).join('')}
      </div>`).join('');
  };

  function renderDrill() {
    const host = $('#ex-drill', view);
    if (!host) return;
    const d = store.get('drill') || {};
    const steps = [
      { k: 'nation', label: 'Nigeria', sub: '36 states + FCT', done: true },
      { k: 'state',  label: d.state || 'Select a state', sub: d.state ? 'Selected' : 'Click the map', done: !!d.state },
      { k: 'lga',    label: d.lga || 'Local government', sub: d.lga ? 'Selected' : 'Awaiting state', done: !!d.lga },
    ];
    host.innerHTML = steps.map((s, i) => `
      <div class="dp-step ${s.done ? 'is-done' : ''}">
        <span class="dp-dot">${s.done && i === 0 ? '' : i + 1}</span>
        <div class="dp-txt"><b>${s.label}</b><i>${s.sub}</i></div>
      </div>`).join('');
  }

  function renderInspector() {
    const host = $('#ex-inspector', view);
    if (!host) return;
    if (!selected) {
      host.innerHTML = `
        <div class="insp-empty">
          <div class="insp-ico">${icon('target', { size: 20 })}</div>
          <p>Hover or select a state or LGA on the map.<br>Its profile appears here.</p>
        </div>`;
      return;
    }
    const p = selected.data || {};
    host.innerHTML = `
      <div class="insp-hd"><b>${p.name || 'Unnamed'}</b>
        <span class="insp-kind">${selected.kind}</span></div>
      <div class="insp-rows">
        ${p.state ? `<div class="insp-r"><span>State</span><b>${p.state}</b></div>` : ''}
        ${p.scode ? `<div class="insp-r"><span>Code</span><b>${p.scode}</b></div>` : ''}
        <div class="insp-r"><span>Incidents</span><b>—</b></div>
        <div class="insp-r"><span>Threat level</span><b>—</b></div>
      </div>
      <p class="insp-note">Counts populate once the incident service is connected.</p>`;
  }

  async function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-explore';
    view.innerHTML = `
      <div class="ex-grid">
        <aside class="ex-dock ex-left" id="ex-left">
          <section class="ex-panel">
            <header class="ex-panel-hd"><h3>${icon('layers', { size: 13 })} Layers</h3></header>
            <div class="ex-panel-bd"><div id="layer-tree">${layerTree()}</div></div>
          </section>
          <section class="ex-panel">
            <header class="ex-panel-hd"><h3>${icon('target', { size: 13 })} Drill path</h3></header>
            <div class="ex-panel-bd"><div id="ex-drill"></div></div>
          </section>
        </aside>

        <div class="ex-stage">
          <div id="ex-map" class="ex-map">
            <div id="map-canvas"></div>
          </div>
          <div id="map-loading" class="map-loading">Initialising map…</div>
        </div>

        <aside class="ex-dock ex-right">
          <section class="ex-panel">
            <header class="ex-panel-hd"><h3>${icon('info', { size: 13 })} Inspector</h3></header>
            <div class="ex-panel-bd"><div id="ex-inspector"></div></div>
          </section>
        </aside>
      </div>`;
    host.appendChild(view);

    renderDrill();
    renderInspector();

    nmap = new NigeriaMap($('#ex-map', view), {
      api,
      onSelect: (props) => {
        selected = props ? { kind: 'state', data: props } : null;
        store.set({ drill: { state: props?.name || null, lga: null } });
        renderDrill(); renderInspector();
      },
      onLgaSelect: (props) => {
        selected = { kind: 'lga', data: props };
        const d = store.get('drill') || {};
        store.set({ drill: { ...d, lga: props?.name || null } });
        renderDrill(); renderInspector();
      },
    });

    try {
      await nmap.init();
      $('#map-loading', view)?.classList.add('is-hidden');
    } catch (err) {
      console.error('[explore] map init', err);
      const l = $('#map-loading', view);
      if (l) l.textContent = 'Map failed to initialise — check the console.';
    }

    $('#layer-tree', view).addEventListener('click', (e) => {
      const b = e.target.closest('[data-layer]');
      if (!b) return;
      const id = b.dataset.layer;
      if (b.classList.contains('is-soon')) {
        toast(`${b.querySelector('.lt-label').textContent} arrives with the data service`);
        return;
      }
      const next = !b.classList.contains('is-on');
      const res = applyLayer(nmap, id, next, { store, toast });
      if (res.ok) {
        b.classList.toggle('is-on', next);
        b.setAttribute('aria-checked', String(next));
      }
    });

    return view;
  }

  return {
    mount,
    onShow() { requestAnimationFrame(() => nmap?.invalidate()); },
    destroy() { nmap?.destroy?.(); view?.remove(); view = null; },
  };
}
