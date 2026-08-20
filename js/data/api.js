/**
 * DATA ACCESS LAYER
 * Every module talks to the backend through this object.
 * Today: simulation fixtures. Tomorrow: authorized PHP/Laravel adapters.
 */

import * as sim from './sim.js';

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

function clone(x) { return JSON.parse(JSON.stringify(x)); }

export const api = {
  mode: 'SIMULATION',

  clearCache() { _cache.clear(); },

  getStateBoundaries() {
    return _json('data/nigeria-states.geojson');
  },

  getLgas(stateCode) {
    return _json(`data/lga/${stateCode}.geojson`);
  },

  /** Point events the map engine already knows how to draw. */
  async getDeposits() {
    return sim.incidentsAsDeposits();
  },

  async getSystemHealth() {
    return {
      tiles: 'ZAM-VEC v1.0',
      latencyMs: 38,
      lastSync: sim.META.lastSync,
      telecom: sim.META.feedMode,
      online: true,
    };
  },

  async getMeta() { return sim.META; },
  async getOfficer() { return sim.OFFICER; },
  async getLgaIndex() { return clone(sim.LGAS); },
  async getPlaces() { return clone(sim.PLACES); },
  async getTowers() { return clone(sim.TOWERS); },
  async getIncidents() { return clone(sim.INCIDENTS); },
  async getIncident(id) { return clone(sim.INCIDENTS.find((i) => i.id === id) || null); },
  async getDevices() { return clone(sim.DEVICES); },
  async getDevice(id) { return clone(sim.DEVICES.find((d) => d.id === id) || null); },
  async getCalls(deviceId) {
    const rows = deviceId ? sim.CALLS.filter((c) => c.device === deviceId || c.otherId === deviceId) : sim.CALLS;
    return clone(rows);
  },
  async getLocations(deviceId) { return clone(sim.LOCATIONS[deviceId] || []); },
  async getNetwork(deviceId) { return sim.networkFor(deviceId); },
  async getUnits() { return clone(sim.UNITS); },
  async getFacilities() { return clone(sim.FACILITIES); },
  async getEmergency() { return clone(sim.EMERGENCY); },
  async getEvents() { return clone(sim.EVENTS); },
  async getAlerts() { return clone(sim.ALERTS); },
  async getAiAlerts() { return clone(sim.AI_ALERTS); },
  async getSources() { return clone(sim.SOURCES); },
  async getAudit() { return clone(sim.AUDIT); },
  async getReports() { return clone(sim.REPORTS); },
  async getRoads() { return clone(sim.ROADS); },
  async getForest() { return clone(sim.FOREST); },
  async getSearchAreas() { return clone(sim.SEARCH_AREAS); },
  async getKpiTrends() { return sim.KPI_TRENDS; },
  async getHeat() { return sim.heatFromRisk(); },

  logAudit(entry) {
    sim.AUDIT.unshift({
      time: new Date().toISOString(),
      actor: sim.OFFICER.name,
      action: entry.action || 'VIEW',
      object: entry.object,
      ip: '10.12.4.18',
    });
  },
};

export { sim };
