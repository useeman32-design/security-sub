# Architecture & conventions

Read this before writing any code. It is the contract the whole codebase
follows, ported from a working production platform — not aspirational.

## Hard constraints

1. **HTML5 + CSS3 + vanilla JavaScript (ES modules). No frameworks.**
   No React, Vue, Svelte, jQuery, or a build step. The browser loads
   `js/main.js` as a module and everything follows from there.
2. **The eventual backend is PHP / Laravel.** No Python anywhere, including
   tooling.
3. **Leaflet for all mapping**, vendored in `vendor/leaflet/`. No CDN at
   runtime.
4. **One map only.** `Explore Map` is the single Leaflet instance. Other
   modules hand off to it — they never embed a second map.
5. **Strict SPA.** Navigation never reloads the page. The shell (sidebar +
   topbar) is built once and persists.
6. **Do not redesign.** The sidebar, topbar, colours, typography, cards, map
   style and layout are fixed. Add features inside that language.

## Module contract

A module is a factory returning a small object. `js/core/router.js` drives it:

```js
export function createThing() {
  let view;
  function mount(host) {          // build DOM, append to host, return it
    view = document.createElement('div');
    view.className = 'view view-thing';
    host.appendChild(view);
    return view;
  }
  return {
    mount,
    onShow()  {},                 // optional: called each time it is revealed
    onHide()  {},                 // optional
    destroy() { view?.remove(); } // optional: only for non-keepAlive routes
  };
}
```

Register it in `js/main.js`:

```js
{ id: 'thing', title: 'Thing', keepAlive: true, factory: () => createThing() }
```

`keepAlive: true` keeps the instance alive across navigation — use it for
anything expensive (the map) or anything holding user state.

**Because keep-alive views stay in the DOM, always scope your selectors**:
`$('#rg-rows', view)` or `#view-thing .foo`, never a bare global selector.
Two views can otherwise match the same id.

## Layers

Never call Leaflet directly from a module to toggle a layer. Add the layer to
`LAYER_GROUPS` in `js/data/layers.js` and implement its rendering in
`js/components/map.js`, then route toggles through `applyLayer()`. This is why
the layer tree and any future layer menu can never drift apart.

## Data

Everything goes through `js/data/api.js`. Modules must not `fetch()` directly.
Swapping static files for a Laravel API then touches one file.

Already wired:

| Method | Returns |
|---|---|
| `getStateBoundaries()` | 36 states + FCT, ADM1 polygons |
| `getLgas(code)` | 774 LGAs, loaded per state on demand |
| `getDeposits()` | Map point events — returns `[]` until the incident service exists |
| `getSystemHealth()` | Topbar/sidebar readout |

## Counting Nigeria correctly

Nigeria has **36 states**. The Federal Capital Territory is *not* a state.
There are **37 ADM1 units**. Write "36 states + FCT", never "37 states".
This was a real bug in the sibling platform; do not reintroduce it.

## Rendering large tables

Never build more than a few hundred rows into the DOM at once. The sibling
platform rendered 10,125 rows and produced 102,230 DOM nodes and a 12.7 s
freeze on a throttled CPU, which users read as a hang. `js/components/register.js`
is ported here already paginated at 200 rows/page — reuse it rather than
writing a new table.

## CSS

Load order in `index.html` matters and is deliberate:

```
tokens.css      design tokens — colours, spacing, radii, fonts
base.css        resets and primitives
shell.css       sidebar, topbar, layout frame
dashboard.css   panels, cards, KPIs (shared vocabulary, not just the dashboard)
explore.css     map workspace + placeholder route
overrides.css   late fixes, print rules, toast  ← must stay last
```

Use existing tokens (`--bg`, `--surface`, `--line`, `--text-mid`, `--amber`,
`--red`, `--cyan`, `--green`). Do not introduce new colours.

## Utilities worth knowing

- `$`, `$$` — scoped querySelector / querySelectorAll → `js/core/utils.js`
- `toast(msg)` — transient message, same file
- `icon(name, {size})` — inline SVG from the registry in `js/core/icons.js`
- `store` — tiny observable state bag, `js/core/store.js`
- `fmt` — number/date formatting, `js/core/utils.js`

## Known trap

`$` returns one element and `$$` returns an array. Calling `.forEach` on `$`
throws. This bit the sibling platform during a refactor — check which one you
mean.
