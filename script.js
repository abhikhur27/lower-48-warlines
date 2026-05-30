const STATE_CATALOG = [
  { id: 'WA', name: 'Washington', x: 1, y: 1, region: 'West', terrain: 'coastal', neighbors: ['OR', 'ID'] },
  { id: 'OR', name: 'Oregon', x: 1, y: 2, region: 'West', terrain: 'coastal', neighbors: ['WA', 'ID', 'NV', 'CA'] },
  { id: 'CA', name: 'California', x: 1, y: 4, region: 'West', terrain: 'coastal', neighbors: ['OR', 'NV', 'AZ'] },
  { id: 'NV', name: 'Nevada', x: 2, y: 3, region: 'West', terrain: 'desert', neighbors: ['OR', 'ID', 'UT', 'AZ', 'CA'] },
  { id: 'ID', name: 'Idaho', x: 2, y: 1, region: 'West', terrain: 'mountain', neighbors: ['WA', 'OR', 'NV', 'UT', 'WY', 'MT'] },
  { id: 'UT', name: 'Utah', x: 3, y: 3, region: 'West', terrain: 'mountain', neighbors: ['ID', 'WY', 'CO', 'NM', 'AZ', 'NV'] },
  { id: 'AZ', name: 'Arizona', x: 2, y: 5, region: 'West', terrain: 'desert', neighbors: ['CA', 'NV', 'UT', 'NM', 'CO'] },
  { id: 'MT', name: 'Montana', x: 3, y: 1, region: 'West', terrain: 'mountain', neighbors: ['ID', 'WY', 'SD', 'ND'] },
  { id: 'WY', name: 'Wyoming', x: 4, y: 2, region: 'West', terrain: 'mountain', neighbors: ['MT', 'SD', 'NE', 'CO', 'UT', 'ID'] },
  { id: 'CO', name: 'Colorado', x: 4, y: 3, region: 'West', terrain: 'mountain', neighbors: ['WY', 'NE', 'KS', 'OK', 'NM', 'AZ', 'UT'] },
  { id: 'NM', name: 'New Mexico', x: 4, y: 5, region: 'West', terrain: 'desert', neighbors: ['AZ', 'UT', 'CO', 'OK', 'TX'] },

  { id: 'ND', name: 'North Dakota', x: 5, y: 1, region: 'Plains', terrain: 'plains', neighbors: ['MT', 'SD', 'MN'] },
  { id: 'SD', name: 'South Dakota', x: 5, y: 2, region: 'Plains', terrain: 'plains', neighbors: ['ND', 'MN', 'IA', 'NE', 'WY', 'MT'] },
  { id: 'NE', name: 'Nebraska', x: 5, y: 3, region: 'Plains', terrain: 'plains', neighbors: ['SD', 'IA', 'MO', 'KS', 'CO', 'WY'] },
  { id: 'KS', name: 'Kansas', x: 5, y: 4, region: 'Plains', terrain: 'plains', neighbors: ['NE', 'MO', 'OK', 'CO'] },
  { id: 'OK', name: 'Oklahoma', x: 5, y: 5, region: 'Plains', terrain: 'plains', neighbors: ['CO', 'KS', 'MO', 'AR', 'TX', 'NM'] },
  { id: 'TX', name: 'Texas', x: 5, y: 6, region: 'Plains', terrain: 'plains', neighbors: ['NM', 'OK', 'AR', 'LA'] },

  { id: 'MN', name: 'Minnesota', x: 6, y: 1, region: 'Midwest', terrain: 'forest', neighbors: ['ND', 'SD', 'IA', 'WI'] },
  { id: 'IA', name: 'Iowa', x: 6, y: 3, region: 'Midwest', terrain: 'plains', neighbors: ['MN', 'SD', 'NE', 'MO', 'IL', 'WI'] },
  { id: 'MO', name: 'Missouri', x: 6, y: 4, region: 'Midwest', terrain: 'forest', neighbors: ['IA', 'IL', 'KY', 'TN', 'AR', 'OK', 'KS', 'NE'] },
  { id: 'AR', name: 'Arkansas', x: 6, y: 5, region: 'South', terrain: 'forest', neighbors: ['TX', 'OK', 'MO', 'TN', 'MS', 'LA'] },
  { id: 'LA', name: 'Louisiana', x: 6, y: 6, region: 'South', terrain: 'coastal', neighbors: ['TX', 'AR', 'MS'] },

  { id: 'WI', name: 'Wisconsin', x: 7, y: 2, region: 'Midwest', terrain: 'forest', neighbors: ['MI', 'MN', 'IA', 'IL'] },
  { id: 'IL', name: 'Illinois', x: 7, y: 3, region: 'Midwest', terrain: 'plains', neighbors: ['WI', 'IA', 'MO', 'KY', 'IN'] },
  { id: 'MS', name: 'Mississippi', x: 7, y: 6, region: 'South', terrain: 'forest', neighbors: ['LA', 'AR', 'TN', 'AL'] },

  { id: 'MI', name: 'Michigan', x: 8, y: 1, region: 'Midwest', terrain: 'forest', neighbors: ['WI', 'IN', 'OH'] },
  { id: 'IN', name: 'Indiana', x: 8, y: 3, region: 'Midwest', terrain: 'plains', neighbors: ['MI', 'OH', 'KY', 'IL'] },
  { id: 'KY', name: 'Kentucky', x: 8, y: 4, region: 'South', terrain: 'hills', neighbors: ['IL', 'IN', 'OH', 'WV', 'VA', 'TN', 'MO'] },
  { id: 'TN', name: 'Tennessee', x: 8, y: 5, region: 'South', terrain: 'hills', neighbors: ['KY', 'VA', 'NC', 'GA', 'AL', 'MS', 'AR', 'MO'] },
  { id: 'AL', name: 'Alabama', x: 8, y: 6, region: 'South', terrain: 'coastal', neighbors: ['FL', 'GA', 'TN', 'MS'] },

  { id: 'OH', name: 'Ohio', x: 9, y: 3, region: 'Midwest', terrain: 'plains', neighbors: ['PA', 'WV', 'KY', 'IN', 'MI'] },
  { id: 'WV', name: 'West Virginia', x: 9, y: 4, region: 'South', terrain: 'hills', neighbors: ['OH', 'PA', 'MD', 'VA', 'KY'] },
  { id: 'GA', name: 'Georgia', x: 9, y: 6, region: 'South', terrain: 'coastal', neighbors: ['FL', 'AL', 'TN', 'NC', 'SC'] },

  { id: 'FL', name: 'Florida', x: 10, y: 7, region: 'South', terrain: 'coastal', neighbors: ['AL', 'GA'] },
  { id: 'SC', name: 'South Carolina', x: 10, y: 6, region: 'South', terrain: 'coastal', neighbors: ['GA', 'NC'] },
  { id: 'NC', name: 'North Carolina', x: 10, y: 5, region: 'South', terrain: 'coastal', neighbors: ['VA', 'TN', 'GA', 'SC'] },
  { id: 'VA', name: 'Virginia', x: 10, y: 4, region: 'South', terrain: 'coastal', neighbors: ['MD', 'WV', 'KY', 'TN', 'NC'] },
  { id: 'PA', name: 'Pennsylvania', x: 11, y: 3, region: 'East', terrain: 'hills', neighbors: ['NY', 'NJ', 'DE', 'MD', 'WV', 'OH'] },
  { id: 'NY', name: 'New York', x: 11, y: 2, region: 'East', terrain: 'hills', neighbors: ['PA', 'NJ', 'CT', 'MA', 'VT'] },
  { id: 'MA', name: 'Massachusetts', x: 13, y: 2, region: 'East', terrain: 'coastal', neighbors: ['NY', 'VT', 'NH', 'CT', 'RI'] },
  { id: 'VT', name: 'Vermont', x: 12, y: 1, region: 'East', terrain: 'hills', neighbors: ['NY', 'NH', 'MA'] },
  { id: 'NH', name: 'New Hampshire', x: 13, y: 1, region: 'East', terrain: 'hills', neighbors: ['ME', 'MA', 'VT'] },
  { id: 'ME', name: 'Maine', x: 14, y: 1, region: 'East', terrain: 'forest', neighbors: ['NH'] },

  { id: 'NJ', name: 'New Jersey', x: 12, y: 3, region: 'East', terrain: 'coastal', neighbors: ['NY', 'PA', 'DE'] },
  { id: 'DE', name: 'Delaware', x: 12, y: 4, region: 'East', terrain: 'coastal', neighbors: ['MD', 'NJ', 'PA'] },
  { id: 'MD', name: 'Maryland', x: 11, y: 4, region: 'East', terrain: 'coastal', neighbors: ['VA', 'WV', 'PA', 'DE'] },
  { id: 'CT', name: 'Connecticut', x: 12, y: 2, region: 'East', terrain: 'coastal', neighbors: ['NY', 'MA', 'RI'] },
  { id: 'RI', name: 'Rhode Island', x: 14, y: 2, region: 'East', terrain: 'coastal', neighbors: ['CT', 'MA'] },
  { id: 'NM2', name: 'Placeholder', x: 99, y: 99, region: 'None', terrain: 'plains', neighbors: [] }
];

