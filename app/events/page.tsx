import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { fetchEvents } from '@/db/queries'
import { Event } from '@/db/types'
import React from 'react'

const majorEvents = ['Hackspire', 'Tech Talk: Future of AI', 'Tech Fest']

const Events = async () => {
    const items: Event[] = await fetchEvents()

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Happening @ ASPDC
            </TextScramble>
            <BentoGrid>
                {items.length === 0 && (
                    <BentoCard
                        name={'HElLO'}
                        description={'j'} // Pass the array directly
                        background={[]} // Pass the array directly
                    />
                )}
                {items.map((item) => (
                    <BentoCard
                        key={item.id}
                        name={item.name}
                        description={item.details}
                        background={item.imageUrls} // Pass the array directly
                        className={`transition-transform duration-200 ease-in-out hover:scale-[1.05] ${
                            majorEvents.includes(item.name)
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
