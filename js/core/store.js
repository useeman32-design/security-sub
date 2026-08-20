/**
 * Tiny observable application store.
 */

class Store {
  constructor(initial = {}) {
    this._state = initial;
    this._subs = new Map();
    this._any = new Set();
  }

  get(key) { return key ? this._state[key] : this._state; }

  set(patch) {
    const changed = [];
    for (const [k, v] of Object.entries(patch)) {
      if (this._state[k] !== v) { this._state[k] = v; changed.push(k); }
    }
    if (!changed.length) return;
    changed.forEach((k) => (this._subs.get(k) || []).forEach((fn) => fn(this._state[k], k)));
    this._any.forEach((fn) => fn(this._state, changed));
  }

  subscribe(key, fn) {
    if (typeof key === 'function') { this._any.add(key); return () => this._any.delete(key); }
    if (!this._subs.has(key)) this._subs.set(key, new Set());
    this._subs.get(key).add(fn);
    return () => this._subs.get(key).delete(fn);
  }
}

export const store = new Store({
  route: 'command',
  railCollapsed: false,

  drill: { level: 'state', nation: 'Nigeria', state: 'Zamfara', lga: null, prospect: null },
  selectedState: { name: 'Zamfara', code: 'ZA' },
  hoveredState: null,
  pendingFocus: null,
  investigationId: 'INV-001',

  basemap: 'vector',
  zoom: 9,
  showLabels: true,
  showGraticule: true,

  layers: {
    graticule: true, labels: true, lgas: true, places: true, roads: true, forest: true,
    incidents: true, heat: true, risk: false, emergency: true, search: true,
    towers: true, devices: true, trails: true,
    facilities: true, units: true,
    deposits: true, prospectivity: true,
  },
  filters: {
    resources: ['armed', 'abduction', 'banditry', 'civil', 'infra', 'other'],
    prospectivity: 'all',
    risk: 'all',
  },

  dataStatus: { online: true, latencyMs: 38, lastSync: '08:42 WAT', telecom: 'SIMULATION' },
  alerts: [],
});
