import { TRAIT_IDS, type TraitId, type TraitVector } from './types'

const WEIGHTS: Record<TraitId, number> = {
    Builder: 1.4,
    Architect: 1.0,
    Scientist: 1.2,
    Explorer: 1.1,
    TeamPlayer: 0.85,
    Mentor: 0.45,
    Leadership: 0.5,
    Consistency: 1.4,
    Discipline: 1.3,
    Curiosity: 1.2,
    Creativity: 1.2,
    Documentation: 1.0,
    OpenSource: 0.5,
    Communication: 0.5,
    Chaos: 0.5,
}

const TOTAL_WEIGHT = TRAIT_IDS.reduce((sum, id) => sum + WEIGHTS[id], 0)

export function scoreDeveloper(vector: TraitVector): number {
    const weighted =
        TRAIT_IDS.reduce((sum, id) => sum + vector[id] * WEIGHTS[id], 0) /
        TOTAL_WEIGHT
    return Math.min(100, Math.max(0, Math.round(weighted)))
}
