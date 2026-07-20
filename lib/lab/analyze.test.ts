import { describe, expect, it, vi } from 'vitest'
import {
    SNAPSHOT_MAX_AGE_MS,
    isSnapshotFresh,
    persistGitHubSnapshot,
    readPersistedGitHubSnapshot,
    resolveGitHubSnapshot,
    runAnalysisPipeline,
} from './analyze'
import type { GitHubSnapshot } from './types'

function snapshot(overrides: Partial<GitHubSnapshot> = {}): GitHubSnapshot {
    return {
        login: 'student',
        accountCreatedAt: '2024-01-01T00:00:00.000Z',
        followers: 1,
        following: 1,
        publicRepos: 1,
        repos: [
            {
                name: 'lab',
                language: 'TypeScript',
                topicsCount: 1,
                hasDescription: true,
                isFork: false,
                stargazersCount: 0,
                forksCount: 0,
            },
        ],
        events: [{ type: 'PushEvent', createdAt: '2024-06-01T12:00:00.000Z' }],
        ...overrides,
    }
}

describe('isSnapshotFresh', () => {
    it('is fresh when captured within 24 hours', () => {
        const now = new Date('2026-07-20T12:00:00.000Z')
        const capturedAt = new Date(now.getTime() - SNAPSHOT_MAX_AGE_MS + 1)
        expect(isSnapshotFresh(capturedAt, now)).toBe(true)
    })

    it('is stale at or beyond 24 hours', () => {
        const now = new Date('2026-07-20T12:00:00.000Z')
        const capturedAt = new Date(now.getTime() - SNAPSHOT_MAX_AGE_MS)
        expect(isSnapshotFresh(capturedAt, now)).toBe(false)
    })
})

describe('persistGitHubSnapshot / readPersistedGitHubSnapshot', () => {
    it('round-trips snapshot data and capture time', () => {
        const data = snapshot({ login: 'walter' })
        const capturedAt = new Date('2026-07-19T00:00:00.000Z')
        const persisted = persistGitHubSnapshot(data, capturedAt)
        const read = readPersistedGitHubSnapshot(persisted)

        expect(read).toEqual({
            snapshot: data,
            capturedAt,
        })
    })

    it('returns null for invalid stored shapes', () => {
        expect(readPersistedGitHubSnapshot({})).toBeNull()
        expect(
            readPersistedGitHubSnapshot({ capturedAt: 'nope', snapshot: null })
        ).toBeNull()
    })
})

describe('resolveGitHubSnapshot', () => {
    it('reuses a fresh cached snapshot without fetching', async () => {
        const cached = snapshot({ login: 'cached-user' })
        const fetchFresh = vi.fn()
        const now = new Date('2026-07-20T12:00:00.000Z')

        const resolved = await resolveGitHubSnapshot({
            cached: {
                snapshot: cached,
                capturedAt: new Date(now.getTime() - 60 * 60 * 1000),
            },
            fetchFresh,
            now,
        })

        expect(resolved).toEqual({
            snapshot: cached,
            capturedAt: new Date(now.getTime() - 60 * 60 * 1000),
            fetched: false,
        })
        expect(fetchFresh).not.toHaveBeenCalled()
    })

    it('fetches when cache is missing or stale', async () => {
        const fresh = snapshot({ login: 'fresh-user' })
        const fetchFresh = vi.fn(async () => fresh)
        const now = new Date('2026-07-20T12:00:00.000Z')

        const resolved = await resolveGitHubSnapshot({
            cached: {
                snapshot: snapshot({ login: 'old' }),
                capturedAt: new Date(now.getTime() - SNAPSHOT_MAX_AGE_MS),
            },
            fetchFresh,
            now,
        })

        expect(fetchFresh).toHaveBeenCalledOnce()
        expect(resolved).toEqual({
            snapshot: fresh,
            capturedAt: now,
            fetched: true,
        })
    })
})

describe('runAnalysisPipeline', () => {
    it('scores, assigns, ranks, and unlocks from a snapshot', () => {
        const result = runAnalysisPipeline(snapshot())

        expect(result.githubUsername).toBe('student')
        expect(result.developerScore).toBeGreaterThanOrEqual(0)
        expect(result.developerScore).toBeLessThanOrEqual(100)
        expect(result.characterMatches).toHaveLength(3)
        expect(result.characterId).toBe(result.characterMatches[0]!.id)
        expect(result.characterSimilarity).toBe(
            result.characterMatches[0]!.similarity
        )
        expect(result.traitScores).toMatchObject(
            expect.objectContaining({
                Builder: expect.any(Number),
                Chaos: expect.any(Number),
            })
        )
        expect(Array.isArray(result.achievements)).toBe(true)
    })
})
