# Continental Feuds

**Abhi's State War Simulator** is a browser strategy campaign across all 48 continental US states.

Alaska and Hawaii are intentionally reserved for a later expansion update.

## Core highlights

- Full-screen map-first viewport with floating diegetic HUD ribbons.
- Real contiguous US state geometry rendered from local TopoJSON (`data/states-10m.json`).
- Native pan + zoom map navigation (drag to pan, wheel to zoom).
- Incremental conquest model:
  - each state tracks control percentage by faction
  - campaigns shift control over time rather than instant all-or-nothing captures
- Frontline and supply-line warfare:
  - disconnected holdings suffer attrition
  - supply pressure directly affects campaign outcomes
- Animated battle language:
  - dashed attack vectors for active maneuvers
  - contested border pulse + ash/smoke particulate overlay
- Doctrine RPS layer:
  - Fabian Attrition
  - Feigned Retreat
  - Siegeworks
- Fog-of-war behavior:
  - exact enemy levy counts are visible only on adjacent borders
- Dynamic AI faction generation with medieval-style names and faction traits.
- First-run guided tutorial overlay when no campaign save exists.

## Campaign loop

1. Select any state as your starting realm.
2. Allocate seasonal budget across Levies, Siegeworks, and Civil provisioning.
3. Queue campaigns from frontline states into adjacent enemies.
4. Advance the season and resolve player + AI turns.
5. Expand control while protecting supply continuity.

## Save system

- Auto-save to `localStorage` at the end of every season.

## Platform honesty

- Project type: Browser strategy game
- Stack truth: HTML, CSS, JavaScript, local TopoJSON data
- Positioning: this is a simulation-heavy web game, not a native systems project
- Export save to structured flat JSON (`factions`, `states`, `stateControl`, `queue`, `chronicle`).
- Import save from JSON file.

## Tech stack

- HTML5
- Custom CSS (no UI framework)
- Vanilla JavaScript (modular architecture)
- D3 + TopoJSON client for geographic rendering
- Lucide icons for HUD iconography

## Run locally

```bash
python -m http.server 8100
```

Then open:

```text
http://127.0.0.1:8100
```

## Repository role

- Portfolio project type: browser simulation game
- Focus areas: systems design, war simulation loops, map rendering, and interactive UX polish

