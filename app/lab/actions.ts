'use server'

import { headers } from 'next/headers'
import { replaceLabAchievements, upsertLabProfile } from '@/db/mutations'
import { findLabProfileByUserId } from '@/db/queries'
import {
    persistGitHubSnapshot,
    readPersistedGitHubSnapshot,
    resolveGitHubSnapshot,
    runAnalysisPipeline,
    type AnalysisPipelineResult,
} from '@/lib/lab/analyze'
import { auth } from '@/lib/auth'
import { fetchGitHubSnapshot } from '@/lib/lab/github'
import { getGitHubAccessToken } from '@/lib/lab/github-token'

export type AnalyzeLabProfileSuccess = {
    ok: true
    profile: {
        id: string
        githubUsername: string
        characterId: string
        characterSimilarity: number
        developerScore: number
        traitScores: AnalysisPipelineResult['traitScores']
        characterMatches: AnalysisPipelineResult['characterMatches']
        achievements: AnalysisPipelineResult['achievements']
        analyzedAt: string
    }
}

export type AnalyzeLabProfileError = {
    ok: false
    error: 'unauthenticated' | 'no_github' | 'github_api' | 'unknown'
    message: string
}

export type AnalyzeLabProfileResult =
    AnalyzeLabProfileSuccess | AnalyzeLabProfileError

export async function analyzeLabProfile(): Promise<AnalyzeLabProfileResult> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.user?.id) {
            return {
                ok: false,
                error: 'unauthenticated',
                message: 'You must be signed in to run an analysis.',
            }
        }

        const userId = session.user.id

        let accessToken: string
        try {
            accessToken = await getGitHubAccessToken(userId)
        } catch {
            return {
                ok: false,
                error: 'no_github',
                message:
                    'No GitHub account is linked. Sign in with GitHub and try again.',
            }
        }

        const existing = await findLabProfileByUserId(userId)
        const cached = existing
            ? readPersistedGitHubSnapshot(existing.githubSnapshot)
            : null

        let resolved: Awaited<ReturnType<typeof resolveGitHubSnapshot>>
        try {
            resolved = await resolveGitHubSnapshot({
                cached,
                fetchFresh: () => fetchGitHubSnapshot(accessToken),
            })
        } catch (error) {
            return {
                ok: false,
                error: 'github_api',
                message:
                    error instanceof Error
                        ? error.message
                        : 'GitHub API request failed.',
            }
        }

        const analysis = runAnalysisPipeline(resolved.snapshot)
        const analyzedAt = new Date()

        const profile = await upsertLabProfile({
            userId,
            githubUsername: analysis.githubUsername,
            characterId: analysis.characterId,
            characterSimilarity: analysis.characterSimilarity,
            developerScore: analysis.developerScore,
            traitScores: analysis.traitScores,
            githubSnapshot: persistGitHubSnapshot(
                analysis.githubSnapshot,
                resolved.capturedAt
            ),
            analyzedAt,
        })

        await replaceLabAchievements(
            profile.id,
            analysis.achievements.map((achievement) => ({
                achievementId: achievement.id,
                unlockedAt: analyzedAt,
            }))
        )

        return {
            ok: true,
            profile: {
                id: profile.id,
                githubUsername: profile.githubUsername,
                characterId: profile.characterId,
                characterSimilarity: profile.characterSimilarity,
                developerScore: profile.developerScore,
                traitScores: analysis.traitScores,
                characterMatches: analysis.characterMatches,
                achievements: analysis.achievements,
                analyzedAt: analyzedAt.toISOString(),
            },
        }
    } catch (error) {
        return {
            ok: false,
            error: 'unknown',
            message:
                error instanceof Error
                    ? error.message
                    : 'Analysis failed unexpectedly.',
        }
    }
}
