import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGitHubSnapshot } from './github'

type MockResponse = {
    ok: boolean
    status: number
    json: () => Promise<unknown>
}

function jsonResponse(status: number, body: unknown): MockResponse {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    }
}

function mockFetchSequence(
    handlers: Array<(url: string, init?: RequestInit) => MockResponse | null>
) {
    return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)
        for (const handler of handlers) {
            const response = handler(url, init)
            if (response) return response
        }
        throw new Error(`Unexpected fetch: ${url}`)
    })
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('fetchGitHubSnapshot', () => {
    it('calls the three GitHub endpoints with the Bearer token and normalises the snapshot', async () => {
        const fetchMock = mockFetchSequence([
            (url, init) => {
                if (!url.endsWith('/user')) return null
                expect(init?.headers).toMatchObject({
                    Authorization: 'Bearer test-token',
                })
                return jsonResponse(200, {
                    login: 'walter',
                    name: 'Walter White',
                    created_at: '2018-01-15T00:00:00Z',
                    followers: 12,
                    following: 3,
                    public_repos: 2,
                    bio: 'Chemistry teacher',
                })
            },
            (url, init) => {
                if (!url.includes('/users/walter/repos')) return null
                expect(url).toContain('sort=updated')
                expect(url).toContain('per_page=100')
                expect(init?.headers).toMatchObject({
                    Authorization: 'Bearer test-token',
                })
                return jsonResponse(200, [
                    {
                        name: 'superlab',
                        language: 'TypeScript',
                        topics: ['chemistry', 'lab'],
                        description: 'Blue sky project',
                        stargazers_count: 7,
                        forks_count: 2,
                        fork: false,
                        created_at: '2020-01-01T00:00:00Z',
                    },
                    {
                        name: 'forked-thing',
                        language: null,
                        topics: [],
                        description: null,
                        stargazers_count: 0,
                        forks_count: 0,
                        fork: true,
                        created_at: '2021-01-01T00:00:00Z',
                    },
                ])
            },
            (url, init) => {
                if (!url.includes('/users/walter/events')) return null
                expect(url).toContain('per_page=100')
                expect(init?.headers).toMatchObject({
                    Authorization: 'Bearer test-token',
                })
                return jsonResponse(200, [
                    {
                        type: 'PushEvent',
                        created_at: '2024-06-01T12:00:00Z',
                    },
                    {
                        type: 'PullRequestEvent',
                        created_at: '2024-06-02T12:00:00Z',
                    },
                ])
            },
        ])
        vi.stubGlobal('fetch', fetchMock)

        const snapshot = await fetchGitHubSnapshot('test-token')

        expect(fetchMock).toHaveBeenCalled()
        expect(snapshot).toEqual({
            login: 'walter',
            accountCreatedAt: '2018-01-15T00:00:00Z',
            followers: 12,
            following: 3,
            publicRepos: 2,
            repos: [
                {
                    name: 'superlab',
                    language: 'TypeScript',
                    topicsCount: 2,
                    hasDescription: true,
                    isFork: false,
                    stargazersCount: 7,
                    forksCount: 2,
                },
                {
                    name: 'forked-thing',
                    language: null,
                    topicsCount: 0,
                    hasDescription: false,
                    isFork: true,
                    stargazersCount: 0,
                    forksCount: 0,
                },
            ],
            events: [
                {
                    type: 'PushEvent',
                    createdAt: '2024-06-01T12:00:00Z',
                },
                {
                    type: 'PullRequestEvent',
                    createdAt: '2024-06-02T12:00:00Z',
                },
            ],
        })
        expect(snapshot.repos[0]).toHaveProperty('stargazersCount')
        expect(snapshot.repos[0]).toHaveProperty('forksCount')
    })

    it('paginates events up to 300 results', async () => {
        const page1 = Array.from({ length: 100 }, (_, i) => ({
            type: 'PushEvent',
            created_at: `2024-05-01T00:${String(i).padStart(2, '0')}:00Z`,
        }))
        const page2 = Array.from({ length: 100 }, (_, i) => ({
            type: 'IssuesEvent',
            created_at: `2024-05-02T00:${String(i).padStart(2, '0')}:00Z`,
        }))
        const page3 = Array.from({ length: 100 }, (_, i) => ({
            type: 'WatchEvent',
            created_at: `2024-05-03T00:${String(i).padStart(2, '0')}:00Z`,
        }))

        const fetchMock = mockFetchSequence([
            (url) =>
                url.endsWith('/user')
                    ? jsonResponse(200, {
                          login: 'jesse',
                          created_at: '2019-01-01T00:00:00Z',
                          followers: 0,
                          following: 0,
                          public_repos: 0,
                      })
                    : null,
            (url) => (url.includes('/repos') ? jsonResponse(200, []) : null),
            (url) => {
                if (!url.includes('/events')) return null
                if (url.includes('page=2')) return jsonResponse(200, page2)
                if (url.includes('page=3')) return jsonResponse(200, page3)
                return jsonResponse(200, page1)
            },
        ])
        vi.stubGlobal('fetch', fetchMock)

        const snapshot = await fetchGitHubSnapshot('token')

        expect(snapshot.events).toHaveLength(300)
        expect(
            fetchMock.mock.calls.filter(([url]) =>
                String(url).includes('/events')
            )
        ).toHaveLength(3)
    })

    it('throws a descriptive error when a GitHub API call fails', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => jsonResponse(401, { message: 'Bad credentials' }))
        )

        await expect(fetchGitHubSnapshot('bad-token')).rejects.toThrow(
            /GitHub API request failed \(401\).*\/user/
        )
    })
})
