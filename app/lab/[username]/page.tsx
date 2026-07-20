import { Suspense } from 'react'
import { headers } from 'next/headers'
import {
    fetchLabAchievementsByProfileId,
    fetchLabProfileByGithubUsername,
    fetchLabProfilesByScore,
} from '@/db/queries'
import { auth } from '@/lib/auth'
import { getProfileDisplayData } from '@/lib/lab/profile'
import { CharacterHero } from '@/components/lab/character-hero'
import { TopMatches } from '@/components/lab/top-matches'
import { TraitRadarChart } from '@/components/lab/trait-radar'
import { AchievementsGrid } from '@/components/lab/achievements-grid'
import { GlobalRankingBellCurve } from '@/components/lab/bell-curve'
import { NotFoundDossier } from '@/components/lab/not-found-dossier'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params
    const profile = await fetchLabProfileByGithubUsername(username)

    if (!profile) {
        return {
            title: `Subject Not Found | Breaking Devs`,
            description: `No laboratory dossier on record for @${username}.`,
        }
    }

    const title = `@${profile.githubUsername}'s Dossier | Breaking Devs`
    const description = `Subject @${profile.githubUsername} laboratory dossier. Persona match: ${profile.characterId} (${Math.round(profile.characterSimilarity)}% purity).`
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

    let session = null
    try {
        session = await auth.api.getSession({
            headers: await headers(),
        })
    } catch {
        session = null
    }

    const isOwner = Boolean(
        session?.user?.id && session.user.id === profile.userId
    )

    const [dbAchievementIds, allProfiles] = await Promise.all([
        fetchLabAchievementsByProfileId(profile.id),
        fetchLabProfilesByScore(),
    ])

    const displayData = getProfileDisplayData(profile, dbAchievementIds)

    const primaryExplanation =
        displayData.topMatches[0]?.explanation ||
        displayData.primaryCharacter.summary

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Section 1: Character Reveal Hero */}
            <CharacterHero
                username={profile.githubUsername}
                character={displayData.primaryCharacter}
                similarity={profile.characterSimilarity}
                developerScore={profile.developerScore}
                explanation={primaryExplanation}
                isOwner={isOwner}
            />

            {/* Section 2: Top 3 Character Matches */}
            <TopMatches matches={displayData.topMatches} />

            {/* Section 3: Trait Radar Chart */}
            <TraitRadarChart traits={displayData.traits} />

            {/* Section 4: Achievements Grid */}
            <AchievementsGrid achievements={displayData.achievements} />

            {/* Section 5: Global Ranking Bell Curve */}
            <GlobalRankingBellCurve
                userScore={profile.developerScore}
                username={profile.githubUsername}
                allProfiles={allProfiles}
            />
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
