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
            Builder: 92,
            Architect: 78,
            Scientist: 90,
            Explorer: 40,
            TeamPlayer: 30,
            Mentor: 72,
            Leadership: 60,
            Consistency: 95,
            Discipline: 93,
            Curiosity: 65,
            Creativity: 55,
            Documentation: 80,
            OpenSource: 35,
            Communication: 35,
            Chaos: 20,
        }),
    },
    {
        id: 'heisenberg',
        name: 'Heisenberg',
        summary:
            'High-purity specialist whose chaos and control sit in the same lab coat.',
        traits: traits({
            Builder: 95,
            Architect: 45,
            Scientist: 88,
            Explorer: 35,
            TeamPlayer: 15,
            Mentor: 20,
            Leadership: 92,
            Consistency: 55,
            Discipline: 80,
            Curiosity: 50,
            Creativity: 70,
            Documentation: 30,
            OpenSource: 15,
            Communication: 25,
            Chaos: 95,
        }),
    },
    {
        id: 'jesse-pinkman',
        name: 'Jesse Pinkman',
        summary:
            'Chaotic creative who learns in public and ships with heart over polish.',
        traits: traits({
            Builder: 55,
            Architect: 20,
            Scientist: 30,
            Explorer: 80,
            TeamPlayer: 70,
            Mentor: 30,
            Leadership: 25,
            Consistency: 25,
            Discipline: 20,
            Curiosity: 92,
            Creativity: 95,
            Documentation: 15,
            OpenSource: 75,
            Communication: 65,
            Chaos: 88,
        }),
    },
    {
        id: 'gus-fring',
        name: 'Gus Fring',
        summary:
            'Quiet systems thinker who scales process until the operation looks legitimate.',
        traits: traits({
            Builder: 60,
            Architect: 96,
            Scientist: 55,
            Explorer: 25,
            TeamPlayer: 45,
            Mentor: 40,
            Leadership: 90,
            Consistency: 92,
            Discipline: 98,
            Curiosity: 30,
            Creativity: 35,
            Documentation: 92,
            OpenSource: 20,
            Communication: 50,
            Chaos: 10,
        }),
    },
    {
        id: 'mike-ehrmantraut',
        name: 'Mike Ehrmantraut',
        summary:
            'No-nonsense operator who values clean process, loyalty, and fewer moving parts.',
        traits: traits({
            Builder: 70,
            Architect: 65,
            Scientist: 30,
            Explorer: 20,
            TeamPlayer: 78,
            Mentor: 90,
            Leadership: 55,
            Consistency: 95,
            Discipline: 92,
            Curiosity: 25,
            Creativity: 20,
            Documentation: 70,
            OpenSource: 25,
            Communication: 45,
            Chaos: 10,
        }),
    },
    {
        id: 'saul-goodman',
        name: 'Saul Goodman',
        summary:
            'Persuasive communicator who can talk any messy PR into looking intentional.',
        traits: traits({
            Builder: 30,
            Architect: 35,
            Scientist: 20,
            Explorer: 65,
            TeamPlayer: 85,
            Mentor: 55,
            Leadership: 60,
            Consistency: 40,
            Discipline: 30,
            Curiosity: 70,
            Creativity: 88,
            Documentation: 45,
            OpenSource: 60,
            Communication: 98,
            Chaos: 65,
        }),
    },
    {
        id: 'hank-schrader',
        name: 'Hank Schrader',
        summary:
            'Aggressive investigator energy — loud, persistent, and oddly good under pressure.',
        traits: traits({
            Builder: 50,
            Architect: 35,
            Scientist: 40,
            Explorer: 92,
            TeamPlayer: 60,
            Mentor: 50,
            Leadership: 70,
            Consistency: 75,
            Discipline: 70,
            Curiosity: 95,
            Creativity: 40,
            Documentation: 55,
            OpenSource: 35,
            Communication: 78,
            Chaos: 45,
        }),
    },
    {
        id: 'tuco-salamanca',
        name: 'Tuco Salamanca',
        summary:
            'Volatile force-multiplier whose output spikes hard and rarely stays stable.',
        traits: traits({
            Builder: 75,
            Architect: 10,
            Scientist: 15,
            Explorer: 40,
            TeamPlayer: 15,
            Mentor: 10,
            Leadership: 65,
            Consistency: 10,
            Discipline: 10,
            Curiosity: 30,
            Creativity: 40,
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
            Builder: 85,
            Architect: 50,
            Scientist: 45,
            Explorer: 15,
            TeamPlayer: 40,
            Mentor: 15,
            Leadership: 25,
            Consistency: 92,
            Discipline: 95,
            Curiosity: 20,
            Creativity: 15,
            Documentation: 55,
            OpenSource: 20,
            Communication: 20,
            Chaos: 15,
        }),
    },
    {
        id: 'skinny-pete',
        name: 'Skinny Pete',
        summary:
            'Loyal collaborator who keeps the group chat alive and the vibe intact.',
        traits: traits({
            Builder: 25,
            Architect: 20,
            Scientist: 20,
            Explorer: 45,
            TeamPlayer: 95,
            Mentor: 60,
            Leadership: 20,
            Consistency: 50,
            Discipline: 35,
            Curiosity: 50,
            Creativity: 55,
            Documentation: 25,
            OpenSource: 85,
            Communication: 90,
            Chaos: 40,
        }),
    },
    {
        id: 'badger',
        name: 'Badger',
        summary:
            'Curious dabbler with wild ideas, half-finished labs, and unexpectedly good stories.',
        traits: traits({
            Builder: 20,
            Architect: 15,
            Scientist: 35,
            Explorer: 88,
            TeamPlayer: 75,
            Mentor: 35,
            Leadership: 15,
            Consistency: 20,
            Discipline: 15,
            Curiosity: 95,
            Creativity: 92,
            Documentation: 10,
            OpenSource: 80,
            Communication: 60,
            Chaos: 72,
        }),
    },
    {
        id: 'lydia',
        name: 'Lydia',
        summary:
            'Precise optimizer obsessed with margins, logistics, and looking unbothered.',
        traits: traits({
            Builder: 55,
            Architect: 95,
            Scientist: 50,
            Explorer: 20,
            TeamPlayer: 25,
            Mentor: 20,
            Leadership: 75,
            Consistency: 88,
            Discipline: 90,
            Curiosity: 30,
            Creativity: 25,
            Documentation: 95,
            OpenSource: 15,
            Communication: 55,
            Chaos: 12,
        }),
    },
    {
        id: 'hector-salamanca',
        name: 'Hector Salamanca',
        summary:
            'Stubborn veteran energy — short on words, long on persistence, refuses to quit the lab.',
        traits: traits({
            Builder: 80,
            Architect: 40,
            Scientist: 25,
            Explorer: 15,
            TeamPlayer: 30,
            Mentor: 65,
            Leadership: 72,
            Consistency: 90,
            Discipline: 92,
            Curiosity: 15,
            Creativity: 15,
            Documentation: 30,
            OpenSource: 15,
            Communication: 15,
            Chaos: 50,
        }),
    },
    {
        id: 'lalo-salamanca',
        name: 'Lalo Salamanca',
        summary:
            'Charming operator who makes bold moves look easy and keeps everyone slightly nervous.',
        traits: traits({
            Builder: 65,
            Architect: 55,
            Scientist: 40,
            Explorer: 75,
            TeamPlayer: 70,
            Mentor: 35,
            Leadership: 85,
            Consistency: 55,
            Discipline: 50,
            Curiosity: 72,
            Creativity: 78,
            Documentation: 35,
            OpenSource: 50,
            Communication: 92,
            Chaos: 68,
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
 * Computes a similarity score that blends cosine similarity with a
 * signature-trait emphasis. This prevents generalist user vectors from
 * always matching generalist characters.
 *
 * For each character, the top 4 traits are identified as "signature" traits.
 * We measure how much the user's vector emphasises those same traits relative
 * to the rest, and blend that with overall cosine similarity.
 *
 * Blend:
 *   - 55% cosine similarity (overall shape match)
 *   - 45% signature emphasis ratio (does the user spike on the same traits?)
 */
function profileSimilarity(user: TraitVector, character: TraitVector): number {
    const cosine = cosineSimilarity(user, character)

    // Identify the character's top 4 "signature" traits
    const sorted = [...TRAIT_IDS].sort((a, b) => character[b] - character[a])
    const signatureSet = new Set(sorted.slice(0, 4))

    // Compute the user's average score on signature vs non-signature traits
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

    // Emphasis ratio: how much more the user scores on signature traits
    // vs the rest. Normalised to [0, 1] via sigmoid.
    // When sigAvg == otherAvg, emphasis ≈ 0.5 (neutral)
    // When sigAvg >> otherAvg, emphasis → 1.0
    const diff = sigAvg - otherAvg
    const emphasis = 1 / (1 + Math.exp(-0.08 * diff))

    return cosine * 0.55 + emphasis * 0.45
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
