(function exposeCampaignPlanner(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ContinentalFeudsCampaignPlanner = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  'use strict';

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

  const TERRAIN_MODIFIERS = {
    plains: { defense: 1.0, supply: 1.03, prosperity: 1.03 },
    coastal: { defense: 1.06, supply: 1.01, prosperity: 1.05 },
    forest: { defense: 1.1, supply: 0.98, prosperity: 1.0 },
    hills: { defense: 1.12, supply: 0.93, prosperity: 0.98 },
    mountain: { defense: 1.17, supply: 0.88, prosperity: 0.96 },
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function dominantControl(stateRecord) {
    return Object.entries(stateRecord.control || {})
      .map(([factionId, share]) => ({ factionId, share: Number(share) || 0 }))
      .sort((a, b) => b.share - a.share || a.factionId.localeCompare(b.factionId))[0]
      || { factionId: stateRecord.ownerFactionId, share: 100 };
  }

  function createCampaignPlanner(options = {}) {
    const doctrines = options.doctrines || DOCTRINES;
    const terrainModifiers = options.terrainModifiers || TERRAIN_MODIFIERS;

    function doctrineAdvantage(attackerKey, defenderKey) {
      if (attackerKey === defenderKey) return 1;
      const attacker = doctrines[attackerKey];
      const defender = doctrines[defenderKey];
      if (!attacker || !defender) return 1;
      if ((attacker.counters || []).includes(defenderKey)) return 1.12;
      if ((defender.counters || []).includes(attackerKey)) return 0.89;
      return 1;
    }

    function isSupplyConnected(campaign, factionId, stateId) {
      const faction = campaign.factionsById[factionId];
      if (!faction || faction.statesOwned <= 0) return false;
      if (faction.capitalStateId === stateId) return true;
      if (!campaign.statesById[faction.capitalStateId] || !campaign.statesById[stateId]) return false;

      const queue = [faction.capitalStateId];
      const seen = new Set(queue);
      while (queue.length) {
        const currentState = campaign.statesById[queue.shift()];
        for (const neighborId of currentState.neighbors) {
          if (seen.has(neighborId)) continue;
          const neighborState = campaign.statesById[neighborId];
          if (!neighborState || neighborState.ownerFactionId !== factionId) continue;
          if (neighborId === stateId) return true;
          seen.add(neighborId);
          queue.push(neighborId);
        }
      }
      return false;
    }

    function estimateCampaign(campaign, action) {
      const source = campaign.statesById[action.sourceId];
      const target = campaign.statesById[action.targetId];
      const attackerFaction = campaign.factionsById[action.attackerFactionId];
      const defenderFaction = target && campaign.factionsById[target.ownerFactionId];
      const attackerDoctrine = doctrines[action.doctrineKey];
      const defenderDoctrine = defenderFaction && doctrines[defenderFaction.doctrine];
      const terrain = target && terrainModifiers[target.terrain];
      if (!source || !target || !attackerFaction || !defenderFaction || !attackerDoctrine || !defenderDoctrine || !terrain) {
        return null;
      }

      const sourceConnected = isSupplyConnected(campaign, attackerFaction.id, source.id);
      const supplyFactor = sourceConnected ? 1.0 : 0.7;
      const rationPressure = clamp(
        (attackerFaction.resources.rations + source.supply * 2) / Math.max(attackerFaction.statesOwned * 170, 1),
        0.56,
        1.28,
      );
      const sourceBuff = source.buff?.effect || {};
      const targetBuff = target.buff?.effect || {};
      const attackPower = source.levies
        * attackerDoctrine.attack
        * attackerFaction.traitEffect.levy
        * attackerDoctrine.supply
        * supplyFactor
        * rationPressure
        * doctrineAdvantage(action.doctrineKey, defenderFaction.doctrine)
        * (sourceBuff.siege || 1)
        * (sourceBuff.supply || 1);
      const defensePower = target.levies
        * defenderDoctrine.defense
        * defenderFaction.traitEffect.defense
        * terrain.defense
        * (1 + target.fort * 0.06)
        * (targetBuff.defense || 1);

      return {
        ratio: attackPower / Math.max(defensePower, 1),
        sourceConnected,
        defenderDoctrineKey: defenderFaction.doctrine,
      };
    }

    function predictControlShift(campaign, action, estimate) {
      const source = campaign.statesById[action.sourceId];
      const attackerFaction = campaign.factionsById[action.attackerFactionId];
      const doctrine = doctrines[action.doctrineKey];
      if (!source || !attackerFaction || !doctrine || !estimate) return 0;
      const intensity = clamp(action.intensity ?? source.pressure ?? 50, 0, 100);
      const intensityFactor = 0.75 + intensity / 100 * 0.5;
      const shiftBase = (estimate.ratio - 0.86) * 15 * doctrine.siege * attackerFaction.traitEffect.siege * intensityFactor;
      return Math.round(clamp(shiftBase - (estimate.sourceConnected ? 0 : 3), -11, 20));
    }

    function projectBattleCosts(campaign, action, estimate) {
      const source = campaign.statesById[action.sourceId];
      const target = campaign.statesById[action.targetId];
      const attackerFaction = campaign.factionsById[action.attackerFactionId];
      const doctrine = doctrines[action.doctrineKey];
      if (!source || !target || !attackerFaction || !doctrine || !estimate) {
        return { attackerLoss: 0, defenderLoss: 0, attackerSupplyCost: 0, defenderSupplyCost: 0 };
      }
      const intensity = clamp(action.intensity ?? 50, 0, 100);
      const intensityFactor = 0.75 + intensity / 100 * 0.5;
      const shiftBase = (estimate.ratio - 0.86) * 15 * doctrine.siege * attackerFaction.traitEffect.siege * intensityFactor;
      const predictedShift = Math.round(clamp(shiftBase - (estimate.sourceConnected ? 0 : 3), -11, 20));
      const commitment = Math.max(24, source.levies * 0.4);
      const attackerLossBase = commitment * (0.12 + 0.21 * (1 / Math.max(estimate.ratio, 0.35)));
      const defenderLossBase = commitment * (0.1 + 0.24 * Math.max(estimate.ratio, 0.48));
      const attritionLoss = estimate.sourceConnected ? 0 : commitment * 0.08;
      return {
        attackerLoss: Math.max(8, Math.round(attackerLossBase + attritionLoss)),
        defenderLoss: Math.max(6, Math.round(defenderLossBase * (predictedShift > 0 ? 1.06 : 0.79))),
        attackerSupplyCost: Math.round(4 + (estimate.sourceConnected ? 2 : 9)),
        defenderSupplyCost: Math.round(predictedShift > 0 ? 6 : 3),
      };
    }

    function comparePlans(a, b) {
      return b.score - a.score
        || b.predictedShift - a.predictedShift
        || a.costs.attackerLoss - b.costs.attackerLoss
        || a.sourceAbbr.localeCompare(b.sourceAbbr)
        || a.targetAbbr.localeCompare(b.targetAbbr)
        || a.doctrineKey.localeCompare(b.doctrineKey);
    }

    function buildPlayerCampaignPlans(campaign, limit = 3) {
      if (!campaign) return [];
      const queuedKeys = new Set(campaign.queue.map((action) => `${action.sourceId}:${action.targetId}`));
      const candidates = [];

      Object.values(campaign.statesById).forEach((sourceState) => {
        if (sourceState.ownerFactionId !== campaign.playerFactionId || !sourceState.frontline) return;
        sourceState.neighbors.forEach((targetId) => {
          const targetState = campaign.statesById[targetId];
          if (!targetState || targetState.ownerFactionId === campaign.playerFactionId) return;
          if (queuedKeys.has(`${sourceState.id}:${targetState.id}`)) return;

          let bestRoutePlan = null;
          Object.keys(doctrines).sort().forEach((doctrineKey) => {
            const doctrine = doctrines[doctrineKey];
            const action = {
              attackerFactionId: campaign.playerFactionId,
              sourceId: sourceState.id,
              targetId: targetState.id,
              doctrineKey,
              intensity: sourceState.pressure ?? 50,
            };
            const estimate = estimateCampaign(campaign, action);
            if (!estimate) return;
            const predictedShift = predictControlShift(campaign, action, estimate);
            const costs = projectBattleCosts(campaign, action, estimate);
            const playerShare = targetState.control[campaign.playerFactionId] || 0;
            const dominant = dominantControl(targetState);
            const turns = predictedShift > 0
              ? Math.ceil(Math.max(1, dominant.share - playerShare + 1) / predictedShift)
              : null;
            const score = predictedShift * 14
              + estimate.ratio * 18
              + (estimate.sourceConnected ? 8 : -18)
              - costs.attackerLoss * 0.75
              - costs.attackerSupplyCost * 0.28
              - (turns ?? 6) * 1.4
              + costs.defenderLoss * 0.24
              + playerShare * 0.08;
            const plan = {
              sourceId: sourceState.id,
              targetId: targetState.id,
              sourceAbbr: sourceState.abbr,
              targetAbbr: targetState.abbr,
              doctrineKey,
              doctrineLabel: doctrine.label,
              predictedShift,
              estimate,
              costs,
              turns,
              playerShare,
              dominant,
              score,
            };
            if (!bestRoutePlan || comparePlans(plan, bestRoutePlan) < 0) bestRoutePlan = plan;
          });
          if (bestRoutePlan) candidates.push(bestRoutePlan);
        });
      });

      candidates.sort(comparePlans);
      const connectedCandidates = candidates.filter((plan) => plan.estimate.sourceConnected);
      const eligibleCandidates = connectedCandidates.length ? connectedCandidates : candidates;
      const requestedLimit = Math.max(0, Math.floor(Number(limit) || 0));
      const picked = [];
      const usedSources = new Set();
      const usedTargets = new Set();

      eligibleCandidates.forEach((plan) => {
        if (picked.length >= requestedLimit) return;
        if (usedSources.has(plan.sourceId) || usedTargets.has(plan.targetId)) return;
        picked.push(plan);
        usedSources.add(plan.sourceId);
        usedTargets.add(plan.targetId);
      });
      if (picked.length < requestedLimit) {
        eligibleCandidates.forEach((plan) => {
          if (picked.length >= requestedLimit) return;
          if (picked.some((existing) => existing.sourceId === plan.sourceId && existing.targetId === plan.targetId)) return;
          picked.push(plan);
        });
      }
      return picked;
    }

    function classifyCampaignPlan(plan) {
      if (!plan.estimate.sourceConnected) return 'Recover supply first';
      if (plan.predictedShift >= 12 && plan.estimate.ratio >= 1.18) return 'Breakthrough lane';
      if (plan.predictedShift >= 8) return 'Strong pressure';
      if (plan.predictedShift > 0) return 'Measured grind';
      return 'Risky probe';
    }

    return {
      buildPlayerCampaignPlans,
      classifyCampaignPlan,
      estimateCampaign,
      isSupplyConnected,
      predictControlShift,
      projectBattleCosts,
    };
  }

  return { DOCTRINES, TERRAIN_MODIFIERS, createCampaignPlanner };
});
