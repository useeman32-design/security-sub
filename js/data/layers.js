/**
 * SHARED LAYER CATALOGUE
 * ======================
 * One definition of the map's layer stack, consumed by every module that
 * renders the map. Adding a layer here surfaces it everywhere automatically.
 *
 * PORTED FROM THE MINERALS PLATFORM. The mechanism is unchanged; the layer
 * list below is a security-domain placeholder — replace the items with the
 * real layers once the specification lands, but keep the shape:
 *
 *   { id, label, color, def?, soon?, hint? }
 *
 *   id    unique key, also the key used in the layer on/off store
 *   def   true = on by default
 *   soon  true = greyed out, shows a "SOON" badge, cannot be toggled
 *   hint  small explanatory line under the label
 */

export const LAYER_GROUPS = [
  {
    group: 'Base',
    items: [
      { id: 'graticule', label: 'Coordinate grid', color: '#2dd8c3', def: true },
      { id: 'labels',    label: 'Place labels',    color: '#93a8ab', def: true },
    ],
  },
  {
    group: 'Situational',
    items: [
      { id: 'incidents', label: 'Incidents',       color: '#ff4d5e', def: true,
        hint: 'Point events on the operational timeline' },
      { id: 'heat',      label: 'Incident density', color: '#ff8a3d', def: true,
        hint: 'Weighted concentration surface' },
      { id: 'lgas',      label: 'LGA boundaries',  color: '#5eead4', def: false,
        hint: 'Needs a selected state · auto at zoom 8.5+' },
      { id: 'risk',      label: 'Threat level',    color: '#f5b942', def: false,
        hint: 'States tinted by assessed threat level' },
    ],
  },
  {
    group: 'Pending data service',
    items: [
      { id: 'assets',   label: 'Protected assets',     color: '#4d9dff', soon: true },
      { id: 'units',    label: 'Deployed units',       color: '#00e676', soon: true },
      { id: 'infra',    label: 'Roads & infrastructure', color: '#9aa7b0', soon: true },
    ],
  },
];

export const LAYER_INDEX = Object.fromEntries(
  LAYER_GROUPS.flatMap((g) => g.items.map((it) => [it.id, it]))
);

/** Default on/off map, used to seed the store and the reset action. */
export function defaultLayerState() {
  const out = {};
  LAYER_GROUPS.forEach((g) => g.items.forEach((it) => {
    if (!it.soon) out[it.id] = !!it.def;
  }));
  return out;
}

/**
 * Single implementation of "turn layer X on/off", so every module that shows
 * the map can never drift apart.
 *
 * @returns {{ok: boolean, reason?: string}}
 */
export function applyLayer(nmap, id, on, { store, toast } = {}) {
  const meta = LAYER_INDEX[id];
  if (!meta) return { ok: false, reason: 'Unknown layer' };
  if (meta.soon) {
    toast?.(`${meta.label} arrives with the data service`);
    return { ok: false, reason: 'pending' };
  }

  if (id === 'labels') {
    nmap.setLabels(on);
  } else if (id === 'lgas') {
    const st = store?.get('selectedState');
    if (on) {
      if (!st) { toast?.('Select a state first to load its LGAs'); return { ok: false, reason: 'no-state' }; }
      nmap.showLgas(st.code, { explicit: true });
    } else {
      nmap.hideLgas();
    }
  } else {
    nmap.toggleLayer(id, on);
  }

  if (store) store.set({ layers: { ...store.get('layers'), [id]: on } });
  return { ok: true };
}
