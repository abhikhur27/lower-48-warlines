'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  createCampaignPlanner,
} = require('../campaign-planner');

const planner = createCampaignPlanner();

function faction(id, overrides = {}) {
  return {
    id,
    doctrine: 'fabian',
    capitalStateId: id === 'player' ? 'TX' : 'OK',
    statesOwned: 1,
    resources: { gold: 300, levies: 260, rations: 260 },
    traitEffect: { levy: 1, defense: 1, siege: 1, supply: 1 },
    ...overrides,
  };
}

function state(id, ownerFactionId, neighbors, overrides = {}) {
  return {
    id,
    abbr: id,
    name: id,
    ownerFactionId,
    neighbors,
    terrain: 'plains',
    levies: 120,
    supply: 60,
    fort: 1,
    pressure: 50,
    frontline: true,
    control: { [ownerFactionId]: 100 },
    buff: null,
    ...overrides,
  };
}

function campaign(statesById, options = {}) {
  const capitalStateId = options.capitalStateId || 'TX';
  const playerHoldings = Object.values(statesById).filter((entry) => entry.ownerFactionId === 'player').length;
  return {
    playerFactionId: 'player',
    queue: options.queue || [],
    factionsById: {
      player: faction('player', { capitalStateId, statesOwned: playerHoldings, ...(options.player || {}) }),
      enemy: faction('enemy', { capitalStateId: options.enemyCapitalStateId || 'OK', statesOwned: Object.keys(statesById).length - playerHoldings, ...(options.enemy || {}) }),
    },
    statesById,
  };
}

test('Texas opening favors the softer Oklahoma lane', () => {
  const game = campaign({
    TX: state('TX', 'player', ['OK', 'NM'], { levies: 190 }),
    OK: state('OK', 'enemy', ['TX'], { levies: 105, terrain: 'plains' }),
    NM: state('NM', 'enemy', ['TX'], { levies: 150, terrain: 'mountain', fort: 2 }),
  });

  const plans = planner.buildPlayerCampaignPlans(game, 3);

  assert.equal(plans[0].sourceId, 'TX');
  assert.equal(plans[0].targetId, 'OK');
  assert.equal(plans[0].estimate.sourceConnected, true);
  assert.ok(plans[0].predictedShift > plans[1].predictedShift);
});

test('Pennsylvania opening prefers New Jersey over the harder Ohio front', () => {
  const game = campaign({
    PA: state('PA', 'player', ['OH', 'NJ'], { levies: 175 }),
    OH: state('OH', 'enemy', ['PA'], { levies: 145, terrain: 'forest', fort: 2 }),
    NJ: state('NJ', 'enemy', ['PA'], { levies: 92, terrain: 'coastal' }),
  }, { capitalStateId: 'PA', enemyCapitalStateId: 'OH' });

  const plans = planner.buildPlayerCampaignPlans(game, 2);

  assert.equal(plans[0].sourceId, 'PA');
  assert.equal(plans[0].targetId, 'NJ');
  assert.ok(plans[0].score > plans[1].score);
});

test('forecast output stays deterministic for a fixed maneuver', () => {
  const game = campaign({
    TX: state('TX', 'player', ['OK'], { levies: 190, supply: 72, pressure: 65 }),
    OK: state('OK', 'enemy', ['TX'], { levies: 105, fort: 1 }),
  });
  const action = {
    attackerFactionId: 'player',
    sourceId: 'TX',
    targetId: 'OK',
    doctrineKey: 'siege',
    intensity: 65,
  };

  const estimate = planner.estimateCampaign(game, action);
  const shift = planner.predictControlShift(game, action, estimate);
  const costs = planner.projectBattleCosts(game, action, estimate);

  assert.equal(Number(estimate.ratio.toFixed(6)), 1.790649);
  assert.equal(shift, 18);
  assert.deepEqual(costs, {
    attackerLoss: 18,
    defenderLoss: 43,
    attackerSupplyCost: 6,
    defenderSupplyCost: 6,
  });
});

test('a supplied frontier suppresses tempting attacks from an isolated holding', () => {
  const game = campaign({
    CA: state('CA', 'player', ['NV'], { frontline: false }),
    NV: state('NV', 'player', ['CA', 'UT'], { levies: 115 }),
    UT: state('UT', 'enemy', ['NV'], { levies: 160, terrain: 'mountain', fort: 3 }),
    TX: state('TX', 'player', ['OK'], { levies: 300 }),
    OK: state('OK', 'enemy', ['TX'], { levies: 60 }),
  }, { capitalStateId: 'CA', enemyCapitalStateId: 'UT' });

  const plans = planner.buildPlayerCampaignPlans(game, 3);

  assert.deepEqual(plans.map((plan) => `${plan.sourceId}:${plan.targetId}`), ['NV:UT']);
  assert.equal(plans[0].estimate.sourceConnected, true);
});

test('an isolated route remains visible as recovery guidance when it is the only front', () => {
  const game = campaign({
    CA: state('CA', 'player', [], { frontline: false }),
    TX: state('TX', 'player', ['OK'], { levies: 260 }),
    OK: state('OK', 'enemy', ['TX'], { levies: 80 }),
  }, { capitalStateId: 'CA', enemyCapitalStateId: 'OK' });

  const [plan] = planner.buildPlayerCampaignPlans(game, 1);

  assert.equal(plan.estimate.sourceConnected, false);
  assert.equal(planner.classifyCampaignPlan(plan), 'Recover supply first');
  assert.equal(plan.costs.attackerSupplyCost, 13);
});

test('queued routes are excluded from reserve recommendations', () => {
  const game = campaign({
    TX: state('TX', 'player', ['OK', 'NM'], { levies: 190 }),
    OK: state('OK', 'enemy', ['TX'], { levies: 105 }),
    NM: state('NM', 'enemy', ['TX'], { levies: 150, terrain: 'mountain' }),
  }, {
    queue: [{ sourceId: 'TX', targetId: 'OK', attackerFactionId: 'player', doctrineKey: 'siege', intensity: 50 }],
  });

  const plans = planner.buildPlayerCampaignPlans(game, 3);

  assert.deepEqual(plans.map((plan) => plan.targetId), ['NM']);
});

test('recommendation ordering is stable when candidate scores tie', () => {
  const first = campaign({
    TX: state('TX', 'player', ['OK', 'AR'], { levies: 160 }),
    OK: state('OK', 'enemy', ['TX'], { levies: 120 }),
    AR: state('AR', 'enemy', ['TX'], { levies: 120 }),
  });
  const second = campaign({
    AR: state('AR', 'enemy', ['TX'], { levies: 120 }),
    OK: state('OK', 'enemy', ['TX'], { levies: 120 }),
    TX: state('TX', 'player', ['OK', 'AR'], { levies: 160 }),
  });

  const firstOrder = planner.buildPlayerCampaignPlans(first, 2).map((plan) => plan.targetId);
  const secondOrder = planner.buildPlayerCampaignPlans(second, 2).map((plan) => plan.targetId);

  assert.deepEqual(firstOrder, ['AR', 'OK']);
  assert.deepEqual(secondOrder, firstOrder);
});
