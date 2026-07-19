import { describe, expect, it } from 'vitest'
import { ACHIEVEMENTS, unlockAchievements } from './achievements'
import { emptyTraitVector } from './traits'
import type { GitHubSnapshot, TraitVector } from './types'

function snapshot(overrides: Partial<GitHubSnapshot> = {}): GitHubSnapshot {
    return {
        login: 'student',
        accountCreatedAt: '2023-01-01T00:00:00.000Z',
        followers: 0,
        following: 0,
        publicRepos: 0,
        repos: [],
        events: [],
        ...overrides,
    }
}

function vector(overrides: Partial<TraitVector> = {}): TraitVector {
    return { ...emptyTraitVector(40), ...overrides }
}

describe('unlockAchievements', () => {
    it('defines at least 12 achievements with required fields', () => {
        expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(12)
        for (const achievement of ACHIEVEMENTS) {
            expect(achievement.id).toBeTruthy()
            expect(achievement.name).toBeTruthy()
            expect(achievement.description).toBeTruthy()
            expect(achievement.icon).toBeTruthy()
            expect(typeof achievement.unlock).toBe('function')
        }
    })

    it('returns only achievements whose predicates are satisfied', () => {
        const unlocked = unlockAchievements(
            vector({ Discipline: 95, Chaos: 10 }),
            snapshot()
        )
        const ids = unlocked.map((achievement) => achievement.id)
        expect(ids).toContain('the-blue-sky')
        expect(ids).not.toContain('i-am-the-danger')
    })

    it('unlocks Science, Bitch! only with scientist score and enough languages', () => {
        const multilingual = snapshot({
            repos: ['TypeScript', 'Python', 'Go', 'Rust', 'Elixir'].map(
                (language, index) => ({
                    name: `lab-${index}`,
                    language,
                    topicsCount: 1,
                    hasDescription: true,
                    isFork: false,
                    stargazersCount: 0,
                    forksCount: 0,
                })
            ),
        })

        const unlocked = unlockAchievements(
            vector({ Scientist: 90 }),
            multilingual
        )
        expect(unlocked.map((a) => a.id)).toContain('science-bitch')

        const locked = unlockAchievements(
            vector({ Scientist: 90 }),
            snapshot({
                repos: [
                    {
                        name: 'solo',
                        language: 'TypeScript',
                        topicsCount: 0,
                        hasDescription: false,
                        isFork: false,
                        stargazersCount: 0,
                        forksCount: 0,
                    },
                ],
            })
        )
        expect(locked.map((a) => a.id)).not.toContain('science-bitch')
    })

    it('unlocks Say My Name when rank is in the top 10', () => {
        const withRank = unlockAchievements(vector(), snapshot(), { rank: 3 })
        const withoutRank = unlockAchievements(vector(), snapshot())
        expect(withRank.map((a) => a.id)).toContain('say-my-name')
        expect(withoutRank.map((a) => a.id)).not.toContain('say-my-name')
    })
})
