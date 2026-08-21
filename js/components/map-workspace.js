import { NigeriaMap } from './map.js';
import { createOpsOverlay } from './ops-map.js';
import { LAYER_GROUPS, applyLayer } from '../data/layers.js';
import { api } from '../data/api.js';
import { store } from '../core/store.js';
import { icon } from '../core/icons.js';
import { $, toast } from '../core/utils.js';

export function layerTreeHtml() {
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
        </button>
        ${it.hint ? `<div class="lt-hint">${it.hint}</div>` : ''}`;
      }).join('')}
    </div>`).join('');
}

export function mapChrome() {
  return `
    <div class="map-toolbar map-ui">
      <div class="glass-bar map-search">
        <span class="s-icon">${icon('search', { size: 12 })}</span>
        <input id="map-q" placeholder="Search LGA or place" />
      </div>
      <div class="glass-bar seg" id="basemap-seg">
        <button data-bm="vector" class="is-on">Vector</button>
        <button data-bm="satellite">Satellite</button>
        <button data-bm="terrain">Terrain</button>
      </div>
    </div>
    <div class="map-tools map-ui">
      <div class="glass-bar tool-stack">
        <button class="tool-btn" data-z="in" title="Zoom in">${icon('plus', { size: 14 })}</button>
        <button class="tool-btn" data-z="out" title="Zoom out">${icon('minus', { size: 14 })}</button>
        <span class="tool-sep"></span>
        <button class="tool-btn" data-z="home" title="Zamfara extent">${icon('target', { size: 14 })}</button>
      </div>
    </div>
    <div class="reticle tl"></div><div class="reticle tr"></div>
    <div class="reticle bl"></div><div class="reticle br"></div>
    <div class="map-loading">Initialising Zamfara map…</div>`;
}

export async function bootMap(container, { onSelect, onLgaSelect } = {}) {
  const nmap = new NigeriaMap(container, {
    api,
    jurisdiction: 'Zamfara',
    onSelect: (props) => onSelect?.({ kind: 'state', data: props }),
    onLgaSelect: (props) => onLgaSelect?.({ kind: 'lga', data: props }),
    onDeposit: (d) => onSelect?.({ kind: 'incident', data: d }),
  });
  await nmap.init();
  const ops = createOpsOverlay(nmap, { onSelect });
  await ops.loadAll(store.get('investigationId') || 'INV-001');
  container.querySelector('.map-loading')?.classList.add('is-hidden');
  const fix = () => nmap.invalidate();
  requestAnimationFrame(fix);
  setTimeout(fix, 80);
  setTimeout(fix, 320);
  setTimeout(fix, 900);
  return { nmap, ops };
}

export function bindMapChrome(view, nmap, ops) {
  $('#basemap-seg', view)?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-bm]');
    if (!b) return;
    view.querySelectorAll('[data-bm]').forEach((x) => x.classList.toggle('is-on', x === b));
    nmap.setBasemap(b.dataset.bm);
  });
  view.addEventListener('click', (e) => {
    const z = e.target.closest('[data-z]')?.dataset.z;
    if (z === 'in') nmap.zoomBy(0.6);
    if (z === 'out') nmap.zoomBy(-0.6);
    if (z === 'home') {
      nmap.lockView(true);
      nmap.selectState('Zamfara', { zoom: true });
    }
    const layerBtn = e.target.closest('[data-layer]');
    if (layerBtn && !layerBtn.classList.contains('is-soon')) {
      const id = layerBtn.dataset.layer;
      const next = !layerBtn.classList.contains('is-on');
      const res = applyLayer(nmap, id, next, { store, toast, ops });
      if (res.ok) {
        layerBtn.classList.toggle('is-on', next);
        layerBtn.setAttribute('aria-checked', String(next));
      }
    }
  });
  const q = $('#map-q', view);
  q?.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const s = q.value.trim().toLowerCase();
    const lgas = await api.getLgaIndex();
    const hit = lgas.find((l) => l.name.toLowerCase().includes(s));
    if (hit) {
      nmap.lockView(true);
      nmap.map.flyTo([hit.lat, hit.lng], 10.5, { duration: 0.7 });
      toast(hit.name + ' LGA');
    }
  });
}
