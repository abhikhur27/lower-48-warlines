# Continental Feuds

**Abhi's State War Simulator** is a browser strategy campaign across all 48 continental US states.

Alaska and Hawaii are intentionally reserved for a later expansion update.

## Core highlights

- Medieval chronicle aesthetic with a tactical parchment war-room layout.
- All 48 continental states are active territories with adjacency-accurate campaign routes.
- Incremental conquest model:
  - each state tracks control percentage by faction
  - campaigns shift control over time rather than instant all-or-nothing captures
- Frontline and supply-line warfare:
  - disconnected holdings suffer attrition
  - supply pressure directly affects campaign outcomes
- Doctrine RPS layer:
  - Fabian Attrition
  - Feigned Retreat
  - Siegeworks
- Fog-of-war behavior:
  - exact enemy levy counts are visible only on adjacent borders
- Dynamic AI faction generation with medieval-style names and traits.

## Campaign loop

1. Select any state as your starting realm.
2. Allocate seasonal budget across Levies, Siegeworks, and Civil provisioning.
3. Queue campaigns from frontline states into adjacent enemies.
4. Advance the season and resolve player + AI turns.
5. Expand control while protecting supply continuity.

## Save system

- Auto-save to `localStorage` at the end of every season.
- Export save to formatted JSON.
- Import save from JSON file.

## Tech stack

- HTML5
- Tailwind CSS
- Vanilla JavaScript (modular architecture)

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
- Focus areas: systems design, game-state architecture, AI turn logic, and UI clarity

