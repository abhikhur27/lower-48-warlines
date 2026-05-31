(() => {
  'use strict';

  const DATA = (() => {
    const STATES = [
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
    ];

    const TERRAIN = {
      plains: { defense: 1.0, supply: 1.03, yield: 1.02 },
      coastal: { defense: 1.05, supply: 1.0, yield: 1.04 },
      forest: { defense: 1.09, supply: 0.96, yield: 1.01 },
      hills: { defense: 1.13, supply: 0.92, yield: 0.98 },
      mountain: { defense: 1.17, supply: 0.88, yield: 0.95 },
      desert: { defense: 1.03, supply: 0.86, yield: 0.93 },
    };

    const DOCTRINES = {
      fabian: {
        key: 'fabian',
        label: 'Fabian Attrition',
        attack: 0.92,
        defense: 1.16,
        siege: 0.94,
        supply: 1.12,
        detail: 'Delay and drain the invader. Strong defensive depth and supply retention.',
      },
      feigned: {
        key: 'feigned',
        label: 'Feigned Retreat',
        attack: 1.08,
        defense: 0.97,
        siege: 0.98,
        supply: 0.99,
        detail: 'Lure forces out of posture then counter. High maneuver and opportunistic strikes.',
      },
      siege: {
        key: 'siege',
        label: 'Siegeworks',
        attack: 1.01,
        defense: 1.03,
        siege: 1.17,
        supply: 0.94,
        detail: 'Engineers and fort-breakers. Best at sustained control transfer in fortified states.',
      },
    };

    const DOCTRINE_COUNTERS = {
      fabian: 'feigned',
      feigned: 'siege',
      siege: 'fabian',
    };

    const TRAITS = [
      {
        id: 'agrarian',
        name: 'Granary Charters',
        summary: '+14% ration yield, +4% civil stability gain.',
        regions: ['Plains', 'Midwest', 'South'],
        effect: { ration: 1.14, civil: 1.04, levy: 1.0, siege: 1.0, defense: 1.0, supply: 1.03 },
      },
      {
        id: 'mountaineers',
        name: 'Fierce Mountaineers',
        summary: '+10% defense in hills/mountains, +6% attrition resistance.',
        regions: ['West', 'East', 'South'],
        effect: { ration: 1.0, civil: 1.0, levy: 1.0, siege: 0.98, defense: 1.06, supply: 1.06 },
      },
      {
        id: 'riverlords',
        name: 'Riverlord Caravans',
        summary: '+12% gold yield, +5% supply flow.',
        regions: ['Midwest', 'South', 'East'],
        effect: { ration: 1.02, civil: 1.08, levy: 1.0, siege: 1.0, defense: 1.0, supply: 1.05 },
      },
      {
        id: 'ironforges',
        name: 'Ironforge Guilds',
        summary: '+11% levy reinforcement, +5% siege pressure.',
        regions: ['Midwest', 'West', 'Plains'],
        effect: { ration: 0.98, civil: 1.0, levy: 1.11, siege: 1.05, defense: 1.0, supply: 1.0 },
      },
      {
        id: 'borderraiders',
        name: 'Border Raider Hosts',
        summary: '+9% attack push, -4% civil output.',
        regions: ['West', 'South', 'Plains'],
        effect: { ration: 0.98, civil: 0.96, levy: 1.05, siege: 1.03, defense: 1.0, supply: 1.0 },
      },
      {
        id: 'clerks',
        name: 'Ledgered Chanceries',
        summary: '+10% civil output and steadier doctrine adaptation.',
        regions: ['East', 'Midwest'],
        effect: { ration: 1.01, civil: 1.1, levy: 0.99, siege: 1.0, defense: 1.02, supply: 1.0 },
      },
    ];

    const REGION_NAMING = {
      West: {
        adjectives: ['Frontier', 'Sierra', 'High Mesa', 'Sunset Range', 'Cinder Canyon'],
        nouns: ['Marches', 'Compact', 'Wardens', 'League', 'Dominion'],
      },
      Plains: {
        adjectives: ['Prairie', 'Longhorn', 'Dustwind', 'Great Plain', 'Red River'],
        nouns: ['Confederacy', 'Sultanate', 'Host', 'Union', 'Stewardship'],
      },
      Midwest: {
        adjectives: ['Rust-Belt', 'Lakeshore', 'Iron Prairie', 'Grain Crown', 'Heartland'],
        nouns: ['Hegemony', 'Consortium', 'Tribunal', 'Cantons', 'Compact'],
      },
      South: {
        adjectives: ['Appalachian', 'Delta', 'Magnolia', 'Cypress', 'Gulfward'],
        nouns: ['Clans', 'Bannerholds', 'Dominion', 'League', 'Regency'],
      },
      East: {
        adjectives: ['Old Dominion', 'Harbor', 'Atlantic', 'Granite', 'Charter'],
        nouns: ['Synod', 'Commonwealth', 'Ward', 'Order', 'Hegemony'],
      },
    };

    const PALETTE = ['#b1623f', '#486141', '#8d3f34', '#6e5a39', '#3d6074', '#7a4e68', '#5f4a82', '#6f4e2a', '#4c6b5b'];
    const STORAGE_KEY = 'continental_feuds_campaign_v2';
    const SAVE_VERSION = 2;
    const LOOKUP = Object.fromEntries(STATES.map((state) => [state.id, state]));

    return {
      STATES,
      LOOKUP,
      TERRAIN,
      DOCTRINES,
      DOCTRINE_COUNTERS,
      TRAITS,
      REGION_NAMING,
      PALETTE,
      STORAGE_KEY,
      SAVE_VERSION,
    };
  })();

  const UTIL = (() => {
    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomChoice(items) {
      if (!items.length) return null;
      return items[Math.floor(Math.random() * items.length)];
    }

    function shuffle(array) {
      const next = [...array];
      for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    }

    function sum(values) {
      return values.reduce((total, value) => total + value, 0);
    }

    function shortNumber(value) {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
      return String(Math.round(value));
    }

    function toTitleCase(text) {
      return text
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }

    function colorWithAlpha(hex, alpha) {
      const clean = hex.replace('#', '');
      const normalized = clean.length === 3 ? clean.split('').map((char) => `${char}${char}`).join('') : clean;
      const r = Number.parseInt(normalized.slice(0, 2), 16);
      const g = Number.parseInt(normalized.slice(2, 4), 16);
      const b = Number.parseInt(normalized.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function makeId(prefix) {
      return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
    }

    return {
      clamp,
      randInt,
      randomChoice,
      shuffle,
      sum,
      shortNumber,
      toTitleCase,
      colorWithAlpha,
      makeId,
    };
  })();

  const LORE = (() => {
    function traitForRegion(region) {
      const regionTraits = DATA.TRAITS.filter((trait) => trait.regions.includes(region));
      return UTIL.randomChoice(regionTraits.length ? regionTraits : DATA.TRAITS);
    }

    function factionName(region, usedNames) {
      const kit = DATA.REGION_NAMING[region] || DATA.REGION_NAMING.East;
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const adjective = UTIL.randomChoice(kit.adjectives);
        const noun = UTIL.randomChoice(kit.nouns);
        const candidate = `The ${adjective} ${noun}`;
        if (!usedNames.has(candidate)) {
          usedNames.add(candidate);
          return candidate;
        }
      }
      const fallback = `The ${region} Ward ${usedNames.size + 1}`;
      usedNames.add(fallback);
      return fallback;
    }

    function playerFactionName(stateName) {
      const stems = ['March', 'Banner', 'Crown', 'Stewardship', 'Compact'];
      const suffix = UTIL.randomChoice(stems);
      return `${stateName} ${suffix}`;
    }

    return {
      traitForRegion,
      factionName,
      playerFactionName,
    };
  })();

  const WORLD = (() => {
    function makeStateTemplate(stateDefinition, ownerFactionId) {
      const terrain = DATA.TERRAIN[stateDefinition.terrain];
      const prosperityBase = stateDefinition.region === 'East' ? 76 : stateDefinition.region === 'Midwest' ? 74 : stateDefinition.region === 'South' ? 71 : stateDefinition.region === 'Plains' ? 68 : 66;
      const prosperity = UTIL.clamp(prosperityBase + UTIL.randInt(-8, 9), 48, 92);
      const levies = UTIL.clamp(Math.round(prosperity * 1.6 + UTIL.randInt(8, 26)), 48, 230);
      const supply = UTIL.clamp(Math.round(56 * terrain.supply + UTIL.randInt(-6, 8)), 32, 95);

      return {
        id: stateDefinition.id,
        name: stateDefinition.name,
        x: stateDefinition.x,
        y: stateDefinition.y,
        region: stateDefinition.region,
        terrain: stateDefinition.terrain,
        neighbors: [...stateDefinition.neighbors],
        prosperity,
        levies,
        supply,
        ownerFactionId,
        control: { [ownerFactionId]: 100 },
        frontline: false,
        fortification: UTIL.clamp(Math.round(1 + (DATA.TERRAIN[stateDefinition.terrain].defense - 1) * 8 + Math.random() * 2), 0, 5),
      };
    }

    function graphDistance(fromId, toId) {
      if (fromId === toId) return 0;
      const queue = [{ id: fromId, depth: 0 }];
      const seen = new Set([fromId]);
      while (queue.length) {
        const current = queue.shift();
        const state = DATA.LOOKUP[current.id];
        for (const neighbor of state.neighbors) {
          if (seen.has(neighbor)) continue;
          if (neighbor === toId) return current.depth + 1;
          seen.add(neighbor);
          queue.push({ id: neighbor, depth: current.depth + 1 });
        }
      }
      return Number.POSITIVE_INFINITY;
    }

    function majorityRegion(stateIds) {
      const tally = {};
      for (const stateId of stateIds) {
        const region = DATA.LOOKUP[stateId].region;
        tally[region] = (tally[region] || 0) + 1;
      }
      return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
    }

    function growClusters(seedIds, availableIds) {
      const clusters = seedIds.map((seed) => new Set([seed]));
      const unclaimed = new Set(availableIds.filter((id) => !seedIds.includes(id)));

      let guard = 0;
      while (unclaimed.size && guard < 350) {
        guard += 1;
        let progressThisRound = false;

        for (let clusterIndex = 0; clusterIndex < clusters.length; clusterIndex += 1) {
          const cluster = clusters[clusterIndex];
          const frontier = [];
          for (const stateId of cluster) {
            const neighbors = DATA.LOOKUP[stateId].neighbors;
            for (const neighborId of neighbors) {
              if (unclaimed.has(neighborId)) frontier.push(neighborId);
            }
          }

          if (!frontier.length) continue;
          const picked = UTIL.randomChoice(frontier);
          cluster.add(picked);
          unclaimed.delete(picked);
          progressThisRound = true;
        }

        if (!progressThisRound) {
          for (const stateId of [...unclaimed]) {
            let bestCluster = 0;
            let bestDistance = Number.POSITIVE_INFINITY;
            for (let clusterIndex = 0; clusterIndex < clusters.length; clusterIndex += 1) {
              const distanceCandidates = [...clusters[clusterIndex]].map((node) => graphDistance(node, stateId));
              const distance = Math.min(...distanceCandidates);
              if (distance < bestDistance) {
                bestDistance = distance;
                bestCluster = clusterIndex;
              }
            }
            clusters[bestCluster].add(stateId);
            unclaimed.delete(stateId);
          }
        }
      }

      return clusters.map((cluster) => [...cluster]);
    }

    function chooseFactionSeeds(stateIds, desiredCount) {
      const shuffled = UTIL.shuffle(stateIds);
      const seeds = [];
      for (const candidate of shuffled) {
        if (seeds.length >= desiredCount) break;
        if (!seeds.length) {
          seeds.push(candidate);
          continue;
        }
        const minDistance = Math.min(...seeds.map((seed) => graphDistance(seed, candidate)));
        if (minDistance >= 3) seeds.push(candidate);
      }

      let cursor = 0;
      while (seeds.length < desiredCount && cursor < shuffled.length) {
        const candidate = shuffled[cursor];
        if (!seeds.includes(candidate)) seeds.push(candidate);
        cursor += 1;
      }

      return seeds;
    }

    function generateFactions(startStateId) {
      const usedNames = new Set();
      const playerState = DATA.LOOKUP[startStateId];
      const playerFactionId = 'player';
      const playerRegion = playerState.region;
      const playerTrait = LORE.traitForRegion(playerRegion);

      const factions = {
        [playerFactionId]: {
          id: playerFactionId,
          name: LORE.playerFactionName(playerState.name),
          traitId: playerTrait.id,
          traitName: playerTrait.name,
          traitSummary: playerTrait.summary,
          traitEffect: playerTrait.effect,
          color: '#6e3b2b',
          capitalStateId: startStateId,
          isPlayer: true,
          aggression: 0.0,
          preferredDoctrine: 'fabian',
          resources: { gold: 280, levies: 220, rations: 210, siegeworks: 120 },
          statesOwned: 1,
          power: 0,
        },
      };

      const nonPlayerStates = DATA.STATES.filter((state) => state.id !== startStateId).map((state) => state.id);
      const aiFactionCount = UTIL.clamp(Math.round(nonPlayerStates.length / 6.8), 6, 9);
      const seeds = chooseFactionSeeds(nonPlayerStates, aiFactionCount);
      const clusters = growClusters(seeds, nonPlayerStates);

      const assignments = { [startStateId]: playerFactionId };

      clusters.forEach((cluster, index) => {
        const factionId = `ai-${index + 1}`;
        const region = majorityRegion(cluster);
        const trait = LORE.traitForRegion(region);
        const capitalStateId = cluster[Math.floor(Math.random() * cluster.length)];

        factions[factionId] = {
          id: factionId,
          name: LORE.factionName(region, usedNames),
          traitId: trait.id,
          traitName: trait.name,
          traitSummary: trait.summary,
          traitEffect: trait.effect,
          color: DATA.PALETTE[index % DATA.PALETTE.length],
          capitalStateId,
          isPlayer: false,
          aggression: 0.38 + Math.random() * 0.42,
          preferredDoctrine: UTIL.randomChoice(['fabian', 'feigned', 'siege']),
          resources: {
            gold: 240 + cluster.length * UTIL.randInt(36, 52),
            levies: 180 + cluster.length * UTIL.randInt(22, 34),
            rations: 170 + cluster.length * UTIL.randInt(20, 28),
            siegeworks: 90 + cluster.length * UTIL.randInt(12, 22),
          },
          statesOwned: cluster.length,
          power: 0,
        };

        cluster.forEach((stateId) => {
          assignments[stateId] = factionId;
        });
      });

      return {
        factions,
        assignments,
        playerFactionId,
      };
    }

    function createCampaign(startStateId) {
      const { factions, assignments, playerFactionId } = generateFactions(startStateId);
      const states = {};
      DATA.STATES.forEach((stateDefinition) => {
        states[stateDefinition.id] = makeStateTemplate(stateDefinition, assignments[stateDefinition.id]);
      });

      const campaign = {
        version: DATA.SAVE_VERSION,
        season: 1,
        playerFactionId,
        selectedStateId: startStateId,
        queue: [],
        autoAdvance: false,
        allocations: {
          levy: 45,
          siege: 25,
          civil: 30,
        },
        doctrineByFaction: Object.fromEntries(Object.values(factions).map((faction) => [faction.id, faction.preferredDoctrine])),
        states,
        factions,
        chronicle: [`Season 1: ${factions[playerFactionId].name} rises from ${DATA.LOOKUP[startStateId].name}.`],
        status: 'Live',
        lastSavedAt: null,
      };

      refreshOwnershipAndFrontline(campaign);
      recalculateFactionPower(campaign);

      return campaign;
    }

    function getDominantControl(state) {
      const entries = Object.entries(state.control).filter(([, share]) => share > 0.05);
      entries.sort((a, b) => b[1] - a[1]);
      const [factionId, share] = entries[0];
      return { factionId, share };
    }

    function normalizeControl(state) {
      const cleaned = {};
      let total = 0;
      for (const [factionId, share] of Object.entries(state.control)) {
        if (share <= 0.01) continue;
        cleaned[factionId] = share;
        total += share;
      }
      if (total <= 0) {
        cleaned[state.ownerFactionId] = 100;
        total = 100;
      }
      const normalized = {};
      for (const [factionId, share] of Object.entries(cleaned)) {
        normalized[factionId] = (share / total) * 100;
      }
      state.control = normalized;
    }

    function transferControl(state, attackerId, delta) {
      if (delta === 0) return;
      if (!state.control[attackerId]) state.control[attackerId] = 0;

      if (delta > 0) {
        let remaining = delta;
        const victims = Object.entries(state.control)
          .filter(([factionId]) => factionId !== attackerId)
          .sort((a, b) => b[1] - a[1]);

        for (const [victimId] of victims) {
          if (remaining <= 0) break;
          const available = state.control[victimId] || 0;
          const taken = Math.min(available, remaining);
          state.control[victimId] = available - taken;
          state.control[attackerId] += taken;
          remaining -= taken;
        }
      } else {
        const retreat = Math.abs(delta);
        const dominant = getDominantControl(state);
        const beneficiaryId = dominant.factionId === attackerId
          ? Object.entries(state.control)
              .filter(([factionId]) => factionId !== attackerId)
              .sort((a, b) => b[1] - a[1])[0]?.[0]
          : dominant.factionId;

        if (!beneficiaryId) return;
        const removed = Math.min(state.control[attackerId] || 0, retreat);
        state.control[attackerId] -= removed;
        state.control[beneficiaryId] = (state.control[beneficiaryId] || 0) + removed;
      }

      normalizeControl(state);
      const dominant = getDominantControl(state);
      state.ownerFactionId = dominant.factionId;
    }

    function ownedStateIds(campaign, factionId) {
      return Object.values(campaign.states)
        .filter((state) => state.ownerFactionId === factionId)
        .map((state) => state.id);
    }

    function refreshOwnershipAndFrontline(campaign) {
      const counts = {};
      Object.values(campaign.factions).forEach((faction) => {
        faction.statesOwned = 0;
      });

      Object.values(campaign.states).forEach((state) => {
        normalizeControl(state);
        const dominant = getDominantControl(state);
        state.ownerFactionId = dominant.factionId;
        counts[state.ownerFactionId] = (counts[state.ownerFactionId] || 0) + 1;
        state.frontline = state.neighbors.some((neighborId) => campaign.states[neighborId].ownerFactionId !== state.ownerFactionId);
      });

      Object.entries(counts).forEach(([factionId, amount]) => {
        if (campaign.factions[factionId]) {
          campaign.factions[factionId].statesOwned = amount;
        }
      });

      Object.values(campaign.factions).forEach((faction) => {
        if (faction.statesOwned === 0) {
          faction.resources.gold = 0;
          faction.resources.levies = 0;
          faction.resources.rations = 0;
          faction.resources.siegeworks = 0;
        } else if (!campaign.states[faction.capitalStateId] || campaign.states[faction.capitalStateId].ownerFactionId !== faction.id) {
          const replacement = ownedStateIds(campaign, faction.id)
            .sort((a, b) => campaign.states[b].prosperity - campaign.states[a].prosperity)[0];
          faction.capitalStateId = replacement;
        }
      });
    }

    function connectedToCapital(campaign, factionId, stateId) {
      const faction = campaign.factions[factionId];
      if (!faction || faction.statesOwned === 0) return false;
      const capital = faction.capitalStateId;
      if (!capital) return false;
      if (capital === stateId) return true;

      const queue = [capital];
      const seen = new Set([capital]);

      while (queue.length) {
        const currentId = queue.shift();
        const current = campaign.states[currentId];
        for (const neighborId of current.neighbors) {
          if (seen.has(neighborId)) continue;
          const neighbor = campaign.states[neighborId];
          if (neighbor.ownerFactionId !== factionId) continue;
          if (neighborId === stateId) return true;
          seen.add(neighborId);
          queue.push(neighborId);
        }
      }

      return false;
    }

    function recalculateFactionPower(campaign) {
      Object.values(campaign.factions).forEach((faction) => {
        const owned = Object.values(campaign.states).filter((state) => state.ownerFactionId === faction.id);
        const levyPower = UTIL.sum(owned.map((state) => state.levies));
        const supplyPower = UTIL.sum(owned.map((state) => state.supply));
        faction.power = Math.round(
          levyPower * 0.55
          + supplyPower * 0.35
          + faction.resources.gold * 0.16
          + faction.resources.siegeworks * 0.28
          + owned.length * 32
        );
      });
    }

    function visibilitySet(campaign) {
      const visible = new Set();
      const playerId = campaign.playerFactionId;
      Object.values(campaign.states).forEach((state) => {
        if (state.ownerFactionId === playerId) {
          visible.add(state.id);
          state.neighbors.forEach((neighborId) => visible.add(neighborId));
        }
      });
      return visible;
    }

    return {
      createCampaign,
      ownedStateIds,
      refreshOwnershipAndFrontline,
      connectedToCapital,
      recalculateFactionPower,
      visibilitySet,
      getDominantControl,
      transferControl,
    };
  })();

  const ENGINE = (() => {
    function doctrineAdvantage(attackerDoctrineKey, defenderDoctrineKey) {
      if (attackerDoctrineKey === defenderDoctrineKey) return 1;
      if (DATA.DOCTRINE_COUNTERS[attackerDoctrineKey] === defenderDoctrineKey) return 1.12;
      if (DATA.DOCTRINE_COUNTERS[defenderDoctrineKey] === attackerDoctrineKey) return 0.9;
      return 1;
    }

    function factionMultiplier(campaign, factionId, metric) {
      const faction = campaign.factions[factionId];
      if (!faction) return 1;
      return faction.traitEffect[metric] || 1;
    }

    function supplyFactor(campaign, factionId, sourceStateId) {
      const connected = WORLD.connectedToCapital(campaign, factionId, sourceStateId);
      const sourceState = campaign.states[sourceStateId];
      const faction = campaign.factions[factionId];
      const rationPressure = UTIL.clamp((faction.resources.rations + sourceState.supply * 2) / Math.max(1, faction.statesOwned * 180), 0.55, 1.26);
      if (!connected) return 0.7 * rationPressure;
      return 1.0 * rationPressure;
    }

    function estimateCampaignScore(campaign, attackerId, sourceState, targetState, doctrineKey) {
      const attackerDoctrine = DATA.DOCTRINES[doctrineKey];
      const defenderDoctrineKey = campaign.doctrineByFaction[targetState.ownerFactionId] || campaign.factions[targetState.ownerFactionId].preferredDoctrine;
      const defenderDoctrine = DATA.DOCTRINES[defenderDoctrineKey];

      const supply = supplyFactor(campaign, attackerId, sourceState.id) * attackerDoctrine.supply;
      const terrainDefense = DATA.TERRAIN[targetState.terrain].defense;
      const doctrineRps = doctrineAdvantage(doctrineKey, defenderDoctrineKey);
      const attackerTrait = factionMultiplier(campaign, attackerId, 'levy');
      const defenderTrait = factionMultiplier(campaign, targetState.ownerFactionId, 'defense');

      const attackStrength = sourceState.levies * attackerDoctrine.attack * attackerTrait * supply * doctrineRps;
      const defenseStrength = targetState.levies * defenderDoctrine.defense * terrainDefense * defenderTrait * (1 + targetState.fortification * 0.06);

      return {
        ratio: attackStrength / Math.max(defenseStrength, 1),
        supply,
        defenderDoctrineKey,
      };
    }

    function campaignResultMessage(campaign, details, visibility) {
      const attacker = campaign.factions[details.attackerId];
      const defender = campaign.factions[details.defenderId];
      const source = campaign.states[details.sourceId];
      const target = campaign.states[details.targetId];
      const visible = visibility.has(details.sourceId) || visibility.has(details.targetId);

      if (!visible && !details.isPlayerAction) {
        return `Rumors spread of heavy fighting near ${target.region}; scouts confirm banners shifting.`;
      }

      if (details.capture) {
        return `${attacker.name} wrests ${target.name} from ${defender.name} (${source.id} spearhead, ${details.controlShift}% control swing).`;
      }

      if (details.controlShift > 0) {
        return `${attacker.name} presses into ${target.name}: +${details.controlShift}% control. ${Math.round(details.attackerLoss)} levies spent.`;
      }

      return `${attacker.name} is repelled at ${target.name}; ${Math.round(details.attackerLoss)} levies lost under counterfire.`;
    }

    function executeCampaign(campaign, action, visibility) {
      const source = campaign.states[action.sourceId];
      const target = campaign.states[action.targetId];
      if (!source || !target) return null;
      if (source.ownerFactionId !== action.attackerId) return null;
      if (target.ownerFactionId === action.attackerId) return null;
      if (!source.neighbors.includes(target.id)) return null;

      const attackerId = action.attackerId;
      const defenderId = target.ownerFactionId;
      const doctrineKey = action.doctrineKey;
      const doctrine = DATA.DOCTRINES[doctrineKey];

      const score = estimateCampaignScore(campaign, attackerId, source, target, doctrineKey);
      const swingRandom = 0.9 + Math.random() * 0.22;
      const rawShift = (score.ratio - 0.88) * 15 * doctrine.siege * factionMultiplier(campaign, attackerId, 'siege') * swingRandom;
      const sourceSupplyPenalty = score.supply < 0.85 ? 2.7 : 0;
      let controlShift = Math.round(UTIL.clamp(rawShift - sourceSupplyPenalty, -10, 19));

      const defenderControlShare = target.control[defenderId] || 0;
      if (defenderControlShare < 18 && controlShift < 0) controlShift = Math.min(0, controlShift + 2);

      const attackCommit = Math.max(30, source.levies * 0.38);
      const defenseCommit = Math.max(30, target.levies * 0.44);

      const attackerLossBase = attackCommit * (0.11 + 0.22 * (1 / Math.max(score.ratio, 0.35)));
      const defenderLossBase = defenseCommit * (0.12 + 0.22 * Math.max(score.ratio, 0.48));
      const supplyAttrition = score.supply < 0.8 ? attackCommit * (0.08 + (0.8 - score.supply) * 0.25) : 0;

      const attackerLoss = Math.max(8, attackerLossBase + supplyAttrition);
      const defenderLoss = Math.max(6, defenderLossBase * (controlShift > 0 ? 1.06 : 0.78));

      source.levies = UTIL.clamp(source.levies - Math.round(attackerLoss), 10, 360);
      target.levies = UTIL.clamp(target.levies - Math.round(defenderLoss), 8, 360);

      source.supply = UTIL.clamp(source.supply - Math.round(5 + (1 - score.supply) * 12), 20, 120);
      target.supply = UTIL.clamp(target.supply - Math.round(Math.max(2, controlShift > 0 ? 6 : 3)), 18, 120);

      const ownerBefore = target.ownerFactionId;
      WORLD.transferControl(target, attackerId, controlShift);
      const ownerAfter = target.ownerFactionId;

      const attackerFaction = campaign.factions[attackerId];
      const defenderFaction = campaign.factions[defenderId];
      attackerFaction.resources.rations = UTIL.clamp(attackerFaction.resources.rations - Math.round(attackerLoss * 0.45), 0, 99999);
      defenderFaction.resources.rations = UTIL.clamp(defenderFaction.resources.rations - Math.round(defenderLoss * 0.3), 0, 99999);
      attackerFaction.resources.levies = UTIL.clamp(attackerFaction.resources.levies - Math.round(attackerLoss * 0.55), 0, 99999);
      defenderFaction.resources.levies = UTIL.clamp(defenderFaction.resources.levies - Math.round(defenderLoss * 0.35), 0, 99999);

      const details = {
        attackerId,
        defenderId,
        sourceId: source.id,
        targetId: target.id,
        attackerLoss,
        controlShift,
        capture: ownerBefore !== ownerAfter,
        isPlayerAction: action.isPlayerAction,
      };

      return { message: campaignResultMessage(campaign, details, visibility) };
    }

    function produceSeasonEconomy(campaign) {
      Object.values(campaign.factions).forEach((faction) => {
        if (faction.statesOwned <= 0) return;

        const ownedStates = Object.values(campaign.states).filter((state) => state.ownerFactionId === faction.id);
        const civicIndex = UTIL.sum(ownedStates.map((state) => state.prosperity * DATA.TERRAIN[state.terrain].yield));

        let levyShare;
        let siegeShare;
        let civilShare;

        if (faction.isPlayer) {
          levyShare = campaign.allocations.levy / 100;
          siegeShare = campaign.allocations.siege / 100;
          civilShare = campaign.allocations.civil / 100;
        } else {
          levyShare = UTIL.clamp(0.35 + faction.aggression * 0.38, 0.3, 0.72);
          siegeShare = UTIL.clamp(0.18 + faction.aggression * 0.2, 0.14, 0.44);
          civilShare = UTIL.clamp(1 - levyShare - siegeShare, 0.08, 0.36);
        }

        const trait = faction.traitEffect;

        const levyGain = civicIndex * levyShare * 0.22 * trait.levy;
        const siegeGain = civicIndex * siegeShare * 0.16 * trait.siege;
        const goldGain = civicIndex * (0.2 + civilShare * 0.34) * trait.civil;
        const rationGain = civicIndex * (0.18 + civilShare * 0.26) * trait.ration;

        faction.resources.levies = UTIL.clamp(faction.resources.levies + levyGain, 0, 250000);
        faction.resources.siegeworks = UTIL.clamp(faction.resources.siegeworks + siegeGain, 0, 250000);
        faction.resources.gold = UTIL.clamp(faction.resources.gold + goldGain, 0, 250000);
        faction.resources.rations = UTIL.clamp(faction.resources.rations + rationGain, 0, 250000);

        const perStateLevies = Math.max(1, levyGain / ownedStates.length);
        const perStateRations = Math.max(1, rationGain / ownedStates.length);

        ownedStates.forEach((state) => {
          state.levies = UTIL.clamp(state.levies + Math.round(perStateLevies * (0.75 + Math.random() * 0.55)), 8, 420);
          state.supply = UTIL.clamp(state.supply + Math.round((perStateRations / 16) * trait.supply), 16, 132);
        });
      });
    }

    function applySupplyAttrition(campaign, visibility) {
      const isolatedNotes = [];
      Object.values(campaign.factions).forEach((faction) => {
        if (faction.statesOwned <= 0) return;

        const ownedStates = Object.values(campaign.states).filter((state) => state.ownerFactionId === faction.id);
        let isolatedCount = 0;

        for (const state of ownedStates) {
          const connected = WORLD.connectedToCapital(campaign, faction.id, state.id);
          if (!connected) {
            isolatedCount += 1;
            const loss = Math.max(4, Math.round(state.levies * 0.08));
            state.levies = UTIL.clamp(state.levies - loss, 6, 420);
            state.supply = UTIL.clamp(state.supply - UTIL.randInt(7, 14), 12, 132);
            faction.resources.rations = UTIL.clamp(faction.resources.rations - loss * 0.5, 0, 99999);
          }
        }

        if (isolatedCount > 0) {
          if (faction.isPlayer) {
            isolatedNotes.push(`${faction.name} has ${isolatedCount} isolated holdings bleeding levies.`);
          } else {
            const visibleFaction = ownedStates.some((state) => visibility.has(state.id));
            if (visibleFaction) {
              isolatedNotes.push(`${faction.name} supply lines fray across ${isolatedCount} holdings.`);
            }
          }
        }
      });
      return isolatedNotes;
    }

    function chooseAiDoctrine(campaign, factionId, sourceState, targetState) {
      const faction = campaign.factions[factionId];
      const aggression = faction.aggression;
      const connected = WORLD.connectedToCapital(campaign, factionId, sourceState.id);
      const terrain = targetState.terrain;

      if (!connected || faction.resources.rations < faction.statesOwned * 80) return 'fabian';
      if (terrain === 'mountain' || terrain === 'hills') return aggression > 0.58 ? 'siege' : 'fabian';
      if (aggression > 0.66 && faction.resources.siegeworks > faction.statesOwned * 28) return 'siege';
      if (aggression > 0.5) return 'feigned';
      return faction.preferredDoctrine;
    }

    function planAiActions(campaign) {
      const plans = [];
      Object.values(campaign.factions).forEach((faction) => {
        if (faction.isPlayer || faction.statesOwned <= 0) return;

        const ownedFrontline = Object.values(campaign.states)
          .filter((state) => state.ownerFactionId === faction.id && state.frontline);

        if (!ownedFrontline.length) return;

        const actionsCount = faction.aggression > 0.7 ? 2 : 1;
        const scoredActions = [];

        ownedFrontline.forEach((sourceState) => {
          if (sourceState.levies < 35) return;
          sourceState.neighbors.forEach((neighborId) => {
            const targetState = campaign.states[neighborId];
            if (targetState.ownerFactionId === faction.id) return;

            const doctrineKey = chooseAiDoctrine(campaign, faction.id, sourceState, targetState);
            const score = estimateCampaignScore(campaign, faction.id, sourceState, targetState, doctrineKey);
            const targetControl = targetState.control[faction.id] || 0;
            const valueScore = targetState.prosperity * 0.15 + targetState.fortification * -2 + (100 - (targetState.control[targetState.ownerFactionId] || 0)) * 0.11;
            const finalScore = score.ratio * 18 + valueScore + targetControl * 0.2;

            scoredActions.push({
              attackerId: faction.id,
              sourceId: sourceState.id,
              targetId: targetState.id,
              doctrineKey,
              score: finalScore,
              isPlayerAction: false,
            });
          });
        });

        scoredActions.sort((a, b) => b.score - a.score);
        const uniqueTargets = new Set();
        for (const action of scoredActions) {
          if (plans.length >= 30) break;
          const key = `${action.sourceId}-${action.targetId}`;
          if (uniqueTargets.has(key)) continue;
          uniqueTargets.add(key);
          plans.push(action);
          if (uniqueTargets.size >= actionsCount) break;
        }
      });

      return plans;
    }

    function queueCampaign(campaign, sourceId, targetId, doctrineKey) {
      const source = campaign.states[sourceId];
      const target = campaign.states[targetId];
      if (!source || !target) return { ok: false, reason: 'Invalid route.' };
      if (source.ownerFactionId !== campaign.playerFactionId) return { ok: false, reason: 'Source must be under your rule.' };
      if (target.ownerFactionId === campaign.playerFactionId) return { ok: false, reason: 'Target is already allied.' };
      if (!source.neighbors.includes(targetId)) return { ok: false, reason: 'Campaign requires direct border adjacency.' };
      if (campaign.queue.length >= 5) return { ok: false, reason: 'Action queue full (max 5).' };

      campaign.queue.push({
        id: UTIL.makeId('camp'),
        attackerId: campaign.playerFactionId,
        sourceId,
        targetId,
        doctrineKey,
        isPlayerAction: true,
      });

      return { ok: true, reason: `${source.id} -> ${target.id} queued under ${DATA.DOCTRINES[doctrineKey].label}.` };
    }

    function updateCampaignStatus(campaign, notes) {
      const playerId = campaign.playerFactionId;
      const playerStates = Object.values(campaign.states).filter((state) => state.ownerFactionId === playerId).length;
      const liveFactions = Object.values(campaign.factions).filter((faction) => faction.statesOwned > 0).length;

      if (playerStates <= 0) {
        campaign.status = 'Defeat';
        notes.push('Your banner has fallen; no states remain under direct rule.');
        return;
      }

      if (playerStates === DATA.STATES.length) {
        campaign.status = 'Victory';
        notes.push('All 48 continental states now fly your standard.');
        return;
      }

      campaign.status = playerStates >= 24 ? 'Dominant' : 'Live';
      if (liveFactions <= 2 && campaign.status === 'Dominant') {
        notes.push('Only a handful of rivals remain. Final consolidation is in reach.');
      }
    }

    function runSeason(campaign) {
      if (campaign.status === 'Defeat' || campaign.status === 'Victory') return;

      const visibility = WORLD.visibilitySet(campaign);
      const seasonNotes = [];

      produceSeasonEconomy(campaign);

      if (campaign.queue.length) {
        const queued = [...campaign.queue];
        campaign.queue.length = 0;
        for (const action of queued) {
          const result = executeCampaign(campaign, action, visibility);
          if (result) seasonNotes.push(result.message);
        }
      }

      const aiPlans = planAiActions(campaign);
      for (const action of aiPlans) {
        const result = executeCampaign(campaign, action, visibility);
        if (result) seasonNotes.push(result.message);
      }

      const supplyNotes = applySupplyAttrition(campaign, visibility);
      supplyNotes.forEach((line) => seasonNotes.push(line));

      WORLD.refreshOwnershipAndFrontline(campaign);
      WORLD.recalculateFactionPower(campaign);

      campaign.season += 1;
      updateCampaignStatus(campaign, seasonNotes);

      seasonNotes.slice(0, 8).reverse().forEach((message) => {
        campaign.chronicle.unshift(`Season ${campaign.season - 1}: ${message}`);
      });
      campaign.chronicle = campaign.chronicle.slice(0, 180);
    }

    return {
      queueCampaign,
      runSeason,
    };
  })();

  const STORE = (() => {
    function save(campaign) {
      campaign.lastSavedAt = new Date().toISOString();
      localStorage.setItem(DATA.STORAGE_KEY, JSON.stringify(campaign));
    }

    function load() {
      const raw = localStorage.getItem(DATA.STORAGE_KEY);
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        if (!parsed || parsed.version !== DATA.SAVE_VERSION) return null;
        if (!parsed.states || !parsed.factions) return null;
        return parsed;
      } catch {
        return null;
      }
    }

    function wipe() {
      localStorage.removeItem(DATA.STORAGE_KEY);
    }

    function exportFile(campaign) {
      const payload = JSON.stringify(campaign, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `continental-feuds-save-season-${campaign.season}.json`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    }

    function importFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result));
            if (!parsed || parsed.version !== DATA.SAVE_VERSION || !parsed.states || !parsed.factions) {
              reject(new Error('Invalid save format.'));
              return;
            }
            resolve(parsed);
          } catch {
            reject(new Error('Could not parse save JSON.'));
          }
        };
        reader.onerror = () => reject(new Error('Unable to read selected file.'));
        reader.readAsText(file);
      });
    }

    return {
      save,
      load,
      wipe,
      exportFile,
      importFile,
    };
  })();

  const UI = (() => {
    const el = {
      loadingScreen: document.getElementById('loading-screen'),
      loadingBar: document.getElementById('loading-bar'),
      loadingLog: document.getElementById('loading-log'),
      seasonCount: document.getElementById('season-count'),
      playerFaction: document.getElementById('player-faction'),
      playerHoldings: document.getElementById('player-holdings'),
      campaignState: document.getElementById('campaign-state'),
      startState: document.getElementById('start-state'),
      newCampaign: document.getElementById('new-campaign'),
      goldReadout: document.getElementById('gold-readout'),
      levyReadout: document.getElementById('levy-readout'),
      rationReadout: document.getElementById('ration-readout'),
      allocLevy: document.getElementById('alloc-levy'),
      allocSiege: document.getElementById('alloc-siege'),
      allocCivil: document.getElementById('alloc-civil'),
      allocSummary: document.getElementById('alloc-summary'),
      playerDoctrine: document.getElementById('player-doctrine'),
      doctrineNote: document.getElementById('doctrine-note'),
      sourceState: document.getElementById('source-state'),
      targetState: document.getElementById('target-state'),
      queueCampaign: document.getElementById('queue-campaign'),
      advanceSeason: document.getElementById('advance-season'),
      toggleAuto: document.getElementById('toggle-auto'),
      mapGrid: document.getElementById('map-grid'),
      stateInspector: document.getElementById('state-inspector'),
      factionTable: document.getElementById('faction-table'),
      chronicleLog: document.getElementById('chronicle-log'),
      openSettings: document.getElementById('open-settings'),
      settingsModal: document.getElementById('settings-modal'),
      closeSettings: document.getElementById('close-settings'),
      exportSave: document.getElementById('export-save'),
      wipeSave: document.getElementById('wipe-save'),
      importSave: document.getElementById('import-save'),
      importFile: document.getElementById('import-file'),
    };

    const queuePanel = document.createElement('div');
    queuePanel.id = 'queued-actions';
    queuePanel.className = 'text-xs border border-[#8f7353]/35 rounded-md bg-[#fff9ee] px-2 py-2 min-h-[60px]';
    queuePanel.textContent = 'No campaigns queued.';
    el.queueCampaign.parentElement.append(queuePanel);

    function renderAllocations(campaign) {
      el.allocLevy.value = String(campaign.allocations.levy);
      el.allocSiege.value = String(campaign.allocations.siege);
      el.allocCivil.value = String(campaign.allocations.civil);
      el.allocSummary.textContent = `Levies ${campaign.allocations.levy}% · Siegeworks ${campaign.allocations.siege}% · Civil ${campaign.allocations.civil}%`;
    }

    function normalizeAllocationInputs(campaign) {
      const levy = Number(el.allocLevy.value);
      const siege = Number(el.allocSiege.value);
      const civil = Number(el.allocCivil.value);
      const total = levy + siege + civil;

      let nextCivil = civil;
      if (total !== 100) {
        const delta = 100 - total;
        nextCivil = UTIL.clamp(civil + delta, 10, 60);
      }

      campaign.allocations = {
        levy,
        siege,
        civil: nextCivil,
      };
      renderAllocations(campaign);
    }

    function renderDoctrineNote(campaign) {
      const key = campaign.doctrineByFaction[campaign.playerFactionId];
      const doctrine = DATA.DOCTRINES[key];
      el.doctrineNote.textContent = doctrine.detail;
    }

    function visibleSet(campaign) {
      return WORLD.visibilitySet(campaign);
    }

    function isFactionObserved(campaign, factionId, visibility) {
      if (factionId === campaign.playerFactionId) return true;
      return Object.values(campaign.states).some((state) => state.ownerFactionId === factionId && visibility.has(state.id));
    }

    function renderMap(campaign) {
      const visibility = visibleSet(campaign);
      const fragment = document.createDocumentFragment();

      DATA.STATES.forEach((layoutState) => {
        const state = campaign.states[layoutState.id];
        const owner = campaign.factions[state.ownerFactionId];
        const dominant = WORLD.getDominantControl(state);
        const visible = visibility.has(state.id) || state.ownerFactionId === campaign.playerFactionId;

        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'state-tile';
        tile.style.gridColumn = String(layoutState.x);
        tile.style.gridRow = String(layoutState.y);

        const density = UTIL.clamp(0.33 + dominant.share / 150, 0.3, 0.88);
        tile.style.background = `linear-gradient(165deg, ${UTIL.colorWithAlpha(owner.color, density)}, ${UTIL.colorWithAlpha(owner.color, density - 0.12)})`;

        if (state.ownerFactionId === campaign.playerFactionId) tile.classList.add('player');
        if (state.frontline) tile.classList.add('frontline');

        const troopText = visible ? String(Math.round(state.levies)) : '??';

        tile.innerHTML = [
          '<div class="w-full px-1">',
          `<div class="flex justify-between items-center"><span>${state.id}</span><span class="text-[10px]">${troopText}</span></div>`,
          '<div class="h-[6px] bg-black/15 rounded overflow-hidden mt-[2px]">',
          `<div class="h-full" style="width:${UTIL.clamp(dominant.share, 2, 100)}%; background:${owner.color}"></div>`,
          '</div>',
          `<small>${Math.round(dominant.share)}% control</small>`,
          '</div>',
        ].join('');

        tile.addEventListener('click', () => {
          campaign.selectedStateId = state.id;
          renderInspector(campaign);
        });

        fragment.append(tile);
      });

      el.mapGrid.innerHTML = '';
      el.mapGrid.append(fragment);
    }

    function renderInspector(campaign) {
      const visibility = visibleSet(campaign);
      const state = campaign.states[campaign.selectedStateId];
      if (!state) {
        el.stateInspector.textContent = 'Select a territory to inspect manor control, supply line, and defensive doctrine.';
        return;
      }

      const owner = campaign.factions[state.ownerFactionId];
      const visible = visibility.has(state.id) || state.ownerFactionId === campaign.playerFactionId;
      const playerShare = state.control[campaign.playerFactionId] || 0;
      const connected = WORLD.connectedToCapital(campaign, state.ownerFactionId, state.id);

      const controlRows = Object.entries(state.control)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([factionId, share]) => `${campaign.factions[factionId].name}: ${share.toFixed(1)}%`)
        .join(' · ');

      const doctrine = campaign.doctrineByFaction[state.ownerFactionId] || campaign.factions[state.ownerFactionId].preferredDoctrine;
      const doctrineLabel = DATA.DOCTRINES[doctrine].label;

      el.stateInspector.innerHTML = [
        `<strong>${state.name} (${state.id})</strong><br>`,
        `Liege: ${owner.name}<br>`,
        visible
          ? `Levies ${Math.round(state.levies)} · Supply ${Math.round(state.supply)} · Fort ${state.fortification}<br>`
          : 'Levies obscured by fog of war beyond adjacent borders.<br>',
        `Control Ledger: ${controlRows}<br>`,
        `Terrain ${UTIL.toTitleCase(state.terrain)} · Doctrine ${visible ? doctrineLabel : 'Obscured'} · Supply Line ${connected ? 'Connected' : 'Cut'}<br>`,
        `Your foothold in this state: ${playerShare.toFixed(1)}%`,
      ].join('');
    }

    function renderFactionTable(campaign) {
      const visibility = visibleSet(campaign);
      const rows = Object.values(campaign.factions)
        .filter((faction) => faction.statesOwned > 0)
        .sort((a, b) => b.statesOwned - a.statesOwned || b.power - a.power)
        .slice(0, 10);

      el.factionTable.innerHTML = rows
        .map((faction) => {
          const seen = isFactionObserved(campaign, faction.id, visibility);
          const warPower = seen ? UTIL.shortNumber(faction.power) : `~${UTIL.shortNumber(faction.statesOwned * 140)}`;
          return `<tr class="border-b border-[#8f7353]/20"><td class="py-1 pr-1">${faction.name}</td><td>${faction.statesOwned}</td><td>${warPower}</td></tr>`;
        })
        .join('');
    }

    function renderChronicle(campaign) {
      el.chronicleLog.innerHTML = campaign.chronicle
        .slice(0, 36)
        .map((entry) => `<div class="border-b border-[#8f7353]/20 pb-1">${entry.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`)
        .join('');
    }

    function renderQueue(campaign) {
      if (!campaign.queue.length) {
        queuePanel.textContent = 'No campaigns queued.';
        return;
      }
      queuePanel.innerHTML = campaign.queue
        .map((action, index) => {
          const doctrineLabel = DATA.DOCTRINES[action.doctrineKey].label;
          return `${index + 1}. ${action.sourceId} -> ${action.targetId} (${doctrineLabel})`;
        })
        .map((line) => `<div>${line}</div>`)
        .join('');
    }

    function renderResourceHeader(campaign) {
      const player = campaign.factions[campaign.playerFactionId];
      el.goldReadout.textContent = UTIL.shortNumber(player.resources.gold);
      el.levyReadout.textContent = UTIL.shortNumber(player.resources.levies);
      el.rationReadout.textContent = UTIL.shortNumber(player.resources.rations);

      el.seasonCount.textContent = String(campaign.season);
      el.playerFaction.textContent = player.name;
      el.playerHoldings.textContent = `${player.statesOwned} / 48`;
      el.campaignState.textContent = campaign.status;
    }

    function playerOwnedSources(campaign) {
      return Object.values(campaign.states)
        .filter((state) => state.ownerFactionId === campaign.playerFactionId && state.frontline)
        .sort((a, b) => b.levies - a.levies || a.name.localeCompare(b.name));
    }

    function renderSourceTargetOptions(campaign) {
      const sources = playerOwnedSources(campaign);
      el.sourceState.innerHTML = '';
      if (!sources.length) {
        el.sourceState.innerHTML = '<option value="">No frontline state available</option>';
        el.targetState.innerHTML = '<option value="">No target</option>';
        return;
      }

      sources.forEach((state) => {
        const option = document.createElement('option');
        option.value = state.id;
        option.textContent = `${state.name} (${state.id})`;
        el.sourceState.append(option);
      });

      if (!sources.some((state) => state.id === el.sourceState.value)) {
        el.sourceState.value = sources[0].id;
      }

      renderTargetOptionsFromSource(campaign, el.sourceState.value);
    }

    function renderTargetOptionsFromSource(campaign, sourceId) {
      const source = campaign.states[sourceId];
      el.targetState.innerHTML = '';
      if (!source) {
        el.targetState.innerHTML = '<option value="">No target</option>';
        return;
      }

      const targets = source.neighbors
        .map((neighborId) => campaign.states[neighborId])
        .filter((state) => state.ownerFactionId !== campaign.playerFactionId)
        .sort((a, b) => (a.control[campaign.playerFactionId] || 0) - (b.control[campaign.playerFactionId] || 0));

      if (!targets.length) {
        el.targetState.innerHTML = '<option value="">No adjacent enemy</option>';
        return;
      }

      targets.forEach((target) => {
        const control = WORLD.getDominantControl(target);
        const option = document.createElement('option');
        option.value = target.id;
        option.textContent = `${target.name} (${target.id}) · ${Math.round(control.share)}% ${campaign.factions[control.factionId].name}`;
        el.targetState.append(option);
      });
    }

    function populateStartStates(defaultId = 'TX') {
      el.startState.innerHTML = DATA.STATES
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((state) => `<option value="${state.id}">${state.name} (${state.id})</option>`)
        .join('');
      el.startState.value = defaultId;
    }

    function render(campaign) {
      renderResourceHeader(campaign);
      renderAllocations(campaign);
      renderDoctrineNote(campaign);
      renderQueue(campaign);
      renderSourceTargetOptions(campaign);
      renderMap(campaign);
      renderInspector(campaign);
      renderFactionTable(campaign);
      renderChronicle(campaign);
      el.playerDoctrine.value = campaign.doctrineByFaction[campaign.playerFactionId];
    }

    async function loadingSequence() {
      const lines = [
        'Inspecting parchment atlas layers...',
        'Checking 48-state adjacency codex...',
        'Drafting medieval faction treaties...',
        'Calibrating supply routes and ration tables...',
        'Forging doctrine matrices and campaign logs...',
        'Finalizing war room ledgers...'
      ];

      el.loadingLog.innerHTML = '';
      for (let i = 0; i < lines.length; i += 1) {
        const item = document.createElement('div');
        item.textContent = lines[i];
        el.loadingLog.prepend(item);
        el.loadingBar.style.width = `${Math.round(((i + 1) / lines.length) * 100)}%`;
        await new Promise((resolve) => setTimeout(resolve, 230 + i * 45));
      }

      await new Promise((resolve) => setTimeout(resolve, 260));
      el.loadingScreen.style.opacity = '0';
      await new Promise((resolve) => setTimeout(resolve, 560));
      el.loadingScreen.classList.add('hidden-soft');
    }

    function wireEvents(controller) {
      el.newCampaign.addEventListener('click', () => controller.startNewCampaign(el.startState.value));

      [el.allocLevy, el.allocSiege, el.allocCivil].forEach((slider) => {
        slider.addEventListener('input', () => controller.updateAllocations());
      });

      el.playerDoctrine.addEventListener('change', () => {
        controller.setPlayerDoctrine(el.playerDoctrine.value);
      });

      el.sourceState.addEventListener('change', () => {
        controller.refreshTargetOptions(el.sourceState.value);
      });

      el.queueCampaign.addEventListener('click', () => {
        controller.queueCampaign(el.sourceState.value, el.targetState.value, el.playerDoctrine.value);
      });

      el.advanceSeason.addEventListener('click', () => controller.advanceSeason());
      el.toggleAuto.addEventListener('click', () => controller.toggleAuto());

      el.openSettings.addEventListener('click', () => {
        el.settingsModal.classList.remove('hidden');
        el.settingsModal.classList.add('flex');
      });

      el.closeSettings.addEventListener('click', () => {
        el.settingsModal.classList.add('hidden');
        el.settingsModal.classList.remove('flex');
      });

      el.exportSave.addEventListener('click', () => controller.exportSave());
      el.wipeSave.addEventListener('click', () => controller.wipeSave());
      el.importSave.addEventListener('click', () => controller.importSave());
    }

    return {
      el,
      render,
      loadingSequence,
      populateStartStates,
      wireEvents,
      normalizeAllocationInputs,
      renderTargetOptionsFromSource,
    };
  })();

  const CONTROLLER = (() => {
    let campaign = null;
    let autoHandle = null;

    function chronicle(message) {
      if (!campaign) return;
      campaign.chronicle.unshift(`Season ${campaign.season}: ${message}`);
      campaign.chronicle = campaign.chronicle.slice(0, 180);
    }

    function saveAuto() {
      if (!campaign) return;
      STORE.save(campaign);
    }

    function setCampaign(nextCampaign, appendMessage = '') {
      campaign = nextCampaign;
      if (appendMessage) chronicle(appendMessage);
      WORLD.refreshOwnershipAndFrontline(campaign);
      WORLD.recalculateFactionPower(campaign);
      UI.render(campaign);
    }

    function stopAuto() {
      if (!autoHandle) return;
      clearInterval(autoHandle);
      autoHandle = null;
      if (campaign) campaign.autoAdvance = false;
      UI.el.toggleAuto.textContent = 'Auto: Off';
    }

    function startAuto() {
      if (autoHandle) return;
      campaign.autoAdvance = true;
      UI.el.toggleAuto.textContent = 'Auto: On';
      autoHandle = setInterval(() => {
        if (!campaign || campaign.status === 'Victory' || campaign.status === 'Defeat') {
          stopAuto();
          return;
        }
        advanceSeason();
      }, 1400);
    }

    function startNewCampaign(startStateId) {
      stopAuto();
      const fresh = WORLD.createCampaign(startStateId);
      setCampaign(fresh, `New chronicle opened with ${DATA.LOOKUP[startStateId].name} as your seat.`);
      saveAuto();
    }

    function updateAllocations() {
      if (!campaign) return;
      UI.normalizeAllocationInputs(campaign);
      chronicle(`Treasury allocation set to Levies ${campaign.allocations.levy}% / Siegeworks ${campaign.allocations.siege}% / Civil ${campaign.allocations.civil}%.`);
      UI.render(campaign);
    }

    function setPlayerDoctrine(doctrineKey) {
      if (!campaign || !DATA.DOCTRINES[doctrineKey]) return;
      campaign.doctrineByFaction[campaign.playerFactionId] = doctrineKey;
      chronicle(`Doctrine shifted to ${DATA.DOCTRINES[doctrineKey].label}.`);
      UI.render(campaign);
    }

    function refreshTargetOptions(sourceStateId) {
      if (!campaign) return;
      UI.renderTargetOptionsFromSource(campaign, sourceStateId);
    }

    function queueCampaign(sourceId, targetId, doctrineKey) {
      if (!campaign) return;
      const result = ENGINE.queueCampaign(campaign, sourceId, targetId, doctrineKey);
      chronicle(result.reason);
      UI.render(campaign);
    }

    function advanceSeason() {
      if (!campaign) return;
      if (campaign.status === 'Victory' || campaign.status === 'Defeat') {
        stopAuto();
        return;
      }
      ENGINE.runSeason(campaign);
      saveAuto();
      UI.render(campaign);
      if (campaign.status === 'Victory' || campaign.status === 'Defeat') {
        stopAuto();
      }
    }

    function toggleAuto() {
      if (!campaign) return;
      if (autoHandle) {
        stopAuto();
      } else {
        startAuto();
      }
    }

    function exportSave() {
      if (!campaign) return;
      STORE.exportFile(campaign);
      chronicle('Campaign exported to JSON.');
      UI.render(campaign);
    }

    function wipeSave() {
      STORE.wipe();
      chronicle('Local autosave wiped.');
      UI.render(campaign);
    }

    async function importSave() {
      if (!campaign) return;
      const file = UI.el.importFile.files?.[0];
      if (!file) {
        chronicle('Select a save file first.');
        UI.render(campaign);
        return;
      }
      try {
        const imported = await STORE.importFile(file);
        stopAuto();
        setCampaign(imported, 'Campaign imported from file.');
        saveAuto();
      } catch (error) {
        chronicle(error.message);
        UI.render(campaign);
      }
    }

    function loadOrCreate() {
      const existing = STORE.load();
      if (existing) {
        setCampaign(existing, 'Autosave restored from local storage.');
      } else {
        setCampaign(WORLD.createCampaign(UI.el.startState.value || 'TX'));
      }
    }

    async function init() {
      UI.populateStartStates('TX');
      UI.wireEvents({
        startNewCampaign,
        updateAllocations,
        setPlayerDoctrine,
        refreshTargetOptions,
        queueCampaign,
        advanceSeason,
        toggleAuto,
        exportSave,
        wipeSave,
        importSave,
      });
      await UI.loadingSequence();
      loadOrCreate();
    }

    return {
      init,
    };
  })();

  CONTROLLER.init();
})();
