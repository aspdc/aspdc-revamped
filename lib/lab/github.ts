import type {
    GitHubEventSummary,
    GitHubRepoSummary,
    GitHubSnapshot,
} from './types'

const GITHUB_API_BASE = 'https://api.github.com'
const MAX_EVENT_PAGES = 3
const EVENTS_PER_PAGE = 100
const MAX_EVENTS = 300

type GitHubUserResponse = {
    login: string
    created_at: string
    followers: number
    following: number
    public_repos: number
}

type GitHubRepoResponse = {
    name: string
    language: string | null
    topics?: string[]
    description: string | null
    stargazers_count: number
    forks_count: number
    fork: boolean
}

type GitHubEventResponse = {
    type: string
    created_at: string
}

function authHeaders(accessToken: string): HeadersInit {
    return {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
    }
}

async function githubGet<T>(path: string, accessToken: string): Promise<T> {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
        headers: authHeaders(accessToken),
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error(
            `GitHub API request failed (${response.status}) for ${path}`
        )
    }

    return (await response.json()) as T
}

function toRepoSummary(repo: GitHubRepoResponse): GitHubRepoSummary {
    return {
        name: repo.name,
        language: repo.language,
        topicsCount: repo.topics?.length ?? 0,
        hasDescription: Boolean(repo.description?.trim()),
        isFork: repo.fork,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
    }
}

function toEventSummary(event: GitHubEventResponse): GitHubEventSummary {
    return {
        type: event.type,
        createdAt: event.created_at,
    }
}

async function fetchRecentEvents(
    login: string,
    accessToken: string
): Promise<GitHubEventSummary[]> {
    const events: GitHubEventSummary[] = []

    for (let page = 1; page <= MAX_EVENT_PAGES; page++) {
        const path = `/users/${encodeURIComponent(login)}/events?per_page=${EVENTS_PER_PAGE}&page=${page}`
        const pageEvents = await githubGet<GitHubEventResponse[]>(
            path,
            accessToken
        )

        for (const event of pageEvents) {
            events.push(toEventSummary(event))
            if (events.length >= MAX_EVENTS) return events
        }

        if (pageEvents.length < EVENTS_PER_PAGE) break
    }

    return events
}

/**
 * Fetches a normalised GitHub activity snapshot for trait scoring.
 * Does not cache — persistence is owned by the analysis server action.
 */
export async function fetchGitHubSnapshot(
    accessToken: string
): Promise<GitHubSnapshot> {
    const user = await githubGet<GitHubUserResponse>('/user', accessToken)
    const [repos, events] = await Promise.all([
        githubGet<GitHubRepoResponse[]>(
            `/users/${encodeURIComponent(user.login)}/repos?sort=updated&per_page=100`,
            accessToken
        ),
        fetchRecentEvents(user.login, accessToken),
    ])

    return {
        login: user.login,
        accountCreatedAt: user.created_at,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        repos: repos.map(toRepoSummary),
        events,
    }
}
