import { TRAIT_IDS, type TraitId, type TraitVector } from './types'
import { emptyTraitVector } from './traits'

export type CharacterId =
    | 'walter-white'
    | 'heisenberg'
    | 'jesse-pinkman'
    | 'gus-fring'
    | 'mike-ehrmantraut'
    | 'saul-goodman'
    | 'hank-schrader'
    | 'tuco-salamanca'
    | 'todd'
    | 'skinny-pete'
    | 'badger'
    | 'lydia'
    | 'hector-salamanca'
    | 'lalo-salamanca'

export type CharacterProfile = {
    id: CharacterId
    name: string
    traits: TraitVector
    summary: string
    image?: string
}

export function getCharacterImageUrl(id: CharacterId): string {
    return `/images/characters/${id}.webp`
}

export type CharacterMatch = {
    id: CharacterId
    name: string
    similarity: number
    explanation: string
    image?: string
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
            Builder: 95,
            Architect: 85,
            Scientist: 95,
            Explorer: 70,
            TeamPlayer: 35,
            Mentor: 75,
            Leadership: 70,
            Consistency: 95,
            Discipline: 95,
            Curiosity: 75,
            Creativity: 65,
            Documentation: 85,
            OpenSource: 40,
            Communication: 40,
            Chaos: 15,
        }),
    },
    {
        id: 'heisenberg',
        name: 'Heisenberg',
        summary:
            'High-purity specialist whose chaos and control sit in the same lab coat.',
        traits: traits({
            Builder: 96,
            Architect: 60,
            Scientist: 92,
            Explorer: 65,
            TeamPlayer: 20,
            Mentor: 25,
            Leadership: 92,
            Consistency: 65,
            Discipline: 85,
            Curiosity: 70,
            Creativity: 75,
            Documentation: 40,
            OpenSource: 20,
            Communication: 30,
            Chaos: 85,
        }),
    },
    {
        id: 'jesse-pinkman',
        name: 'Jesse Pinkman',
        summary:
            'Chaotic creative who learns in public and ships with heart over polish.',
        traits: traits({
            Builder: 55,
            Architect: 25,
            Scientist: 35,
            Explorer: 80,
            TeamPlayer: 70,
            Mentor: 30,
            Leadership: 25,
            Consistency: 30,
            Discipline: 25,
            Curiosity: 90,
            Creativity: 95,
            Documentation: 20,
            OpenSource: 75,
            Communication: 65,
            Chaos: 85,
        }),
    },
    {
        id: 'gus-fring',
        name: 'Gus Fring',
        summary:
            'Quiet systems thinker who scales process until the operation looks legitimate.',
        traits: traits({
            Builder: 85,
            Architect: 98,
            Scientist: 70,
            Explorer: 50,
            TeamPlayer: 45,
            Mentor: 45,
            Leadership: 92,
            Consistency: 95,
            Discipline: 98,
            Curiosity: 45,
            Creativity: 40,
            Documentation: 95,
            OpenSource: 25,
            Communication: 55,
            Chaos: 10,
        }),
    },
    {
        id: 'mike-ehrmantraut',
        name: 'Mike Ehrmantraut',
        summary:
            'No-nonsense operator who values clean process, loyalty, and fewer moving parts.',
        traits: traits({
            Builder: 80,
            Architect: 75,
            Scientist: 45,
            Explorer: 35,
            TeamPlayer: 78,
            Mentor: 90,
            Leadership: 60,
            Consistency: 95,
            Discipline: 92,
            Curiosity: 35,
            Creativity: 25,
            Documentation: 75,
            OpenSource: 30,
            Communication: 50,
            Chaos: 10,
        }),
    },
    {
        id: 'saul-goodman',
        name: 'Saul Goodman',
        summary:
            'Persuasive communicator who can talk any messy PR into looking intentional.',
        traits: traits({
            Builder: 35,
            Architect: 40,
            Scientist: 25,
            Explorer: 70,
            TeamPlayer: 88,
            Mentor: 60,
            Leadership: 65,
            Consistency: 45,
            Discipline: 35,
            Curiosity: 75,
            Creativity: 90,
            Documentation: 50,
            OpenSource: 65,
            Communication: 98,
            Chaos: 60,
        }),
    },
    {
        id: 'hank-schrader',
        name: 'Hank Schrader',
        summary:
            'Aggressive investigator energy — loud, persistent, and oddly good under pressure.',
        traits: traits({
            Builder: 75,
            Architect: 55,
            Scientist: 60,
            Explorer: 95,
            TeamPlayer: 70,
            Mentor: 60,
            Leadership: 80,
            Consistency: 85,
            Discipline: 80,
            Curiosity: 95,
            Creativity: 50,
            Documentation: 65,
            OpenSource: 50,
            Communication: 85,
            Chaos: 40,
        }),
    },
    {
        id: 'tuco-salamanca',
        name: 'Tuco Salamanca',
        summary:
            'Volatile force-multiplier whose output spikes hard and rarely stays stable.',
        traits: traits({
            Builder: 70,
            Architect: 15,
            Scientist: 20,
            Explorer: 45,
            TeamPlayer: 15,
            Mentor: 10,
            Leadership: 65,
            Consistency: 15,
            Discipline: 15,
            Curiosity: 35,
            Creativity: 45,
            Documentation: 5,
            OpenSource: 15,
            Communication: 45,
            Chaos: 98,
        }),
    },
    {
        id: 'todd',
        name: 'Todd',
        summary:
            'Calm executor who follows the recipe precisely and never asks why.',
        traits: traits({
            Builder: 88,
            Architect: 55,
            Scientist: 50,
            Explorer: 20,
            TeamPlayer: 45,
            Mentor: 20,
            Leadership: 30,
            Consistency: 95,
            Discipline: 95,
            Curiosity: 25,
            Creativity: 15,
            Documentation: 60,
            OpenSource: 25,
            Communication: 25,
            Chaos: 15,
        }),
    },
    {
        id: 'skinny-pete',
        name: 'Skinny Pete',
        summary:
            'Loyal collaborator who keeps the group chat alive and the vibe intact.',
        traits: traits({
            Builder: 30,
            Architect: 25,
            Scientist: 25,
            Explorer: 50,
            TeamPlayer: 95,
            Mentor: 65,
            Leadership: 25,
            Consistency: 55,
            Discipline: 40,
            Curiosity: 55,
            Creativity: 60,
            Documentation: 30,
            OpenSource: 85,
            Communication: 92,
            Chaos: 35,
        }),
    },
    {
        id: 'badger',
        name: 'Badger',
        summary:
            'Curious dabbler with wild ideas, half-finished labs, and unexpectedly good stories.',
        traits: traits({
            Builder: 25,
            Architect: 20,
            Scientist: 35,
            Explorer: 85,
            TeamPlayer: 75,
            Mentor: 35,
            Leadership: 15,
            Consistency: 25,
            Discipline: 20,
            Curiosity: 95,
            Creativity: 92,
            Documentation: 15,
            OpenSource: 75,
            Communication: 60,
            Chaos: 70,
        }),
    },
    {
        id: 'lydia',
        name: 'Lydia',
        summary:
            'Precise optimizer obsessed with margins, logistics, and looking unbothered.',
        traits: traits({
            Builder: 70,
            Architect: 95,
            Scientist: 60,
            Explorer: 30,
            TeamPlayer: 30,
            Mentor: 25,
            Leadership: 80,
            Consistency: 92,
            Discipline: 92,
            Curiosity: 35,
            Creativity: 30,
            Documentation: 98,
            OpenSource: 20,
            Communication: 60,
            Chaos: 10,
        }),
    },
    {
        id: 'hector-salamanca',
        name: 'Hector Salamanca',
        summary:
            'Stubborn veteran energy — short on words, long on persistence, refuses to quit the lab.',
        traits: traits({
            Builder: 85,
            Architect: 45,
            Scientist: 30,
            Explorer: 20,
            TeamPlayer: 35,
            Mentor: 70,
            Leadership: 75,
            Consistency: 92,
            Discipline: 95,
            Curiosity: 20,
            Creativity: 20,
            Documentation: 35,
            OpenSource: 20,
            Communication: 20,
            Chaos: 45,
        }),
    },
    {
        id: 'lalo-salamanca',
        name: 'Lalo Salamanca',
        summary:
            'Charming operator who makes bold moves look easy and keeps everyone slightly nervous.',
        traits: traits({
            Builder: 80,
            Architect: 70,
            Scientist: 65,
            Explorer: 85,
            TeamPlayer: 75,
            Mentor: 45,
            Leadership: 90,
            Consistency: 75,
            Discipline: 70,
            Curiosity: 85,
            Creativity: 88,
            Documentation: 50,
            OpenSource: 60,
            Communication: 95,
            Chaos: 60,
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

/**
 * Computes a similarity score that combines:
 * 1. Vector direction (Cosine similarity - 40%)
 * 2. Signature trait alignment (30%)
 * 3. Execution & Proficiency level alignment (30%)
 *
 * This prevents high-output, master developers (Dev Score 75+) from matching
 * low-output dabbler archetypes (like Badger or Skinny Pete).
 */
function profileSimilarity(user: TraitVector, character: TraitVector): number {
    const cosine = cosineSimilarity(user, character)

    // 1. Signature trait alignment
    const sorted = [...TRAIT_IDS].sort((a, b) => character[b] - character[a])
    const signatureSet = new Set(sorted.slice(0, 4))

    let sigSum = 0
    let sigCount = 0
    let otherSum = 0
    let otherCount = 0
    for (const id of TRAIT_IDS) {
        if (signatureSet.has(id)) {
            sigSum += user[id]
            sigCount++
        } else {
            otherSum += user[id]
            otherCount++
        }
    }
    const sigAvg = sigCount > 0 ? sigSum / sigCount : 0
    const otherAvg = otherCount > 0 ? otherSum / otherCount : 0

    const diff = sigAvg - otherAvg
    const emphasis = 1 / (1 + Math.exp(-0.08 * diff))

    // 2. Execution & Proficiency Level Alignment
    const execTraits: TraitId[] = [
        'Builder',
        'Architect',
        'Discipline',
        'Scientist',
    ]
    const userExec =
        execTraits.reduce((sum, id) => sum + user[id], 0) / execTraits.length
    const charExec =
        execTraits.reduce((sum, id) => sum + character[id], 0) /
        execTraits.length

    const execDiff = Math.abs(userExec - charExec)
    const execAlignment = Math.max(0, 1 - execDiff / 60)

    const score = cosine * 0.4 + emphasis * 0.3 + execAlignment * 0.3
    return Math.min(1.0, Math.max(0, score))
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
            profileSimilarity(vector, profile.traits) * 100
        )
        return {
            id: profile.id,
            name: profile.name,
            similarity,
            explanation: explanationFor(profile, similarity),
            image: getCharacterImageUrl(profile.id),
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
