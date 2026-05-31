(() => {
  'use strict';

  const STORAGE_KEY = 'abhi_state_war_sim_campaign_v3';
  const SAVE_VERSION = 3;

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
      note: 'Deliberate withdrawals that bleed invaders and preserve supply depth.',
    },
    feigned: {
      key: 'feigned',
      label: 'Feigned Retreat',
      attack: 1.09,
      defense: 0.98,
      siege: 0.99,
      supply: 0.98,
      note: 'Bait-and-counter warfare with sharper offensive swings.',
    },
    siege: {
      key: 'siege',
      label: 'Siegeworks',
      attack: 1.02,
      defense: 1.04,
      siege: 1.18,
      supply: 0.94,
      note: 'Engineer-heavy campaigns that accelerate control transfer in hard targets.',
    },
  };

  const DOCTRINE_COUNTER = {
    fabian: 'feigned',
    feigned: 'siege',
    siege: 'fabian',
  };

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
    '#b76a49',
    '#4f6a45',
    '#8d4740',
    '#736145',
    '#58718a',
    '#86576f',
    '#5e5387',
    '#6e4f2f',
    '#507165',
  ];

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

  const ROOT = document.getElementById('game-root');
  const SVG = document.getElementById('war-map');
  const CAMERA_GROUP = document.getElementById('camera-group');
  const FILL_LAYER = document.getElementById('state-fill-layer');
  const BORDER_LAYER = document.getElementById('state-border-layer');
  const LABEL_LAYER = document.getElementById('state-label-layer');
  const VECTOR_LAYER = document.getElementById('vector-layer');
  const ASH_CANVAS = document.getElementById('ash-canvas');

  const EL = {
    startState: document.getElementById('start-state'),
    newCampaign: document.getElementById('new-campaign'),
    playerDoctrine: document.getElementById('player-doctrine'),
    campaignDoctrine: document.getElementById('campaign-doctrine'),
    doctrineNote: document.getElementById('doctrine-note'),
    allocLevies: document.getElementById('alloc-levies'),
    allocSiege: document.getElementById('alloc-siege'),
    allocCivil: document.getElementById('alloc-civil'),
    allocLeviesReadout: document.getElementById('alloc-levies-readout'),
    allocSiegeReadout: document.getElementById('alloc-siege-readout'),
    allocCivilReadout: document.getElementById('alloc-civil-readout'),
    sourceState: document.getElementById('source-state'),
    targetState: document.getElementById('target-state'),
    queueCampaign: document.getElementById('queue-campaign'),
    advanceSeason: document.getElementById('advance-season'),
    toggleAuto: document.getElementById('toggle-auto'),
    actionQueue: document.getElementById('action-queue'),
    chronicleLog: document.getElementById('chronicle-log'),
    metricLevies: document.getElementById('metric-levies'),
    metricGold: document.getElementById('metric-gold'),
    metricRations: document.getElementById('metric-rations'),
    metricSeason: document.getElementById('metric-season'),
    metricRealm: document.getElementById('metric-realm'),
    metricHoldings: document.getElementById('metric-holdings'),
    metricStatus: document.getElementById('metric-status'),
    theaterTitle: document.getElementById('theater-title'),
    theaterOwner: document.getElementById('theater-owner'),
    theaterPressure: document.getElementById('theater-pressure'),
    theaterPressureReadout: document.getElementById('theater-pressure-readout'),
    theaterControlLedger: document.getElementById('theater-control-ledger'),
    openSettings: document.getElementById('open-settings'),
    closeSettings: document.getElementById('close-settings'),
    settingsOverlay: document.getElementById('settings-overlay'),
    exportSave: document.getElementById('export-save'),
    importSave: document.getElementById('import-save'),
    importFile: document.getElementById('import-file'),
    wipeSave: document.getElementById('wipe-save'),
    tutorialOverlay: document.getElementById('tutorial-overlay'),
    tutorialText: document.getElementById('tutorial-text'),
    tutorialBack: document.getElementById('tutorial-back'),
    tutorialNext: document.getElementById('tutorial-next'),
    tutorialClose: document.getElementById('tutorial-close'),
    toggleWarRoom: document.getElementById('toggle-war-room'),
    toggleChronicle: document.getElementById('toggle-chronicle'),
    toggleDeclarations: document.getElementById('toggle-declarations'),
    toggleTheater: document.getElementById('toggle-theater'),
    panelWarRoom: document.getElementById('hud-war-room'),
    panelChronicle: document.getElementById('hud-chronicle'),
    panelDeclarations: document.getElementById('hud-declarations'),
    panelTheater: document.getElementById('hud-theater'),
  };

  const tutorialSteps = [
    {
      text: 'Welcome, Commander. Select your ancestral realm and begin your first campaign.',
      target: EL.startState,
    },
    {
      text: 'The War Room controls doctrine and royal allocation. These values alter every seasonal resolution.',
      target: EL.panelWarRoom,
    },
    {
      text: 'Seasonal Declarations queue maneuvers. You can stage multiple campaigns before advancing the season.',
      target: EL.panelDeclarations,
    },
    {
      text: 'The Chronicle records border shifts, attrition, and doctrine outcomes each turn.',
      target: EL.panelChronicle,
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

  function doctrineAdvantage(attackerKey, defenderKey) {
    if (attackerKey === defenderKey) return 1;
    if (DOCTRINE_COUNTER[attackerKey] === defenderKey) return 1.13;
    if (DOCTRINE_COUNTER[defenderKey] === attackerKey) return 0.89;
    return 1;
  }

  async function loadMap() {
    const topo = await d3.json('data/states-10m.json');
    const stateObject = topo.objects.states;
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
      return {
        id,
        abbr,
        name: feature.properties.name,
        region: REGION_BY_ABBR[abbr] || 'East',
        terrain: TERRAIN_BY_REGION[REGION_BY_ABBR[abbr] || 'East'],
        neighbors: neighborById[id] || [],
        path: mapModel.pathGenerator(feature),
        centroid,
      };
    });

    mapModel.statesById = Object.fromEntries(mapModel.states.map((state) => [state.id, state]));
  }

  function renderMapScaffold() {
    const fillFragment = document.createDocumentFragment();
    const borderFragment = document.createDocumentFragment();
    const labelFragment = document.createDocumentFragment();

    mapModel.states.forEach((state) => {
      const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
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

      const borderPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      borderPath.setAttribute('d', state.path);
      borderPath.setAttribute('fill', 'none');
      borderPath.setAttribute('stroke', 'rgba(54,42,28,0.6)');
      borderPath.setAttribute('stroke-width', '0.9');
      borderPath.style.pointerEvents = 'none';
      borderFragment.append(borderPath);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', String(state.centroid[0]));
      label.setAttribute('y', String(state.centroid[1]));
      label.setAttribute('dy', '0.35em');
      label.classList.add('state-label');
      label.textContent = state.abbr;
      labelFragment.append(label);
    });

    FILL_LAYER.append(fillFragment);
    BORDER_LAYER.append(borderFragment);
    LABEL_LAYER.append(labelFragment);
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

  function initializeCampaign(startStateId) {
    const playerState = mapModel.statesById[startStateId];
    const playerRegion = playerState.region;
    const playerTrait = pickTrait(playerRegion);

    const factionById = {
      player: {
        id: 'player',
        name: `${playerState.name} Crown`,
        color: '#6d3f30',
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
        doctrine: randomItem(['fabian', 'feigned', 'siege']),
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
        ownerFactionId,
        levies: clamp(Math.round(prosperity * 1.55 + randInt(8, 36)), 40, 300),
        supply: clamp(Math.round(58 * terrainFactor.supply + randInt(-8, 8)), 18, 120),
        prosperity,
        fort: clamp(Math.round(1 + (terrainFactor.defense - 1) * 8 + Math.random() * 2), 0, 6),
        pressure: 50,
        neighbors: [...mapState.neighbors],
        centroid: [...mapState.centroid],
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
      allocations: { levies: 45, siege: 30, civil: 25 },
      queue: [],
      chronicle: [`Season 1: ${factionById.player.name} claims ${playerState.name} and calls banners to war.`],
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
      const civicIndex = states.reduce((sum, stateRecord) => {
        const terrainProsperity = TERRAIN_MODIFIERS[stateRecord.terrain].prosperity;
        return sum + stateRecord.prosperity * terrainProsperity;
      }, 0);

      const levyGain = civicIndex * 0.2 * levyShare * trait.levy;
      const goldGain = civicIndex * (0.2 + 0.3 * civilShare) * trait.gold;
      const rationGain = civicIndex * (0.17 + 0.25 * civilShare) * trait.ration;
      faction.resources.levies = clamp(faction.resources.levies + levyGain, 0, 999999);
      faction.resources.gold = clamp(faction.resources.gold + goldGain, 0, 999999);
      faction.resources.rations = clamp(faction.resources.rations + rationGain, 0, 999999);

      const perStateLevies = levyGain / Math.max(states.length, 1);
      const perStateSupply = rationGain / Math.max(states.length, 1) / 16;

      states.forEach((stateRecord) => {
        stateRecord.levies = clamp(stateRecord.levies + Math.round(perStateLevies * (0.72 + Math.random() * 0.5)), 8, 460);
        stateRecord.supply = clamp(stateRecord.supply + Math.round(perStateSupply * (0.84 + Math.random() * 0.45)), 10, 140);
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

    const attackPower = source.levies
      * attackerDoctrine.attack
      * attackerFaction.traitEffect.levy
      * attackerDoctrine.supply
      * supplyFactor
      * rationPressure
      * doctrineEdge;

    const defensePower = target.levies
      * defenderDoctrine.defense
      * defenderFaction.traitEffect.defense
      * terrainDefense
      * (1 + target.fort * 0.06);

    return {
      ratio: attackPower / Math.max(defensePower, 1),
      sourceConnected,
      defenderDoctrineKey,
    };
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
    transferControl(target, action.attackerFactionId, controlShift);
    const ownerAfter = target.ownerFactionId;

    queueAttackVector(c, source.id, target.id, action.attackerFactionId);

    const attackerVisible = visibilitySetForFog.has(source.id) || visibilitySetForFog.has(target.id);
    if (!attackerVisible && !attackerFaction.isPlayer) {
      return `Rumors of fierce fighting spread beyond ${target.region}. The map’s ink shifts overnight.`;
    }

    if (ownerBefore !== ownerAfter) {
      return `${attackerFaction.name} captures ${target.name} from ${defenderFaction.name} (${Math.max(controlShift, 1)}% border swing).`;
    }
    if (controlShift > 0) {
      return `${attackerFaction.name} pushes deeper into ${target.name} (+${controlShift}% control).`;
    }
    return `${attackerFaction.name} is repelled at ${target.name} after heavy losses.`;
  }

  function chooseAIDoctrine(c, faction, sourceState, targetState) {
    const connected = isSupplyConnected(c, faction.id, sourceState.id);
    if (!connected || faction.resources.rations < faction.statesOwned * 82) return 'fabian';
    if ((targetState.terrain === 'mountain' || targetState.terrain === 'hills') && faction.aggression > 0.55) return 'siege';
    if (faction.aggression > 0.65) return 'feigned';
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
    const doctrineKey = EL.campaignDoctrine.value;
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

  function applyAllocationInputs() {
    if (!campaign) return;
    let levies = Number(EL.allocLevies.value);
    let siege = Number(EL.allocSiege.value);
    let civil = Number(EL.allocCivil.value);
    const total = levies + siege + civil;
    if (total !== 100) {
      civil = clamp(civil + (100 - total), 10, 60);
    }
    campaign.allocations = { levies, siege, civil };
    EL.allocLevies.value = String(levies);
    EL.allocSiege.value = String(siege);
    EL.allocCivil.value = String(civil);
    renderAllocationReadouts();
  }

  function renderAllocationReadouts() {
    EL.allocLeviesReadout.textContent = toFixedPercent(Number(EL.allocLevies.value));
    EL.allocSiegeReadout.textContent = toFixedPercent(Number(EL.allocSiege.value));
    EL.allocCivilReadout.textContent = toFixedPercent(Number(EL.allocCivil.value));
  }

  function renderDoctrineOptions() {
    const options = Object.values(DOCTRINES)
      .map((doctrine) => `<option value="${doctrine.key}">${doctrine.label}</option>`)
      .join('');
    EL.playerDoctrine.innerHTML = options;
    EL.campaignDoctrine.innerHTML = options;
  }

  function renderStartStateOptions(defaultStateId = '48') {
    EL.startState.innerHTML = mapModel.states
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((state) => `<option value="${state.id}">${state.name} (${state.abbr})</option>`)
      .join('');
    EL.startState.value = defaultStateId;
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
      const option = document.createElement('option');
      option.value = targetState.id;
      option.textContent = `${targetState.name} (${targetState.abbr}) · ${Math.round(dominant.share)}% ${campaign.factionsById[dominant.factionId].name}`;
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
      EL.actionQueue.textContent = 'No maneuvers queued.';
      return;
    }
    EL.actionQueue.innerHTML = campaign.queue
      .map((action, index) => {
        const sourceState = campaign.statesById[action.sourceId];
        const targetState = campaign.statesById[action.targetId];
        return `<div class="queue-item">${index + 1}. ${sourceState.abbr} -> ${targetState.abbr} · ${DOCTRINES[action.doctrineKey].label} · Pressure ${action.intensity}%</div>`;
      })
      .join('');
  }

  function visibilityForPlayer() {
    return visibleStateSet(campaign);
  }

  function renderTheater() {
    if (!campaign || !campaign.selectedStateId || !campaign.statesById[campaign.selectedStateId]) {
      EL.theaterTitle.textContent = 'Select a state from the map.';
      EL.theaterOwner.textContent = 'Control percentages and supply conditions appear here.';
      EL.theaterControlLedger.innerHTML = '';
      EL.theaterPressure.value = '50';
      EL.theaterPressureReadout.textContent = '50%';
      return;
    }

    const stateRecord = campaign.statesById[campaign.selectedStateId];
    const owner = campaign.factionsById[stateRecord.ownerFactionId];
    const visible = visibilityForPlayer().has(stateRecord.id) || stateRecord.ownerFactionId === campaign.playerFactionId;
    const connected = isSupplyConnected(campaign, stateRecord.ownerFactionId, stateRecord.id);
    const dominant = dominantControl(stateRecord);

    EL.theaterTitle.textContent = `${stateRecord.name} (${stateRecord.abbr})`;
    EL.theaterOwner.textContent = [
      `Liege: ${owner.name}`,
      visible ? `Levies ${Math.round(stateRecord.levies)} · Supply ${Math.round(stateRecord.supply)} · Fort ${stateRecord.fort}` : 'Enemy levy totals obscured by fog of war.',
      `Dominant control: ${Math.round(dominant.share)}%`,
      `Supply line: ${connected ? 'Connected' : 'Cut'}`,
    ].join(' | ');

    const controlRows = Object.entries(stateRecord.control)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([factionId, share]) => `<div>${campaign.factionsById[factionId].name}: ${share.toFixed(1)}%</div>`)
      .join('');
    EL.theaterControlLedger.innerHTML = controlRows;

    stateRecord.pressure = clamp(stateRecord.pressure ?? 50, 0, 100);
    EL.theaterPressure.value = String(stateRecord.pressure);
    EL.theaterPressureReadout.textContent = `${Math.round(stateRecord.pressure)}%`;
  }

  function blendHex(hex, amount) {
    const normalized = hex.replace('#', '');
    const r = parseInt(normalized.substring(0, 2), 16);
    const g = parseInt(normalized.substring(2, 4), 16);
    const b = parseInt(normalized.substring(4, 6), 16);
    const clampColor = (value) => clamp(Math.round(value), 0, 255);
    const blended = [
      clampColor(r + (255 - r) * amount),
      clampColor(g + (255 - g) * amount),
      clampColor(b + (255 - b) * amount),
    ];
    return `rgb(${blended[0]}, ${blended[1]}, ${blended[2]})`;
  }

  function renderMapStateStyles() {
    if (!campaign) return;
    const pathElements = FILL_LAYER.querySelectorAll('.state-shape');
    pathElements.forEach((pathElement) => {
      const stateId = pathElement.getAttribute('data-state-id');
      const stateRecord = campaign.statesById[stateId];
      const dominant = dominantControl(stateRecord);
      const ownerFaction = campaign.factionsById[dominant.factionId];
      const contested = dominant.share < 86 || Object.values(stateRecord.control).filter((share) => share > 8).length > 1;
      const brightness = (100 - dominant.share) / 170;
      pathElement.style.fill = blendHex(ownerFaction.color, brightness);
      pathElement.classList.toggle('state-contested', contested);
      pathElement.classList.toggle('state-selected', campaign.selectedStateId === stateId);
    });
  }

  function renderAttackVectors() {
    if (!campaign) return;
    VECTOR_LAYER.innerHTML = '';
    const fragment = document.createDocumentFragment();
    campaign.vectors.forEach((vector) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.classList.add('attack-vector');
      const opacity = clamp(vector.ttl / vector.maxTtl, 0.15, 1);
      line.setAttribute('x1', String(vector.from[0]));
      line.setAttribute('y1', String(vector.from[1]));
      line.setAttribute('x2', String(vector.to[0]));
      line.setAttribute('y2', String(vector.to[1]));
      line.setAttribute('stroke-opacity', opacity.toFixed(2));
      fragment.append(line);
    });
    VECTOR_LAYER.append(fragment);
  }

  function renderHUDMetrics() {
    if (!campaign) return;
    const playerFaction = campaign.factionsById[campaign.playerFactionId];
    EL.metricLevies.textContent = shortNumber(playerFaction.resources.levies);
    EL.metricGold.textContent = shortNumber(playerFaction.resources.gold);
    EL.metricRations.textContent = shortNumber(playerFaction.resources.rations);
    EL.metricSeason.textContent = String(campaign.season);
    EL.metricRealm.textContent = playerFaction.name;
    EL.metricHoldings.textContent = `${playerFaction.statesOwned} / 48`;
    EL.metricStatus.textContent = campaign.status;
    EL.playerDoctrine.value = playerFaction.doctrine;
    EL.campaignDoctrine.value = playerFaction.doctrine;
    EL.doctrineNote.textContent = DOCTRINES[playerFaction.doctrine].note;
  }

  function renderAll() {
    if (!campaign) return;
    renderHUDMetrics();
    renderAllocationReadouts();
    renderSourceTargetOptions();
    renderQueue();
    renderChronicle();
    renderTheater();
    renderMapStateStyles();
    renderAttackVectors();
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
    ROOT.addEventListener('mousedown', (event) => {
      const interactive = event.target.closest('.hud-panel, .hud-ribbon, button, select, input, #tutorial-overlay, #settings-overlay');
      if (interactive || event.button !== 0) return;
      dragging = true;
      ROOT.classList.add('dragging');
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
      ROOT.classList.remove('dragging');
    });

    ROOT.addEventListener('wheel', (event) => {
      const interactive = event.target.closest('.hud-panel, .hud-ribbon, button, select, input, #tutorial-overlay, #settings-overlay');
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
    const width = Math.floor(window.innerWidth * dpr);
    const height = Math.floor(window.innerHeight * dpr);
    if (ASH_CANVAS.width !== width || ASH_CANVAS.height !== height) {
      ASH_CANVAS.width = width;
      ASH_CANVAS.height = height;
      ASH_CANVAS.style.width = `${window.innerWidth}px`;
      ASH_CANVAS.style.height = `${window.innerHeight}px`;
    }
  }

  function spawnParticlesForContestedStates() {
    if (!campaign) return;
    const contestedStates = Object.values(campaign.statesById).filter((stateRecord) => {
      const controlValues = Object.values(stateRecord.control).sort((a, b) => b - a);
      return controlValues.length > 1 && controlValues[0] < 90;
    });

    contestedStates.forEach((stateRecord) => {
      if (Math.random() > 0.16) return;
      const point = screenPointFromWorld(stateRecord.centroid[0], stateRecord.centroid[1]);
      if (point.x < -40 || point.x > window.innerWidth + 40 || point.y < -40 || point.y > window.innerHeight + 40) return;
      particles.push({
        x: point.x + (Math.random() - 0.5) * 16,
        y: point.y + (Math.random() - 0.5) * 9,
        vx: (Math.random() - 0.5) * 0.24,
        vy: -(0.25 + Math.random() * 0.66),
        life: 36 + Math.random() * 32,
        maxLife: 64,
        size: 1 + Math.random() * 1.9,
      });
    });
  }

  function animateLayer(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const delta = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    resizeCanvas();
    const ctx = ASH_CANVAS.getContext('2d');
    ctx.clearRect(0, 0, ASH_CANVAS.width, ASH_CANVAS.height);
    ctx.save();
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    spawnParticlesForContestedStates();

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
      ctx.beginPath();
      ctx.fillStyle = `rgba(94, 42, 42, ${alpha * 0.36})`;
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

  function setupPanelToggle(button, panel, axisClass) {
    button.addEventListener('click', () => {
      panel.classList.toggle('panel-collapsed');
      panel.classList.toggle(axisClass);
    });
  }

  function openSettings() {
    EL.settingsOverlay.style.display = 'flex';
  }

  function closeSettings() {
    EL.settingsOverlay.style.display = 'none';
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
        ownerFactionId: 'player',
        levies: 60,
        supply: 50,
        prosperity: 65,
        fort: 1,
        pressure: 50,
        neighbors: [...mapState.neighbors],
        centroid: [...mapState.centroid],
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
        traitId: entry.traitId,
        traitName: entry.traitName,
        traitSummary: entry.traitSummary,
        traitEffect: entry.traitEffect,
        isPlayer: Boolean(entry.isPlayer),
        aggression: Number(entry.aggression || 0),
        doctrine: entry.doctrine || 'fabian',
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
      allocations: {
        levies: Number(raw.allocLevies ?? 45),
        siege: Number(raw.allocSiege ?? 30),
        civil: Number(raw.allocCivil ?? 25),
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

  function setTutorialTarget(element) {
    document.querySelectorAll('.tutorial-target').forEach((node) => node.classList.remove('tutorial-target'));
    if (element) element.classList.add('tutorial-target');
  }

  function showTutorialStep(index) {
    tutorialIndex = clamp(index, 0, tutorialSteps.length - 1);
    const step = tutorialSteps[tutorialIndex];
    EL.tutorialText.textContent = step.text;
    setTutorialTarget(step.target);
    EL.tutorialBack.classList.toggle('hidden', tutorialIndex === 0);
    EL.tutorialNext.classList.toggle('hidden', tutorialIndex >= tutorialSteps.length - 1);
    EL.tutorialClose.classList.toggle('hidden', tutorialIndex < tutorialSteps.length - 1);
  }

  function openTutorial() {
    EL.tutorialOverlay.style.display = 'flex';
    showTutorialStep(0);
  }

  function closeTutorial() {
    EL.tutorialOverlay.style.display = 'none';
    setTutorialTarget(null);
  }

  function setupEvents() {
    EL.newCampaign.addEventListener('click', () => {
      stopAutoAdvance();
      campaign = initializeCampaign(EL.startState.value);
      camera = { x: 0, y: 0, scale: 1 };
      applyCamera();
      persistCampaign();
      renderAll();
    });

    EL.playerDoctrine.addEventListener('change', () => {
      updatePlayerDoctrine(EL.playerDoctrine.value);
    });

    [EL.allocLevies, EL.allocSiege, EL.allocCivil].forEach((slider) => {
      slider.addEventListener('input', () => {
        applyAllocationInputs();
      });
      slider.addEventListener('change', () => {
        if (!campaign) return;
        campaign.chronicle.unshift(`Season ${campaign.season}: Royal allocation revised.`);
        campaign.chronicle = campaign.chronicle.slice(0, 200);
        renderAll();
      });
    });

    EL.sourceState.addEventListener('change', () => {
      renderTargetOptions(EL.sourceState.value);
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

    EL.theaterPressure.addEventListener('input', () => {
      if (!campaign || !campaign.selectedStateId) return;
      const stateRecord = campaign.statesById[campaign.selectedStateId];
      if (!stateRecord) return;
      stateRecord.pressure = Number(EL.theaterPressure.value);
      EL.theaterPressureReadout.textContent = `${Math.round(stateRecord.pressure)}%`;
    });

    EL.openSettings.addEventListener('click', openSettings);
    EL.closeSettings.addEventListener('click', closeSettings);
    EL.exportSave.addEventListener('click', exportCampaign);
    EL.importSave.addEventListener('click', importCampaignFromFile);
    EL.wipeSave.addEventListener('click', wipeSave);

    EL.tutorialBack.addEventListener('click', () => showTutorialStep(tutorialIndex - 1));
    EL.tutorialNext.addEventListener('click', () => showTutorialStep(tutorialIndex + 1));
    EL.tutorialClose.addEventListener('click', closeTutorial);

    setupPanelToggle(EL.toggleWarRoom, EL.panelWarRoom, 'left');
    setupPanelToggle(EL.toggleChronicle, EL.panelChronicle, 'right');
    setupPanelToggle(EL.toggleDeclarations, EL.panelDeclarations, 'bottom');
    setupPanelToggle(EL.toggleTheater, EL.panelTheater, 'right');

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
    setupEvents();

    const restored = restoreCampaign();
    const hadNoCampaign = !restored;
    if (restored) {
      campaign = restored;
      camera = { ...campaign.camera };
    } else {
      campaign = initializeCampaign(EL.startState.value || '48');
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

  initialize();
})();
