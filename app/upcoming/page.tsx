import { TextScramble } from '@/components/motion-primitives/text-scramble'
import UpcomingEventsPage from '@/components/UpcomingEvents'
import { fetchUpcomingEvents } from '@/db/queries'
import { UpcomingEvent } from '@/db/types'

export default async function UpcomingEvents() {
    const upcomingEvent: UpcomingEvent[] = await fetchUpcomingEvents()
    return (
        <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Mark Your Calenders
            </TextScramble>
            hello
            <UpcomingEventsPage events={upcomingEvent} />
        </main>
    )
}
