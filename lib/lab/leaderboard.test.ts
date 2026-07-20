import { describe, expect, it } from 'vitest'
import {
    formatLeaderboardEntries,
    getCharacterName,
    getGitHubAvatarUrl,
} from './leaderboard'
import type { LabProfile } from '@/db/types'

describe('lib/lab/leaderboard', () => {
    it('returns character name for known characterId', () => {
        expect(getCharacterName('walter-white')).toBe('Walter White')
        expect(getCharacterName('jesse-pinkman')).toBe('Jesse Pinkman')
        expect(getCharacterName('gus-fring')).toBe('Gus Fring')
    })

    it('formats unknown characterId to title case fallback', () => {
        expect(getCharacterName('unknown-dev')).toBe('Unknown Dev')
    })

    it('generates GitHub avatar URL from username', () => {
        expect(getGitHubAvatarUrl('octocat')).toBe(
            'https://avatars.githubusercontent.com/octocat'
        )
    })

    it('sorts profiles by developer score descending and assigns 1-based ranks', () => {
        const mockProfiles: LabProfile[] = [
            {
                id: '1',
                userId: 'u1',
                githubUsername: 'user_b',
                characterId: 'jesse-pinkman',
                characterSimilarity: 80,
                developerScore: 75,
                traitScores: {},
                githubSnapshot: {},
                analyzedAt: new Date('2026-07-20T10:00:00Z'),
            },
            {
                id: '2',
                userId: 'u2',
                githubUsername: 'user_a',
                characterId: 'walter-white',
                characterSimilarity: 95,
                developerScore: 95,
                traitScores: {},
                githubSnapshot: {},
                analyzedAt: new Date('2026-07-20T11:00:00Z'),
            },
            {
                id: '3',
                userId: 'u3',
                githubUsername: 'user_c',
                characterId: 'gus-fring',
                characterSimilarity: 90,
                developerScore: 90,
                traitScores: {},
                githubSnapshot: {},
                analyzedAt: new Date('2026-07-20T09:00:00Z'),
            },
        ]

        const result = formatLeaderboardEntries(mockProfiles)

        expect(result).toHaveLength(3)
        expect(result[0]).toMatchObject({
            rank: 1,
            githubUsername: 'user_a',
            characterName: 'Walter White',
            developerScore: 95,
            avatarUrl: 'https://avatars.githubusercontent.com/user_a',
        })
        expect(result[1]).toMatchObject({
            rank: 2,
            githubUsername: 'user_c',
            characterName: 'Gus Fring',
            developerScore: 90,
        })
        expect(result[2]).toMatchObject({
            rank: 3,
            githubUsername: 'user_b',
            characterName: 'Jesse Pinkman',
            developerScore: 75,
        })
    })

    it('returns empty array when given empty profiles array', () => {
        expect(formatLeaderboardEntries([])).toEqual([])
    })
})
