import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchEvents } from '@/db/queries'
import EventsAdminClient from './client'
import { Suspense } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

async function EventsContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const events = await fetchEvents()

    return <EventsAdminClient initialData={events} />
}

export default async function EventsAdminPage() {
    return (
        <Suspense
            fallback={
                <Card>
                    <CardHeader>
                        <CardTitle>Loading Events...</CardTitle>
                        <CardDescription>
                            Please wait while we fetch the data.
                        </CardDescription>
                    </CardHeader>
                </Card>
            }
        >
            <EventsContent />
        </Suspense>
    )
}
