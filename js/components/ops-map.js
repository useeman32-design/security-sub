/**
 * Operational overlays on top of NigeriaMap.
 * Estimated locations always render as uncertainty circles, never as a pin claiming GPS precision.
 */

import { api } from '../data/api.js';
import { store } from '../core/store.js';
import { fmt } from '../core/utils.js';
import { INCIDENT_TYPES } from '../data/sim.js';

const KIND_COLOR = {
  police: '#4d9dff', military: '#00e676', checkpoint: '#f5b942',
  command: '#2dd8c3', emergency: '#ff4d5e',
  city: '#e8f2f2', town: '#c5d4d6', village: '#93a8ab',
};

function iconHtml(cls, color, glyph, label) {
  return `<div class="ops-mark ${cls}" style="--c:${color}">
    <i></i><b>${glyph}</b>
    ${label ? `<span>${label}</span>` : ''}
  </div>`;
}

export function createOpsOverlay(nmap, { onSelect } = {}) {
  const map = nmap.map;
  const groups = {};
  const vis = { ...store.get('layers') };
  let playback = null;

  [['opsUnder', 515], ['ops', 560], ['trails', 570]].forEach(([p, z]) => {
    if (!map.getPane(p)) {
      map.createPane(p);
      map.getPane(p).style.zIndex = z;
    }
  });

  function group(id) {
    if (!groups[id]) {
      const pane = ['roads', 'forest', 'search', 'heat'].includes(id) ? 'opsUnder' : (id === 'trails' ? 'trails' : 'ops');
      groups[id] = L.layerGroup([], { pane });
      if (vis[id] !== false) groups[id].addTo(map);
    }
    return groups[id];
  }

  function reset(id) {
    if (groups[id]) groups[id].clearLayers();
  }

  function marker(lat, lng, html, pane = 'ops') {
    return L.marker([lat, lng], {
      pane,
      riseOnHover: true,
      icon: L.divIcon({ className: '', html, iconSize: [0, 0], iconAnchor: [0, 0] }),
    });
  }

  function tip(html) {
    return { direction: 'top', offset: [0, -12], className: 'dep-tip', opacity: 1, html };
  }

  async function renderRoads() {
    reset('roads');
    const g = group('roads');
    const roads = await api.getRoads();
    roads.forEach((r) => {
      const hwy = r.kind === 'highway';
      L.polyline(r.path, {
        pane: 'opsUnder',
        color: hwy ? '#c5d0d2' : r.kind === 'track' ? '#8a6a3a' : '#7a8a8e',
        weight: hwy ? 2.4 : 1.4,
        opacity: hwy ? 0.7 : 0.5,
        dashArray: r.kind === 'track' ? '4,5' : null,
        interactive: false,
      }).addTo(g);
    });
  }

  async function renderForest() {
    reset('forest');
    const g = group('forest');
    const forest = await api.getForest();
    forest.forEach((f) => {
      L.circle([f.lat, f.lng], {
        pane: 'opsUnder', radius: f.r, stroke: false,
        fillColor: '#1f6b4a', fillOpacity: 0.16, interactive: false,
      }).addTo(g);
    });
  }

  async function renderPlaces() {
    reset('places');
    const g = group('places');
    const places = await api.getPlaces();
    places.forEach((p) => {
      const c = KIND_COLOR[p.kind] || '#93a8ab';
      const m = marker(p.lat, p.lng, `<div class="place-mark is-${p.kind}">${p.name}</div>`, 'labels');
      m.addTo(g);
    });
  }

  async function renderTowers() {
    reset('towers');
    const g = group('towers');
    const towers = await api.getTowers();
    towers.forEach((t) => {
      const m = marker(t.lat, t.lng, iconHtml('is-tower', '#4d9dff', '▲', t.id));
      m.bindTooltip(`<div class="dt">
        <div class="dt-hd"><span class="dt-sw" style="background:#4d9dff"></span>
          <span class="dt-name">${t.id}</span></div>
        <div class="dt-rows">
          <div class="dt-r"><span>Area</span><b>${t.area}</b></div>
          <div class="dt-r"><span>LGA</span><b>${t.lga}</b></div>
          <div class="dt-r"><span>Type</span><b>${t.type}</b></div>
          <div class="dt-r"><span>Source</span><b>Simulation</b></div>
        </div>
        <div class="dt-ft">Cell ID is fictional · not a GPS fix</div>
      </div>`, tip());
      m.on('click', (e) => { L.DomEvent.stopPropagation(e); onSelect?.({ kind: 'tower', data: t }); });
      m.addTo(g);
    });
  }

  async function renderFacilities() {
    reset('facilities');
    const g = group('facilities');
    const list = await api.getFacilities();
    list.forEach((f) => {
      const c = KIND_COLOR[f.kind] || '#00e676';
      const glyph = f.kind === 'police' ? 'P' : f.kind === 'military' ? 'M' : f.kind === 'checkpoint' ? 'C' : f.kind === 'command' ? '★' : 'E';
      const m = marker(f.lat, f.lng, iconHtml('is-fac', c, glyph, ''));
      m.bindTooltip(`<div class="dt"><div class="dt-hd"><span class="dt-sw" style="background:${c}"></span>
        <span class="dt-name">${f.name}</span></div>
        <div class="dt-rows">
          <div class="dt-r"><span>Kind</span><b>${f.kind}</b></div>
          <div class="dt-r"><span>LGA</span><b>${f.lga}</b></div>
        </div></div>`, tip());
      m.addTo(g);
    });
  }

  async function renderUnits() {
    reset('units');
    const g = group('units');
    const list = await api.getUnits();
    list.forEach((u) => {
      const c = u.status === 'OFFLINE' ? '#64787c' : u.status === 'AVAILABLE' ? '#00e676' : '#f5b942';
      const m = marker(u.lat, u.lng, iconHtml('is-unit', c, '▣', u.id));
      m.bindTooltip(`<div class="dt"><div class="dt-hd"><span class="dt-sw" style="background:${c}"></span>
        <span class="dt-name">${u.name}</span></div>
        <div class="dt-rows">
          <div class="dt-r"><span>Status</span><b>${u.status}</b></div>
          <div class="dt-r"><span>Kind</span><b>${u.kind}</b></div>
          <div class="dt-r"><span>Incident</span><b>${u.incident || '—'}</b></div>
          <div class="dt-r"><span>Updated</span><b>${u.updated}</b></div>
        </div>
        <div class="dt-ft">Approximate reported position</div></div>`, tip());
      m.on('click', (e) => { L.DomEvent.stopPropagation(e); onSelect?.({ kind: 'unit', data: u }); });
      m.addTo(g);
    });
  }

  async function renderEmergency() {
    reset('emergency');
    const g = group('emergency');
    const list = await api.getEmergency();
    list.forEach((e) => {
      L.circle([e.lat, e.lng], {
        pane: 'opsUnder', radius: e.radiusKm * 1000,
        color: '#2dd8c3', weight: 1, dashArray: '4,4',
        fillColor: '#2dd8c3', fillOpacity: 0.08,
      }).addTo(g);
      const m = marker(e.lat, e.lng, iconHtml('is-emg', '#2dd8c3', '!', e.id));
      m.bindTooltip(`<div class="dt"><div class="dt-hd"><span class="dt-sw" style="background:#2dd8c3"></span>
        <span class="dt-name">${e.id}</span></div>
        <div class="dt-rows">
          <div class="dt-r"><span>Type</span><b>${e.type}</b></div>
          <div class="dt-r"><span>Priority</span><b>${e.pri}</b></div>
          <div class="dt-r"><span>Status</span><b>${e.status}</b></div>
          <div class="dt-r"><span>Radius</span><b>~${e.radiusKm} km</b></div>
          <div class="dt-r"><span>Confidence</span><b>${e.conf}%</b></div>
        </div>
        <div class="dt-ft">Estimated area · not exact GPS</div></div>`, tip());
      m.addTo(g);
    });
  }

  async function renderSearch() {
    reset('search');
    const g = group('search');
    const list = await api.getSearchAreas();
    list.forEach((s) => {
      L.circle([s.lat, s.lng], {
        pane: 'opsUnder', radius: s.r,
        color: '#8b7dff', weight: 1.4, dashArray: '6,4',
        fillColor: '#8b7dff', fillOpacity: 0.08,
      }).bindTooltip(s.name, { className: 'dep-tip' }).addTo(g);
    });
  }

  async function renderDevices(focusId) {
    reset('devices');
    const g = group('devices');
    const devices = await api.getDevices();
    devices.filter((d) => d.status !== 'CLOSED').forEach((d) => {
      const tw = (store.get('_towers') || []).find?.() ;
      // current estimated cell
    });
    const towers = await api.getTowers();
    const T = Object.fromEntries(towers.map((t) => [t.id, t]));
    devices.filter((d) => d.status !== 'CLOSED').forEach((d) => {
      const tw = T[d.currentTower];
      if (!tw) return;
      const hot = d.id === focusId;
      L.circle([tw.lat, tw.lng], {
        pane: 'ops',
        radius: d.radiusKm * 1000,
        color: hot ? '#f5b942' : '#ff8a3d',
        weight: hot ? 2 : 1,
        dashArray: '5,4',
        fillColor: hot ? '#f5b942' : '#ff8a3d',
        fillOpacity: hot ? 0.16 : 0.08,
      }).bindTooltip(`<div class="dt"><div class="dt-hd"><span class="dt-sw" style="background:#f5b942"></span>
        <span class="dt-name">${d.id} · estimated area</span></div>
        <div class="dt-rows">
          <div class="dt-r"><span>Area</span><b>${d.currentArea}</b></div>
          <div class="dt-r"><span>Radius</span><b>~${d.radiusKm} km</b></div>
          <div class="dt-r"><span>Confidence</span><b>${d.confidence}%</b></div>
          <div class="dt-r"><span>Cell</span><b>${d.currentTower}</b></div>
        </div>
        <div class="dt-ft">${d.source}</div></div>`, tip()).addTo(g);
      const m = marker(tw.lat, tw.lng, iconHtml(hot ? 'is-dev is-hot' : 'is-dev', '#f5b942', '◎', d.id));
      m.on('click', (e) => { L.DomEvent.stopPropagation(e); onSelect?.({ kind: 'device', data: d }); });
      m.addTo(g);
    });
  }

  async function renderTrails(focusId = 'INV-001') {
    reset('trails');
    const g = group('trails');
    const loc = await api.getLocations(focusId);
    if (loc.length < 2) return;
    const latlngs = loc.map((p) => [p.lat, p.lng]);
    L.polyline(latlngs, {
      pane: 'trails', color: '#ff8a3d', weight: 2.2, opacity: 0.85, dashArray: '7,6',
    }).addTo(g);
    loc.forEach((p, i) => {
      L.circleMarker([p.lat, p.lng], {
        pane: 'trails', radius: i === loc.length - 1 ? 5 : 3.2,
        color: '#ff8a3d', fillColor: i === loc.length - 1 ? '#ff4d5e' : '#ff8a3d',
        fillOpacity: 0.9, weight: 1.4,
      }).bindTooltip(`<div class="dt"><div class="dt-name">${p.cell} · ${p.area}</div>
        <div class="dt-rows">
          <div class="dt-r"><span>Radius</span><b>~${p.radiusKm} km</b></div>
          <div class="dt-r"><span>Confidence</span><b>${p.conf}%</b></div>
        </div>
        <div class="dt-ft">Estimated cell area · simulation</div></div>`, tip()).addTo(g);
    });
  }

  async function loadAll(focusId) {
    await Promise.all([
      renderRoads(), renderForest(), renderPlaces(), renderTowers(),
      renderFacilities(), renderUnits(), renderEmergency(), renderSearch(),
      renderDevices(focusId), renderTrails(focusId),
    ]);
  }

  function setVisible(id, on) {
    vis[id] = on;
    const g = groups[id];
    if (!g) return;
    if (on) g.addTo(map); else map.removeLayer(g);
  }

  function playMovement(points, { onTick, duration = 8000 } = {}) {
    stopPlayback();
    if (!points?.length) return;
    const trail = points.map((p) => L.latLng(p.lat, p.lng));
    const markerLayer = L.circleMarker(trail[0], {
      pane: 'trails', radius: 7, color: '#fff', weight: 2,
      fillColor: '#ff4d5e', fillOpacity: 1,
    }).addTo(map);
    const halo = L.circle(trail[0], {
      pane: 'ops', radius: (points[0].radiusKm || 2) * 1000,
      color: '#ff4d5e', weight: 1, dashArray: '4,4', fillColor: '#ff4d5e', fillOpacity: 0.1,
    }).addTo(map);
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / duration);
      const f = p * (trail.length - 1);
      const i = Math.min(trail.length - 2, Math.floor(f));
      const t = f - i;
      const a = trail[i], b = trail[i + 1];
      const lat = a.lat + (b.lat - a.lat) * t;
      const lng = a.lng + (b.lng - a.lng) * t;
      markerLayer.setLatLng([lat, lng]);
      const rad = (points[i].radiusKm + (points[i + 1].radiusKm - points[i].radiusKm) * t) * 1000;
      halo.setLatLng([lat, lng]);
      halo.setRadius(rad);
      onTick?.({ p, i, point: points[i] });
      if (p < 1) playback = requestAnimationFrame(step);
      else playback = null;
    }
    playback = requestAnimationFrame(step);
    return () => { stopPlayback(); map.removeLayer(markerLayer); map.removeLayer(halo); };
  }

  function stopPlayback() {
    if (playback) cancelAnimationFrame(playback);
    playback = null;
  }

  function flyEstimated(lat, lng, radiusKm) {
    nmap.lockView(true);
    const b = L.latLng(lat, lng).toBounds(radiusKm * 1000 * 2.2);
    map.flyToBounds(b, { duration: 0.7, maxZoom: 11 });
  }

  return {
    loadAll, setVisible, renderTrails, renderDevices, playMovement, stopPlayback, flyEstimated,
    destroy() { stopPlayback(); Object.values(groups).forEach((g) => map.removeLayer(g)); },
  };
}

export { INCIDENT_TYPES, fmt };
