/* eslint-disable @next/next/no-img-element */
'use client'

import { UpcomingEvent } from '@/db/types'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function UpcomingEventsPage({
    events,
}: {
    events: UpcomingEvent[]
}) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Filter out past events
    const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() >= today.getTime()
    })

    // Sort by date (today first, then upcoming soonest)
    const sortedEvents = filteredEvents.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    return (
        <section className="mx-auto max-w-7xl gap-10 pb-24 text-neutral-200 md:grid-cols-2 md:px-6 lg:grid-cols-3">
            {sortedEvents.map((event) => {
                const eventDate = new Date(event.date)
                eventDate.setHours(0, 0, 0, 0)

                const diffDays = Math.round(
                    (eventDate.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24)
                )

                // Badge text + style
                let badgeText = ''
                let badgeClass = ''
                if (diffDays === 0) {
                    badgeText = 'Happening Today 🎉'
                    badgeClass = 'bg-yellow-400 text-black'
                } else if (diffDays > 0 && diffDays <= 10) {
                    badgeText = `${diffDays} day${diffDays > 1 ? 's' : ''} left`
                    badgeClass = 'bg-orange-400 text-black'
                } else {
                    badgeText = 'Upcoming'
                    badgeClass = 'bg-primary text-black'
                }

                return (
                    <article
                        key={event.id}
                        className="group hover:shadow-primary/30 hover:border-primary/40 relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/70 to-neutral-800/30 shadow-lg backdrop-blur-md"
                    >
                        {/* Event Image */}
                        {event.eventImageUrl && (
                            <div className="relative aspect-video w-full overflow-hidden">
                                <img
                                    src={event.eventImageUrl}
                                    alt={event.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                                {/* Tag Badge */}
                                <span
                                    className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold shadow ${badgeClass}`}
                                >
                                    {badgeText}
                                </span>
                            </div>
                        )}

                        {/* Content */}
                        <div className="relative flex flex-1 flex-col justify-between p-6">
                            <div>
                                <h2 className="text-primary mb-2 text-xl leading-tight font-extrabold md:text-2xl">
                                    {event.name}
                                </h2>
                                <p className="text-sm leading-relaxed text-neutral-400 md:text-base">
                                    {event.description}
                                </p>
                            </div>

                            {/* Metadata */}
                            <div className="mt-6 space-y-2 text-sm text-neutral-300">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        size={16}
                                        className="text-primary shrink-0"
                                    />
                                    <span>
                                        {new Date(
                                            event.date
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                {event.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            size={16}
                                            className="text-primary shrink-0"
                                        />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex gap-3">
                                {event.registrationLink ? (
                                    <Link
                                        href={event.registrationLink}
                                        target="_blank"
                                        className="bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-black shadow transition hover:scale-105 active:scale-95"
                                    >
                                        Register <ExternalLink size={16} />
                                    </Link>
                                ) : (
                                    <span className="rounded-lg border border-white/20 px-4 py-2 text-sm text-neutral-400">
                                        Coming Soon 🚧
                                    </span>
                                )}
                            </div>
                        </div>
                    </article>
                )
            })}

            {/* Empty State */}
            {sortedEvents.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-8 text-center md:p-16">
                    <span className="animate-bounce text-7xl">👩‍💻</span>
                    <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                        No Upcoming Events
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Stay tuned — something exciting is cooking at ASPDC!
                    </p>
                </div>
            )}
        </section>
    )
}
