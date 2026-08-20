/**
 * DATA ACCESS LAYER
 * =================
 * Every module talks to the backend through this object and nothing else.
 * Today it reads static files from /data; swapping in a PHP/Laravel API means
 * changing the bodies here and nothing in the modules.
 *
 * Ported from the minerals platform, reduced to what the map needs at boot.
 */

const _cache = new Map();

async function _json(path) {
  if (_cache.has(path)) return _cache.get(path);
  const p = fetch(path).then((r) => {
    if (!r.ok) throw new Error(`${path} → HTTP ${r.status}`);
    return r.json();
  });
  _cache.set(path, p);
  return p;
}

export const api = {
  /** Clear memoised responses — call after a data-source switch. */
  clearCache() { _cache.clear(); },

  /** 36 states + the FCT as ADM1 polygons. */
  getStateBoundaries() {
    return _json('data/nigeria-states.geojson');
  },

  /**
   * LGA polygons for one state, by two-letter code (see data/lga/index.json).
   * Loaded on demand — all 774 at once is far too heavy for the browser.
   */
  getLgas(stateCode) {
    return _json(`data/lga/${stateCode}.geojson`);
  },

  /**
   * Point events rendered on the map.
   * The map component expects: { id, name, lat, lng, resource, status, state }
   * where `resource` keys into CATEGORY_META in js/data/fixtures.js.
   *
   * Returns [] until the incident service exists — the map handles an empty
   * set cleanly, so the app runs end to end today.
   */
  async getDeposits() {
    return [];
  },

  /** Topbar / sidebar health readout. */
  async getSystemHealth() {
    return { tiles: 'ISTS-VEC v1.0', latencyMs: 38, lastSync: 'just now' };
  },
};
