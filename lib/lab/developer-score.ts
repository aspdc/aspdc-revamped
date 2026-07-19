import { TRAIT_IDS, type TraitId, type TraitVector } from './types'

const WEIGHTS: Record<TraitId, number> = {
    Builder: 1.2,
    Architect: 1.1,
    Scientist: 1.1,
    Explorer: 0.9,
    TeamPlayer: 1.0,
    Mentor: 0.9,
    Leadership: 1.1,
    Consistency: 1.2,
    Discipline: 1.2,
    Curiosity: 1.0,
    Creativity: 1.0,
    Documentation: 0.8,
    OpenSource: 0.9,
    Communication: 1.0,
    Chaos: 0.6,
}

const TOTAL_WEIGHT = TRAIT_IDS.reduce((sum, id) => sum + WEIGHTS[id], 0)

export function scoreDeveloper(vector: TraitVector): number {
    const weighted =
        TRAIT_IDS.reduce((sum, id) => sum + vector[id] * WEIGHTS[id], 0) /
        TOTAL_WEIGHT
    return Math.min(100, Math.max(0, Math.round(weighted)))
}
