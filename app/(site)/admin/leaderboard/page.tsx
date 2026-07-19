import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchLeaderboardUsers } from '@/db/queries'
import LeaderboardAdminClient from './client'
import { Suspense } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

async function LeaderboardContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const users = await fetchLeaderboardUsers()

    return <LeaderboardAdminClient initialData={users} />
}

export default async function LeaderboardAdminPage() {
    return (
        <Suspense
            fallback={
                <Card>
                    <CardHeader>
                        <CardTitle>Loading Leaderboard Users...</CardTitle>
                        <CardDescription>
                            Please wait while we fetch the data.
                        </CardDescription>
                    </CardHeader>
                </Card>
            }
        >
            <LeaderboardContent />
        </Suspense>
    )
}
