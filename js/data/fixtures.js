/**
 * MAP FIXTURES
 * ============
 * Minimal data the map component needs at boot. Ported from the minerals
 * platform with the mineral semantics stripped out.
 *
 * Replace CATEGORY_META keys with your real incident/threat categories and
 * feed HEAT from the live API once it exists. The map reads only these two
 * exports, so nothing else has to change.
 */

/**
 * Weighted points driving the density surface.
 *   lat, lng  position
 *   w         weight, 0..1 — drives radius
 *   i         intensity, 0..1 — drives opacity/colour ramp
 *   category  key into CATEGORY_META
 *
 * Empty by default: the security system should render its own events rather
 * than inherit someone else's. The heat layer degrades gracefully to nothing.
 */
export const HEAT = [];

/**
 * Category styling. `hex` is required — the map uses it directly for markers,
 * tooltips and legend swatches. `color` may reference a CSS custom property.
 */
export const CATEGORY_META = {
  armed:      { label: 'Armed clash',     color: 'var(--c-red)',    hex: '#ff4d5e', cat: 'Violent' },
  abduction:  { label: 'Abduction',       color: 'var(--c-orange)', hex: '#ff8a3d', cat: 'Violent' },
  banditry:   { label: 'Banditry',        color: 'var(--c-gold)',   hex: '#f5b942', cat: 'Criminal' },
  civil:      { label: 'Civil unrest',    color: 'var(--c-cyan)',   hex: '#2dd8c3', cat: 'Public order' },
  explosive:  { label: 'Explosive',       color: 'var(--c-purple)', hex: '#8b7dff', cat: 'Violent' },
  infra:      { label: 'Infrastructure',  color: 'var(--c-blue)',   hex: '#4d9dff', cat: 'Asset' },
  other:      { label: 'Other',           color: 'var(--c-grey)',   hex: '#9aa7b0', cat: 'Unclassified' },
};

/**
 * Back-compat alias. `map.js` was written against RESOURCE_META in the
 * minerals platform; keeping the alias means the ported map component runs
 * unmodified. Prefer CATEGORY_META in new code.
 */
export const RESOURCE_META = CATEGORY_META;
