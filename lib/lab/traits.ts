import {
    TRAIT_IDS,
    type GitHubEventSummary,
    type GitHubSnapshot,
    type TraitId,
    type TraitVector,
} from './types'

const WINDOW_DAYS = 90
const MS_PER_DAY = 24 * 60 * 60 * 1000
const STAR_FORK_WEIGHT = 0.05

type WeightedSignal = {
    weight: number
    value: number
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

function softNorm(value: number, midpoint: number, steepness = 0.12): number {
    return 100 / (1 + Math.exp(-steepness * (value - midpoint)))
}

function combine(signals: WeightedSignal[]): number {
    const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0)
    if (totalWeight <= 0) return 0
    const score =
        signals.reduce((sum, signal) => sum + signal.weight * signal.value, 0) /
        totalWeight
    return clamp(Math.round(score), 0, 100)
}

function uniqueLanguages(snapshot: GitHubSnapshot): string[] {
    return [
        ...new Set(
            snapshot.repos
                .map((repo) => repo.language)
                .filter((language): language is string => Boolean(language))
        ),
    ]
}

function eventTimestamps(events: GitHubEventSummary[]): number[] {
    return events
        .map((event) => Date.parse(event.createdAt))
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b)
}

function countEventType(events: GitHubEventSummary[], type: string): number {
    return events.filter((event) => event.type === type).length
}

function daysActive(timestamps: number[]): number {
    return new Set(
        timestamps.map((timestamp) => Math.floor(timestamp / MS_PER_DAY))
    ).size
}

function regularityScore(timestamps: number[]): number {
    if (timestamps.length < 2) return timestamps.length === 1 ? 25 : 0

    const gaps: number[] = []
    for (let i = 1; i < timestamps.length; i++) {
        gaps.push((timestamps[i] - timestamps[i - 1]) / MS_PER_DAY)
    }

    const mean = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length
    const variance =
        gaps.reduce((sum, gap) => sum + (gap - mean) ** 2, 0) / gaps.length
    const stdDev = Math.sqrt(variance)

    const regularity = 1 / (1 + stdDev)
    const density = softNorm(timestamps.length, 20, 0.1)
    return combine([
        { weight: 0.7, value: regularity * 100 },
        { weight: 0.3, value: density },
    ])
}

function nameEntropy(names: string[]): number {
    if (names.length === 0) return 0
    const counts = new Map<string, number>()
    for (const name of names) {
        const token = name.toLowerCase().replace(/[^a-z0-9]+/g, '')
        if (!token) continue
        counts.set(token, (counts.get(token) ?? 0) + 1)
    }
    const total = [...counts.values()].reduce((sum, count) => sum + count, 0)
    if (total === 0) return 0
    let entropy = 0
    for (const count of counts.values()) {
        const p = count / total
        entropy -= p * Math.log2(p)
    }
    return softNorm(entropy, 3, 0.8)
}

function popularitySignal(snapshot: GitHubSnapshot): number {
    const stars = snapshot.repos.reduce(
        (sum, repo) => sum + repo.stargazersCount,
        0
    )
    const forks = snapshot.repos.reduce((sum, repo) => sum + repo.forksCount, 0)
    return softNorm(stars + forks * 2, 40, 0.04)
}

function accountAgeDays(snapshot: GitHubSnapshot): number {
    const created = Date.parse(snapshot.accountCreatedAt)
    if (!Number.isFinite(created)) return 0
    return Math.max(0, (Date.now() - created) / MS_PER_DAY)
}

