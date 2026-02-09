import { fetchLeaderboardUsers, fetchTournamentLeaderboard } from '@/db/queries'
import { getMultipleCodeforcesUsers } from '@/lib/codeforces'
import LeaderboardClient from './client'
import type { LeaderboardUser } from '@/db/types'
import { Suspense } from 'react'

async function LeaderboardContent() {
    const [users, tournamentData] = await Promise.all([
        fetchLeaderboardUsers(),
        fetchTournamentLeaderboard(),
    ])

    // Build semicolon-separated string
    const handles = users.map((u) => u.codeforcesHandle).join(';')

    // Fetch CF data for all users
    const cfUsers = handles ? await getMultipleCodeforcesUsers(handles) : []

    // Merge data
    const leaderboardData = users.map((user: LeaderboardUser) => {
        const cfData = cfUsers.find(
            (cf) =>
                cf.handle.toLowerCase() === user.codeforcesHandle.toLowerCase()
        )
        return {
            ...user,
            rating: cfData?.rating ?? 0,
            rank: cfData?.rank ?? 'unrated',
            maxRating: cfData?.maxRating,
        }
    })

    // Sort by rating
    leaderboardData.sort((a, b) => b.rating - a.rating)

    return (
        <LeaderboardClient
            leaderboardData={leaderboardData}
            tournamentData={tournamentData}
        />
    )
}

export default async function LeaderboardPage() {
    return (
        <Suspense
            fallback={
                <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
                    <div className="text-muted-foreground">
                        Loading leaderboard...
                    </div>
                </main>
            }
        >
            <LeaderboardContent />
        </Suspense>
    )
}