const STATE_DATA = STATE_CATALOG.filter((item) => item.id !== 'NM2');

const REGION_BONUS = {
  West: { industry: 56, army: 54, stability: 52 },
  Plains: { industry: 52, army: 57, stability: 51 },
  Midwest: { industry: 58, army: 53, stability: 55 },
  South: { industry: 54, army: 55, stability: 50 },
  East: { industry: 60, army: 52, stability: 56 },
};

const TERRAIN_DEFENSE = {
  plains: 1.0,
  coastal: 1.05,
  forest: 1.1,
  hills: 1.12,
  mountain: 1.16,
  desert: 1.04,
};

const DOCTRINES = {
  balanced: { attack: 1.0, defense: 1.0, research: 1.0, supply: 1.0 },
  blitz: { attack: 1.16, defense: 0.92, research: 0.94, supply: 0.95 },
  fortress: { attack: 0.9, defense: 1.18, research: 1.04, supply: 1.1 },
};

const STORAGE_KEY = 'lower_48_warlines_state_v1';

const turnCountEl = document.getElementById('turn-count');
const playerNameEl = document.getElementById('player-name');
const playerTerritoriesEl = document.getElementById('player-territories');
const warStatusEl = document.getElementById('war-status');
const startStateEl = document.getElementById('start-state');
const startGameBtn = document.getElementById('start-game');
const doctrineEl = document.getElementById('doctrine');
const budgetMilitaryEl = document.getElementById('budget-military');
const budgetScienceEl = document.getElementById('budget-science');
const budgetCivilEl = document.getElementById('budget-civil');
const budgetReadoutEl = document.getElementById('budget-readout');
const offensiveTargetEl = document.getElementById('offensive-target');
const launchOffensiveBtn = document.getElementById('launch-offensive');
const endTurnBtn = document.getElementById('end-turn');
const autoRunBtn = document.getElementById('auto-run');
const saveStateBtn = document.getElementById('save-state');
const loadStateBtn = document.getElementById('load-state');
const resetStateBtn = document.getElementById('reset-state');
const mapEl = document.getElementById('state-map');
const selectedStateEl = document.getElementById('selected-state');
const leaderboardEl = document.getElementById('leaderboard');
const eventLogEl = document.getElementById('event-log');