export function scoreTraits(snapshot: GitHubSnapshot): TraitVector {
    const repos = snapshot.repos
    const events = snapshot.events
    const originalRepos = repos.filter((repo) => !repo.isFork)
    const languages = uniqueLanguages(snapshot)
    const timestamps = eventTimestamps(events)
    const activeDays = daysActive(timestamps)
    const topicsTotal = repos.reduce((sum, repo) => sum + repo.topicsCount, 0)
    const describedRatio =
        repos.length === 0
            ? 0
            : repos.filter((repo) => repo.hasDescription).length / repos.length
    const originalRatio =
        repos.length === 0 ? 0 : originalRepos.length / repos.length
    const pushEvents = countEventType(events, 'PushEvent')
    const prEvents =
        countEventType(events, 'PullRequestEvent') +
        countEventType(events, 'PullRequestReviewEvent')
    const issueEvents =
        countEventType(events, 'IssuesEvent') +
        countEventType(events, 'IssueCommentEvent')
    const reviewEvents = countEventType(events, 'PullRequestReviewEvent')
    const commentEvents =
        countEventType(events, 'IssueCommentEvent') +
        countEventType(events, 'CommitCommentEvent')
    const popularity = popularitySignal(snapshot)
    const ageScore = softNorm(accountAgeDays(snapshot), 365, 0.01)
    const followerScore = softNorm(snapshot.followers, 25, 0.08)
    const followingScore = softNorm(snapshot.following, 25, 0.08)
    const associateRatio = softNorm(
        snapshot.followers / (snapshot.following + 1),
        1.2,
        1.2
    )
    const languageScore = softNorm(languages.length, 4, 0.45)
    const topicScore = softNorm(topicsTotal, 12, 0.15)
    const repoScore = softNorm(originalRepos.length, 8, 0.2)
    const pushScore = softNorm(pushEvents, 20, 0.1)
    const consistency = regularityScore(timestamps)
    const discipline = combine([
        {
            weight: 0.55,
            value: softNorm(activeDays, WINDOW_DAYS * 0.35, 0.08),
        },
        { weight: 0.3, value: consistency },
        { weight: 0.15, value: pushScore },
    ])
    const chaos = combine([
        { weight: 0.45, value: 100 - consistency },
        {
            weight: 0.3,
            value: softNorm(
                Math.abs(pushEvents - issueEvents - prEvents),
                15,
                0.1
            ),
        },
        {
            weight: 0.25,
            value: softNorm(1 - describedRatio, 0.5, 4),
        },
    ])

    const scores: TraitVector = {
        Builder: combine([
            { weight: 0.45, value: repoScore },
            { weight: 0.35, value: pushScore },
            { weight: 0.15, value: originalRatio * 100 },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Architect: combine([
            { weight: 0.4, value: topicScore },
            { weight: 0.35, value: describedRatio * 100 },
            { weight: 0.2, value: languageScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Scientist: combine([
            { weight: 0.55, value: languageScore },
            { weight: 0.25, value: topicScore },
            { weight: 0.15, value: softNorm(repos.length, 10, 0.15) },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Explorer: combine([
            { weight: 0.4, value: languageScore },
            { weight: 0.35, value: topicScore },
            { weight: 0.2, value: softNorm(repos.length, 15, 0.12) },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        TeamPlayer: combine([
            { weight: 0.4, value: softNorm(prEvents, 8, 0.25) },
            { weight: 0.3, value: softNorm(reviewEvents, 5, 0.3) },
            { weight: 0.25, value: followerScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Mentor: combine([
            { weight: 0.4, value: softNorm(commentEvents, 10, 0.2) },
            { weight: 0.3, value: softNorm(reviewEvents, 5, 0.3) },
            { weight: 0.25, value: followingScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Leadership: combine([
            { weight: 0.35, value: followerScore },
            { weight: 0.3, value: associateRatio },
            { weight: 0.3, value: softNorm(reviewEvents + prEvents, 10, 0.2) },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Consistency: consistency,
        Discipline: discipline,
        Curiosity: combine([
            { weight: 0.45, value: languageScore },
            { weight: 0.35, value: topicScore },
            { weight: 0.15, value: softNorm(events.length, 30, 0.08) },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Creativity: combine([
            { weight: 0.4, value: languageScore },
            {
                weight: 0.3,
                value: nameEntropy(repos.map((repo) => repo.name)),
            },
            { weight: 0.25, value: topicScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Documentation: combine([
            { weight: 0.7, value: describedRatio * 100 },
            { weight: 0.25, value: topicScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        OpenSource: combine([
            { weight: 0.45, value: originalRatio * 100 },
            { weight: 0.35, value: repoScore },
            { weight: 0.15, value: ageScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Communication: combine([
            { weight: 0.4, value: softNorm(issueEvents, 10, 0.2) },
            { weight: 0.35, value: softNorm(commentEvents, 10, 0.2) },
            { weight: 0.2, value: softNorm(prEvents, 8, 0.25) },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Chaos: chaos,
    }

    for (const trait of TRAIT_IDS) {
        scores[trait] = clamp(scores[trait], 0, 100)
    }

    return scores
}

export function emptyTraitVector(fill = 0): TraitVector {
    return Object.fromEntries(
        TRAIT_IDS.map((trait) => [trait, fill])
    ) as TraitVector
}

export function isTraitId(value: string): value is TraitId {
    return (TRAIT_IDS as readonly string[]).includes(value)
}
