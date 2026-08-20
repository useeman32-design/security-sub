/**
 * SHARED LAYER CATALOGUE — Zamfara operations
 */

export const LAYER_GROUPS = [
  {
    group: 'Base',
    items: [
      { id: 'graticule', label: 'Coordinate grid', color: '#2dd8c3', def: true },
      { id: 'labels',    label: 'Place labels',    color: '#93a8ab', def: true },
      { id: 'lgas',      label: 'LGA boundaries',  color: '#5eead4', def: true,
        hint: 'Zamfara 14 LGAs' },
      { id: 'places',    label: 'Cities & villages', color: '#e8f2f2', def: true },
      { id: 'roads',     label: 'Roads & highways', color: '#9aa7b0', def: true },
      { id: 'forest',    label: 'Forest / bush areas', color: '#1f6b4a', def: true },
    ],
  },
  {
    group: 'Situational',
    items: [
      { id: 'incidents',  label: 'Incident locations', color: '#ff4d5e', def: true },
      { id: 'heat',       label: 'Risk heatmap',       color: '#ff8a3d', def: true },
      { id: 'risk',       label: 'LGA risk tint',      color: '#f5b942', def: false },
      { id: 'emergency',  label: 'Emergency calls',    color: '#2dd8c3', def: true },
      { id: 'search',     label: 'Search areas',       color: '#8b7dff', def: true },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { id: 'towers',   label: 'Telecom towers',          color: '#4d9dff', def: true,
        hint: 'Cell IDs are simulated' },
      { id: 'devices',  label: 'Estimated device areas',  color: '#f5b942', def: true,
        hint: 'Uncertainty circles — not GPS' },
      { id: 'trails',   label: 'Movement trails',         color: '#ff8a3d', def: true },
    ],
  },
  {
    group: 'Forces',
    items: [
      { id: 'facilities', label: 'Security facilities', color: '#00e676', def: true },
      { id: 'units',      label: 'Emergency units',     color: '#4dffa6', def: true },
    ],
  },
];

export const LAYER_INDEX = Object.fromEntries(
  LAYER_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it]))
);

export function defaultLayerState() {
  const out = {};
  LAYER_GROUPS.forEach((g) => g.items.forEach((it) => {
    if (!it.soon) out[it.id] = !!it.def;
  }));
  return out;
}

export function applyLayer(nmap, id, on, { store, toast, ops } = {}) {
  const meta = LAYER_INDEX[id];
  if (!meta) return { ok: false, reason: 'Unknown layer' };
  if (meta.soon) {
    toast?.(`${meta.label} arrives with the data service`);
    return { ok: false, reason: 'pending' };
  }

  if (id === 'labels') {
    nmap.setLabels(on);
  } else if (id === 'lgas') {
    if (on) nmap.showLgas('ZA', { explicit: true });
    else nmap.hideLgas();
  } else if (id === 'graticule') {
    nmap.toggleLayer('graticule', on);
  } else if (id === 'heat') {
    nmap.toggleLayer('prospectivity', on);
  } else if (id === 'incidents') {
    nmap.toggleLayer('deposits', on);
  } else if (id === 'risk') {
    nmap.toggleLayer('risk', on);
  } else if (ops) {
    ops.setVisible(id, on);
  }

  if (store) store.set({ layers: { ...store.get('layers'), [id]: on } });
  return { ok: true };
}