let autoRunHandle = null;
let game = null;

function hashCode(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function randFor(seed, min, max) {
  const value = (Math.sin(seed * 12.9898) * 43758.5453) % 1;
  const normalized = Math.abs(value);
  return min + (max - min) * normalized;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildFactionColor(id) {
  const h = hashCode(id) % 360;
  const s = 68;
  const l = 64;
  return `hsl(${h} ${s}% ${l}%)`;
}

function toStateMap(list) {
  const map = {};
  list.forEach((state) => {
    map[state.id] = state;
  });
  return map;
}

const STATE_LOOKUP = toStateMap(STATE_DATA);

function territoryPower(territory) {
  return territory.army * (1 + territory.fort * 0.08) * (territory.supply / 100);
}

function createInitialState(startFactionId) {
  const factions = {};
  const territories = {};

  STATE_DATA.forEach((state) => {
    const seed = hashCode(state.id);
    const base = REGION_BONUS[state.region];

    territories[state.id] = {
      id: state.id,
      name: state.name,
      x: state.x,
      y: state.y,
      region: state.region,
      terrain: state.terrain,
      neighbors: [...state.neighbors],
      owner: state.id,
      army: Math.round(base.army + randFor(seed, -12, 14)),
      industry: Math.round(base.industry + randFor(seed + 11, -8, 11)),
      stability: Math.round(base.stability + randFor(seed + 31, -10, 9)),
      supply: Math.round(58 + randFor(seed + 51, -10, 10)),
      fort: Math.round(randFor(seed + 79, 0, 2)),
      pressure: 0,
    };

    factions[state.id] = {
      id: state.id,
      name: state.name,
      color: buildFactionColor(state.id),
      tech: 1 + randFor(seed + 101, 0, 0.3),
      researchProgress: 0,
      aggression: randFor(seed + 121, 0.32, 0.68),
      doctrine: 'balanced',
      alive: true,
    };
  });

  const playerFactionId = startFactionId;

  return {
    version: 1,
    turn: 1,
    playerFactionId,
    territories,
    factions,
    playerBudget: {
      military: 45,
      science: 25,
      civil: 30,
    },
    playerDoctrine: 'balanced',
    queuedOffensive: null,
    selectedTerritoryId: null,
    log: [`Turn 1: ${STATE_LOOKUP[playerFactionId].name} enters total war command.`],
    status: 'live',
  };
}

function stateOwnerCounts() {
  const counts = {};
  Object.values(game.territories).forEach((territory) => {
    counts[territory.owner] = (counts[territory.owner] || 0) + 1;
  });
  return counts;
}

function territoriesOwnedBy(factionId) {
  return Object.values(game.territories).filter((territory) => territory.owner === factionId);
}

function frontierOf(factionId) {
  return territoriesOwnedBy(factionId).filter((territory) => territory.neighbors.some((neighbor) => game.territories[neighbor].owner !== factionId));
}

function appendLog(message) {
  game.log.unshift(`Turn ${game.turn}: ${message}`);
  game.log = game.log.slice(0, 70);
}

function randomChoice(list) {
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function computeFactionPower(factionId) {
  const faction = game.factions[factionId];
  const owned = territoriesOwnedBy(factionId);
  const army = owned.reduce((sum, territory) => sum + territory.army, 0);
  const industry = owned.reduce((sum, territory) => sum + territory.industry, 0);
  return Math.round(army + industry * 0.8 + faction.tech * 36 + owned.length * 22);
}

function rollEvent() {
  const chance = Math.random();
  if (chance > 0.45) return;

  const allTerritories = Object.values(game.territories);
  const target = randomChoice(allTerritories);
  if (!target) return;

  const ownerFaction = game.factions[target.owner];
  const eventRoll = Math.random();

  if (eventRoll < 0.25) {
    target.supply = clamp(target.supply - 12, 20, 120);
    appendLog(`Supply rail sabotage hits ${target.name}. Operational supply drops.`);
  } else if (eventRoll < 0.5) {
    target.industry = clamp(target.industry + 4, 15, 110);
    appendLog(`War factory surge in ${target.name}. Industrial output rises.`);
  } else if (eventRoll < 0.75) {
    target.stability = clamp(target.stability - 8, 0, 100);
    appendLog(`Civil unrest breaks out in ${target.name}. Stability declines.`);
  } else {
    ownerFaction.researchProgress += 16;
    appendLog(`${ownerFaction.name} intercepts strategic intel and accelerates research.`);
  }
}

function applyEconomyAndResearch() {
  const ownerCounts = stateOwnerCounts();

  Object.entries(ownerCounts).forEach(([factionId, territoryCount]) => {
    const faction = game.factions[factionId];
    const owned = territoriesOwnedBy(factionId);
    if (!owned.length) {
      faction.alive = false;
      return;
    }

    faction.alive = true;

    let militaryShare;
    let scienceShare;
    let civilShare;
    let doctrine;

    if (factionId === game.playerFactionId) {
      militaryShare = game.playerBudget.military / 100;
      scienceShare = game.playerBudget.science / 100;
      civilShare = game.playerBudget.civil / 100;
      doctrine = DOCTRINES[game.playerDoctrine];
      faction.doctrine = game.playerDoctrine;
    } else {
      const aggr = faction.aggression;
      militaryShare = clamp(0.36 + aggr * 0.32, 0.28, 0.72);
      scienceShare = clamp(0.12 + (1 - aggr) * 0.18, 0.08, 0.38);
      civilShare = clamp(1 - militaryShare - scienceShare, 0.08, 0.34);
      doctrine = aggr > 0.58 ? DOCTRINES.blitz : aggr < 0.4 ? DOCTRINES.fortress : DOCTRINES.balanced;
      faction.doctrine = aggr > 0.58 ? 'blitz' : aggr < 0.4 ? 'fortress' : 'balanced';
    }

    owned.forEach((territory) => {
      const baseOutput = territory.industry * (0.68 + territory.stability / 250);
      const militaryGain = Math.round((baseOutput / 13) * militaryShare * doctrine.attack);
      const supplyGain = Math.round((baseOutput / 18) * doctrine.supply);
      const stabilityGain = Math.round(civilShare * 4) - (territory.pressure > 0 ? 1 : 0);

      territory.army = clamp(territory.army + militaryGain, 6, 420);
      territory.supply = clamp(territory.supply + supplyGain - 3, 20, 140);
      territory.stability = clamp(territory.stability + stabilityGain, 0, 100);
      territory.pressure = Math.max(0, territory.pressure - 1);
    });

    faction.researchProgress += owned.reduce((sum, territory) => sum + territory.industry * scienceShare * doctrine.research * 0.4, 0);
    const territoryBonus = Math.max(0, territoryCount - 1) * 1.2;
    faction.researchProgress += territoryBonus;

    while (faction.researchProgress >= 100) {
      faction.researchProgress -= 100;
      faction.tech = clamp(faction.tech + 0.08, 1, 4);
      appendLog(`${faction.name} unlocks a tactical upgrade (tech ${faction.tech.toFixed(2)}).`);
    }
  });
}

function battle(attackerFactionId, fromId, toId, { forced = false } = {}) {
  const from = game.territories[fromId];
  const to = game.territories[toId];
  if (!from || !to || from.owner !== attackerFactionId || to.owner === attackerFactionId) return false;
  if (from.army < 10) return false;

  const attackerFaction = game.factions[attackerFactionId];
  const defenderFaction = game.factions[to.owner];
  const atkDoctrine = DOCTRINES[attackerFaction.doctrine || 'balanced'];
  const defDoctrine = DOCTRINES[defenderFaction.doctrine || 'balanced'];

  const attackBase = from.army * (0.84 + Math.random() * 0.42);
  const defenseBase = to.army * (0.86 + Math.random() * 0.38);

  const attackPower = attackBase
    * (1 + (attackerFaction.tech - 1) * 0.42)
    * (1 + from.supply / 280)
    * atkDoctrine.attack;

  const defensePower = defenseBase
    * (1 + (defenderFaction.tech - 1) * 0.45)
    * TERRAIN_DEFENSE[to.terrain]
    * (1 + to.fort * 0.14)
    * (1 + to.supply / 300)
    * defDoctrine.defense;

  if (attackPower > defensePower) {
    const attackerLoss = Math.round(from.army * randFor(hashCode(`${fromId}${toId}${game.turn}`), 0.24, 0.49));
    const defenderLoss = Math.round(to.army * randFor(hashCode(`${toId}${fromId}${game.turn}`), 0.55, 0.88));

    from.army = clamp(from.army - attackerLoss, 8, 420);
    to.army = clamp(to.army - defenderLoss, 4, 420);

    const occupyingForce = clamp(Math.round(from.army * 0.52), 6, from.army - 4);
    from.army -= occupyingForce;

    const previousOwnerName = defenderFaction.name;
    to.owner = attackerFactionId;
    to.army = occupyingForce;
    to.fort = Math.max(0, to.fort - 1);
    to.pressure = 3;

    appendLog(`${attackerFaction.name} seizes ${to.name} from ${previousOwnerName} (${from.id} assault).`);
    return true;
  }

  const attackerLoss = Math.round(from.army * randFor(hashCode(`${fromId}${toId}${game.turn}x`), 0.34, 0.68));
  const defenderLoss = Math.round(to.army * randFor(hashCode(`${toId}${fromId}${game.turn}x`), 0.18, 0.44));

  from.army = clamp(from.army - attackerLoss, 5, 420);
  to.army = clamp(to.army - defenderLoss, 4, 420);
  from.pressure = 2;

  if (forced) {
    appendLog(`${attackerFaction.name} offensive stalled at ${to.name}.`);
  }

  return false;
}

function chooseEnemyTarget(fromTerritory) {
  const enemies = fromTerritory.neighbors
    .map((id) => game.territories[id])
    .filter((territory) => territory.owner !== fromTerritory.owner);

  if (!enemies.length) return null;

  enemies.sort((a, b) => {
    const aScore = a.army + a.fort * 12 + TERRAIN_DEFENSE[a.terrain] * 14;
    const bScore = b.army + b.fort * 12 + TERRAIN_DEFENSE[b.terrain] * 14;
    return aScore - bScore;
  });

  return enemies[0];
}

function processPlayerOffensive() {
  const targetId = game.queuedOffensive;
  if (!targetId) return;

  const target = game.territories[targetId];
  if (!target) return;

  const playerFrontier = frontierOf(game.playerFactionId)
    .filter((territory) => territory.neighbors.includes(targetId))
    .sort((a, b) => territoryPower(b) - territoryPower(a));

  if (!playerFrontier.length) {
    appendLog(`Player offensive on ${target.name} aborted: no adjacent launch state.`);
    game.queuedOffensive = null;
    return;
  }

  battle(game.playerFactionId, playerFrontier[0].id, targetId, { forced: true });
  game.queuedOffensive = null;
}

function processAiOffensives() {
  const ownerCounts = stateOwnerCounts();

  Object.keys(ownerCounts).forEach((factionId) => {
    if (factionId === game.playerFactionId) return;

    const faction = game.factions[factionId];
    const frontier = frontierOf(factionId);
    if (!frontier.length) return;

    const strikes = faction.aggression > 0.6 ? 2 : 1;

    for (let i = 0; i < strikes; i += 1) {
      const launch = [...frontier]
        .sort((a, b) => territoryPower(b) - territoryPower(a))[i % frontier.length];
      if (!launch || launch.army < 14) continue;

      const target = chooseEnemyTarget(launch);
      if (!target) continue;

      const risk = territoryPower(launch) / Math.max(territoryPower(target), 1);
      const go = Math.random() < clamp(0.36 + faction.aggression * 0.42 + risk * 0.12, 0.2, 0.92);
      if (!go) continue;

      battle(factionId, launch.id, target.id);
    }
  });
}

function updateWarStatus() {
  const ownerCounts = stateOwnerCounts();
  const playerTerritories = ownerCounts[game.playerFactionId] || 0;

  if (playerTerritories === 0) {
    game.status = 'defeat';
    warStatusEl.textContent = 'Defeat';
    appendLog('Your faction has been eliminated.');
    stopAutoRun();
    return;
  }

  if (playerTerritories >= 24) {
    game.status = 'dominant';
    warStatusEl.textContent = 'Dominant';
  } else {
    game.status = 'live';
    warStatusEl.textContent = 'Live';
  }

  const surviving = Object.keys(ownerCounts).length;
  if (surviving === 1 && ownerCounts[game.playerFactionId]) {
    game.status = 'victory';
    warStatusEl.textContent = 'Victory';
    appendLog('Theater secured: all 48 states are under your command.');
    stopAutoRun();
  }
}

function calculateFrontlines() {
  Object.values(game.territories).forEach((territory) => {
    const hostileNeighbors = territory.neighbors.filter((neighbor) => game.territories[neighbor].owner !== territory.owner).length;
    territory.frontline = hostileNeighbors > 0;
  });
}

function runTurn() {
  if (!game || game.status === 'defeat' || game.status === 'victory') return;

  applyEconomyAndResearch();
  rollEvent();
  processPlayerOffensive();
  processAiOffensives();
  calculateFrontlines();

  game.turn += 1;
  updateWarStatus();
  render();
}

function collectPlayerTargets() {
  const unique = new Set();
  frontierOf(game.playerFactionId).forEach((territory) => {
    territory.neighbors.forEach((neighbor) => {
      if (game.territories[neighbor].owner !== game.playerFactionId) {
        unique.add(neighbor);
      }
    });
  });
  return [...unique].map((id) => game.territories[id]);
}

function updateTargetOptions() {
  const targets = collectPlayerTargets();
  offensiveTargetEl.innerHTML = '';

  if (!targets.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No adjacent enemy targets';
    offensiveTargetEl.append(option);
    offensiveTargetEl.disabled = true;
    launchOffensiveBtn.disabled = true;
    return;
  }

  targets
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((territory) => {
      const option = document.createElement('option');
      option.value = territory.id;
      option.textContent = `${territory.name} (${territory.id})`;
      offensiveTargetEl.append(option);
    });

  offensiveTargetEl.disabled = false;
  launchOffensiveBtn.disabled = false;
}

function updateBudgetReadout() {
  const military = Number(budgetMilitaryEl.value);
  const science = Number(budgetScienceEl.value);
  const civil = Number(budgetCivilEl.value);
  const total = military + science + civil;

  if (total !== 100) {
    const diff = 100 - total;
    const adjustedCivil = clamp(civil + diff, 10, 70);
    budgetCivilEl.value = String(adjustedCivil);
  }

  game.playerBudget = {
    military: Number(budgetMilitaryEl.value),
    science: Number(budgetScienceEl.value),
    civil: Number(budgetCivilEl.value),
  };

  budgetReadoutEl.textContent = `Military ${game.playerBudget.military}% | Science ${game.playerBudget.science}% | Civil ${game.playerBudget.civil}%`;
}

function renderSelectedState() {
  if (!game.selectedTerritoryId) {
    selectedStateEl.textContent = 'Select a state on the map to inspect it.';
    return;
  }

  const territory = game.territories[game.selectedTerritoryId];
  if (!territory) {
    selectedStateEl.textContent = 'Select a state on the map to inspect it.';
    return;
  }

  const owner = game.factions[territory.owner];
  const hostileCount = territory.neighbors.filter((id) => game.territories[id].owner !== territory.owner).length;

  selectedStateEl.innerHTML = `
    <strong>${territory.name} (${territory.id})</strong><br>
    Controller: ${owner.name}<br>
    Army ${territory.army} | Fort ${territory.fort} | Supply ${territory.supply} | Stability ${territory.stability}<br>
    Industry ${territory.industry} | Terrain ${territory.terrain} | Hostile Borders ${hostileCount}
  `;
}

function renderLeaderboard() {
  const counts = stateOwnerCounts();
  const rows = Object.keys(counts)
    .map((factionId) => ({
      factionId,
      territories: counts[factionId],
      power: computeFactionPower(factionId),
      name: game.factions[factionId].name,
    }))
    .sort((a, b) => b.territories - a.territories || b.power - a.power)
    .slice(0, 12);

  leaderboardEl.innerHTML = rows
    .map((row) => `<tr><td>${row.name}</td><td>${row.territories}</td><td>${row.power}</td></tr>`)
    .join('');
}

function renderEventLog() {
  eventLogEl.innerHTML = game.log
    .slice(0, 24)
    .map((entry) => {
      const safe = entry.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const split = safe.split(': ');
      const turn = split.shift() || 'Turn';
      return `<div class="event-item"><span class="turn">${turn}</span>${split.join(': ')}</div>`;
    })
    .join('');
}

function renderMap() {
  const counts = stateOwnerCounts();
  mapEl.innerHTML = '';

  STATE_DATA.forEach((state) => {
    const territory = game.territories[state.id];
    const owner = game.factions[territory.owner];
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'state-tile';
    tile.style.gridColumn = String(state.x);
    tile.style.gridRow = String(state.y);
    tile.style.background = owner.color;
    tile.innerHTML = `<span>${state.id}</span><small>${territory.army}</small>`;

    if (territory.frontline) {
      tile.classList.add('frontline');
    }

    if (territory.owner === game.playerFactionId) {
      tile.classList.add('player');
    }

    tile.addEventListener('click', () => {
      game.selectedTerritoryId = state.id;
      renderSelectedState();
    });

    mapEl.append(tile);
  });

  turnCountEl.textContent = String(game.turn);
  playerNameEl.textContent = game.factions[game.playerFactionId].name;
  playerTerritoriesEl.textContent = String(counts[game.playerFactionId] || 0);
}

function render() {
  if (!game) return;
  renderMap();
  renderSelectedState();
  renderLeaderboard();
  renderEventLog();
  updateTargetOptions();
}

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  appendLog('Campaign state saved locally.');
  renderEventLog();
}

function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    appendLog('No saved campaign found.');
    renderEventLog();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.territories || !parsed.factions) throw new Error('invalid save');
    game = parsed;
    doctrineEl.value = game.playerDoctrine || 'balanced';
    budgetMilitaryEl.value = String(game.playerBudget?.military ?? 45);
    budgetScienceEl.value = String(game.playerBudget?.science ?? 25);
    budgetCivilEl.value = String(game.playerBudget?.civil ?? 30);
    updateBudgetReadout();
    appendLog('Campaign restored from local save.');
    render();
  } catch {
    appendLog('Failed to load save data.');
    renderEventLog();
  }
}

