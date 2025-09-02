import { TextScramble } from '@/components/motion-primitives/text-scramble'
import UpcomingEventsPage from '@/components/UpcomingEvents'
import { fetchUpcomingEvents } from '@/db/queries'
import { UpcomingEvent } from '@/db/types'

export default async function UpcomingEvents() {
    const upcomingEvent: UpcomingEvent[] = await fetchUpcomingEvents()
    return (
        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-8 md:py-32 lg:px-16">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Mark Your Calenders
            </TextScramble>
            <UpcomingEventsPage events={upcomingEvent} />
        </main>
    )
}
