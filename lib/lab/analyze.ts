import { assignCharacter, type CharacterMatch } from './characters'
import { scoreDeveloper } from './developer-score'
import { unlockAchievements, type Achievement } from './achievements'
import { scoreTraits } from './traits'
import type { GitHubSnapshot, TraitVector } from './types'

export const SNAPSHOT_MAX_AGE_MS = 24 * 60 * 60 * 1000

export type PersistedGitHubSnapshot = {
    capturedAt: string
    snapshot: GitHubSnapshot
}

export type CachedGitHubSnapshot = {
    capturedAt: Date
    snapshot: GitHubSnapshot
}

export type AnalysisPipelineResult = {
    githubUsername: string
    characterId: string
    characterSimilarity: number
    characterMatches: CharacterMatch[]
    developerScore: number
    traitScores: TraitVector
    achievements: Achievement[]
    githubSnapshot: GitHubSnapshot
}

export function isSnapshotFresh(
    capturedAt: Date,
    now: Date = new Date()
): boolean {
    return now.getTime() - capturedAt.getTime() < SNAPSHOT_MAX_AGE_MS
}

export function persistGitHubSnapshot(
    snapshot: GitHubSnapshot,
    capturedAt: Date
): PersistedGitHubSnapshot {
    return {
        capturedAt: capturedAt.toISOString(),
        snapshot,
    }
}

function isGitHubSnapshot(value: unknown): value is GitHubSnapshot {
    if (!value || typeof value !== 'object') return false
    const candidate = value as Partial<GitHubSnapshot>
    return (
        typeof candidate.login === 'string' &&
        typeof candidate.accountCreatedAt === 'string' &&
        typeof candidate.followers === 'number' &&
        typeof candidate.following === 'number' &&
        typeof candidate.publicRepos === 'number' &&
        Array.isArray(candidate.repos) &&
        Array.isArray(candidate.events)
    )
}

export function readPersistedGitHubSnapshot(
    raw: Record<string, unknown>
): CachedGitHubSnapshot | null {
    const capturedAtRaw = raw.capturedAt
    if (typeof capturedAtRaw !== 'string') return null
    const capturedAt = new Date(capturedAtRaw)
    if (Number.isNaN(capturedAt.getTime())) return null
    if (!isGitHubSnapshot(raw.snapshot)) return null
    return { capturedAt, snapshot: raw.snapshot }
}

export async function resolveGitHubSnapshot(options: {
    cached: CachedGitHubSnapshot | null
    fetchFresh: () => Promise<GitHubSnapshot>
    now?: Date
}): Promise<{
    snapshot: GitHubSnapshot
    capturedAt: Date
    fetched: boolean
}> {
    const now = options.now ?? new Date()
    if (options.cached && isSnapshotFresh(options.cached.capturedAt, now)) {
        return {
            snapshot: options.cached.snapshot,
            capturedAt: options.cached.capturedAt,
            fetched: false,
        }
    }

    const snapshot = await options.fetchFresh()
    return {
        snapshot,
        capturedAt: now,
        fetched: true,
    }
}

export function runAnalysisPipeline(
    snapshot: GitHubSnapshot
): AnalysisPipelineResult {
    const traitScores = scoreTraits(snapshot)
    const characterMatches = assignCharacter(traitScores)
    const primary = characterMatches[0]!
    const developerScore = scoreDeveloper(traitScores)
    const achievements = unlockAchievements(traitScores, snapshot)

    return {
        githubUsername: snapshot.login,
        characterId: primary.id,
        characterSimilarity: primary.similarity,
        characterMatches,
        developerScore,
        traitScores,
        achievements,
        githubSnapshot: snapshot,
    }
}
