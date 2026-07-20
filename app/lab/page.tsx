import { Suspense } from 'react'
import { fetchLabProfilesByScore } from '@/db/queries'
import { formatLeaderboardEntries } from '@/lib/lab/leaderboard'
import { LabLeaderboard } from '@/components/lab/lab-leaderboard'
import { BreakingDevsLogo } from './breaking-devs-logo'
import { HeroAnalyzeCta } from './hero-analyze-cta'

export const metadata = {
    title: 'Leaderboard | Breaking Devs',
    description:
        'Public ranked index of analyzed GitHub developer profiles, ordered by developer score.',
}

async function LeaderboardContent() {
    const profiles = await fetchLabProfilesByScore()
    const entries = formatLeaderboardEntries(profiles)

    return (
        <div className="bg-background text-foreground flex min-h-screen flex-col font-sans">
            <div className="relative flex flex-1 flex-col items-center px-4 py-12 md:py-20">
                <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-12">
                    {/* Hero Card matching /lab/analyze */}
                    <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
                        <BreakingDevsLogo animate={false} />
                        <div className="bg-border mx-auto h-px w-48" />
                        <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
                            Analyze your GitHub activity to calculate your
                            developer score, coding traits, and matching
                            Breaking Bad character.
                        </p>
                        <HeroAnalyzeCta />
                    </div>

                    {/* Leaderboard Table */}
                    <LabLeaderboard entries={entries} />
                </div>
            </div>
        </div>
    )
}

export default function LabLeaderboardPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-background flex min-h-screen items-center justify-center">
                    <div className="text-muted-foreground flex flex-col items-center gap-3 font-mono text-xs">
                        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                        <p>LOADING DEVELOPER LEADERBOARD...</p>
                    </div>
                </div>
            }
        >
            <LeaderboardContent />
        </Suspense>
    )
}
