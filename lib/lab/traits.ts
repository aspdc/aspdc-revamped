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
    const density = softNorm(timestamps.length, 8, 0.2)
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
    return softNorm(stars + forks * 2, 3, 0.35)
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
    const followerScore = softNorm(snapshot.followers, 6, 0.18)
    const followingScore = softNorm(snapshot.following, 12, 0.1)
    const networkScore = combine([
        { weight: 0.55, value: followerScore },
        { weight: 0.45, value: followingScore },
    ])
    const languageScore = softNorm(languages.length, 2, 0.7)
    const topicScore = softNorm(topicsTotal, 3, 0.4)
    const repoScore = softNorm(originalRepos.length, 3, 0.4)
    const pushScore = softNorm(pushEvents, 5, 0.25)
    const consistency = regularityScore(timestamps)
    const discipline = combine([
        {
            weight: 0.55,
            value: softNorm(activeDays, WINDOW_DAYS * 0.1, 0.15),
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
                6,
                0.2
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
            { weight: 0.4, value: pushScore },
            { weight: 0.1, value: originalRatio * 100 },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Architect: combine([
            { weight: 0.35, value: topicScore },
            { weight: 0.4, value: describedRatio * 100 },
            { weight: 0.2, value: languageScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Scientist: combine([
            { weight: 0.55, value: languageScore },
            { weight: 0.25, value: topicScore },
            { weight: 0.15, value: softNorm(repos.length, 3, 0.35) },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Explorer: combine([
            { weight: 0.4, value: languageScore },
            { weight: 0.35, value: topicScore },
            { weight: 0.2, value: softNorm(repos.length, 4, 0.3) },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        TeamPlayer: combine([
            { weight: 0.35, value: networkScore },
            { weight: 0.3, value: softNorm(prEvents, 1, 0.9) },
            { weight: 0.2, value: softNorm(reviewEvents, 1, 1.0) },
            { weight: 0.1, value: followingScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Mentor: combine([
            { weight: 0.4, value: followingScore },
            { weight: 0.3, value: followerScore },
            { weight: 0.25, value: softNorm(commentEvents, 2, 0.55) },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Leadership: combine([
            { weight: 0.45, value: followerScore },
            { weight: 0.3, value: followingScore },
            { weight: 0.2, value: softNorm(prEvents + reviewEvents, 2, 0.5) },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Consistency: consistency,
        Discipline: discipline,
        Curiosity: combine([
            { weight: 0.45, value: languageScore },
            { weight: 0.3, value: topicScore },
            { weight: 0.2, value: softNorm(events.length, 6, 0.2) },
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
            { weight: 0.75, value: describedRatio * 100 },
            { weight: 0.2, value: topicScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        OpenSource: combine([
            { weight: 0.3, value: followerScore },
            { weight: 0.25, value: followingScore },
            { weight: 0.25, value: originalRatio * 100 },
            { weight: 0.15, value: repoScore },
            { weight: STAR_FORK_WEIGHT, value: popularity },
        ]),
        Communication: combine([
            { weight: 0.3, value: followerScore },
            { weight: 0.2, value: followingScore },
            {
                weight: 0.3,
                value: softNorm(issueEvents + commentEvents, 2, 0.55),
            },
            { weight: 0.15, value: describedRatio * 100 },
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

export const TRAIT_LABELS: Record<TraitId, string> = {
    Builder: 'Builder',
    Architect: 'Architect',
    Scientist: 'Scientist',
    Explorer: 'Explorer',
    TeamPlayer: 'Team Player',
    Mentor: 'Mentor',
    Leadership: 'Leadership',
    Consistency: 'Consistency',
    Discipline: 'Discipline',
    Curiosity: 'Curiosity',
    Creativity: 'Creativity',
    Documentation: 'Documentation',
    OpenSource: 'Open Source',
    Communication: 'Communication',
    Chaos: 'Chaos',
}

/**
 * Plain-English explanation of what each trait measures and what a high score means.
 * Used in the UI to help readers understand their profile.
 */
export const TRAIT_DESCRIPTIONS: Record<TraitId, string> = {
    Builder:
        'How much code you ship. Measures how many original repos you own and how frequently you push commits. A high score means you spend most of your time creating new things rather than maintaining or forking others.',
    Architect:
        'How well you design and document projects. Looks at whether your repos have descriptions, relevant tags, and READMEs. A high score means people landing on your profile can immediately understand what your projects do.',
    Scientist:
        'How many programming languages you use. A high score means you regularly work across multiple languages — not just one stack — which signals broad technical range.',
    Explorer:
        'How broadly you range across topics. Combines language variety with the number of topic tags on your repos. A high score means you dip into many different problem domains rather than staying in one lane.',
    TeamPlayer:
        "How actively you collaborate. Counts pull requests, PR reviews, and your GitHub follow network. A high score means you actively participate in others' projects, not just your own.",
    Mentor: 'How much you follow and engage with others. Measures who you follow and how often you leave comments. A high score means you are actively guiding or encouraging other developers.',
    Leadership:
        'How much influence you have on GitHub. Looks at your follower count relative to who you follow. A high score means many developers look to you — not the other way around.',
    Consistency:
        'How evenly spaced your commits are over time. A high score means you code regularly across the week, rather than in intense bursts followed by long silences.',
    Discipline:
        'How reliably active you are over the 90-day window. Combines consistency with active days and push volume. A high score means you show up to code day after day.',
    Curiosity:
        'How much you explore new territory. Combines language diversity with repo topics and overall event activity. A high score means you are always trying something new.',
    Creativity:
        'How unique your project ideas are. Measures language variety plus the originality of your repo names. A high score means your projects are distinctive — not cookie-cutter.',
    Documentation:
        'How thoroughly you document your work. Primarily driven by how many of your repos have descriptions. A high score means someone can understand your project without reading your code.',
    OpenSource:
        'How publicly engaged you are. Looks at your follower and following network alongside original repo count. A high score means you are a visible, sharing member of the open-source ecosystem.',
    Communication:
        'How clearly you communicate with the community. Combines follower reach with issue comments and commit comments. A high score means you actively discuss, review, and respond — not just code in silence.',
    Chaos: 'How unpredictable your activity patterns are. A high score means your commit schedule is erratic and your project mix is broad and inconsistent — this is not necessarily bad; many prolific experimenters score high here.',
}

export function getTraitLabel(traitId: TraitId): string {
    return TRAIT_LABELS[traitId] ?? traitId
}

export function getTraitDescription(traitId: TraitId): string {
    return TRAIT_DESCRIPTIONS[traitId] ?? ''
}
