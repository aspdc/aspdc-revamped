import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { fetchEvents } from '@/db/queries'
import { Event } from '@/db/types'
import React from 'react'

const majorEvents = ['Hackspire 2025', 'Adani University x Odoo Hackathon']

const Events = async () => {
    const items: Event[] = await fetchEvents()

    if (items.length === 0)
        return (
            <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
                <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                    Achievements
                </TextScramble>
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                    <span className="animate-bounce text-7xl">📅</span>
                    <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                        No Upcoming Events
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Stay tuned — something exciting is on the way!
                    </p>
                </div>
            </main>
        )

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Happening @ ASPDC
            </TextScramble>
            <BentoGrid>
                {items.map((item) => (
                    <BentoCard
                        key={item.id}
                        name={item.name}
                        description={item.details}
                        background={item.imageUrls} // Pass the array directly
                        className={`transition-transform duration-200 ease-in-out hover:scale-[1.05] ${
                            item.name === 'Hackspire 2025'
                                ? 'md:col-span-2 lg:col-span-3'
                                : majorEvents.includes(item.name)
                                  ? 'md:col-span-2'
                                  : ''
                        }`}
                    />
                ))}
            </BentoGrid>
        </main>
    )
}

export default Events
