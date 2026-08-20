# Intelligence Security Tracking System

GIS-based situational awareness and security intelligence for Nigeria.

**Live preview:** https://useeman32-design.github.io/security-sub/

---

## For the agent picking this up

This repository is **not an empty scaffold**. The application shell, router,
Leaflet map engine, layer system, design system and Nigeria geodata are all
ported from a working sibling platform and are running right now. Clone it,
serve it, and you get a live map of Nigeria with working state → LGA drill
navigation before writing a line of code.

**Read `docs/ARCHITECTURE.md` first.** It is the contract: module shape,
layer registration, data access, CSS load order, and the traps that already
cost the sibling project real time.

### Run it

```bash
php -S 0.0.0.0:4000        # or any static server
```

Open `http://localhost:4000`. No build step, no install, no dependencies.

---

## What already works

| Piece | State |
|---|---|
| SPA shell — sidebar, topbar, routing, no reload | **Done** |
| Leaflet map, 36 states + FCT as real polygons | **Done** |
| 774 LGA polygons, loaded per state on demand | **Done** |
| State click → drill path → inspector | **Done** |
| Layer tree with on/off, hints and SOON badges | **Done** |
| Dark AMOLED design system + light theme toggle | **Done** |
| Paginated data register (200 rows/page) | **Ported, unused** |
| Overview, Incidents, Threat, Assets, Deployments, Reports, Data Center | **Placeholders** |

Every route is registered and navigable. Unbuilt ones render a placeholder
stating what they will become, so the shell is exercised end to end.

## Layout

```
index.html            boot: theme, CSS order, Leaflet, module entry
js/main.js            module registry + boot sequence  ← add routes here
js/core/              router, store, utils, icons, theme, geo, context, history
js/components/        map.js (Leaflet engine), shell, register, legend,
                      statusbar, rail, draw, map-toolbar, draggable, search
js/data/              api.js (all I/O), layers.js (layer catalogue), fixtures.js
js/modules/           explore.js (real), placeholder.js
css/                  tokens → base → shell → dashboard → explore → overrides
data/                 nigeria-states.geojson (37 ADM1), lga/*.geojson (774)
vendor/leaflet/       vendored, no CDN
docs/ARCHITECTURE.md  conventions and constraints — read this
```

## Stack

- **HTML5 + CSS3 + vanilla JavaScript (ES modules)** — no frameworks, no build
- **Leaflet.js** for all mapping, vendored
- SPA shell: persistent sidebar and topbar
- Dark AMOLED design language, high information density
- Structured for a later **PHP / Laravel** API — all I/O behind `js/data/api.js`

## Domain notes

- Nigeria has **36 states**; the FCT is not one of them. 37 ADM1 units total.
  Always write "36 states + FCT".
- Security data is **temporal** in a way minerals data is not. Incidents have
  timestamps, so the register and map will likely need a date-range filter and
  timeline playback. Design for that from the start rather than retrofitting.

## Status

Shell and map complete and verified. Domain modules pending specification.
