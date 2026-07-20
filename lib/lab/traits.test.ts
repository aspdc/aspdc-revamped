import { describe, expect, it } from 'vitest'
import { scoreTraits } from './traits'
import { TRAIT_IDS, type GitHubSnapshot } from './types'

function emptySnapshot(
    overrides: Partial<GitHubSnapshot> = {}
): GitHubSnapshot {
    return {
        login: 'student',
        accountCreatedAt: '2024-01-01T00:00:00.000Z',
        followers: 0,
        following: 0,
        publicRepos: 0,
        repos: [],
        events: [],
        ...overrides,
    }
}

function assertValidVector(vector: ReturnType<typeof scoreTraits>) {
    for (const trait of TRAIT_IDS) {
        expect(vector).toHaveProperty(trait)
        expect(vector[trait]).toBeGreaterThanOrEqual(0)
        expect(vector[trait]).toBeLessThanOrEqual(100)
    }
}

describe('scoreTraits', () => {
    it('returns all 15 traits in [0, 100] for an empty snapshot', () => {
        const vector = scoreTraits(emptySnapshot())
        expect(Object.keys(vector)).toHaveLength(TRAIT_IDS.length)
        assertValidVector(vector)
    })

    it('handles one repo with one language', () => {
        const vector = scoreTraits(
            emptySnapshot({
                publicRepos: 1,
                repos: [
                    {
                        name: 'hello-world',
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
        assertValidVector(vector)
    })

    it('handles 100+ repos without crashing or leaving range', () => {
        const repos = Array.from({ length: 120 }, (_, i) => ({
            name: `lab-${i}`,
            language: i % 2 === 0 ? 'Python' : 'Go',
            topicsCount: i % 5,
            hasDescription: i % 3 === 0,
            isFork: i % 10 === 0,
            stargazersCount: i,
            forksCount: Math.floor(i / 2),
        }))
        const vector = scoreTraits(
            emptySnapshot({
                publicRepos: repos.length,
                followers: 50,
                following: 20,
                repos,
            })
        )
        assertValidVector(vector)
    })

    it('scores regular activity higher on Consistency than sporadic activity', () => {
        const base = new Date('2024-06-01T12:00:00.000Z').getTime()
        const day = 24 * 60 * 60 * 1000

        const regularEvents = Array.from({ length: 45 }, (_, i) => ({
            type: 'PushEvent',
            createdAt: new Date(base + i * day).toISOString(),
        }))

        const sporadicEvents = [
            {
                type: 'PushEvent',
                createdAt: new Date(base).toISOString(),
            },
            {
                type: 'PushEvent',
                createdAt: new Date(base + 40 * day).toISOString(),
            },
            {
                type: 'PushEvent',
                createdAt: new Date(base + 80 * day).toISOString(),
            },
        ]

        const regular = scoreTraits(emptySnapshot({ events: regularEvents }))
        const sporadic = scoreTraits(emptySnapshot({ events: sporadicEvents }))

        expect(regular.Consistency).toBeGreaterThan(sporadic.Consistency)
    })

    it('gives a typical undergrad profile mid-range Builder and Consistency scores', () => {
        const base = new Date('2024-06-01T12:00:00.000Z').getTime()
        const day = 24 * 60 * 60 * 1000
        const vector = scoreTraits(
            emptySnapshot({
                followers: 4,
                following: 10,
                publicRepos: 6,
                repos: [
                    {
                        name: 'dsa-practice',
                        language: 'C++',
                        topicsCount: 1,
                        hasDescription: true,
                        isFork: false,
                        stargazersCount: 1,
                        forksCount: 0,
                    },
                    {
                        name: 'web-lab',
                        language: 'TypeScript',
                        topicsCount: 2,
                        hasDescription: true,
                        isFork: false,
                        stargazersCount: 0,
                        forksCount: 0,
                    },
                    {
                        name: 'ml-mini-project',
                        language: 'Python',
                        topicsCount: 1,
                        hasDescription: true,
                        isFork: false,
                        stargazersCount: 2,
                        forksCount: 1,
                    },
                    {
                        name: 'course-notes',
                        language: 'Markdown',
                        topicsCount: 0,
                        hasDescription: false,
                        isFork: false,
                        stargazersCount: 0,
                        forksCount: 0,
                    },
                    {
                        name: 'forked-starter',
                        language: 'JavaScript',
                        topicsCount: 0,
                        hasDescription: false,
                        isFork: true,
                        stargazersCount: 0,
                        forksCount: 0,
                    },
                ],
                events: Array.from({ length: 12 }, (_, i) => ({
                    type: i % 5 === 0 ? 'PullRequestEvent' : 'PushEvent',
                    createdAt: new Date(base + i * 3 * day).toISOString(),
                })),
            })
        )

        assertValidVector(vector)
        expect(vector.Builder).toBeGreaterThanOrEqual(35)
        expect(vector.Builder).toBeLessThanOrEqual(90)
        expect(vector.Consistency).toBeGreaterThanOrEqual(30)
        expect(vector.Communication).toBeLessThan(vector.Builder)
        expect(vector.Leadership).toBeLessThan(vector.Builder)
    })

    it('raises Leadership and Mentor when followers and following are farmed', () => {
        const quiet = scoreTraits(
            emptySnapshot({
                followers: 1,
                following: 2,
                publicRepos: 3,
                repos: [
                    {
                        name: 'a',
                        language: 'Python',
                        topicsCount: 0,
                        hasDescription: true,
                        isFork: false,
                        stargazersCount: 0,
                        forksCount: 0,
                    },
                ],
            })
        )
        const networked = scoreTraits(
            emptySnapshot({
                followers: 25,
                following: 40,
                publicRepos: 3,
                repos: [
                    {
                        name: 'a',
                        language: 'Python',
                        topicsCount: 0,
                        hasDescription: true,
                        isFork: false,
                        stargazersCount: 0,
                        forksCount: 0,
                    },
                ],
            })
        )

        expect(networked.Leadership).toBeGreaterThan(quiet.Leadership)
        expect(networked.Mentor).toBeGreaterThan(quiet.Mentor)
        expect(networked.Communication).toBeGreaterThan(quiet.Communication)
        expect(networked.OpenSource).toBeGreaterThan(quiet.OpenSource)
    })

    it('keeps scores in range when star and fork counts are extreme', () => {
        const vector = scoreTraits(
            emptySnapshot({
                publicRepos: 3,
                repos: [
                    {
                        name: 'viral',
                        language: 'JavaScript',
                        topicsCount: 20,
                        hasDescription: true,
                        isFork: false,
                        stargazersCount: 500_000,
                        forksCount: 100_000,
                    },
                    {
                        name: 'also-viral',
                        language: 'Rust',
                        topicsCount: 10,
                        hasDescription: true,
                        isFork: false,
                        stargazersCount: 250_000,
                        forksCount: 50_000,
                    },
                    {
                        name: 'quiet',
                        language: 'Go',
                        topicsCount: 1,
                        hasDescription: true,
                        isFork: false,
                        stargazersCount: 0,
                        forksCount: 0,
                    },
                ],
            })
        )
        assertValidVector(vector)
    })
})
