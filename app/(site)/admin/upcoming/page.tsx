import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchUpcomingEvents } from '@/db/queries'
import UpcomingEventsAdminClient from './client'
import { Suspense } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

async function UpcomingEventsContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const upcomingEvents = await fetchUpcomingEvents()

    return <UpcomingEventsAdminClient initialData={upcomingEvents} />
}

export default async function UpcomingEventsAdminPage() {
    return (
        <Suspense
            fallback={
                <Card>
                    <CardHeader>
                        <CardTitle>Loading Upcoming Events...</CardTitle>
                        <CardDescription>
                            Please wait while we fetch the data.
                        </CardDescription>
                    </CardHeader>
                </Card>
            }
        >
            <UpcomingEventsContent />
        </Suspense>
    )
}
