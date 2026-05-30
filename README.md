# Lower 48 Warlines

High-feature browser strategy game where all 48 contiguous US states start in active war.

Alaska and Hawaii are intentionally excluded for a future expansion update.

## Why this project is distinctive

- Full-theater simulation with **48 autonomous factions** at game start.
- Territory conquest, frontline pressure, supply/industry/stability systems, and doctrine-based combat.
- Hybrid strategic loop:
  - player command doctrine + budget allocation
  - targeted offensives
  - AI faction decision making and adaptive aggression
- Persistent local saves and replayable event log for scenario analysis.

## Gameplay systems

- **Territorial warfare**: states capture neighboring states through probabilistic battle resolution.
- **Doctrine control**:
  - Balanced
  - Blitz
  - Fortress
- **Budget policy**:
  - Military
  - Science
  - Civil Stability
- **Dynamic events**:
  - supply disruption
  - industrial surges
  - civil unrest
  - intelligence breakthroughs
- **Tech progression**: faction research unlocks combat multipliers over time.

## Controls

- Pick your starting state and start campaign.
- Set doctrine and budget allocations.
- Queue a targeted offensive each turn (optional).
- Process turn manually or enable auto-run.
- Save/load/reset campaign state from browser localStorage.

## Tech stack

- HTML
- CSS
- Vanilla JavaScript

## Run locally

```bash
python -m http.server 8100
```

Open:

```text
http://127.0.0.1:8100
```

## Notes

- This is a strategic simulation, not a geographic projection-accurate map.
- State placement is optimized for fast readability and gameplay clarity.

## Portfolio Positioning

- Project type: Browser strategy simulation (HTML, CSS, JavaScript)
- Verification path: Open index.html and run multiple turns plus save/load cycle.

