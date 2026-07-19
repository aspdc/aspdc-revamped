export const TRAIT_IDS = [
    'Builder',
    'Architect',
    'Scientist',
    'Explorer',
    'TeamPlayer',
    'Mentor',
    'Leadership',
    'Consistency',
    'Discipline',
    'Curiosity',
    'Creativity',
    'Documentation',
    'OpenSource',
    'Communication',
    'Chaos',
] as const

export type TraitId = (typeof TRAIT_IDS)[number]

export type TraitVector = Record<TraitId, number>

export type GitHubRepoSummary = {
    name: string
    language: string | null
    topicsCount: number
    hasDescription: boolean
    isFork: boolean
    stargazersCount: number
    forksCount: number
}

export type GitHubEventSummary = {
    type: string
    createdAt: string
}

export type GitHubSnapshot = {
    login: string
    accountCreatedAt: string
    followers: number
    following: number
    publicRepos: number
    repos: GitHubRepoSummary[]
    events: GitHubEventSummary[]
}
