/**
 * INTELLIGENCE SECURITY TRACKING SYSTEM — application entry point
 * ===============================================================
 * Boots the persistent shell once, registers every module with the router,
 * and hands control over. Adding a module later = one entry in MODULES; the
 * shell, design system and navigation need no changes.
 *
 * Ported from the Nigeria Mineral Intelligence platform. The shell, router,
 * map, layer system and design tokens are the SAME CODE — only the module
 * list and the domain data differ.
 */

import { buildShell } from './components/shell.js';
import { Router } from './core/router.js';
import { store } from './core/store.js';
import { theme } from './core/theme.js';
import { toast } from './core/utils.js';
import { createExplore } from './modules/explore.js';
import { createPlaceholder } from './modules/placeholder.js';

const MODULES = [
  { id: 'overview',  title: 'Overview',         keepAlive: true,
    factory: () => createPlaceholder('Overview',
      'National situational picture: live incident counts, threat posture by state, and the operational feed.') },

  { id: 'explore',   title: 'Explore Map',      keepAlive: true,
    factory: () => createExplore() },

  { id: 'incidents', title: 'Incidents',        keepAlive: true,
    factory: () => createPlaceholder('Incidents',
      'Searchable incident register with date range, category, state/LGA and severity filters.') },

  { id: 'threat',    title: 'Threat Analysis',  keepAlive: true,
    factory: () => createPlaceholder('Threat Analysis',
      'Weighted threat scoring per area with contributing factors and confidence.') },

  { id: 'assets',    title: 'Protected Assets', keepAlive: true,
    factory: () => createPlaceholder('Protected Assets',
      'Critical infrastructure and protected sites with proximity exposure analysis.') },

  { id: 'units',     title: 'Deployments',      keepAlive: true,
    factory: () => createPlaceholder('Deployments',
      'Deployed units, coverage gaps and response-time modelling.') },

  { id: 'reports',   title: 'Reports',          keepAlive: false,
    factory: () => createPlaceholder('Reports',
      'Report workspace: build, preview and export situation reports to PDF, Excel and CSV.') },

  { id: 'data',      title: 'Data Center',      keepAlive: true,
    factory: () => createPlaceholder('Data Center',
      'Dataset catalogue with provenance, refresh status, quality score and "used by" module links.') },
];

function boot() {
  theme.init();

  const shell = buildShell(document.getElementById('root'));
  const router = new Router(shell.stage, shell.routeBar);

  MODULES.forEach((m) => router.register(m.id, {
    title: m.title, keepAlive: m.keepAlive, factory: m.factory,
  }));

  router.onChange((id) => shell.setActive(id));
  shell.onNav((id) => router.navigate(id));
  router.start('overview');

  // Topbar affordances
  document.getElementById('btn-theme')?.addEventListener('click', () => {
    const t = theme.toggle();
    toast(`${t === 'light' ? 'Light' : 'Dark'} theme`);
  });
  document.getElementById('btn-bell')?.addEventListener('click',
    () => toast('Notification centre arrives with the alerting service'));
  document.getElementById('btn-user')?.addEventListener('click',
    () => toast('Account menu arrives with the auth service'));
  document.getElementById('loc-pill')?.addEventListener('click', () => {
    const d = store.get('drill');
    toast(d.state ? `Context: ${d.state}` : 'Context: national extent');
  });

  // Drop the boot splash once the first view is painted
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
