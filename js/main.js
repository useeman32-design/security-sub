/**
 * ZAMFARA SECURITY INTELLIGENCE & EMERGENCY RESPONSE
 * Command platform entry — vanilla ES modules, one Leaflet engine.
 */

import { buildShell } from './components/shell.js';
import { Router } from './core/router.js';
import { store } from './core/store.js';
import { theme } from './core/theme.js';
import { toast } from './core/utils.js';
import { createCommand } from './modules/command.js';
import { createLive } from './modules/live.js';
import { createIncidents } from './modules/incidents.js';
import { createCalls } from './modules/calls.js';
import { createDevices } from './modules/devices.js';
import { createLocation } from './modules/location.js';
import { createMovement } from './modules/movement.js';
import { createRisk } from './modules/risk.js';
import { createEmergency } from './modules/emergency.js';
import { createUnits } from './modules/units.js';
import { createReports } from './modules/reports.js';
import { createAnalytics } from './modules/analytics.js';
import { createSources } from './modules/sources.js';
import { createAudit } from './modules/audit.js';
import { createSettings } from './modules/settings.js';
import { createCase } from './modules/case.js';

const MODULES = [
  { id: 'command',   title: 'Command Center',        keepAlive: true,  factory: () => createCommand() },
  { id: 'live',      title: 'Live Intelligence',     keepAlive: true,  factory: () => createLive() },
  { id: 'incidents', title: 'Incidents',             keepAlive: true,  factory: () => createIncidents() },
  { id: 'calls',     title: 'Call Intelligence',     keepAlive: true,  factory: () => createCalls() },
  { id: 'devices',   title: 'Device Intelligence',   keepAlive: true,  factory: () => createDevices() },
  { id: 'location',  title: 'Location Tracking',     keepAlive: true,  factory: () => createLocation() },
  { id: 'movement',  title: 'Movement Analysis',     keepAlive: true,  factory: () => createMovement() },
  { id: 'risk',      title: 'Risk & Threat Map',     keepAlive: true,  factory: () => createRisk() },
  { id: 'emergency', title: 'Emergency Calls',       keepAlive: true,  factory: () => createEmergency() },
  { id: 'units',     title: 'Security Units',        keepAlive: true,  factory: () => createUnits() },
  { id: 'reports',   title: 'Intelligence Reports',  keepAlive: false, factory: () => createReports() },
  { id: 'analytics', title: 'Analytics',             keepAlive: false, factory: () => createAnalytics() },
  { id: 'case',      title: 'Investigation',         keepAlive: true,  factory: () => createCase() },
  { id: 'sources',   title: 'Data Sources',          keepAlive: false, factory: () => createSources() },
  { id: 'audit',     title: 'Audit Logs',            keepAlive: false, factory: () => createAudit() },
  { id: 'settings',  title: 'Settings',              keepAlive: false, factory: () => createSettings() },
];

function boot() {
  theme.init();

  const shell = buildShell(document.getElementById('root'));
  const router = new Router(shell.stage, shell.routeBar);

  MODULES.forEach((m) => router.register(m.id, {
    title: m.title, keepAlive: m.keepAlive, factory: m.factory,
  }));

  router.onChange((id) => {
    shell.setActive(id);
    store.set({ route: id });
    document.title = `${MODULES.find((m) => m.id === id)?.title || id} · Zamfara SIC`;
  });
  shell.onNav((id) => router.navigate(id));
  router.start('command');

  document.getElementById('btn-theme')?.addEventListener('click', () => {
    const t = theme.toggle();
    toast(`${t === 'light' ? 'Light' : 'Dark'} theme`);
  });
  document.getElementById('btn-user')?.addEventListener('click',
    () => toast('Account menu is bound to the future auth service'));
  document.getElementById('loc-pill')?.addEventListener('click', () => {
    toast('Jurisdiction locked to Zamfara State');
  });

  requestAnimationFrame(() => {
    const b = document.getElementById('boot');
    if (b) { b.classList.add('is-out'); setTimeout(() => b.remove(), 420); }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
