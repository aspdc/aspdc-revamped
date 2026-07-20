import { Suspense } from 'react'
import {
    fetchLabAchievementsByProfileId,
    fetchLabProfileByGithubUsername,
    fetchLabProfilesByScore,
} from '@/db/queries'
import { getProfileDisplayData } from '@/lib/lab/profile'
import { CharacterHero } from '@/components/lab/character-hero'
import { TopMatches } from '@/components/lab/top-matches'
import { TraitRadarChart } from '@/components/lab/trait-radar'
import { AchievementsGrid } from '@/components/lab/achievements-grid'
import { GlobalRankingBellCurve } from '@/components/lab/bell-curve'
import { NotFoundDossier } from '@/components/lab/not-found-dossier'
import { MetricsExplanation } from '@/components/lab/metrics-explanation'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params
    const profile = await fetchLabProfileByGithubUsername(username)

    if (!profile) {
        return {
            title: `Developer Not Found | Breaking Devs`,
            description: `No developer profile found for @${username}.`,
        }
    }

    const title = `@${profile.githubUsername}'s Developer Profile | Breaking Devs`
    const description = `GitHub developer analysis for @${profile.githubUsername}. Persona match: ${profile.characterId} (${profile.characterSimilarity.toFixed(2)}% match).`
    const ogImageUrl = `/api/lab/og/${encodeURIComponent(profile.githubUsername)}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: `@${profile.githubUsername}'s Breaking Dev Dossier`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
    }
}

async function ProfileContent({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params
    const profile = await fetchLabProfileByGithubUsername(username)

    if (!profile) {
        return <NotFoundDossier username={username} />
    }

    const [dbAchievementIds, allProfiles] = await Promise.all([
        fetchLabAchievementsByProfileId(profile.id),
        fetchLabProfilesByScore(),
    ])

    const displayData = getProfileDisplayData(profile, dbAchievementIds)

    const primaryExplanation =
        displayData.topMatches[0]?.explanation ||
        displayData.primaryCharacter.summary

    return (
        <div className="bg-background text-foreground min-h-screen font-sans">
            {/* Section 1: Character Reveal Hero */}
            <CharacterHero
                username={profile.githubUsername}
                character={displayData.primaryCharacter}
                similarity={profile.characterSimilarity}
                developerScore={profile.developerScore}
                explanation={primaryExplanation}
                profileUserId={profile.userId}
            />

            {/* Section 2: Top 3 Character Matches */}
            <TopMatches matches={displayData.topMatches} />

            {/* Section 3: Trait Radar Chart */}
            <TraitRadarChart traits={displayData.traits} />

            {/* Section 4: Global Ranking Distribution */}
            <GlobalRankingBellCurve
                userScore={profile.developerScore}
                username={profile.githubUsername}
                allProfiles={allProfiles}
            />

            {/* Section 5: Achievements & Badges */}
            <AchievementsGrid achievements={displayData.achievements} />

            {/* Section 6: Methodology & Metrics Explanation */}
            <MetricsExplanation />
        </div>
    )
}

export default function LabProfilePage({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-black">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                        <p className="font-mono text-xs text-green-400">
                            DECRYPTING SUBJECT DOSSIER...
                        </p>
                    </div>
                </div>
            }
        >
            <ProfileContent params={params} />
        </Suspense>
    )
}
