import { TextScramble } from '@/components/motion-primitives/text-scramble'
import UpcomingEventsTabs from '@/components/UpcomingEventsTabs'
import { fetchUpcomingEvents } from '@/db/queries'
import { UpcomingEvent } from '@/db/types'
import { Suspense } from 'react'

export default async function UpcomingEvents() {
    const upcomingEvent: UpcomingEvent[] = await fetchUpcomingEvents()
    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Mark Your Calenders
            </TextScramble>
            <Suspense
                fallback={
                    <div className="flex items-center justify-center py-12">
                        <div className="text-muted-foreground text-center">
                            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                            <p>Loading events...</p>
                        </div>
                    </div>
                }
            >
                <UpcomingEventsTabs events={upcomingEvent} />
            </Suspense>
        </main>
    )
}
