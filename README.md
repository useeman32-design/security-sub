# Intelligence Security Tracking System

GIS-based situational awareness and security intelligence for Nigeria.

**Live preview:** https://useeman32-design.github.io/security-sub/

## Stack

Deliberately identical to the Nigeria Mineral Intelligence platform so the two
systems share engineering patterns and the same map behaviour:

- **HTML5 + CSS3 + vanilla JavaScript (ES modules)** — no frameworks
- **Leaflet.js** for all mapping
- SPA shell: persistent sidebar and topbar, no reload on navigation
- Dark AMOLED design language, high information density
- Modular JS structured for a later PHP/Laravel API

## Layout

| Path | Purpose |
|---|---|
| `css/` | Stylesheets |
| `js/core/` | Router, state, shared utilities |
| `js/components/` | Map, shell, reusable UI |
| `js/modules/` | Feature modules, one per route |
| `js/data/` | API layer and data adapters |
| `data/` | GeoJSON and reference datasets |
| `docs/` | Design notes and data sourcing |

## Status

Scaffold only. Repository and GitHub Pages deployment are verified working;
the application specification is pending.