function resetGame() {
  stopAutoRun();
  game = createInitialState(startStateEl.value || 'TX');
  doctrineEl.value = 'balanced';
  budgetMilitaryEl.value = '45';
  budgetScienceEl.value = '25';
  budgetCivilEl.value = '30';
  updateBudgetReadout();
  appendLog('Fresh campaign initialized.');
  render();
}

function toggleAutoRun() {
  if (autoRunHandle) {
    stopAutoRun();
    return;
  }

  autoRunHandle = setInterval(() => {
    if (game.status === 'defeat' || game.status === 'victory') {
      stopAutoRun();
      return;
    }
    runTurn();
  }, 1300);

  autoRunBtn.textContent = 'Auto Run: On';
}

function stopAutoRun() {
  if (autoRunHandle) {
    clearInterval(autoRunHandle);
    autoRunHandle = null;
  }
  autoRunBtn.textContent = 'Auto Run: Off';
}

function populateStartStates() {
  startStateEl.innerHTML = STATE_DATA
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((state) => `<option value="${state.id}">${state.name} (${state.id})</option>`)
    .join('');
  startStateEl.value = 'TX';
}

function wireEvents() {
  startGameBtn.addEventListener('click', () => {
    resetGame();
  });

  doctrineEl.addEventListener('change', () => {
    game.playerDoctrine = doctrineEl.value;
    appendLog(`Doctrine switched to ${doctrineEl.options[doctrineEl.selectedIndex].text}.`);
    renderEventLog();
  });

  [budgetMilitaryEl, budgetScienceEl, budgetCivilEl].forEach((input) => {
    input.addEventListener('input', updateBudgetReadout);
  });

  launchOffensiveBtn.addEventListener('click', () => {
    if (offensiveTargetEl.disabled) return;
    game.queuedOffensive = offensiveTargetEl.value;
    const target = game.territories[game.queuedOffensive];
    if (target) {
      appendLog(`Offensive queued toward ${target.name}.`);
      renderEventLog();
    }
  });

  endTurnBtn.addEventListener('click', runTurn);
  autoRunBtn.addEventListener('click', toggleAutoRun);
  saveStateBtn.addEventListener('click', saveGame);
  loadStateBtn.addEventListener('click', loadGame);
  resetStateBtn.addEventListener('click', resetGame);
}

function init() {
  populateStartStates();
  game = createInitialState(startStateEl.value || 'TX');
  updateBudgetReadout();
  calculateFrontlines();
  wireEvents();
  render();
}

init();
