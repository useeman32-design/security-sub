# Zamfara Security Intelligence & Emergency Response

GIS command platform for authorized security and emergency-response personnel in **Zamfara State**. Built on the existing Leaflet map engine, SPA shell and design system.

**This prototype uses DEMO / SIMULATION DATA only.** It is not a call-interception system. Telecom rows are metadata (time, direction, duration, cell). Estimated locations are cell-area circles with a confidence score — never exact GPS.

## Run

```bash
python3 -m http.server 4000
# or: php -S 0.0.0.0:4000
```

Open `http://localhost:4000`. No build step.

## Architecture

See `docs/ARCHITECTURE.md`. Domain data lives in `js/data/sim.js` and is reached only through `js/data/api.js`, so an authorized live adapter can replace the simulation without redesigning the UI.

## Classification chips

The UI always distinguishes:

- SIMULATION DATA
- AUTHORIZED LIVE DATA
- ANALYST VERIFIED INTELLIGENCE
- AI-GENERATED LEADS (require analyst verification)
