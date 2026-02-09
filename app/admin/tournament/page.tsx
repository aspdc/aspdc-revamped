import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
    fetchTournamentContests,
    fetchTournamentParticipants,
    fetchTournamentScores,
} from '@/db/queries'
import TournamentAdminClient from './client'
import { Suspense } from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

async function TournamentContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const [contests, participants, scores] = await Promise.all([
        fetchTournamentContests(),
        fetchTournamentParticipants(),
        fetchTournamentScores(),
    ])

    return (
        <TournamentAdminClient
            initialContests={contests}
            initialParticipants={participants}
            initialScores={scores}
        />
    )
}

export default async function TournamentAdminPage() {
    return (
        <Suspense
            fallback={
                <Card>
                    <CardHeader>
                        <CardTitle>Loading Tournament Data...</CardTitle>
                        <CardDescription>
                            Please wait while we fetch the data.
                        </CardDescription>
                    </CardHeader>
                </Card>
            }
        >
            <TournamentContent />
        </Suspense>
    )
}
