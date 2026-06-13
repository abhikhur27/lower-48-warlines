(() => {
  'use strict';

  const STORAGE_KEY = 'abhi_state_war_sim_campaign_v3';
  const SAVE_VERSION = 4;
  const DEFAULT_RULER_NAME = 'Abhi the Strategist';

  const CONTIGUOUS_FIPS = new Set([
    '01', '04', '05', '06', '08', '09', '10', '12', '13', '16', '17', '18', '19', '20', '21', '22', '23', '24',
    '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42',
    '44', '45', '46', '47', '48', '49', '50', '51', '53', '54', '55', '56',
  ]);

  const STATE_ABBR_BY_FIPS = {
    '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC',
    '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY',
    '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS', '29': 'MO', '30': 'MT',
    '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH',
    '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
    '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI', '56': 'WY',
  };

  const REGION_BY_ABBR = {
    WA: 'West', OR: 'West', CA: 'West', NV: 'West', ID: 'West', UT: 'West', AZ: 'West', MT: 'West', WY: 'West', CO: 'West', NM: 'West',
    ND: 'Plains', SD: 'Plains', NE: 'Plains', KS: 'Plains', OK: 'Plains', TX: 'Plains',
    MN: 'Midwest', IA: 'Midwest', MO: 'Midwest', WI: 'Midwest', IL: 'Midwest', MI: 'Midwest', IN: 'Midwest', OH: 'Midwest',
    AR: 'South', LA: 'South', MS: 'South', KY: 'South', TN: 'South', AL: 'South', WV: 'South', GA: 'South', FL: 'South', SC: 'South', NC: 'South', VA: 'South',
    PA: 'East', NY: 'East', VT: 'East', NH: 'East', ME: 'East', NJ: 'East', DE: 'East', MD: 'East', CT: 'East', RI: 'East', MA: 'East',
  };

  const DOCTRINES = {
    fabian: {
      key: 'fabian',
      label: 'Fabian Attrition',
      attack: 0.92,
      defense: 1.17,
      siege: 0.96,
      supply: 1.15,
      counters: ['encirclement'],
      note: 'Deliberate withdrawals that bleed invaders and preserve supply depth.',
    },
    feigned: {
      key: 'feigned',
      label: 'Feigned Retreat',
      attack: 1.09,
      defense: 0.98,
      siege: 0.99,
      supply: 0.98,
      counters: ['siege', 'march'],
      note: 'Bait-and-counter warfare with sharper offensive swings.',
    },
    siege: {
      key: 'siege',
      label: 'Siegeworks',
      attack: 1.02,
      defense: 1.04,
      siege: 1.18,
      supply: 0.94,
      counters: ['shieldwall'],
      note: 'Engineer-heavy campaigns that accelerate control transfer in hard targets.',
    },
    shieldwall: {
      key: 'shieldwall',
      label: 'Pike Shieldwall',
      attack: 0.95,
      defense: 1.22,
      siege: 0.9,
      supply: 1.02,
      counters: ['feigned'],
      note: 'Disciplined defensive ranks blunt raids and stabilize contested borders.',
    },
    encirclement: {
      key: 'encirclement',
      label: 'Encirclement Drive',
      attack: 1.15,
      defense: 0.9,
      siege: 1.05,
      supply: 0.9,
      counters: ['march'],
      note: 'Fast flank pressure that can collapse enemy fronts if supply holds.',
    },
    march: {
      key: 'march',
      label: 'Scorched March',
      attack: 1.03,
      defense: 0.96,
      siege: 1.08,
      supply: 1.08,
      counters: ['fabian'],
      note: 'Hard campaigning that preserves momentum through harsh logistics.',
    },
  };

  const STATE_BUFF_TEMPLATES = [
    {
      key: 'levy',
      title: 'Drill Muster',
      statLabel: 'Levy Growth',
      summary: 'Rural militias answer muster calls faster than average.',
    },
    {
      key: 'gold',
      title: 'Coin Ledger',
      statLabel: 'Gold Yield',
      summary: 'Stable trade taxation improves treasury reliability.',
    },
    {
      key: 'ration',
      title: 'Granary Ring',
      statLabel: 'Ration Yield',
      summary: 'Stored harvest depth supports sustained campaigns.',
    },
    {
      key: 'defense',
      title: 'Fortified Passes',
      statLabel: 'Defense',
      summary: 'Defensive terrain and fort traditions harden resistance.',
    },
    {
      key: 'siege',
      title: 'Siege Foundries',
      statLabel: 'Siege Strength',
      summary: 'Engineering guilds improve artillery and breach tempo.',
    },
    {
      key: 'supply',
      title: 'Supply Roads',
      statLabel: 'Supply Efficiency',
      summary: 'Road and depot networks reduce campaign waste.',
    },
  ];

  const TRAITS = [
    {
      id: 'granary',
      name: 'Granary Charters',
      regions: ['Plains', 'Midwest', 'South'],
      effect: { levy: 1.0, gold: 1.0, ration: 1.16, defense: 1.0, siege: 1.0, supply: 1.04 },
      summary: 'Richer harvest reserves sustain long campaigns.',
    },
    {
      id: 'mountain',
      name: 'Fierce Mountaineers',
      regions: ['West', 'East', 'South'],
      effect: { levy: 1.02, gold: 0.99, ration: 1.0, defense: 1.08, siege: 0.97, supply: 1.06 },
      summary: 'Excellent defensive doctrine in rough terrain.',
    },
    {
      id: 'ledger',
      name: 'Ledgered Chanceries',
      regions: ['East', 'Midwest'],
      effect: { levy: 1.0, gold: 1.13, ration: 1.02, defense: 1.02, siege: 1.0, supply: 1.01 },
      summary: 'Disciplined civil bureaus produce stable treasury growth.',
    },
    {
      id: 'forge',
      name: 'Ironforge Guilds',
      regions: ['West', 'Midwest', 'Plains'],
      effect: { levy: 1.11, gold: 1.0, ration: 0.98, defense: 1.0, siege: 1.07, supply: 1.0 },
      summary: 'Strong levy reinforcement and siege production.',
    },
    {
      id: 'raiders',
      name: 'Border Raider Hosts',
      regions: ['South', 'West', 'Plains'],
      effect: { levy: 1.07, gold: 0.98, ration: 0.98, defense: 0.98, siege: 1.05, supply: 0.99 },
      summary: 'Fast, aggressive border action with high campaign tempo.',
    },
  ];

  const FACTION_NAME_KITS = {
    West: {
      adjectives: ['Sierra', 'Frontier', 'Red Canyon', 'Sunset Range', 'High Mesa'],
      nouns: ['Marches', 'League', 'Dominion', 'Wardens', 'Compact'],
    },
    Plains: {
      adjectives: ['Prairie', 'Dustwind', 'Longhorn', 'Great River', 'Red Steppe'],
      nouns: ['Confederacy', 'Host', 'Sultanate', 'Union', 'Stewardship'],
    },
    Midwest: {
      adjectives: ['Rust-Belt', 'Lakeshore', 'Iron Prairie', 'Heartland', 'Grain Crown'],
      nouns: ['Hegemony', 'Consortium', 'Tribunal', 'Compact', 'Cantons'],
    },
    South: {
      adjectives: ['Appalachian', 'Cypress', 'Delta', 'Magnolia', 'Gulfward'],
      nouns: ['Clans', 'Bannerholds', 'Regency', 'League', 'Dominion'],
    },
    East: {
      adjectives: ['Granite', 'Atlantic', 'Harbor', 'Charter', 'Old Dominion'],
      nouns: ['Commonwealth', 'Order', 'Ward', 'Synod', 'Hegemony'],
    },
  };

  const FACTION_COLORS = [
    '#c0673f',
    '#5a7d4f',
    '#9c4038',
    '#c79a3a',
    '#4d6f8a',
    '#8a4f6d',
    '#5f5391',
    '#7a5230',
    '#3f8074',
  ];

  const PLAYER_COLOR = '#7c2a24';

  const TERRAIN_BY_REGION = {
    West: 'mountain',
    Plains: 'plains',
    Midwest: 'forest',
    South: 'hills',
    East: 'coastal',
  };

  const TERRAIN_MODIFIERS = {
    plains: { defense: 1.0, supply: 1.03, prosperity: 1.03 },
    coastal: { defense: 1.06, supply: 1.01, prosperity: 1.05 },
    forest: { defense: 1.1, supply: 0.98, prosperity: 1.0 },
    hills: { defense: 1.12, supply: 0.93, prosperity: 0.98 },
    mountain: { defense: 1.17, supply: 0.88, prosperity: 0.96 },
  };

  const MAP_STAGE = document.getElementById('map-stage');
  const SVG = document.getElementById('war-map');
  const MAP_DEFS = document.getElementById('map-defs');
  const CAMERA_GROUP = document.getElementById('camera-group');
  const FILL_LAYER = document.getElementById('state-fill-layer');
  const TERRITORY_LAYER = document.getElementById('territory-layer');
  const FRONTLINE_LAYER = document.getElementById('frontline-layer');
  const BORDER_LAYER = document.getElementById('state-border-layer');
  const FRONTIER_LAYER = document.getElementById('frontier-layer');
  const ORDER_LAYER = document.getElementById('order-layer');
  const CAPITAL_LAYER = document.getElementById('capital-layer');
  const LABEL_LAYER = document.getElementById('state-label-layer');
  const VECTOR_LAYER = document.getElementById('vector-layer');
  const ASH_CANVAS = document.getElementById('ash-canvas');
  const SVGNS = 'http://www.w3.org/2000/svg';

  const EL = {
    rulerName: document.getElementById('ruler-name'),
    startState: document.getElementById('start-state'),
    newCampaign: document.getElementById('new-campaign'),
    playerDoctrine: document.getElementById('player-doctrine'),
    campaignDoctrine: document.getElementById('campaign-doctrine'),
    campaignDoctrineNote: document.getElementById('campaign-doctrine-note'),
    doctrineNote: document.getElementById('doctrine-note'),
    doctrineInline: document.getElementById('doctrine-inline'),
    allocLeviesDec: document.getElementById('alloc-levies-dec'),
    allocLeviesInc: document.getElementById('alloc-levies-inc'),
    allocSiegeDec: document.getElementById('alloc-siege-dec'),
    allocSiegeInc: document.getElementById('alloc-siege-inc'),
    allocCivilDec: document.getElementById('alloc-civil-dec'),
    allocCivilInc: document.getElementById('alloc-civil-inc'),
    allocLeviesTrack: document.getElementById('alloc-levies-track'),
    allocSiegeTrack: document.getElementById('alloc-siege-track'),
    allocCivilTrack: document.getElementById('alloc-civil-track'),
    allocLeviesReadout: document.getElementById('alloc-levies-readout'),
    allocSiegeReadout: document.getElementById('alloc-siege-readout'),
    allocCivilReadout: document.getElementById('alloc-civil-readout'),
    sourceState: document.getElementById('source-state'),
    targetState: document.getElementById('target-state'),
    queueCampaign: document.getElementById('queue-campaign'),
    advanceSeason: document.getElementById('advance-season'),
    toggleAuto: document.getElementById('toggle-auto'),
    conquestAdvisor: document.getElementById('conquest-advisor'),
    actionQueue: document.getElementById('action-queue'),
    chronicleLog: document.getElementById('chronicle-log'),
    metricLevies: document.getElementById('metric-levies'),
    metricGold: document.getElementById('metric-gold'),
    metricRations: document.getElementById('metric-rations'),
    metricSeason: document.getElementById('metric-season'),
    metricRealm: document.getElementById('metric-realm'),
    metricRuler: document.getElementById('metric-ruler'),
    metricHoldings: document.getElementById('metric-holdings'),
    metricStatus: document.getElementById('metric-status'),
    theaterTitle: document.getElementById('theater-title'),
    theaterOwner: document.getElementById('theater-owner'),
    theaterBuff: document.getElementById('theater-buff'),
    theaterPressureDec: document.getElementById('theater-pressure-dec'),
    theaterPressureInc: document.getElementById('theater-pressure-inc'),
    theaterPressureTrack: document.getElementById('theater-pressure-track'),
    theaterPressureReadout: document.getElementById('theater-pressure-readout'),
    theaterControlLedger: document.getElementById('theater-control-ledger'),
    openSettings: document.getElementById('open-settings'),
    closeSettings: document.getElementById('close-settings'),
    settingsOverlay: document.getElementById('settings-overlay'),
    exportSave: document.getElementById('export-save'),
    exportBrief: document.getElementById('export-brief'),
    importSave: document.getElementById('import-save'),
    importFile: document.getElementById('import-file'),
    wipeSave: document.getElementById('wipe-save'),
    editorSeason: document.getElementById('editor-season'),
    editorPlayerLevies: document.getElementById('editor-player-levies'),
    editorPlayerGold: document.getElementById('editor-player-gold'),
    editorPlayerRations: document.getElementById('editor-player-rations'),
    editorRulerName: document.getElementById('editor-ruler-name'),
    editorPlayerDoctrine: document.getElementById('editor-player-doctrine'),
    applySaveEditor: document.getElementById('apply-save-editor'),
    tutorialOverlay: document.getElementById('tutorial-overlay'),
    tutorialStepCount: document.getElementById('tutorial-step-count'),
    tutorialTitle: document.getElementById('tutorial-title'),
    tutorialText: document.getElementById('tutorial-text'),
    tutorialRulerName: document.getElementById('tutorial-ruler-name'),
    tutorialStartState: document.getElementById('tutorial-start-state'),
    tutorialRetreat: document.getElementById('tutorial-retreat'),
    tutorialAdvance: document.getElementById('tutorial-advance'),
    tutorialFinish: document.getElementById('tutorial-finish'),
    hoverHelp: document.getElementById('hover-help'),
    standingsList: document.getElementById('standings-list'),
    strategistQuote: document.getElementById('strategist-quote'),
    campaignObjective: document.getElementById('campaign-objective'),
    loopSteps: document.getElementById('loop-steps'),
    campaignBanner: document.getElementById('campaign-banner'),
    bannerTitle: document.getElementById('banner-title'),
    bannerText: document.getElementById('banner-text'),
    bannerDismiss: document.getElementById('banner-dismiss'),
  };

  // Sun Tzu (Lionel Giles translation, public domain) — rotating war-room counsel.
  const ART_OF_WAR = [
    'If you know the enemy and know yourself, you need not fear a hundred battles.',
    'All warfare is based on deception.',
    'The supreme art of war is to subdue the enemy without fighting.',
    'He will win who knows when to fight and when not to fight.',
    'Attack him where he is unprepared; appear where you are not expected.',
    'Rapidity is the essence of war.',
    'In the midst of chaos, there is also opportunity.',
    'Move not unless you see an advantage; use not your troops unless there is something to be gained.',
    'The good fighter secures himself against defeat, then awaits his enemy’s undoing.',
    'Opportunities multiply as they are seized.',
    'Hold out baits to entice the enemy. Feign disorder, and crush him.',
    'The skilful leader subdues the enemy’s troops without any fighting.',
  ];

  const tutorialSteps = [
    {
      title: 'I. Lay Your Plans',
      text: '“The art of war is of vital importance to the State.” Name your ruler and choose an ancestral realm. Drag the map to pan, scroll to zoom. Your realm glows; rival banners ring the frontier.',
    },
    {
      title: 'II. Choose Where to Strike',
      text: '“Attack him where he is unprepared; appear where you are not expected.” In the War Council: pick a frontline realm to attack FROM, then an adjacent enemy to STRIKE. A reticle and arrow mark your target on the map.',
    },
    {
      title: 'III. Shift the Border',
      text: '“The clever combatant imposes his will on the enemy.” Declare the maneuver and advance the season. Each season, your colour bleeds across the contested state and the front line physically moves toward the enemy capital.',
    },
    {
      title: 'IV. Win the Campaign',
      text: '“In war, let your great object be victory.” Keep supply lines connected to your capital, hold your levies and rations, and press until states flip. Unite all 48 states to claim continental dominion.',
    },
  ];

  const mapModel = {
    states: [],
    statesById: {},
    projection: null,
    pathGenerator: null,
    bounds: { minX: 0, minY: 0, maxX: 1200, maxY: 760 },
  };

  let campaign = null;
  let autoTimer = null;
  let tutorialIndex = 0;

  let camera = { x: 0, y: 0, scale: 1 };
  let dragging = false;
  let dragStart = { x: 0, y: 0, camX: 0, camY: 0 };

  const particles = [];
  let animationHandle = null;
  let lastFrameTime = 0;
  const TRACK_SEGMENTS = 10;
  const ALLOCATION_STEP = 10;
  const PRESSURE_STEP = 10;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function shuffle(list) {
    const next = [...list];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
  }

  function shortNumber(value) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return String(Math.round(value));
  }

  function toFixedPercent(value) {
    return `${Math.round(value)}%`;
  }

  function sanitizeRulerName(raw) {
    const normalized = String(raw ?? '').replace(/\s+/g, ' ').trim();
    return normalized || DEFAULT_RULER_NAME;
  }

  function signedPercentFromMultiplier(multiplier) {
    const delta = Math.round((multiplier - 1) * 100);
    return `${delta >= 0 ? '+' : ''}${delta}%`;
  }

  function doctrineStatsLine(doctrine) {
    return [
      `ATK ${signedPercentFromMultiplier(doctrine.attack)}`,
      `DEF ${signedPercentFromMultiplier(doctrine.defense)}`,
      `SIEGE ${signedPercentFromMultiplier(doctrine.siege)}`,
      `SUPPLY ${signedPercentFromMultiplier(doctrine.supply)}`,
    ].join(' | ');
  }

  function doctrineSummary(doctrine) {
    return `${doctrine.note} ${doctrineStatsLine(doctrine)}.`;
  }

  function stateBuffForMapState(mapState) {
    const idSeed = Number(mapState.id);
    const template = STATE_BUFF_TEMPLATES[idSeed % STATE_BUFF_TEMPLATES.length];
    const power = 4 + ((idSeed * 7 + mapState.name.length) % 9);
    const multiplier = 1 + power / 100;
    const effect = { levy: 1, gold: 1, ration: 1, defense: 1, siege: 1, supply: 1 };
    effect[template.key] = multiplier;
    return {
      key: template.key,
      name: `${mapState.name} ${template.title}`,
      valuePct: power,
      effect,
      summary: `${template.summary} (+${power}% ${template.statLabel}).`,
    };
  }

  function doctrineAdvantage(attackerKey, defenderKey) {
    if (attackerKey === defenderKey) return 1;
    const attacker = DOCTRINES[attackerKey];
    const defender = DOCTRINES[defenderKey];
    if (!attacker || !defender) return 1;
    if ((attacker.counters || []).includes(defenderKey)) return 1.12;
    if ((defender.counters || []).includes(attackerKey)) return 0.89;
    return 1;
  }

  async function loadMap() {
    let topo = window.__US_STATES_TOPOJSON__;
    if (!topo) {
      try {
        topo = await d3.json('data/states-10m.json');
      } catch (error) {
        throw new Error('Map data could not be loaded. Ensure data/states-10m.js is present for file:// browser runs.');
      }
    }
    const stateObject = topo.objects.states;
    mapModel.topo = topo;
    mapModel.statesObject = stateObject;
    const allFeatures = topojson.feature(topo, stateObject).features;
    const geometries = stateObject.geometries;
    const geometryNeighbors = topojson.neighbors(geometries);

    const contiguousFeatures = allFeatures.filter((feature) => {
      const id = String(feature.id).padStart(2, '0');
      return CONTIGUOUS_FIPS.has(id);
    });

    const featureCollection = { type: 'FeatureCollection', features: contiguousFeatures };
    mapModel.projection = d3.geoAlbersUsa().fitExtent([[70, 60], [1130, 700]], featureCollection);
    mapModel.pathGenerator = d3.geoPath(mapModel.projection);

    const fipsByIndex = geometries.map((geometry) => String(geometry.id).padStart(2, '0'));
    const neighborById = {};
    fipsByIndex.forEach((fips, index) => {
      if (!CONTIGUOUS_FIPS.has(fips)) return;
      const neighbors = geometryNeighbors[index]
        .map((neighborIndex) => fipsByIndex[neighborIndex])
        .filter((neighborFips) => CONTIGUOUS_FIPS.has(neighborFips));
      neighborById[fips] = neighbors;
    });

    mapModel.states = contiguousFeatures.map((feature) => {
      const id = String(feature.id).padStart(2, '0');
      const abbr = STATE_ABBR_BY_FIPS[id];
      const centroid = mapModel.pathGenerator.centroid(feature);
      const bounds = mapModel.pathGenerator.bounds(feature);
      const region = REGION_BY_ABBR[abbr] || 'East';
      const terrain = TERRAIN_BY_REGION[region];
      const templateState = {
        id,
        abbr,
        name: feature.properties.name,
        region,
        terrain,
      };
      return {
        ...templateState,
        neighbors: neighborById[id] || [],
        path: mapModel.pathGenerator(feature),
        centroid,
        bounds,
        buff: stateBuffForMapState(templateState),
      };
    });

    mapModel.statesById = Object.fromEntries(mapModel.states.map((state) => [state.id, state]));
  }

  function renderMapScaffold() {
    const fillFragment = document.createDocumentFragment();
    const labelFragment = document.createDocumentFragment();
    const clipFragment = document.createDocumentFragment();

    mapModel.states.forEach((state) => {
      const fillPath = document.createElementNS(SVGNS, 'path');
      fillPath.id = `state-path-${state.id}`;
      fillPath.setAttribute('d', state.path);
      fillPath.setAttribute('data-state-id', state.id);
      fillPath.classList.add('state-shape');
      fillPath.addEventListener('click', (event) => {
        event.stopPropagation();
        campaign.selectedStateId = state.id;
        if (campaign.statesById[state.id]) {
          campaign.statesById[state.id].pressure = campaign.statesById[state.id].pressure || 50;
        }
        renderAll();
      });
      fillFragment.append(fillPath);

      const clipPath = document.createElementNS(SVGNS, 'clipPath');
      clipPath.id = `clip-state-${state.id}`;
      clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
      clipPath.setAttribute('data-state-clip', 'true');
      const clipShape = document.createElementNS(SVGNS, 'path');
      clipShape.setAttribute('d', state.path);
      clipPath.append(clipShape);
      clipFragment.append(clipPath);

      const label = document.createElementNS(SVGNS, 'text');
      label.setAttribute('x', String(state.centroid[0]));
      label.setAttribute('y', String(state.centroid[1]));
      label.setAttribute('dy', '0.35em');
      label.classList.add('state-label');
      label.textContent = state.abbr;
      labelFragment.append(label);
    });

    FILL_LAYER.append(fillFragment);
    LABEL_LAYER.append(labelFragment);
    MAP_DEFS.append(clipFragment);
  }

  function stateDistance(fromId, toId) {
    if (fromId === toId) return 0;
    const queue = [{ id: fromId, depth: 0 }];
    const seen = new Set([fromId]);
    while (queue.length) {
      const node = queue.shift();
      const neighbors = mapModel.statesById[node.id].neighbors;
      for (const neighborId of neighbors) {
        if (seen.has(neighborId)) continue;
        if (neighborId === toId) return node.depth + 1;
        seen.add(neighborId);
        queue.push({ id: neighborId, depth: node.depth + 1 });
      }
    }
    return Number.POSITIVE_INFINITY;
  }

  function chooseFactionSeeds(candidateIds, count) {
    const shuffledIds = shuffle(candidateIds);
    const seeds = [];
    for (const candidateId of shuffledIds) {
      if (seeds.length >= count) break;
      if (!seeds.length) {
        seeds.push(candidateId);
        continue;
      }
      const minDistance = Math.min(...seeds.map((seedId) => stateDistance(seedId, candidateId)));
      if (minDistance >= 3) seeds.push(candidateId);
    }

    let index = 0;
    while (seeds.length < count && index < shuffledIds.length) {
      if (!seeds.includes(shuffledIds[index])) seeds.push(shuffledIds[index]);
      index += 1;
    }
    return seeds;
  }

  function expandFactionClusters(seedIds, allIds) {
    const clusters = seedIds.map((seed) => new Set([seed]));
    const unassigned = new Set(allIds.filter((stateId) => !seedIds.includes(stateId)));

    let loops = 0;
    while (unassigned.size && loops < 500) {
      loops += 1;
      let progressed = false;

      clusters.forEach((cluster) => {
        const frontier = [];
        cluster.forEach((stateId) => {
          mapModel.statesById[stateId].neighbors.forEach((neighborId) => {
            if (unassigned.has(neighborId)) frontier.push(neighborId);
          });
        });
        if (!frontier.length) return;
        const selected = randomItem(frontier);
        cluster.add(selected);
        unassigned.delete(selected);
        progressed = true;
      });

      if (!progressed) {
        [...unassigned].forEach((stateId) => {
          let nearestClusterIndex = 0;
          let nearestDistance = Number.POSITIVE_INFINITY;
          clusters.forEach((cluster, clusterIndex) => {
            const distances = [...cluster].map((clusterStateId) => stateDistance(clusterStateId, stateId));
            const candidateDistance = Math.min(...distances);
            if (candidateDistance < nearestDistance) {
              nearestDistance = candidateDistance;
              nearestClusterIndex = clusterIndex;
            }
          });
          clusters[nearestClusterIndex].add(stateId);
          unassigned.delete(stateId);
        });
      }
    }

    return clusters.map((cluster) => [...cluster]);
  }

  function pickTrait(region) {
    const options = TRAITS.filter((trait) => trait.regions.includes(region));
    return randomItem(options.length ? options : TRAITS);
  }

  function pickFactionName(region, used) {
    const kit = FACTION_NAME_KITS[region] || FACTION_NAME_KITS.East;
    for (let i = 0; i < 24; i += 1) {
      const candidate = `The ${randomItem(kit.adjectives)} ${randomItem(kit.nouns)}`;
      if (!used.has(candidate)) {
        used.add(candidate);
        return candidate;
      }
    }
    const fallback = `The ${region} Ward ${used.size + 1}`;
    used.add(fallback);
    return fallback;
  }

  function initializeCampaign(startStateId, rulerName = DEFAULT_RULER_NAME) {
    const playerState = mapModel.statesById[startStateId];
    const playerRegion = playerState.region;
    const playerTrait = pickTrait(playerRegion);
    const cleanRulerName = sanitizeRulerName(rulerName);

    const factionById = {
      player: {
        id: 'player',
        name: `${playerState.name} Crown`,
        rulerName: cleanRulerName,
        color: PLAYER_COLOR,
        traitId: playerTrait.id,
        traitName: playerTrait.name,
        traitSummary: playerTrait.summary,
        traitEffect: playerTrait.effect,
        isPlayer: true,
        aggression: 0,
        doctrine: 'fabian',
        capitalStateId: startStateId,
        statesOwned: 0,
        power: 0,
        resources: { gold: 340, levies: 260, rations: 240 },
      },
    };

    const nonPlayerStateIds = mapModel.states.map((state) => state.id).filter((stateId) => stateId !== startStateId);
    const factionCount = clamp(Math.round(nonPlayerStateIds.length / 6.5), 6, 9);
    const seeds = chooseFactionSeeds(nonPlayerStateIds, factionCount);
    const clusters = expandFactionClusters(seeds, nonPlayerStateIds);
    const assignedFactionByStateId = { [startStateId]: 'player' };
    const usedNames = new Set();

    clusters.forEach((cluster, clusterIndex) => {
      const factionId = `ai-${clusterIndex + 1}`;
      const regionTally = {};
      cluster.forEach((stateId) => {
        const region = mapModel.statesById[stateId].region;
        regionTally[region] = (regionTally[region] || 0) + 1;
      });
      const majorRegion = Object.entries(regionTally).sort((a, b) => b[1] - a[1])[0][0];
      const trait = pickTrait(majorRegion);
      const capitalStateId = randomItem(cluster);

      factionById[factionId] = {
        id: factionId,
        name: pickFactionName(majorRegion, usedNames),
        color: FACTION_COLORS[clusterIndex % FACTION_COLORS.length],
        traitId: trait.id,
        traitName: trait.name,
        traitSummary: trait.summary,
        traitEffect: trait.effect,
        isPlayer: false,
        aggression: 0.38 + Math.random() * 0.44,
        doctrine: randomItem(Object.keys(DOCTRINES)),
        capitalStateId,
        statesOwned: 0,
        power: 0,
        resources: {
          gold: 280 + cluster.length * randInt(24, 40),
          levies: 220 + cluster.length * randInt(18, 30),
          rations: 200 + cluster.length * randInt(14, 24),
        },
      };

      cluster.forEach((stateId) => {
        assignedFactionByStateId[stateId] = factionId;
      });
    });

    const stateById = {};
    mapModel.states.forEach((mapState) => {
      const ownerFactionId = assignedFactionByStateId[mapState.id];
      const terrainFactor = TERRAIN_MODIFIERS[mapState.terrain];
      const prosperityBase = mapState.region === 'East' ? 78 : mapState.region === 'Midwest' ? 74 : mapState.region === 'South' ? 72 : mapState.region === 'Plains' ? 69 : 66;
      const prosperity = clamp(Math.round((prosperityBase + randInt(-8, 8)) * terrainFactor.prosperity), 45, 95);
      stateById[mapState.id] = {
        id: mapState.id,
        abbr: mapState.abbr,
        name: mapState.name,
        region: mapState.region,
        terrain: mapState.terrain,
        buff: mapState.buff ? { ...mapState.buff, effect: { ...mapState.buff.effect } } : null,
        ownerFactionId,
        levies: clamp(Math.round(prosperity * 1.55 + randInt(8, 36)), 40, 300),
        supply: clamp(Math.round(58 * terrainFactor.supply + randInt(-8, 8)), 18, 120),
        prosperity,
        fort: clamp(Math.round(1 + (terrainFactor.defense - 1) * 8 + Math.random() * 2), 0, 6),
        pressure: 50,
        neighbors: [...mapState.neighbors],
        centroid: [...mapState.centroid],
        bounds: mapState.bounds ? [[...mapState.bounds[0]], [...mapState.bounds[1]]] : [[0, 0], [0, 0]],
        control: { [ownerFactionId]: 100 },
        frontline: false,
      };
    });

    const nextCampaign = {
      version: SAVE_VERSION,
      season: 1,
      status: 'Live',
      playerFactionId: 'player',
      selectedStateId: startStateId,
      rulerName: cleanRulerName,
      allocations: { levies: 50, siege: 30, civil: 20 },
      queue: [],
      chronicle: [`Season 1: ${cleanRulerName} of ${factionById.player.name} claims ${playerState.name} and calls banners to war.`],
      factionsById: factionById,
      statesById: stateById,
      vectors: [],
      camera: { x: 0, y: 0, scale: 1 },
    };

    refreshOwnershipAndFrontline(nextCampaign);
    recalcFactionPower(nextCampaign);
    return nextCampaign;
  }

  function normalizeControl(controlObj, ownerId) {
    const next = {};
    let total = 0;
    Object.entries(controlObj).forEach(([factionId, value]) => {
      if (value <= 0.05) return;
      next[factionId] = value;
      total += value;
    });
    if (total <= 0) {
      next[ownerId] = 100;
      total = 100;
    }
    Object.keys(next).forEach((factionId) => {
      next[factionId] = (next[factionId] / total) * 100;
    });
    return next;
  }

  function dominantControl(stateRecord) {
    const sorted = Object.entries(stateRecord.control).sort((a, b) => b[1] - a[1]);
    return { factionId: sorted[0][0], share: sorted[0][1] };
  }

  function transferControl(stateRecord, attackerId, shift) {
    const nextControl = { ...stateRecord.control };
    if (!nextControl[attackerId]) nextControl[attackerId] = 0;
    if (shift > 0) {
      let remaining = shift;
      const victims = Object.entries(nextControl).filter(([id]) => id !== attackerId).sort((a, b) => b[1] - a[1]);
      victims.forEach(([victimId]) => {
        if (remaining <= 0) return;
        const taken = Math.min(nextControl[victimId], remaining);
        nextControl[victimId] -= taken;
        nextControl[attackerId] += taken;
        remaining -= taken;
      });
    } else if (shift < 0) {
      const retreat = Math.abs(shift);
      const defenders = Object.entries(nextControl).filter(([id]) => id !== attackerId).sort((a, b) => b[1] - a[1]);
      if (defenders.length) {
        const beneficiaryId = defenders[0][0];
        const returned = Math.min(nextControl[attackerId], retreat);
        nextControl[attackerId] -= returned;
        nextControl[beneficiaryId] += returned;
      }
    }
    stateRecord.control = normalizeControl(nextControl, stateRecord.ownerFactionId);
    const dominant = dominantControl(stateRecord);
    stateRecord.ownerFactionId = dominant.factionId;
  }

  function refreshOwnershipAndFrontline(c) {
    Object.values(c.factionsById).forEach((faction) => {
      faction.statesOwned = 0;
    });

    Object.values(c.statesById).forEach((stateRecord) => {
      stateRecord.control = normalizeControl(stateRecord.control, stateRecord.ownerFactionId);
      const dominant = dominantControl(stateRecord);
      stateRecord.ownerFactionId = dominant.factionId;
      if (c.factionsById[stateRecord.ownerFactionId]) {
        c.factionsById[stateRecord.ownerFactionId].statesOwned += 1;
      }
    });

    Object.values(c.statesById).forEach((stateRecord) => {
      stateRecord.frontline = stateRecord.neighbors.some((neighborId) => c.statesById[neighborId].ownerFactionId !== stateRecord.ownerFactionId);
    });

    Object.values(c.factionsById).forEach((faction) => {
      if (faction.statesOwned <= 0) return;
      if (!c.statesById[faction.capitalStateId] || c.statesById[faction.capitalStateId].ownerFactionId !== faction.id) {
        const replacement = Object.values(c.statesById)
          .filter((stateRecord) => stateRecord.ownerFactionId === faction.id)
          .sort((a, b) => b.prosperity - a.prosperity)[0];
        if (replacement) faction.capitalStateId = replacement.id;
      }
    });
  }

  function recalcFactionPower(c) {
    Object.values(c.factionsById).forEach((faction) => {
      if (faction.statesOwned <= 0) {
        faction.power = 0;
        return;
      }
      const holdings = Object.values(c.statesById).filter((stateRecord) => stateRecord.ownerFactionId === faction.id);
      const levySum = holdings.reduce((sum, stateRecord) => sum + stateRecord.levies, 0);
      const supplySum = holdings.reduce((sum, stateRecord) => sum + stateRecord.supply, 0);
      faction.power = Math.round(
        levySum * 0.57
        + supplySum * 0.35
        + faction.resources.gold * 0.17
        + faction.resources.rations * 0.12
        + holdings.length * 32
      );
    });
  }

  function isSupplyConnected(c, factionId, stateId) {
    const faction = c.factionsById[factionId];
    if (!faction || faction.statesOwned <= 0) return false;
    if (faction.capitalStateId === stateId) return true;

    const queue = [faction.capitalStateId];
    const seen = new Set([faction.capitalStateId]);

    while (queue.length) {
      const currentId = queue.shift();
      const currentState = c.statesById[currentId];
      currentState.neighbors.forEach((neighborId) => {
        if (seen.has(neighborId)) return;
        const neighborState = c.statesById[neighborId];
        if (neighborState.ownerFactionId !== factionId) return;
        if (neighborId === stateId) {
          seen.add(neighborId);
          queue.length = 0;
          return;
        }
        seen.add(neighborId);
        queue.push(neighborId);
      });
      if (seen.has(stateId)) return true;
    }

    return seen.has(stateId);
  }

  function visibleStateSet(c) {
    const set = new Set();
    Object.values(c.statesById).forEach((stateRecord) => {
      if (stateRecord.ownerFactionId === c.playerFactionId) {
        set.add(stateRecord.id);
        stateRecord.neighbors.forEach((neighborId) => set.add(neighborId));
      }
    });
    return set;
  }

  function averageStateBuffMultiplier(states, key) {
    if (!states.length) return 1;
    const sum = states.reduce((acc, stateRecord) => acc + (stateRecord.buff?.effect?.[key] || 1), 0);
    return sum / states.length;
  }

  function produceEconomy(c) {
    Object.values(c.factionsById).forEach((faction) => {
      if (faction.statesOwned <= 0) return;
      const states = Object.values(c.statesById).filter((stateRecord) => stateRecord.ownerFactionId === faction.id);

      let levyShare;
      let siegeShare;
      let civilShare;

      if (faction.isPlayer) {
        levyShare = c.allocations.levies / 100;
        siegeShare = c.allocations.siege / 100;
        civilShare = c.allocations.civil / 100;
      } else {
        levyShare = clamp(0.34 + faction.aggression * 0.4, 0.3, 0.74);
        siegeShare = clamp(0.16 + faction.aggression * 0.22, 0.12, 0.42);
        civilShare = clamp(1 - levyShare - siegeShare, 0.08, 0.34);
      }

      const trait = faction.traitEffect;
      const buffLevy = averageStateBuffMultiplier(states, 'levy');
      const buffGold = averageStateBuffMultiplier(states, 'gold');
      const buffRation = averageStateBuffMultiplier(states, 'ration');
      const buffSupply = averageStateBuffMultiplier(states, 'supply');
      const civicIndex = states.reduce((sum, stateRecord) => {
        const terrainProsperity = TERRAIN_MODIFIERS[stateRecord.terrain].prosperity;
        return sum + stateRecord.prosperity * terrainProsperity;
      }, 0);

      const levyGain = civicIndex * 0.2 * levyShare * trait.levy * buffLevy;
      const goldGain = civicIndex * (0.2 + 0.3 * civilShare) * trait.gold * buffGold;
      const rationGain = civicIndex * (0.17 + 0.25 * civilShare) * trait.ration * buffRation;
      faction.resources.levies = clamp(faction.resources.levies + levyGain, 0, 999999);
      faction.resources.gold = clamp(faction.resources.gold + goldGain, 0, 999999);
      faction.resources.rations = clamp(faction.resources.rations + rationGain, 0, 999999);

      const perStateLevies = levyGain / Math.max(states.length, 1);
      const perStateSupply = rationGain / Math.max(states.length, 1) / 16;

      states.forEach((stateRecord) => {
        stateRecord.levies = clamp(stateRecord.levies + Math.round(perStateLevies * (0.72 + Math.random() * 0.5)), 8, 460);
        stateRecord.supply = clamp(
          stateRecord.supply + Math.round(perStateSupply * buffSupply * (0.84 + Math.random() * 0.45)),
          10,
          140,
        );
      });
    });
  }

  function estimateCampaign(c, action) {
    const source = c.statesById[action.sourceId];
    const target = c.statesById[action.targetId];
    const attackerFaction = c.factionsById[action.attackerFactionId];
    const defenderFaction = c.factionsById[target.ownerFactionId];
    const attackerDoctrine = DOCTRINES[action.doctrineKey];
    const defenderDoctrineKey = defenderFaction.doctrine;
    const defenderDoctrine = DOCTRINES[defenderDoctrineKey];

    const sourceConnected = isSupplyConnected(c, attackerFaction.id, source.id);
    const supplyFactor = sourceConnected ? 1.0 : 0.7;
    const rationPressure = clamp((attackerFaction.resources.rations + source.supply * 2) / Math.max(attackerFaction.statesOwned * 170, 1), 0.56, 1.28);
    const doctrineEdge = doctrineAdvantage(action.doctrineKey, defenderDoctrineKey);
    const terrainDefense = TERRAIN_MODIFIERS[target.terrain].defense;
    const sourceBuff = source.buff?.effect || {};
    const targetBuff = target.buff?.effect || {};
    const attackBuff = sourceBuff.siege || 1;
    const defenseBuff = targetBuff.defense || 1;
    const supplyBuff = sourceBuff.supply || 1;

    const attackPower = source.levies
      * attackerDoctrine.attack
      * attackerFaction.traitEffect.levy
      * attackerDoctrine.supply
      * supplyFactor
      * rationPressure
      * doctrineEdge
      * attackBuff
      * supplyBuff;

    const defensePower = target.levies
      * defenderDoctrine.defense
      * defenderFaction.traitEffect.defense
      * terrainDefense
      * (1 + target.fort * 0.06)
      * defenseBuff;

    return {
      ratio: attackPower / Math.max(defensePower, 1),
      sourceConnected,
      defenderDoctrineKey,
    };
  }

  function predictControlShift(c, action, estimate) {
    const source = c.statesById[action.sourceId];
    const attackerFaction = c.factionsById[action.attackerFactionId];
    const doctrine = DOCTRINES[action.doctrineKey];
    if (!source || !attackerFaction || !doctrine || !estimate) return 0;
    const intensity = clamp(action.intensity ?? source.pressure ?? 50, 0, 100);
    const intensityFactor = 0.75 + intensity / 100 * 0.5;
    const shiftBase = (estimate.ratio - 0.86) * 15 * doctrine.siege * attackerFaction.traitEffect.siege * intensityFactor;
    const disconnectedPenalty = estimate.sourceConnected ? 0 : 3;
    return Math.round(clamp(shiftBase - disconnectedPenalty, -11, 20));
  }

  function queueAttackVector(c, sourceId, targetId, attackerFactionId) {
    const source = c.statesById[sourceId];
    const target = c.statesById[targetId];
    c.vectors.push({
      from: [...source.centroid],
      to: [...target.centroid],
      ttl: 90,
      maxTtl: 90,
      attackerFactionId,
    });
  }

  function executeCampaignAction(c, action, visibilitySetForFog) {
    const source = c.statesById[action.sourceId];
    const target = c.statesById[action.targetId];
    if (!source || !target) return null;
    if (source.ownerFactionId !== action.attackerFactionId) return null;
    if (target.ownerFactionId === action.attackerFactionId) return null;
    if (!source.neighbors.includes(target.id)) return null;
    if (source.levies < 22) return null;

    const attackerFaction = c.factionsById[action.attackerFactionId];
    const defenderFaction = c.factionsById[target.ownerFactionId];
    const doctrine = DOCTRINES[action.doctrineKey];

    const estimate = estimateCampaign(c, action);
    const intensity = clamp(action.intensity ?? 50, 0, 100);
    const intensityFactor = 0.75 + intensity / 100 * 0.5;
    const shiftBase = (estimate.ratio - 0.86) * 15 * doctrine.siege * attackerFaction.traitEffect.siege * intensityFactor;
    const disconnectedPenalty = estimate.sourceConnected ? 0 : 3;
    const randomSwing = 0.9 + Math.random() * 0.22;
    let controlShift = Math.round(clamp((shiftBase - disconnectedPenalty) * randomSwing, -11, 20));

    if ((target.control[target.ownerFactionId] || 0) < 18 && controlShift < 0) {
      controlShift = Math.min(0, controlShift + 3);
    }

    const commitment = Math.max(24, source.levies * 0.4);
    const attackerLossBase = commitment * (0.12 + 0.21 * (1 / Math.max(estimate.ratio, 0.35)));
    const defenderLossBase = commitment * (0.1 + 0.24 * Math.max(estimate.ratio, 0.48));
    const attritionLoss = estimate.sourceConnected ? 0 : commitment * 0.08;

    const attackerLoss = Math.max(8, attackerLossBase + attritionLoss);
    const defenderLoss = Math.max(6, defenderLossBase * (controlShift > 0 ? 1.06 : 0.79));

    source.levies = clamp(source.levies - Math.round(attackerLoss), 6, 520);
    target.levies = clamp(target.levies - Math.round(defenderLoss), 6, 520);
    source.supply = clamp(source.supply - Math.round(4 + (estimate.sourceConnected ? 2 : 9)), 8, 140);
    target.supply = clamp(target.supply - Math.round(controlShift > 0 ? 6 : 3), 8, 140);

    attackerFaction.resources.rations = clamp(attackerFaction.resources.rations - attackerLoss * 0.45, 0, 999999);
    defenderFaction.resources.rations = clamp(defenderFaction.resources.rations - defenderLoss * 0.28, 0, 999999);
    attackerFaction.resources.levies = clamp(attackerFaction.resources.levies - attackerLoss * 0.52, 0, 999999);
    defenderFaction.resources.levies = clamp(defenderFaction.resources.levies - defenderLoss * 0.33, 0, 999999);

    const ownerBefore = target.ownerFactionId;
    const attackerShareBefore = target.control[action.attackerFactionId] || 0;
    transferControl(target, action.attackerFactionId, controlShift);
    const ownerAfter = target.ownerFactionId;
    const attackerShareAfter = target.control[action.attackerFactionId] || 0;

    queueAttackVector(c, source.id, target.id, action.attackerFactionId);

    const attackerVisible = visibilitySetForFog.has(source.id) || visibilitySetForFog.has(target.id);
    if (!attackerVisible && !attackerFaction.isPlayer) {
      return `Rumors of fierce fighting spread beyond ${target.region}. The map's ink shifts overnight.`;
    }

    if (ownerBefore !== ownerAfter) {
      return `${attackerFaction.name} captures ${target.name} from ${defenderFaction.name} (${attackerShareBefore.toFixed(1)}% -> ${attackerShareAfter.toFixed(1)}% control).`;
    }
    if (controlShift > 0) {
      return `${attackerFaction.name} pushes deeper into ${target.name} (${attackerShareBefore.toFixed(1)}% -> ${attackerShareAfter.toFixed(1)}%).`;
    }
    return `${attackerFaction.name} is repelled at ${target.name} after heavy losses.`;
  }

  function chooseAIDoctrine(c, faction, sourceState, targetState) {
    const connected = isSupplyConnected(c, faction.id, sourceState.id);
    if (!connected || faction.resources.rations < faction.statesOwned * 82) return 'fabian';
    if ((targetState.terrain === 'mountain' || targetState.terrain === 'hills') && faction.aggression > 0.55) return 'siege';
    if (targetState.fort >= 4 && faction.aggression > 0.58) return 'encirclement';
    if (faction.aggression > 0.72) return 'march';
    if (faction.aggression > 0.65) return 'feigned';
    if (faction.aggression < 0.46) return 'shieldwall';
    return faction.doctrine;
  }

  function planAIActions(c) {
    const plans = [];
    Object.values(c.factionsById).forEach((faction) => {
      if (faction.isPlayer || faction.statesOwned <= 0) return;
      const frontlineStates = Object.values(c.statesById).filter((stateRecord) => stateRecord.ownerFactionId === faction.id && stateRecord.frontline && stateRecord.levies >= 34);
      if (!frontlineStates.length) return;

      const candidateActions = [];
      frontlineStates.forEach((sourceState) => {
        sourceState.neighbors.forEach((neighborId) => {
          const targetState = c.statesById[neighborId];
          if (targetState.ownerFactionId === faction.id) return;
          const doctrineKey = chooseAIDoctrine(c, faction, sourceState, targetState);
          const estimate = estimateCampaign(c, {
            attackerFactionId: faction.id,
            sourceId: sourceState.id,
            targetId: targetState.id,
            doctrineKey,
          });
          const strategicValue = targetState.prosperity * 0.14 + (100 - (targetState.control[targetState.ownerFactionId] || 0)) * 0.15 - targetState.fort * 1.8;
          const score = estimate.ratio * 18 + strategicValue;
          candidateActions.push({
            attackerFactionId: faction.id,
            sourceId: sourceState.id,
            targetId: targetState.id,
            doctrineKey,
            intensity: randInt(34, 82),
            score,
          });
        });
      });

      candidateActions.sort((a, b) => b.score - a.score);
      const desired = faction.aggression > 0.68 ? 2 : 1;
      const usedPairs = new Set();
      for (const action of candidateActions) {
        if (usedPairs.size >= desired) break;
        const key = `${action.sourceId}:${action.targetId}`;
        if (usedPairs.has(key)) continue;
        usedPairs.add(key);
        plans.push(action);
      }
    });

    return plans;
  }

  function applySupplyAttrition(c, visibility) {
    const notes = [];
    Object.values(c.factionsById).forEach((faction) => {
      if (faction.statesOwned <= 0) return;
      const states = Object.values(c.statesById).filter((stateRecord) => stateRecord.ownerFactionId === faction.id);
      let isolated = 0;
      states.forEach((stateRecord) => {
        const connected = isSupplyConnected(c, faction.id, stateRecord.id);
        if (!connected) {
          isolated += 1;
          const loss = Math.max(4, Math.round(stateRecord.levies * 0.08));
          stateRecord.levies = clamp(stateRecord.levies - loss, 6, 520);
          stateRecord.supply = clamp(stateRecord.supply - randInt(6, 14), 6, 140);
          faction.resources.rations = clamp(faction.resources.rations - loss * 0.45, 0, 999999);
        }
      });
      if (isolated > 0) {
        const visibleFaction = states.some((stateRecord) => visibility.has(stateRecord.id));
        if (faction.isPlayer || visibleFaction) {
          notes.push(`${faction.name} suffers supply attrition across ${isolated} isolated holdings.`);
        }
      }
    });
    return notes;
  }

  function updateCampaignStatus(c, notes) {
    const playerStates = Object.values(c.statesById).filter((stateRecord) => stateRecord.ownerFactionId === c.playerFactionId).length;
    if (playerStates <= 0) {
      c.status = 'Defeat';
      notes.push('Your standard falls. No territories remain under direct rule.');
      stopAutoAdvance();
      return;
    }
    if (playerStates === mapModel.states.length) {
      c.status = 'Victory';
      notes.push('All 48 continental states answer to your throne.');
      stopAutoAdvance();
      return;
    }
    c.status = playerStates >= 24 ? 'Dominant' : 'Live';
  }

  function runSeason() {
    if (!campaign) return;
    if (campaign.status === 'Victory' || campaign.status === 'Defeat') return;

    const seasonNotes = [];
    const visibility = visibleStateSet(campaign);

    produceEconomy(campaign);

    if (campaign.queue.length) {
      const queuedActions = [...campaign.queue];
      campaign.queue.length = 0;
      queuedActions.forEach((action) => {
        const result = executeCampaignAction(campaign, action, visibility);
        if (result) seasonNotes.push(result);
      });
    }

    const aiActions = planAIActions(campaign);
    aiActions.forEach((action) => {
      const result = executeCampaignAction(campaign, action, visibility);
      if (result) seasonNotes.push(result);
    });

    applySupplyAttrition(campaign, visibility).forEach((note) => seasonNotes.push(note));

    refreshOwnershipAndFrontline(campaign);
    recalcFactionPower(campaign);

    campaign.season += 1;
    updateCampaignStatus(campaign, seasonNotes);

    seasonNotes.slice(0, 10).reverse().forEach((note) => {
      campaign.chronicle.unshift(`Season ${campaign.season - 1}: ${note}`);
    });
    campaign.chronicle = campaign.chronicle.slice(0, 200);

    persistCampaign();
    renderAll();
  }

  function queueCampaignAction() {
    if (!campaign) return;
    const sourceId = EL.sourceState.value;
    const targetId = EL.targetState.value;
    const doctrineKey = DOCTRINES[EL.campaignDoctrine.value] ? EL.campaignDoctrine.value : campaign.factionsById[campaign.playerFactionId].doctrine;
    if (!sourceId || !targetId) return;
    const sourceState = campaign.statesById[sourceId];
    const targetState = campaign.statesById[targetId];
    if (!sourceState || !targetState) return;
    if (sourceState.ownerFactionId !== campaign.playerFactionId) return;
    if (targetState.ownerFactionId === campaign.playerFactionId) return;
    if (!sourceState.neighbors.includes(targetId)) return;
    if (campaign.queue.length >= 6) {
      campaign.chronicle.unshift(`Season ${campaign.season}: Maneuver queue is full.`);
      renderAll();
      return;
    }

    const intensity = clamp(sourceState.pressure || 50, 0, 100);
    campaign.queue.push({
      id: `q-${Math.random().toString(36).slice(2, 7)}`,
      attackerFactionId: campaign.playerFactionId,
      sourceId,
      targetId,
      doctrineKey,
      intensity,
    });
    campaign.chronicle.unshift(`Season ${campaign.season}: Maneuver queued ${sourceState.abbr} -> ${targetState.abbr} (${DOCTRINES[doctrineKey].label}).`);
    campaign.chronicle = campaign.chronicle.slice(0, 200);
    renderAll();
  }

  function updatePlayerDoctrine(doctrineKey) {
    if (!campaign || !DOCTRINES[doctrineKey]) return;
    campaign.factionsById[campaign.playerFactionId].doctrine = doctrineKey;
    campaign.chronicle.unshift(`Season ${campaign.season}: Royal doctrine shifted to ${DOCTRINES[doctrineKey].label}.`);
    campaign.chronicle = campaign.chronicle.slice(0, 200);
    renderAll();
  }

  function buildTactileTrack(value) {
    return clamp(Math.round(value / 10), 0, TRACK_SEGMENTS);
  }

  function renderTactileTrack(trackElement, value) {
    if (!trackElement) return;
    const filled = buildTactileTrack(value);
    trackElement.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < TRACK_SEGMENTS; index += 1) {
      const segment = document.createElement('span');
      segment.className = `track-segment${index < filled ? ' filled' : ''}`;
      fragment.append(segment);
    }
    trackElement.append(fragment);
  }

  function normalizeAllocationTotal(nextAllocations) {
    const keys = ['levies', 'siege', 'civil'];
    let sum = keys.reduce((acc, key) => acc + nextAllocations[key], 0);
    if (sum === 100) return nextAllocations;
    let diff = 100 - sum;
    const priority = ['civil', 'siege', 'levies'];
    for (const key of priority) {
      if (diff === 0) break;
      const roomUp = 100 - nextAllocations[key];
      const roomDown = nextAllocations[key];
      if (diff > 0 && roomUp > 0) {
        const add = Math.min(diff, roomUp);
        nextAllocations[key] += add;
        diff -= add;
      } else if (diff < 0 && roomDown > 0) {
        const subtract = Math.min(Math.abs(diff), roomDown);
        nextAllocations[key] -= subtract;
        diff += subtract;
      }
    }
    return nextAllocations;
  }

  function splitIntegerProportion(total, keys, weightsByKey) {
    if (total <= 0) return Object.fromEntries(keys.map((key) => [key, 0]));
    const weightSum = keys.reduce((acc, key) => acc + weightsByKey[key], 0);
    const baseWeights = weightSum > 0
      ? weightsByKey
      : Object.fromEntries(keys.map((key) => [key, 1]));
    const baseSum = weightSum > 0 ? weightSum : keys.length;

    const provisional = keys.map((key) => {
      const raw = total * (baseWeights[key] / baseSum);
      const floored = Math.floor(raw);
      return { key, raw, floored, remainder: raw - floored };
    });

    let used = provisional.reduce((acc, item) => acc + item.floored, 0);
    let remainderUnits = total - used;
    provisional.sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < provisional.length && remainderUnits > 0; i += 1) {
      provisional[i].floored += 1;
      remainderUnits -= 1;
    }
    return Object.fromEntries(provisional.map((item) => [item.key, item.floored]));
  }

  function applyAllocationDelta(changedKey, delta) {
    if (!campaign || !delta) return;
    const keys = ['levies', 'siege', 'civil'];
    const current = { ...campaign.allocations };
    const next = { ...campaign.allocations };
    const newTarget = clamp(current[changedKey] + delta, 0, 100);
    const actualDelta = newTarget - current[changedKey];
    if (actualDelta === 0) return;

    const others = keys.filter((key) => key !== changedKey);
    next[changedKey] = newTarget;

    if (actualDelta > 0) {
      const deduction = splitIntegerProportion(actualDelta, others, current);
      others.forEach((key) => {
        next[key] = clamp(current[key] - deduction[key], 0, 100);
      });
    } else {
      const addition = splitIntegerProportion(Math.abs(actualDelta), others, current);
      others.forEach((key) => {
        next[key] = clamp(current[key] + addition[key], 0, 100);
      });
    }

    campaign.allocations = normalizeAllocationTotal(next);
    campaign.chronicle.unshift(`Season ${campaign.season}: Royal allocation revised.`);
    campaign.chronicle = campaign.chronicle.slice(0, 200);
    renderAll();
  }

  function renderAllocationReadouts() {
    if (!campaign) return;
    EL.allocLeviesReadout.textContent = toFixedPercent(campaign.allocations.levies);
    EL.allocSiegeReadout.textContent = toFixedPercent(campaign.allocations.siege);
    EL.allocCivilReadout.textContent = toFixedPercent(campaign.allocations.civil);
    renderTactileTrack(EL.allocLeviesTrack, campaign.allocations.levies);
    renderTactileTrack(EL.allocSiegeTrack, campaign.allocations.siege);
    renderTactileTrack(EL.allocCivilTrack, campaign.allocations.civil);
  }

  function renderDoctrineOptions() {
    const options = Object.values(DOCTRINES)
      .map((doctrine) => {
        const shortStats = `ATK ${signedPercentFromMultiplier(doctrine.attack)}, DEF ${signedPercentFromMultiplier(doctrine.defense)}, SIEGE ${signedPercentFromMultiplier(doctrine.siege)}, SUPPLY ${signedPercentFromMultiplier(doctrine.supply)}`;
        return `<option value="${doctrine.key}">${doctrine.label} (${shortStats})</option>`;
      })
      .join('');
    EL.playerDoctrine.innerHTML = options;
    EL.campaignDoctrine.innerHTML = options;
    EL.editorPlayerDoctrine.innerHTML = options;
  }

  function renderDoctrineNotes() {
    const playerDoctrine = DOCTRINES[EL.playerDoctrine.value];
    const campaignDoctrine = DOCTRINES[EL.campaignDoctrine.value];
    if (playerDoctrine) EL.doctrineNote.textContent = doctrineSummary(playerDoctrine);
    if (campaignDoctrine) EL.campaignDoctrineNote.textContent = doctrineSummary(campaignDoctrine);
  }

  function renderStartStateOptions(defaultStateId = '48') {
    const optionsHtml = mapModel.states
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((state) => `<option value="${state.id}">${state.name} (${state.abbr})</option>`)
      .join('');
    EL.startState.innerHTML = optionsHtml;
    EL.tutorialStartState.innerHTML = optionsHtml;
    EL.startState.value = defaultStateId;
    EL.tutorialStartState.value = defaultStateId;
  }

  function renderSourceTargetOptions() {
    if (!campaign) return;
    const sources = Object.values(campaign.statesById)
      .filter((stateRecord) => stateRecord.ownerFactionId === campaign.playerFactionId && stateRecord.frontline)
      .sort((a, b) => b.levies - a.levies || a.name.localeCompare(b.name));

    EL.sourceState.innerHTML = '';
    if (!sources.length) {
      EL.sourceState.innerHTML = '<option value="">No frontline territory</option>';
      EL.targetState.innerHTML = '<option value="">No adjacent target</option>';
      return;
    }

    sources.forEach((stateRecord) => {
      const option = document.createElement('option');
      option.value = stateRecord.id;
      option.textContent = `${stateRecord.name} (${stateRecord.abbr})`;
      EL.sourceState.append(option);
    });

    if (!sources.some((stateRecord) => stateRecord.id === EL.sourceState.value)) {
      EL.sourceState.value = sources[0].id;
    }

    renderTargetOptions(EL.sourceState.value);
  }

  function renderTargetOptions(sourceStateId) {
    if (!campaign) return;
    const sourceState = campaign.statesById[sourceStateId];
    EL.targetState.innerHTML = '';
    if (!sourceState) {
      EL.targetState.innerHTML = '<option value="">No adjacent target</option>';
      return;
    }

    const doctrineKey = DOCTRINES[EL.campaignDoctrine.value]
      ? EL.campaignDoctrine.value
      : campaign.factionsById[campaign.playerFactionId].doctrine;

    const targets = sourceState.neighbors
      .map((neighborId) => campaign.statesById[neighborId])
      .filter((stateRecord) => stateRecord.ownerFactionId !== campaign.playerFactionId)
      .sort((a, b) => (a.control[campaign.playerFactionId] || 0) - (b.control[campaign.playerFactionId] || 0));

    if (!targets.length) {
      EL.targetState.innerHTML = '<option value="">No adjacent target</option>';
      return;
    }

    targets.forEach((targetState) => {
      const dominant = dominantControl(targetState);
      const actionPreview = {
        attackerFactionId: campaign.playerFactionId,
        sourceId: sourceState.id,
        targetId: targetState.id,
        doctrineKey,
        intensity: sourceState.pressure ?? 50,
      };
      const estimate = estimateCampaign(campaign, actionPreview);
      const predicted = predictControlShift(campaign, actionPreview, estimate);
      const predictedText = predicted >= 0 ? `+${predicted}` : String(predicted);
      const option = document.createElement('option');
      option.value = targetState.id;
      option.textContent = `${targetState.name} (${targetState.abbr}) | Hold ${Math.round(dominant.share)}% ${campaign.factionsById[dominant.factionId].name} | Forecast ${predictedText}%`;
      EL.targetState.append(option);
    });
  }
  function chronicleListHtml() {
    return campaign.chronicle
      .slice(0, 36)
      .map((entry) => `<div class="chronicle-item">${entry.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`)
      .join('');
  }

  function renderChronicle() {
    EL.chronicleLog.innerHTML = chronicleListHtml();
  }

  function renderQueue() {
    if (!campaign.queue.length) {
      EL.actionQueue.textContent = 'No maneuvers declared. Use the War Council above to plan an attack.';
      return;
    }
    EL.actionQueue.innerHTML = campaign.queue
      .map((action, index) => {
        const sourceState = campaign.statesById[action.sourceId];
        const targetState = campaign.statesById[action.targetId];
        return `<div class="queue-item">${index + 1}. ${sourceState.abbr} -> ${targetState.abbr} | ${DOCTRINES[action.doctrineKey].label} | Pressure ${action.intensity}%</div>`;
      })
      .join('');
  }

  function counselBox(quote, advice, readout) {
    return `<span class="advisor-quote">“${quote}”</span>`
      + `<span class="advisor-advice">${advice}</span>`
      + (readout ? `<span class="advisor-readout">${readout}</span>` : '');
  }

  function renderConquestAdvisor() {
    if (!campaign || !EL.conquestAdvisor) return;
    const sourceId = EL.sourceState.value;
    const targetId = EL.targetState.value;
    const sourceState = campaign.statesById[sourceId];
    const targetState = campaign.statesById[targetId];
    const playerFaction = campaign.factionsById[campaign.playerFactionId];

    if (!sourceState || !targetState) {
      EL.conquestAdvisor.innerHTML = counselBox(
        'Know the enemy and know yourself.',
        'Pick a frontline realm to attack <em>from</em> (step 1), then an adjacent enemy to strike (step 2). I will weigh the odds for you.',
      );
      return;
    }

    if (!sourceState.neighbors.includes(targetState.id)) {
      EL.conquestAdvisor.innerHTML = counselBox(
        'He who knows the direct and the indirect approach will be victorious.',
        `${targetState.name} does not border ${sourceState.name}. You cannot strike where your host cannot march — choose an adjacent enemy.`,
      );
      return;
    }

    const doctrineKey = DOCTRINES[EL.campaignDoctrine.value]
      ? EL.campaignDoctrine.value
      : playerFaction.doctrine;

    const actionPreview = {
      attackerFactionId: campaign.playerFactionId,
      sourceId: sourceState.id,
      targetId: targetState.id,
      doctrineKey,
      intensity: sourceState.pressure ?? 50,
    };
    const estimate = estimateCampaign(campaign, actionPreview);
    const predictedShift = predictControlShift(campaign, actionPreview, estimate);
    const predictedText = predictedShift >= 0 ? `+${predictedShift}%` : `${predictedShift}%`;

    const playerShare = targetState.control[campaign.playerFactionId] || 0;
    const dominant = dominantControl(targetState);
    const deltaToFlip = dominant.factionId === campaign.playerFactionId
      ? 0
      : Math.max(1, Math.ceil(dominant.share - playerShare + 1));
    const projectedTurns = predictedShift > 0 ? Math.ceil(deltaToFlip / predictedShift) : null;

    const oddsLabel = estimate.ratio >= 1.2 ? 'momentum is yours' : estimate.ratio >= 0.95 ? 'the contest is even' : 'the odds are against you';

    let quote;
    let advice;
    if (!estimate.sourceConnected) {
      quote = 'The line between disorder and order lies in logistics.';
      advice = `Your host at <strong>${sourceState.abbr}</strong> is cut off from the capital. Reconnect the supply line or expect attrition to bleed this attack.`;
    } else if (predictedShift <= 0) {
      quote = 'He will win who knows when to fight and when not to fight.';
      advice = `<strong>${sourceState.abbr} → ${targetState.abbr}</strong> stalls (${oddsLabel}). Raise Border Pressure, switch doctrine, or strike a weaker neighbour.`;
    } else if (estimate.ratio >= 1.2) {
      quote = 'Attack him where he is unprepared; appear where you are not expected.';
      advice = `<strong>${sourceState.abbr} → ${targetState.abbr}</strong> favours you — declare the maneuver and press hard${projectedTurns ? `; about ${projectedTurns} season${projectedTurns > 1 ? 's' : ''} to flip` : ''}.`;
    } else {
      quote = 'Ponder and deliberate before you make a move.';
      advice = `<strong>${sourceState.abbr} → ${targetState.abbr}</strong> is winnable but ${oddsLabel}${projectedTurns ? `; ~${projectedTurns} season${projectedTurns > 1 ? 's' : ''} to flip` : ''}. Commit only if you can bear the losses.`;
    }

    const readout = `Forecast ${predictedText}/season · Your hold ${playerShare.toFixed(0)}% vs ${dominant.share.toFixed(0)}% (${campaign.factionsById[dominant.factionId].name}) · Supply ${estimate.sourceConnected ? 'connected' : 'CUT'} · ${DOCTRINES[doctrineKey].label}`;

    EL.conquestAdvisor.innerHTML = counselBox(quote, advice, readout);
  }

  function renderStrategistQuote() {
    if (!campaign || !EL.strategistQuote) return;
    const quote = ART_OF_WAR[campaign.season % ART_OF_WAR.length];
    EL.strategistQuote.textContent = `“${quote}” — Sun Tzu`;
  }

  function renderObjective() {
    if (!campaign || !EL.campaignObjective) return;
    const held = campaign.factionsById[campaign.playerFactionId]?.statesOwned || 0;
    EL.campaignObjective.innerHTML = `<strong>Objective:</strong> forge a single banner over all 48 states. You hold <strong>${held} / 48</strong>.`;
  }

  // Highlight the current step of the conquest loop in the War Council tracker.
  function renderLoopSteps() {
    if (!campaign || !EL.loopSteps) return;
    const sourceState = campaign.statesById[EL.sourceState.value];
    const targetState = campaign.statesById[EL.targetState.value];
    const hasSource = Boolean(sourceState && sourceState.ownerFactionId === campaign.playerFactionId && sourceState.frontline);
    const hasTarget = Boolean(
      hasSource && targetState && targetState.ownerFactionId !== campaign.playerFactionId
      && sourceState.neighbors.includes(targetState.id),
    );
    const hasQueue = campaign.queue.length > 0;

    let active;
    if (!hasSource) active = 1;
    else if (!hasTarget) active = 2;
    else if (!hasQueue) active = 3;
    else active = 4;

    EL.loopSteps.querySelectorAll('li').forEach((li) => {
      const step = Number(li.getAttribute('data-step'));
      li.classList.toggle('is-active', step === active);
      li.classList.toggle('is-done', step < active);
    });
  }

  // ---- Active-attack markers: arrows + target reticles on the map ----------
  function buildReticle(x, y, isPreview) {
    const group = document.createElementNS(SVGNS, 'g');
    group.classList.add('target-reticle');
    if (isPreview) group.classList.add('is-preview');
    group.setAttribute('transform', `translate(${x} ${y})`);

    const ring = document.createElementNS(SVGNS, 'circle');
    ring.classList.add('reticle-ring');
    ring.setAttribute('r', '10');
    const inner = document.createElementNS(SVGNS, 'circle');
    inner.classList.add('reticle-ring-inner');
    inner.setAttribute('r', '4.4');
    group.append(ring, inner);

    [[0, -13, 0, -6.5], [0, 13, 0, 6.5], [-13, 0, -6.5, 0], [13, 0, 6.5, 0]].forEach(([x1, y1, x2, y2]) => {
      const tick = document.createElementNS(SVGNS, 'line');
      tick.classList.add('reticle-tick');
      tick.setAttribute('x1', String(x1));
      tick.setAttribute('y1', String(y1));
      tick.setAttribute('x2', String(x2));
      tick.setAttribute('y2', String(y2));
      group.append(tick);
    });

    if (!isPreview) {
      const pulse = document.createElementNS(SVGNS, 'circle');
      pulse.classList.add('reticle-pulse');
      pulse.setAttribute('r', '10');
      group.append(pulse);
    }
    return group;
  }

  function drawOrder(fragment, sourceId, targetId, number, isPreview) {
    const source = campaign.statesById[sourceId];
    const target = campaign.statesById[targetId];
    if (!source || !target) return;
    const [fx, fy] = source.centroid;
    const [tx, ty] = target.centroid;
    const dx = tx - fx;
    const dy = ty - fy;
    const length = Math.hypot(dx, dy) || 1;
    const bow = Math.min(length * 0.16, 24);
    const ctrlX = (fx + tx) / 2 + (-dy / length) * bow;
    const ctrlY = (fy + ty) / 2 + (dx / length) * bow;
    const d = `M${fx.toFixed(1)},${fy.toFixed(1)} Q${ctrlX.toFixed(1)},${ctrlY.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`;

    if (!isPreview) {
      const glow = document.createElementNS(SVGNS, 'path');
      glow.classList.add('order-vector-glow');
      glow.setAttribute('d', d);
      fragment.append(glow);
    }
    const path = document.createElementNS(SVGNS, 'path');
    path.classList.add(isPreview ? 'order-vector-preview' : 'order-vector');
    path.setAttribute('d', d);
    path.setAttribute('marker-end', isPreview ? 'url(#order-arrow-preview)' : 'url(#order-arrow)');
    fragment.append(path);

    fragment.append(buildReticle(tx, ty, isPreview));

    if (number != null) {
      const badge = document.createElementNS(SVGNS, 'g');
      badge.setAttribute('transform', `translate(${(tx + 14).toFixed(1)} ${(ty - 13).toFixed(1)})`);
      const bg = document.createElementNS(SVGNS, 'circle');
      bg.classList.add('order-badge-bg');
      bg.setAttribute('r', '7');
      const text = document.createElementNS(SVGNS, 'text');
      text.classList.add('order-badge-text');
      text.setAttribute('dy', '3.1');
      text.textContent = String(number);
      badge.append(bg, text);
      fragment.append(badge);
    }

    // Emphasise the source/target state outlines.
    const sourceEl = document.getElementById(`state-path-${sourceId}`);
    const targetEl = document.getElementById(`state-path-${targetId}`);
    if (sourceEl) sourceEl.classList.add(isPreview ? 'state-source-preview' : 'state-source');
    if (targetEl) targetEl.classList.add(isPreview ? 'state-target-preview' : 'state-target');
  }

  function renderOrders() {
    if (!campaign || !ORDER_LAYER) return;
    ORDER_LAYER.innerHTML = '';
    FILL_LAYER.querySelectorAll('.state-source, .state-target, .state-source-preview, .state-target-preview')
      .forEach((el) => el.classList.remove('state-source', 'state-target', 'state-source-preview', 'state-target-preview'));

    const fragment = document.createDocumentFragment();
    const queuedKeys = new Set();
    campaign.queue.forEach((action, index) => {
      queuedKeys.add(`${action.sourceId}:${action.targetId}`);
      drawOrder(fragment, action.sourceId, action.targetId, index + 1, false);
    });

    // Live preview of the maneuver currently being composed in the dropdowns.
    const previewSource = campaign.statesById[EL.sourceState.value];
    const previewTarget = campaign.statesById[EL.targetState.value];
    if (
      previewSource && previewTarget
      && previewSource.ownerFactionId === campaign.playerFactionId
      && previewTarget.ownerFactionId !== campaign.playerFactionId
      && previewSource.neighbors.includes(previewTarget.id)
      && !queuedKeys.has(`${previewSource.id}:${previewTarget.id}`)
    ) {
      drawOrder(fragment, previewSource.id, previewTarget.id, null, true);
    }

    ORDER_LAYER.append(fragment);
  }

  function visibilityForPlayer() {
    return visibleStateSet(campaign);
  }

  function renderTheater() {
    if (!campaign || !campaign.selectedStateId || !campaign.statesById[campaign.selectedStateId]) {
      EL.theaterTitle.textContent = 'Select a state from the map.';
      EL.theaterOwner.textContent = 'Control percentages and supply conditions appear here.';
      EL.theaterBuff.textContent = 'State trait appears here.';
      EL.theaterControlLedger.innerHTML = '';
      renderTactileTrack(EL.theaterPressureTrack, 50);
      EL.theaterPressureReadout.textContent = '50%';
      return;
    }

    const stateRecord = campaign.statesById[campaign.selectedStateId];
    const owner = campaign.factionsById[stateRecord.ownerFactionId];
    const visible = visibilityForPlayer().has(stateRecord.id) || stateRecord.ownerFactionId === campaign.playerFactionId;
    const connected = isSupplyConnected(campaign, stateRecord.ownerFactionId, stateRecord.id);
    const dominant = dominantControl(stateRecord);
    const playerShare = stateRecord.control[campaign.playerFactionId] || 0;
    const controlToFlip = dominant.factionId === campaign.playerFactionId
      ? 0
      : Math.max(1, Math.ceil(dominant.share - playerShare + 1));

    EL.theaterTitle.textContent = `${stateRecord.name} (${stateRecord.abbr})`;
    EL.theaterOwner.textContent = [
      `Liege: ${owner.name}`,
      visible ? `Levies ${Math.round(stateRecord.levies)} | Supply ${Math.round(stateRecord.supply)} | Fort ${stateRecord.fort}` : 'Enemy levy totals obscured by fog of war.',
      `Dominant control: ${Math.round(dominant.share)}%`,
      `Your control: ${playerShare.toFixed(1)}%`,
      dominant.factionId === campaign.playerFactionId ? 'State secured by your crown.' : `Approx ${controlToFlip}% more control needed to flip ownership.`,
      `Supply line: ${connected ? 'Connected' : 'Cut'}`,
    ].join(' | ');
    EL.theaterBuff.textContent = stateRecord.buff
      ? `State Trait: ${stateRecord.buff.name} - ${stateRecord.buff.summary}`
      : 'State trait appears here.';

    const controlRows = Object.entries(stateRecord.control)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([factionId, share]) => `<div>${campaign.factionsById[factionId].name}: ${share.toFixed(1)}%</div>`)
      .join('');
    EL.theaterControlLedger.innerHTML = controlRows;

    stateRecord.pressure = clamp(stateRecord.pressure ?? 50, 0, 100);
    renderTactileTrack(EL.theaterPressureTrack, stateRecord.pressure);
    EL.theaterPressureReadout.textContent = `${Math.round(stateRecord.pressure)}%`;
  }

  function adjustSelectedStatePressure(delta) {
    if (!campaign || !campaign.selectedStateId || !delta) return;
    const stateRecord = campaign.statesById[campaign.selectedStateId];
    if (!stateRecord) return;
    stateRecord.pressure = clamp((stateRecord.pressure ?? 50) + delta, 0, 100);
    renderTactileTrack(EL.theaterPressureTrack, stateRecord.pressure);
    EL.theaterPressureReadout.textContent = `${Math.round(stateRecord.pressure)}%`;
    if (EL.sourceState.value === stateRecord.id) {
      renderTargetOptions(stateRecord.id);
      renderConquestAdvisor();
    }
  }

  function topTwoControllers(stateRecord) {
    return Object.entries(stateRecord.control)
      .filter(([factionId, share]) => campaign.factionsById[factionId] && share > 0.05)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([factionId, share]) => ({ factionId, share }));
  }

  // ---- Shifting-border system --------------------------------------------
  // Each contested state keeps a persistent overlay (the advancing faction's
  // colour) and a war-front line. Both ride a transform that slides across the
  // state as control shifts, so the border physically moves rather than the
  // fill simply recolouring. The slide is eased every animation frame.
  const borderFx = new Map();

  function hashString(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  }

  function frontGeometryFor(stateRecord, idA, idB) {
    const pair = [idA, idB].sort();
    const bounds = stateRecord.bounds || mapModel.statesById[stateRecord.id]?.bounds || [[0, 0], [1, 1]];
    const minX = bounds[0][0];
    const minY = bounds[0][1];
    const maxX = bounds[1][0];
    const maxY = bounds[1][1];
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const w = Math.max(maxX - minX, 1);
    const h = Math.max(maxY - minY, 1);
    const R = Math.max(w, h) * 0.78 + 8;
    const seed = hashString(`${stateRecord.id}:${pair[0]}:${pair[1]}`);
    const angleDeg = (seed % 130) + 25; // 25..155deg front orientation
    return { refId: pair[0], otherId: pair[1], cx, cy, R, angleDeg, seed };
  }

  // A vertical-ish hand-drawn front in slide-local coordinates (x ~ 0).
  // Returns the front-line stroke path AND a filled overlay path whose left
  // edge is the same jagged line, so the colour boundary itself is organic.
  function buildFrontPaths(R, seed) {
    const steps = 16;
    const top = -R * 1.5;
    const bottom = R * 1.5;
    let state = seed || 1;
    const rnd = () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
    const amp = Math.min(R * 0.13, 6);
    const far = R * 3;
    const points = [];
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const y = top + (bottom - top) * t;
      const jag = (rnd() - 0.5) * 2 * amp;
      points.push([jag, y]);
    }
    const frontD = points
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ');
    const overlayD = `${frontD} L${far.toFixed(1)},${bottom.toFixed(1)} L${far.toFixed(1)},${top.toFixed(1)} Z`;
    return { frontD, overlayD };
  }

  function ensureBorderFx(stateRecord, idA, idB) {
    const geo = frontGeometryFor(stateRecord, idA, idB);
    const pairKey = `${geo.refId}|${geo.otherId}`;
    let fx = borderFx.get(stateRecord.id);

    if (fx && fx.pairKey !== pairKey) {
      fx.overlayGroup.remove();
      fx.frontGroup.remove();
      fx = null;
    }

    if (!fx) {
      const { frontD, overlayD } = buildFrontPaths(geo.R, geo.seed);

      const overlayGroup = document.createElementNS(SVGNS, 'g');
      overlayGroup.setAttribute('clip-path', `url(#clip-state-${stateRecord.id})`);
      const overlaySlide = document.createElementNS(SVGNS, 'g');
      const overlay = document.createElementNS(SVGNS, 'path');
      overlay.classList.add('territory-overlay');
      overlay.setAttribute('d', overlayD);
      overlaySlide.append(overlay);
      overlayGroup.append(overlaySlide);
      TERRITORY_LAYER.append(overlayGroup);

      const frontGroup = document.createElementNS(SVGNS, 'g');
      frontGroup.setAttribute('clip-path', `url(#clip-state-${stateRecord.id})`);
      const frontSlide = document.createElementNS(SVGNS, 'g');
      const glow = document.createElementNS(SVGNS, 'path');
      glow.classList.add('war-front-glow');
      glow.setAttribute('d', frontD);
      const sharp = document.createElementNS(SVGNS, 'path');
      sharp.classList.add('war-front');
      sharp.setAttribute('d', frontD);
      frontSlide.append(glow, sharp);
      frontGroup.append(frontSlide);
      FRONTLINE_LAYER.append(frontGroup);

      fx = {
        pairKey,
        overlayGroup,
        overlaySlide,
        overlay,
        frontGroup,
        frontSlide,
        rendered: null,
        target: 0.5,
      };
      borderFx.set(stateRecord.id, fx);
    }

    fx.refId = geo.refId;
    fx.otherId = geo.otherId;
    fx.cx = geo.cx;
    fx.cy = geo.cy;
    fx.angleDeg = geo.angleDeg;
    fx.R = geo.R;
    fx.refColor = campaign.factionsById[geo.refId]?.color ?? '#7b6550';
    fx.otherColor = campaign.factionsById[geo.otherId]?.color ?? '#5f4e3b';
    fx.overlay.setAttribute('fill', fx.otherColor);
    return fx;
  }

  function resetMapFx() {
    borderFx.forEach((fx) => {
      fx.overlayGroup.remove();
      fx.frontGroup.remove();
    });
    borderFx.clear();
    if (TERRITORY_LAYER) TERRITORY_LAYER.innerHTML = '';
    if (FRONTLINE_LAYER) FRONTLINE_LAYER.innerHTML = '';
    particles.length = 0;
  }

  function renderTerritories() {
    if (!campaign) return;
    const contestedIds = new Set();
    const pathElements = FILL_LAYER.querySelectorAll('.state-shape');

    pathElements.forEach((pathElement) => {
      const stateId = pathElement.getAttribute('data-state-id');
      const stateRecord = campaign.statesById[stateId];
      const top = topTwoControllers(stateRecord);
      const dominant = top[0] || dominantControl(stateRecord);
      const runnerUp = top[1];
      const contested = Boolean(runnerUp && runnerUp.share >= 1.5);

      pathElement.classList.toggle('state-contested', contested);
      pathElement.classList.toggle('state-selected', campaign.selectedStateId === stateId);

      if (contested) {
        contestedIds.add(stateId);
        const fx = ensureBorderFx(stateRecord, dominant.factionId, runnerUp.factionId);
        pathElement.style.fill = fx.refColor;
        const refShare = stateRecord.control[fx.refId] || 0;
        const otherShare = stateRecord.control[fx.otherId] || 0;
        fx.target = clamp(refShare / Math.max(refShare + otherShare, 0.0001), 0.03, 0.97);
        // Snap on first sight, or when the tab is hidden (rAF is paused there, so
        // there is no frame loop to ease the front toward its new position).
        if (fx.rendered === null || document.hidden) fx.rendered = fx.target;
      } else {
        const ownerFaction = campaign.factionsById[dominant.factionId] || { color: '#7b6550' };
        pathElement.style.fill = ownerFaction.color;
      }
    });

    borderFx.forEach((fx, stateId) => {
      if (!contestedIds.has(stateId)) {
        fx.overlayGroup.remove();
        fx.frontGroup.remove();
        borderFx.delete(stateId);
      }
    });

    animateBorders(0);
  }

  function animateBorders(delta) {
    if (!borderFx.size) return;
    const speed = clamp(delta / 200, 0, 1);
    borderFx.forEach((fx) => {
      if (fx.rendered === null) fx.rendered = fx.target;
      fx.rendered += (fx.target - fx.rendered) * speed;
      if (Math.abs(fx.target - fx.rendered) < 0.0015) fx.rendered = fx.target;
      const offset = (2 * fx.rendered - 1) * fx.R;
      const transform = `translate(${fx.cx} ${fx.cy}) rotate(${fx.angleDeg}) translate(${offset.toFixed(2)} 0)`;
      fx.overlaySlide.setAttribute('transform', transform);
      fx.frontSlide.setAttribute('transform', transform);
    });
  }

  // Bold national borders: only the arcs between differently-owned states.
  // Recomputed each turn, so the frontier redraws to a new line when a state flips.
  function renderFrontierMesh() {
    if (!campaign || !mapModel.topo || !mapModel.statesObject) return;
    FRONTIER_LAYER.innerHTML = '';
    const ownerByFips = {};
    Object.values(campaign.statesById).forEach((stateRecord) => {
      ownerByFips[stateRecord.id] = stateRecord.ownerFactionId;
    });

    const isContiguous = (geometry) => CONTIGUOUS_FIPS.has(String(geometry.id).padStart(2, '0'));
    const frontierMesh = topojson.mesh(mapModel.topo, mapModel.statesObject, (a, b) => {
      if (a === b) return false;
      if (!isContiguous(a) || !isContiguous(b)) return false;
      const ownerA = ownerByFips[String(a.id).padStart(2, '0')];
      const ownerB = ownerByFips[String(b.id).padStart(2, '0')];
      return ownerA !== ownerB;
    });

    const d = mapModel.pathGenerator(frontierMesh);
    if (d) {
      const path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('d', d);
      path.classList.add('frontier-line');
      FRONTIER_LAYER.append(path);
    }
  }

  function starPath(cx, cy, points, outer, inner) {
    let d = '';
    for (let i = 0; i < points * 2; i += 1) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = (Math.PI / points) * i - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
    }
    return `${d}Z`;
  }

  function renderCapitals() {
    if (!campaign) return;
    CAPITAL_LAYER.innerHTML = '';
    const fragment = document.createDocumentFragment();
    Object.values(campaign.factionsById).forEach((faction) => {
      if (faction.statesOwned <= 0) return;
      const capital = campaign.statesById[faction.capitalStateId];
      if (!capital || capital.ownerFactionId !== faction.id) return;
      const [x, y] = capital.centroid;
      const group = document.createElementNS(SVGNS, 'g');
      group.classList.add('capital-marker');
      if (faction.isPlayer) group.classList.add('capital-player');
      group.setAttribute('transform', `translate(${x} ${y})`);

      if (faction.isPlayer) {
        const ring = document.createElementNS(SVGNS, 'circle');
        ring.classList.add('capital-ring');
        ring.setAttribute('cx', '0');
        ring.setAttribute('cy', '0');
        ring.setAttribute('r', '8.5');
        group.append(ring);
      }

      const star = document.createElementNS(SVGNS, 'path');
      star.classList.add('capital-star');
      star.setAttribute('d', starPath(0, 0, 5, faction.isPlayer ? 6.4 : 5.2, faction.isPlayer ? 2.9 : 2.3));
      star.setAttribute('fill', faction.color);
      group.append(star);
      fragment.append(group);
    });
    CAPITAL_LAYER.append(fragment);
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderStandings() {
    if (!campaign || !EL.standingsList) return;
    const factions = Object.values(campaign.factionsById)
      .filter((faction) => faction.statesOwned > 0)
      .sort((a, b) => b.statesOwned - a.statesOwned || b.power - a.power);
    const maxOwned = Math.max(1, ...factions.map((faction) => faction.statesOwned));

    EL.standingsList.innerHTML = factions
      .map((faction) => {
        const widthPct = Math.round((faction.statesOwned / maxOwned) * 100);
        return `<div class="standings-row${faction.isPlayer ? ' is-player' : ''}">`
          + `<span class="standings-swatch" style="background:${faction.color}"></span>`
          + `<span class="standings-name">${faction.isPlayer ? '★ ' : ''}${escapeHtml(faction.name)}</span>`
          + `<span class="standings-bar"><span style="width:${widthPct}%;background:${faction.color}"></span></span>`
          + `<span class="standings-count">${faction.statesOwned}</span>`
          + '</div>';
      })
      .join('');
  }

  function updateVictoryBanner() {
    if (!EL.campaignBanner) return;
    const ended = campaign.status === 'Victory' || campaign.status === 'Defeat';
    EL.campaignBanner.classList.toggle('hidden', !ended);
    if (!ended) return;
    const victory = campaign.status === 'Victory';
    EL.campaignBanner.classList.toggle('is-victory', victory);
    EL.campaignBanner.classList.toggle('is-defeat', !victory);
    const ruler = sanitizeRulerName(campaign.rulerName);
    EL.bannerTitle.textContent = victory ? 'Continental Dominion' : 'The Realm Has Fallen';
    EL.bannerText.textContent = victory
      ? `${ruler} unites all 48 continental states beneath a single crown. The chronicle is closed in triumph.`
      : `${ruler}'s banner is struck from the map. The remaining realms carve up the continent.`;
  }

  function renderAttackVectors() {
    if (!campaign) return;
    VECTOR_LAYER.innerHTML = '';
    const fragment = document.createDocumentFragment();
    campaign.vectors.forEach((vector) => {
      const opacity = clamp(vector.ttl / vector.maxTtl, 0.15, 1);
      const [fx, fy] = vector.from;
      const [tx, ty] = vector.to;
      const midX = (fx + tx) / 2;
      const midY = (fy + ty) / 2;
      // Bow the arrow perpendicular to its run for a swept campaign-arrow look.
      const dx = tx - fx;
      const dy = ty - fy;
      const length = Math.hypot(dx, dy) || 1;
      const bow = Math.min(length * 0.18, 26);
      const ctrlX = midX + (-dy / length) * bow;
      const ctrlY = midY + (dx / length) * bow;
      const d = `M${fx.toFixed(1)},${fy.toFixed(1)} Q${ctrlX.toFixed(1)},${ctrlY.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`;

      const glow = document.createElementNS(SVGNS, 'path');
      glow.classList.add('attack-vector-glow');
      glow.setAttribute('d', d);
      glow.setAttribute('stroke-opacity', (opacity * 0.7).toFixed(2));

      const path = document.createElementNS(SVGNS, 'path');
      path.classList.add('attack-vector');
      path.setAttribute('d', d);
      path.setAttribute('stroke-opacity', opacity.toFixed(2));
      path.setAttribute('marker-end', 'url(#vector-arrow)');

      fragment.append(glow, path);
    });
    VECTOR_LAYER.append(fragment);
  }

  function renderHUDMetrics() {
    if (!campaign) return;
    const playerFaction = campaign.factionsById[campaign.playerFactionId];
    const rulerName = sanitizeRulerName(campaign.rulerName || playerFaction.rulerName);
    EL.metricLevies.textContent = shortNumber(playerFaction.resources.levies);
    EL.metricGold.textContent = shortNumber(playerFaction.resources.gold);
    EL.metricRations.textContent = shortNumber(playerFaction.resources.rations);
    EL.metricSeason.textContent = String(campaign.season);
    EL.metricRealm.textContent = playerFaction.name;
    EL.metricRuler.textContent = rulerName;
    EL.metricHoldings.textContent = `${playerFaction.statesOwned} / 48`;
    EL.metricStatus.textContent = campaign.status;
    EL.rulerName.value = rulerName;
    const currentDoctrine = DOCTRINES[playerFaction.doctrine] ? playerFaction.doctrine : 'fabian';
    playerFaction.doctrine = currentDoctrine;
    EL.playerDoctrine.value = currentDoctrine;
    if (!DOCTRINES[EL.campaignDoctrine.value]) {
      EL.campaignDoctrine.value = currentDoctrine;
    }
    EL.doctrineInline.textContent = DOCTRINES[currentDoctrine].label;
    renderDoctrineNotes();
  }

  function renderAll() {
    if (!campaign) return;
    renderHUDMetrics();
    renderAllocationReadouts();
    renderSourceTargetOptions();
    renderConquestAdvisor();
    renderQueue();
    renderChronicle();
    renderTheater();
    renderTerritories();
    renderFrontierMesh();
    renderCapitals();
    renderOrders();
    renderStandings();
    renderAttackVectors();
    renderStrategistQuote();
    renderObjective();
    renderLoopSteps();
    updateVictoryBanner();
  }

  function applyCamera() {
    CAMERA_GROUP.setAttribute('transform', `translate(${camera.x} ${camera.y}) scale(${camera.scale})`);
  }

  function clientToSvgPoint(clientX, clientY) {
    const point = SVG.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const inverse = SVG.getScreenCTM().inverse();
    return point.matrixTransform(inverse);
  }

  function screenPointFromWorld(worldX, worldY) {
    const matrix = CAMERA_GROUP.getScreenCTM();
    if (!matrix) return { x: -9999, y: -9999 };
    return {
      x: matrix.a * worldX + matrix.c * worldY + matrix.e,
      y: matrix.b * worldX + matrix.d * worldY + matrix.f,
    };
  }

  function setupPanZoom() {
    MAP_STAGE.addEventListener('mousedown', (event) => {
      const interactive = event.target.closest('button, select, input, .overlay');
      if (interactive || event.button !== 0) return;
      dragging = true;
      MAP_STAGE.classList.add('dragging');
      dragStart = { x: event.clientX, y: event.clientY, camX: camera.x, camY: camera.y };
    });

    window.addEventListener('mousemove', (event) => {
      if (!dragging) return;
      const rect = SVG.getBoundingClientRect();
      const scaleX = SVG.viewBox.baseVal.width / rect.width;
      const scaleY = SVG.viewBox.baseVal.height / rect.height;
      const dx = (event.clientX - dragStart.x) * scaleX;
      const dy = (event.clientY - dragStart.y) * scaleY;
      camera.x = dragStart.camX + dx;
      camera.y = dragStart.camY + dy;
      applyCamera();
    });

    window.addEventListener('mouseup', () => {
      dragging = false;
      MAP_STAGE.classList.remove('dragging');
    });

    MAP_STAGE.addEventListener('wheel', (event) => {
      const interactive = event.target.closest('button, select, input, .overlay');
      if (interactive) return;
      event.preventDefault();
      const svgPoint = clientToSvgPoint(event.clientX, event.clientY);
      const beforeX = (svgPoint.x - camera.x) / camera.scale;
      const beforeY = (svgPoint.y - camera.y) / camera.scale;
      const zoomFactor = Math.exp(-event.deltaY * 0.0014);
      const nextScale = clamp(camera.scale * zoomFactor, 0.75, 4.6);
      camera.scale = nextScale;
      camera.x = svgPoint.x - beforeX * camera.scale;
      camera.y = svgPoint.y - beforeY * camera.scale;
      applyCamera();
    }, { passive: false });
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = MAP_STAGE.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (ASH_CANVAS.width !== width || ASH_CANVAS.height !== height) {
      ASH_CANVAS.width = width;
      ASH_CANVAS.height = height;
      ASH_CANVAS.style.width = `${rect.width}px`;
      ASH_CANVAS.style.height = `${rect.height}px`;
    }
  }

  const EMBER_COLORS = [
    [214, 120, 58],
    [196, 86, 54],
    [232, 178, 96],
    [120, 60, 44],
  ];

  // Embers rise from the live war fronts (the moving border) of each contested state.
  function spawnFrontEmbers(stageRect) {
    if (!campaign || !borderFx.size) return;
    borderFx.forEach((fx) => {
      if (Math.random() > 0.24) return;
      const rad = (fx.angleDeg * Math.PI) / 180;
      const offset = (2 * fx.rendered - 1) * fx.R;
      const worldX = fx.cx + Math.cos(rad) * offset;
      const worldY = fx.cy + Math.sin(rad) * offset;
      const point = screenPointFromWorld(worldX, worldY);
      const x = point.x - stageRect.left;
      const y = point.y - stageRect.top;
      if (x < -40 || x > stageRect.width + 40 || y < -40 || y > stageRect.height + 40) return;
      const spread = 12 + fx.R * 0.4 * camera.scale;
      const color = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)];
      particles.push({
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.3 + Math.random() * 0.8),
        life: 34 + Math.random() * 34,
        maxLife: 68,
        size: 0.8 + Math.random() * 1.8,
        color,
      });
    });
  }

  function animateLayer(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const delta = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    animateBorders(delta);

    resizeCanvas();
    const stageRect = MAP_STAGE.getBoundingClientRect();
    const ctx = ASH_CANVAS.getContext('2d');
    ctx.clearRect(0, 0, ASH_CANVAS.width, ASH_CANVAS.height);
    ctx.save();
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    spawnFrontEmbers(stageRect);

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.x += particle.vx * (delta / 16);
      particle.y += particle.vy * (delta / 16);
      particle.life -= delta / 16;
      if (particle.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      const alpha = clamp(particle.life / particle.maxLife, 0, 1);
      const [r, g, b] = particle.color || [94, 42, 42];
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.5).toFixed(3)})`;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    if (campaign) {
      campaign.vectors = campaign.vectors
        .map((vector) => ({ ...vector, ttl: vector.ttl - delta / 18 }))
        .filter((vector) => vector.ttl > 0);
      renderAttackVectors();
    }

    animationHandle = requestAnimationFrame(animateLayer);
  }

  function stopAutoAdvance() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    EL.toggleAuto.textContent = 'Auto: Off';
  }

  function startAutoAdvance() {
    if (autoTimer) return;
    autoTimer = setInterval(() => {
      runSeason();
      if (campaign.status === 'Victory' || campaign.status === 'Defeat') {
        stopAutoAdvance();
      }
    }, 1400);
    EL.toggleAuto.textContent = 'Auto: On';
  }

  function toggleAutoAdvance() {
    if (autoTimer) {
      stopAutoAdvance();
    } else {
      startAutoAdvance();
    }
  }

  function populateSaveEditor() {
    if (!campaign) return;
    const playerFaction = campaign.factionsById[campaign.playerFactionId];
    EL.editorSeason.value = String(Math.max(1, Math.round(campaign.season)));
    EL.editorPlayerLevies.value = String(Math.round(playerFaction.resources.levies));
    EL.editorPlayerGold.value = String(Math.round(playerFaction.resources.gold));
    EL.editorPlayerRations.value = String(Math.round(playerFaction.resources.rations));
    EL.editorRulerName.value = sanitizeRulerName(campaign.rulerName || playerFaction.rulerName);
    EL.editorPlayerDoctrine.value = playerFaction.doctrine;
  }

  function openSettings() {
    populateSaveEditor();
    EL.settingsOverlay.style.display = 'flex';
  }

  function closeSettings() {
    EL.settingsOverlay.style.display = 'none';
  }

  function applySaveEditor() {
    if (!campaign) return;
    const playerFaction = campaign.factionsById[campaign.playerFactionId];
    if (!playerFaction) return;

    campaign.season = Math.max(1, Math.round(Number(EL.editorSeason.value) || campaign.season));
    playerFaction.resources.levies = clamp(Number(EL.editorPlayerLevies.value) || playerFaction.resources.levies, 0, 999999);
    playerFaction.resources.gold = clamp(Number(EL.editorPlayerGold.value) || playerFaction.resources.gold, 0, 999999);
    playerFaction.resources.rations = clamp(Number(EL.editorPlayerRations.value) || playerFaction.resources.rations, 0, 999999);
    const rulerName = sanitizeRulerName(EL.editorRulerName.value);
    campaign.rulerName = rulerName;
    playerFaction.rulerName = rulerName;
    if (DOCTRINES[EL.editorPlayerDoctrine.value]) {
      playerFaction.doctrine = EL.editorPlayerDoctrine.value;
    }

    campaign.chronicle.unshift(`Season ${campaign.season}: Campaign records amended from the save editor.`);
    campaign.chronicle = campaign.chronicle.slice(0, 200);
    persistCampaign();
    renderAll();
  }

  function exportCampaign() {
    if (!campaign) return;
    const serialized = serializeCampaign(campaign);
    const blob = new Blob([JSON.stringify(serialized, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `abhi-state-war-sim-season-${campaign.season}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    campaign.chronicle.unshift(`Season ${campaign.season}: Campaign exported.`);
    renderAll();
  }

  function buildCampaignBriefMarkdown() {
    if (!campaign) return '';
    const playerFaction = campaign.factionsById[campaign.playerFactionId];
    const playerStates = Object.values(campaign.statesById)
      .filter((stateRecord) => stateRecord.ownerFactionId === campaign.playerFactionId)
      .sort((a, b) => b.control[campaign.playerFactionId] - a.control[campaign.playerFactionId]);
    const frontierStates = playerStates
      .filter((stateRecord) => stateRecord.frontline)
      .sort((a, b) => (b.pressure + b.levies) - (a.pressure + a.levies))
      .slice(0, 6);
    const standings = Object.values(campaign.factionsById)
      .sort((a, b) => b.statesOwned - a.statesOwned)
      .slice(0, 6);
    const queueRows = campaign.queue.slice(0, 6).map((action, index) => {
      const sourceState = campaign.statesById[action.sourceId];
      const targetState = campaign.statesById[action.targetId];
      return `${index + 1}. ${sourceState.abbr} -> ${targetState.abbr} | ${DOCTRINES[action.doctrineKey].label} | Pressure ${action.intensity}%`;
    });
    const chronicleRows = campaign.chronicle.slice(0, 8).map((entry) => `- ${entry}`);

    return [
      '# Continental Feuds Campaign Brief',
      '',
      `- Season: ${campaign.season}`,
      `- Ruler: ${campaign.rulerName}`,
      `- Realm: ${playerFaction.name}`,
      `- Status: ${campaign.status}`,
      `- Holdings: ${playerFaction.statesOwned} / 48`,
      `- Field doctrine: ${DOCTRINES[playerFaction.doctrine]?.label || playerFaction.doctrine}`,
      `- Treasury: ${Math.round(playerFaction.resources.gold)} gold`,
      `- Levies: ${Math.round(playerFaction.resources.levies)}`,
      `- Rations: ${Math.round(playerFaction.resources.rations)}`,
      '',
      '## Frontline Pressure',
      ...(frontierStates.length
        ? frontierStates.map((stateRecord) => `- ${stateRecord.name} (${stateRecord.abbr}) | control ${Math.round(stateRecord.control[campaign.playerFactionId])}% | pressure ${stateRecord.pressure}% | levies ${Math.round(stateRecord.levies)}`)
        : ['- No frontline territories.']),
      '',
      '## Declared Maneuvers',
      ...(queueRows.length ? queueRows : ['- No maneuvers queued.']),
      '',
      '## Continental Standings',
      ...standings.map((faction, index) => `${index + 1}. ${faction.name} | ${faction.statesOwned} states | doctrine ${DOCTRINES[faction.doctrine]?.label || faction.doctrine}`),
      '',
      '## Recent Chronicle',
      ...(chronicleRows.length ? chronicleRows : ['- No chronicle entries yet.']),
      '',
    ].join('\n');
  }

  function exportCampaignBrief() {
    if (!campaign) return;
    const brief = buildCampaignBriefMarkdown();
    const blob = new Blob([brief], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `continental-feuds-brief-season-${campaign.season}.md`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    campaign.chronicle.unshift(`Season ${campaign.season}: Campaign brief exported.`);
    renderAll();
  }

  function wipeSave() {
    localStorage.removeItem(STORAGE_KEY);
    if (campaign) {
      campaign.chronicle.unshift(`Season ${campaign.season}: Local campaign save wiped.`);
      renderAll();
    }
  }

  function serializeCampaign(c) {
    const stateControl = [];
    Object.values(c.statesById).forEach((stateRecord) => {
      Object.entries(stateRecord.control).forEach(([factionId, percent]) => {
        stateControl.push({
          stateId: stateRecord.id,
          factionId,
          percent: Number(percent.toFixed(4)),
        });
      });
    });

    return {
      version: SAVE_VERSION,
      season: c.season,
      status: c.status,
      playerFactionId: c.playerFactionId,
      selectedStateId: c.selectedStateId,
      rulerName: sanitizeRulerName(c.rulerName || c.factionsById.player?.rulerName || DEFAULT_RULER_NAME),
      cameraX: camera.x,
      cameraY: camera.y,
      cameraScale: camera.scale,
      allocLevies: c.allocations.levies,
      allocSiege: c.allocations.siege,
      allocCivil: c.allocations.civil,
      queue: c.queue.map((item) => ({ ...item })),
      chronicle: [...c.chronicle],
      factions: Object.values(c.factionsById).map((faction) => ({
        id: faction.id,
        name: faction.name,
        color: faction.color,
        rulerName: faction.rulerName || null,
        traitId: faction.traitId,
        traitName: faction.traitName,
        traitSummary: faction.traitSummary,
        traitEffect: { ...faction.traitEffect },
        isPlayer: faction.isPlayer,
        aggression: faction.aggression,
        doctrine: faction.doctrine,
        capitalStateId: faction.capitalStateId,
        statesOwned: faction.statesOwned,
        power: faction.power,
        gold: faction.resources.gold,
        levies: faction.resources.levies,
        rations: faction.resources.rations,
      })),
      states: Object.values(c.statesById).map((stateRecord) => ({
        id: stateRecord.id,
        ownerFactionId: stateRecord.ownerFactionId,
        levies: stateRecord.levies,
        supply: stateRecord.supply,
        prosperity: stateRecord.prosperity,
        fort: stateRecord.fort,
        pressure: stateRecord.pressure,
        buff: stateRecord.buff || null,
      })),
      stateControl,
    };
  }

  function deserializeCampaign(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const stateRecords = {};
    mapModel.states.forEach((mapState) => {
      stateRecords[mapState.id] = {
        id: mapState.id,
        abbr: mapState.abbr,
        name: mapState.name,
        region: mapState.region,
        terrain: mapState.terrain,
        buff: mapState.buff ? { ...mapState.buff, effect: { ...mapState.buff.effect } } : null,
        ownerFactionId: 'player',
        levies: 60,
        supply: 50,
        prosperity: 65,
        fort: 1,
        pressure: 50,
        neighbors: [...mapState.neighbors],
        centroid: [...mapState.centroid],
        bounds: mapState.bounds ? [[...mapState.bounds[0]], [...mapState.bounds[1]]] : [[0, 0], [0, 0]],
        control: { player: 100 },
        frontline: false,
      };
    });

    const factionsById = {};
    if (!Array.isArray(raw.factions)) return null;
    raw.factions.forEach((entry) => {
      if (!entry.id) return;
      factionsById[entry.id] = {
        id: entry.id,
        name: entry.name,
        color: entry.color,
        rulerName: entry.rulerName || null,
        traitId: entry.traitId,
        traitName: entry.traitName,
        traitSummary: entry.traitSummary,
        traitEffect: entry.traitEffect,
        isPlayer: Boolean(entry.isPlayer),
        aggression: Number(entry.aggression || 0),
        doctrine: entry.doctrine && DOCTRINES[entry.doctrine] ? entry.doctrine : 'fabian',
        capitalStateId: entry.capitalStateId,
        statesOwned: Number(entry.statesOwned || 0),
        power: Number(entry.power || 0),
        resources: {
          gold: Number(entry.gold || 0),
          levies: Number(entry.levies || 0),
          rations: Number(entry.rations || 0),
        },
      };
    });

    if (!factionsById.player) return null;

    if (Array.isArray(raw.states)) {
      raw.states.forEach((entry) => {
        const stateRecord = stateRecords[entry.id];
        if (!stateRecord) return;
        stateRecord.ownerFactionId = entry.ownerFactionId || stateRecord.ownerFactionId;
        stateRecord.levies = Number(entry.levies ?? stateRecord.levies);
        stateRecord.supply = Number(entry.supply ?? stateRecord.supply);
        stateRecord.prosperity = Number(entry.prosperity ?? stateRecord.prosperity);
        stateRecord.fort = Number(entry.fort ?? stateRecord.fort);
        stateRecord.pressure = Number(entry.pressure ?? stateRecord.pressure);
        if (entry.buff && typeof entry.buff === 'object') {
          stateRecord.buff = entry.buff;
        }
        stateRecord.control = { [stateRecord.ownerFactionId]: 100 };
      });
    }

    if (Array.isArray(raw.stateControl)) {
      Object.values(stateRecords).forEach((stateRecord) => {
        stateRecord.control = {};
      });
      raw.stateControl.forEach((entry) => {
        if (!stateRecords[entry.stateId]) return;
        const value = Number(entry.percent);
        if (!Number.isFinite(value)) return;
        stateRecords[entry.stateId].control[entry.factionId] = value;
      });
      Object.values(stateRecords).forEach((stateRecord) => {
        stateRecord.control = normalizeControl(stateRecord.control, stateRecord.ownerFactionId);
        stateRecord.ownerFactionId = dominantControl(stateRecord).factionId;
      });
    }

    const nextCampaign = {
      version: SAVE_VERSION,
      season: Number(raw.season || 1),
      status: raw.status || 'Live',
      playerFactionId: raw.playerFactionId || 'player',
      selectedStateId: raw.selectedStateId || mapModel.states[0].id,
      rulerName: sanitizeRulerName(raw.rulerName || factionsById.player.rulerName || DEFAULT_RULER_NAME),
      allocations: {
        levies: Number(raw.allocLevies ?? 50),
        siege: Number(raw.allocSiege ?? 30),
        civil: Number(raw.allocCivil ?? 20),
      },
      queue: Array.isArray(raw.queue) ? raw.queue.map((item) => ({ ...item })) : [],
      chronicle: Array.isArray(raw.chronicle) ? [...raw.chronicle] : [],
      factionsById,
      statesById: stateRecords,
      vectors: [],
      camera: {
        x: Number(raw.cameraX || 0),
        y: Number(raw.cameraY || 0),
        scale: Number(raw.cameraScale || 1),
      },
    };

    nextCampaign.allocations = normalizeAllocationTotal({ ...nextCampaign.allocations });
    nextCampaign.factionsById.player.rulerName = sanitizeRulerName(nextCampaign.rulerName);

    refreshOwnershipAndFrontline(nextCampaign);
    recalcFactionPower(nextCampaign);
    return nextCampaign;
  }

  function persistCampaign() {
    if (!campaign) return;
    const serialized = serializeCampaign(campaign);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }

  function restoreCampaign() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      const restored = deserializeCampaign(parsed);
      return restored;
    } catch {
      return null;
    }
  }

  async function importCampaignFromFile() {
    const file = EL.importFile.files?.[0];
    if (!file) {
      if (campaign) {
        campaign.chronicle.unshift(`Season ${campaign.season}: Choose a JSON file before importing.`);
        renderAll();
      }
      return;
    }

    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      const restored = deserializeCampaign(parsed);
      if (!restored) throw new Error('Invalid campaign format.');
      campaign = restored;
      camera = { ...campaign.camera };
      applyCamera();
      resetMapFx();
      persistCampaign();
      closeSettings();
      campaign.chronicle.unshift(`Season ${campaign.season}: Campaign imported from file.`);
      renderAll();
    } catch {
      if (campaign) {
        campaign.chronicle.unshift(`Season ${campaign.season}: Import failed. File format is invalid.`);
        renderAll();
      }
    }
  }

  function showTutorialStep(index) {
    tutorialIndex = clamp(index, 0, tutorialSteps.length - 1);
    const step = tutorialSteps[tutorialIndex];
    EL.tutorialStepCount.textContent = `${tutorialIndex + 1} / ${tutorialSteps.length}`;
    EL.tutorialTitle.textContent = step.title;
    EL.tutorialText.textContent = step.text;
    EL.tutorialRetreat.classList.toggle('hidden', tutorialIndex === 0);
    const isFinalStep = tutorialIndex >= tutorialSteps.length - 1;
    EL.tutorialAdvance.classList.toggle('hidden', isFinalStep);
    EL.tutorialFinish.classList.toggle('hidden', !isFinalStep);
    const showSetup = tutorialIndex === 0 || isFinalStep;
    const tutorialForm = EL.tutorialRulerName.closest('.tutorial-form');
    if (tutorialForm) tutorialForm.classList.toggle('hidden', !showSetup);
  }

  function openTutorial() {
    EL.tutorialRulerName.value = sanitizeRulerName(EL.rulerName.value || campaign?.rulerName || DEFAULT_RULER_NAME);
    EL.tutorialStartState.value = EL.startState.value || '48';
    EL.tutorialOverlay.style.display = 'flex';
    showTutorialStep(0);
  }

  function closeTutorial() {
    EL.tutorialOverlay.style.display = 'none';
  }

  function setupHoverHelp() {
    if (!EL.hoverHelp) return;
    const hoverTargets = document.querySelectorAll('[data-tip]');
    hoverTargets.forEach((node) => {
      node.addEventListener('mouseenter', (event) => {
        const tip = node.getAttribute('data-tip');
        if (!tip) return;
        EL.hoverHelp.textContent = tip;
        EL.hoverHelp.classList.remove('hidden');
        const pad = 16;
        EL.hoverHelp.style.left = `${event.clientX + pad}px`;
        EL.hoverHelp.style.top = `${event.clientY + pad}px`;
      });
      node.addEventListener('mousemove', (event) => {
        const pad = 16;
        EL.hoverHelp.style.left = `${event.clientX + pad}px`;
        EL.hoverHelp.style.top = `${event.clientY + pad}px`;
      });
      node.addEventListener('mouseleave', () => {
        EL.hoverHelp.classList.add('hidden');
      });
    });
  }

  function launchNewCampaign(startStateId, rulerName) {
    stopAutoAdvance();
    const safeState = mapModel.statesById[startStateId] ? startStateId : (EL.startState.value || '48');
    const safeRuler = sanitizeRulerName(rulerName || EL.rulerName.value || DEFAULT_RULER_NAME);
    EL.rulerName.value = safeRuler;
    EL.tutorialRulerName.value = safeRuler;
    EL.startState.value = safeState;
    EL.tutorialStartState.value = safeState;
    campaign = initializeCampaign(safeState, safeRuler);
    camera = { x: 0, y: 0, scale: 1 };
    applyCamera();
    resetMapFx();
    persistCampaign();
    renderAll();
  }

  function setupEvents() {
    EL.newCampaign.addEventListener('click', () => {
      launchNewCampaign(EL.startState.value, EL.rulerName.value);
    });

    EL.startState.addEventListener('change', () => {
      EL.tutorialStartState.value = EL.startState.value;
    });

    EL.rulerName.addEventListener('input', () => {
      EL.tutorialRulerName.value = EL.rulerName.value;
    });

    EL.tutorialStartState.addEventListener('change', () => {
      EL.startState.value = EL.tutorialStartState.value;
    });

    EL.tutorialRulerName.addEventListener('input', () => {
      EL.rulerName.value = EL.tutorialRulerName.value;
    });

    EL.playerDoctrine.addEventListener('change', () => {
      updatePlayerDoctrine(EL.playerDoctrine.value);
      renderDoctrineNotes();
    });

    EL.campaignDoctrine.addEventListener('change', () => {
      renderDoctrineNotes();
      if (EL.sourceState.value) {
        renderTargetOptions(EL.sourceState.value);
      }
      renderConquestAdvisor();
      renderOrders();
      renderLoopSteps();
    });

    EL.allocLeviesDec.addEventListener('click', () => applyAllocationDelta('levies', -ALLOCATION_STEP));
    EL.allocLeviesInc.addEventListener('click', () => applyAllocationDelta('levies', ALLOCATION_STEP));
    EL.allocSiegeDec.addEventListener('click', () => applyAllocationDelta('siege', -ALLOCATION_STEP));
    EL.allocSiegeInc.addEventListener('click', () => applyAllocationDelta('siege', ALLOCATION_STEP));
    EL.allocCivilDec.addEventListener('click', () => applyAllocationDelta('civil', -ALLOCATION_STEP));
    EL.allocCivilInc.addEventListener('click', () => applyAllocationDelta('civil', ALLOCATION_STEP));

    EL.sourceState.addEventListener('change', () => {
      renderTargetOptions(EL.sourceState.value);
      renderConquestAdvisor();
      renderOrders();
      renderLoopSteps();
    });

    EL.targetState.addEventListener('change', () => {
      renderConquestAdvisor();
      renderOrders();
      renderLoopSteps();
    });

    EL.queueCampaign.addEventListener('click', () => {
      queueCampaignAction();
    });

    EL.advanceSeason.addEventListener('click', () => {
      runSeason();
    });

    EL.toggleAuto.addEventListener('click', () => {
      toggleAutoAdvance();
    });

    EL.theaterPressureDec.addEventListener('click', () => adjustSelectedStatePressure(-PRESSURE_STEP));
    EL.theaterPressureInc.addEventListener('click', () => adjustSelectedStatePressure(PRESSURE_STEP));

    if (EL.bannerDismiss) {
      EL.bannerDismiss.addEventListener('click', () => {
        EL.campaignBanner.classList.add('hidden');
      });
    }

    EL.openSettings.addEventListener('click', openSettings);
    EL.closeSettings.addEventListener('click', closeSettings);
    EL.exportSave.addEventListener('click', exportCampaign);
    EL.exportBrief.addEventListener('click', exportCampaignBrief);
    EL.importSave.addEventListener('click', importCampaignFromFile);
    EL.wipeSave.addEventListener('click', wipeSave);
    EL.applySaveEditor.addEventListener('click', applySaveEditor);

    EL.tutorialRetreat.addEventListener('click', () => showTutorialStep(tutorialIndex - 1));
    EL.tutorialAdvance.addEventListener('click', () => showTutorialStep(tutorialIndex + 1));
    EL.tutorialFinish.addEventListener('click', () => {
      launchNewCampaign(EL.tutorialStartState.value, EL.tutorialRulerName.value);
      closeTutorial();
    });
    EL.tutorialOverlay.addEventListener('click', (event) => {
      if (event.target === EL.tutorialOverlay) closeTutorial();
    });
    EL.settingsOverlay.addEventListener('click', (event) => {
      if (event.target === EL.settingsOverlay) closeSettings();
    });

    window.addEventListener('resize', () => {
      resizeCanvas();
      renderAttackVectors();
    });
  }

  async function initialize() {
    renderDoctrineOptions();
    await loadMap();
    renderMapScaffold();
    renderStartStateOptions('48');
    setupPanZoom();
    setupHoverHelp();
    setupEvents();

    const restored = restoreCampaign();
    const hadNoCampaign = !restored;
    if (restored) {
      campaign = restored;
      camera = { ...campaign.camera };
    } else {
      campaign = initializeCampaign(EL.startState.value || '48', EL.rulerName.value || DEFAULT_RULER_NAME);
      persistCampaign();
    }

    applyCamera();
    renderAll();
    lucide.createIcons({ attrs: { 'stroke-width': 1.8, width: 15, height: 15 } });
    if (hadNoCampaign) {
      openTutorial();
    }

    animationHandle = requestAnimationFrame(animateLayer);
  }

  initialize().catch((error) => {
    console.error(error);
    const mapStage = document.getElementById('map-stage');
    if (mapStage) {
      mapStage.innerHTML = `<div style="padding:1rem;font-family:'Source Sans 3',sans-serif;color:#3f1f1f;"><strong>Map bootstrap failed.</strong><br>${error.message}</div>`;
    }
  });
})();



