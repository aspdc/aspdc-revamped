import { TRAIT_IDS, type TraitId, type TraitVector } from './types'
import { emptyTraitVector } from './traits'

export type CharacterId =
    | 'walter-white'
    | 'heisenberg'
    | 'jesse-pinkman'
    | 'gus-fring'
    | 'mike-ehrmantraut'
    | 'saul-goodman'
    | 'gale-boetticher'
    | 'hank-schrader'
    | 'tuco-salamanca'
    | 'todd'
    | 'skinny-pete'
    | 'badger'
    | 'lydia'
    | 'don-eladio'
    | 'the-cousins'

export type CharacterProfile = {
    id: CharacterId
    name: string
    traits: TraitVector
    summary: string
}

export type CharacterMatch = {
    id: CharacterId
    name: string
    similarity: number
    explanation: string
}

function traits(partial: Partial<Record<TraitId, number>>): TraitVector {
    const base = emptyTraitVector(40)
    for (const id of TRAIT_IDS) {
        if (partial[id] !== undefined) {
            base[id] = partial[id]!
        }
    }
    return base
}

export const CHARACTER_PROFILES: CharacterProfile[] = [
    {
        id: 'walter-white',
        name: 'Walter White',
        summary:
            'Methodical builder who turns quiet competence into empire-scale output.',
        traits: traits({
            Builder: 88,
            Architect: 82,
            Scientist: 95,
            Explorer: 55,
            TeamPlayer: 35,
            Mentor: 70,
            Leadership: 85,
            Consistency: 90,
            Discipline: 92,
            Curiosity: 80,
            Creativity: 75,
            Documentation: 70,
            OpenSource: 40,
            Communication: 55,
            Chaos: 45,
        }),
    },
    {
        id: 'heisenberg',
        name: 'Heisenberg',
        summary:
            'High-purity specialist whose chaos and control sit in the same lab coat.',
        traits: traits({
            Builder: 90,
            Architect: 78,
            Scientist: 98,
            Explorer: 50,
            TeamPlayer: 20,
            Mentor: 40,
            Leadership: 95,
            Consistency: 85,
            Discipline: 96,
            Curiosity: 70,
            Creativity: 80,
            Documentation: 60,
            OpenSource: 25,
            Communication: 40,
            Chaos: 88,
        }),
    },
    {
        id: 'jesse-pinkman',
        name: 'Jesse Pinkman',
        summary:
            'Chaotic creative who learns in public and ships with heart over polish.',
        traits: traits({
            Builder: 70,
            Architect: 35,
            Scientist: 55,
            Explorer: 85,
            TeamPlayer: 75,
            Mentor: 45,
            Leadership: 40,
            Consistency: 35,
            Discipline: 30,
            Curiosity: 90,
            Creativity: 92,
            Documentation: 25,
            OpenSource: 65,
            Communication: 70,
            Chaos: 90,
        }),
    },
    {
        id: 'gus-fring',
        name: 'Gus Fring',
        summary:
            'Quiet systems thinker who scales process until the operation looks legitimate.',
        traits: traits({
            Builder: 80,
            Architect: 95,
            Scientist: 70,
            Explorer: 40,
            TeamPlayer: 60,
            Mentor: 55,
            Leadership: 98,
            Consistency: 95,
            Discipline: 97,
            Curiosity: 50,
            Creativity: 55,
            Documentation: 85,
            OpenSource: 35,
            Communication: 65,
            Chaos: 15,
        }),
    },
    {
        id: 'mike-ehrmantraut',
        name: 'Mike Ehrmantraut',
        summary:
            'No-nonsense operator who values clean process, loyalty, and fewer moving parts.',
        traits: traits({
            Builder: 75,
            Architect: 80,
            Scientist: 45,
            Explorer: 35,
            TeamPlayer: 70,
            Mentor: 85,
            Leadership: 80,
            Consistency: 92,
            Discipline: 94,
            Curiosity: 40,
            Creativity: 35,
            Documentation: 75,
            OpenSource: 30,
            Communication: 50,
            Chaos: 20,
        }),
    },
    {
        id: 'saul-goodman',
        name: 'Saul Goodman',
        summary:
            'Persuasive communicator who can talk any messy PR into looking intentional.',
        traits: traits({
            Builder: 45,
            Architect: 50,
            Scientist: 35,
            Explorer: 70,
            TeamPlayer: 80,
            Mentor: 60,
            Leadership: 75,
            Consistency: 55,
            Discipline: 40,
            Curiosity: 75,
            Creativity: 85,
            Documentation: 55,
            OpenSource: 50,
            Communication: 98,
            Chaos: 70,
        }),
    },
    {
        id: 'gale-boetticher',
        name: 'Gale Boetticher',
        summary:
            'Gentle scientist who documents everything and treats the craft as poetry.',
        traits: traits({
            Builder: 70,
            Architect: 75,
            Scientist: 96,
            Explorer: 60,
            TeamPlayer: 65,
            Mentor: 80,
            Leadership: 35,
            Consistency: 88,
            Discipline: 90,
            Curiosity: 92,
            Creativity: 70,
            Documentation: 98,
            OpenSource: 55,
            Communication: 60,
            Chaos: 10,
        }),
    },
    {
        id: 'hank-schrader',
        name: 'Hank Schrader',
        summary:
            'Aggressive investigator energy — loud, persistent, and oddly good under pressure.',
        traits: traits({
            Builder: 60,
            Architect: 45,
            Scientist: 50,
            Explorer: 80,
            TeamPlayer: 70,
            Mentor: 55,
            Leadership: 75,
            Consistency: 70,
            Discipline: 65,
            Curiosity: 85,
            Creativity: 50,
            Documentation: 60,
            OpenSource: 40,
            Communication: 80,
            Chaos: 55,
        }),
    },
    {
        id: 'tuco-salamanca',
        name: 'Tuco Salamanca',
        summary:
            'Volatile force-multiplier whose output spikes hard and rarely stays stable.',
        traits: traits({
            Builder: 65,
            Architect: 20,
            Scientist: 30,
            Explorer: 55,
            TeamPlayer: 25,
            Mentor: 15,
            Leadership: 70,
            Consistency: 20,
            Discipline: 15,
            Curiosity: 40,
            Creativity: 45,
            Documentation: 10,
            OpenSource: 25,
            Communication: 55,
            Chaos: 98,
        }),
    },
    {
        id: 'todd',
        name: 'Todd',
        summary:
            'Calm executor who follows the recipe precisely and never asks why.',
        traits: traits({
            Builder: 78,
            Architect: 55,
            Scientist: 60,
            Explorer: 30,
            TeamPlayer: 50,
            Mentor: 25,
            Leadership: 40,
            Consistency: 85,
            Discipline: 88,
            Curiosity: 35,
            Creativity: 25,
            Documentation: 50,
            OpenSource: 30,
            Communication: 35,
            Chaos: 40,
        }),
    },
    {
        id: 'skinny-pete',
        name: 'Skinny Pete',
        summary:
            'Loyal collaborator who keeps the group chat alive and the vibe intact.',
        traits: traits({
            Builder: 40,
            Architect: 25,
            Scientist: 30,
            Explorer: 50,
            TeamPlayer: 90,
            Mentor: 55,
            Leadership: 30,
            Consistency: 45,
            Discipline: 35,
            Curiosity: 55,
            Creativity: 60,
            Documentation: 30,
            OpenSource: 70,
            Communication: 75,
            Chaos: 50,
        }),
    },
    {
        id: 'badger',
        name: 'Badger',
        summary:
            'Curious dabbler with wild ideas, half-finished labs, and unexpectedly good stories.',
        traits: traits({
            Builder: 35,
            Architect: 20,
            Scientist: 40,
            Explorer: 75,
            TeamPlayer: 80,
            Mentor: 40,
            Leadership: 25,
            Consistency: 30,
            Discipline: 25,
            Curiosity: 85,
            Creativity: 88,
            Documentation: 20,
            OpenSource: 75,
            Communication: 70,
            Chaos: 65,
        }),
    },
    {
        id: 'lydia',
        name: 'Lydia',
        summary:
            'Precise optimizer obsessed with margins, logistics, and looking unbothered.',
        traits: traits({
            Builder: 70,
            Architect: 90,
            Scientist: 65,
            Explorer: 35,
            TeamPlayer: 40,
            Mentor: 30,
            Leadership: 85,
            Consistency: 90,
            Discipline: 93,
            Curiosity: 45,
            Creativity: 40,
            Documentation: 80,
            OpenSource: 20,
            Communication: 70,
            Chaos: 25,
        }),
    },
    {
        id: 'don-eladio',
        name: 'Don Eladio',
        summary:
            'Old-school empire energy — delegates freely, expects results, hosts the party.',
        traits: traits({
            Builder: 55,
            Architect: 60,
            Scientist: 35,
            Explorer: 40,
            TeamPlayer: 50,
            Mentor: 45,
            Leadership: 92,
            Consistency: 60,
            Discipline: 55,
            Curiosity: 35,
            Creativity: 40,
            Documentation: 35,
            OpenSource: 30,
            Communication: 75,
            Chaos: 60,
        }),
    },
    {
        id: 'the-cousins',
        name: 'The Cousins',
        summary:
            'Silent dual-core duo: relentless focus, zero small talk, mission over everything.',
        traits: traits({
            Builder: 85,
            Architect: 50,
            Scientist: 40,
            Explorer: 30,
            TeamPlayer: 95,
            Mentor: 20,
            Leadership: 45,
            Consistency: 90,
            Discipline: 95,
            Curiosity: 25,
            Creativity: 20,
            Documentation: 40,
            OpenSource: 15,
            Communication: 10,
            Chaos: 35,
        }),
    },
]

function cosineSimilarity(a: TraitVector, b: TraitVector): number {
    let dot = 0
    let magA = 0
    let magB = 0
    for (const id of TRAIT_IDS) {
        dot += a[id] * b[id]
        magA += a[id] ** 2
        magB += b[id] ** 2
    }
    if (magA === 0 || magB === 0) return 0
    return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

function explanationFor(profile: CharacterProfile, similarity: number): string {
    const topTraits = [...TRAIT_IDS]
        .sort((left, right) => profile.traits[right] - profile.traits[left])
        .slice(0, 2)
    return `${profile.summary} Your ${topTraits.join(' / ')} profile aligns at ${similarity}%.`
}

export function assignCharacter(vector: TraitVector): CharacterMatch[] {
    return CHARACTER_PROFILES.map((profile) => {
        const similarity = Math.round(
            cosineSimilarity(vector, profile.traits) * 100
        )
        return {
            id: profile.id,
            name: profile.name,
            similarity,
            explanation: explanationFor(profile, similarity),
        }
    })
        .sort((left, right) => {
            if (right.similarity !== left.similarity) {
                return right.similarity - left.similarity
            }
            return left.id.localeCompare(right.id)
        })
        .slice(0, 3)
}
