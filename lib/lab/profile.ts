import type { LabProfile } from '@/db/types'
import { ACHIEVEMENTS, type Achievement } from './achievements'
import { readPersistedGitHubSnapshot, runAnalysisPipeline } from './analyze'
import {
    CHARACTER_PROFILES,
    assignCharacter,
    type CharacterMatch,
    type CharacterProfile,
} from './characters'
import { emptyTraitVector } from './traits'
import { TRAIT_IDS, type TraitId, type TraitVector } from './types'

export type ProfileDisplayData = {
    primaryCharacter: CharacterProfile
    topMatches: CharacterMatch[]
    achievements: Achievement[]
    traits: TraitVector
}

export function getProfileDisplayData(
    profile: LabProfile,
    dbAchievementIds?: string[]
): ProfileDisplayData {
    const cached = readPersistedGitHubSnapshot(profile.githubSnapshot)

    let topMatches: CharacterMatch[]
    let achievements: Achievement[]
    let traits: TraitVector

    if (cached?.snapshot) {
        const pipelineResult = runAnalysisPipeline(cached.snapshot)
        topMatches = pipelineResult.characterMatches
        achievements = pipelineResult.achievements
        traits = pipelineResult.traitScores
    } else {
        // Reconstruct TraitVector from stored profile
        traits = emptyTraitVector(40)
        if (profile.traitScores && typeof profile.traitScores === 'object') {
            const rawScores = profile.traitScores as Record<string, unknown>
            for (const id of TRAIT_IDS) {
                const val = rawScores[id]
                if (typeof val === 'number') {
                    traits[id as TraitId] = val
                }
            }
        }

        topMatches = assignCharacter(traits)

        if (dbAchievementIds && dbAchievementIds.length > 0) {
            const idSet = new Set(dbAchievementIds)
            achievements = ACHIEVEMENTS.filter((a) => idSet.has(a.id)).map(
                ({ id, name, description, icon }) => ({
                    id,
                    name,
                    description,
                    icon,
                })
            )
        } else {
            achievements = []
        }
    }

    let primaryCharacter = CHARACTER_PROFILES.find(
        (c) => c.id === profile.characterId
    )

    if (!primaryCharacter) {
        const topMatch = topMatches[0]
        if (topMatch) {
            primaryCharacter = CHARACTER_PROFILES.find(
                (c) => c.id === topMatch.id
            )
        }
    }

    if (!primaryCharacter) {
        primaryCharacter = {
            id: (profile.characterId as any) || 'walter-white',
            name: profile.characterId || 'Classified Subject',
            summary: 'A subject undergoing laboratory analysis.',
            traits: emptyTraitVector(50),
        }
    }

    return {
        primaryCharacter,
        topMatches,
        achievements,
        traits,
    }
}
