/**
 * PLACEHOLDER MODULE
 * ==================
 * Every route that has no implementation yet renders through this, so the
 * shell, router and navigation are fully exercised from day one and each
 * route states what it is going to become.
 *
 * Replace a placeholder by writing a real module and swapping the factory in
 * js/main.js — nothing else changes.
 */

import { icon } from '../core/icons.js';

export function createPlaceholder(title, blurb) {
  let view;

  function mount(host) {
    view = document.createElement('div');
    view.className = 'view view-placeholder';
    view.innerHTML = `
      <div class="ph-wrap">
        <div class="ph-card">
          <div class="ph-ico">${icon('layers', { size: 22 })}</div>
          <h2 class="ph-t">${title}</h2>
          <p class="ph-b">${blurb}</p>
          <div class="ph-note">
            <span class="ph-dot"></span>
            Route is registered and the shell is live — module implementation pending
          </div>
        </div>
      </div>`;
    host.appendChild(view);
    return view;
  }

  return {
    mount,
    destroy() { view?.remove(); view = null; },
  };
}
