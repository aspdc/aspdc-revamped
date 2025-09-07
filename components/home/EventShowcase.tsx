/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { fetchEvents } from '@/db/queries'
import { Event } from '@/db/types'
import React from 'react'
import { TextScramble } from '../motion-primitives/text-scramble'
import { TextEffect } from '../motion-primitives/text-effect'
import { InteractiveHoverButton } from '../magicui/interactive-hover-button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    ScrollVelocityContainer,
    ScrollVelocityRow,
} from '../magicui/scroll-based-velocity'

const ImageCard = ({ img }: { img: string }) => {
    return (
        <figure
            className={cn(
                'relative mr-3 h-48 w-48 overflow-hidden rounded-xl border sm:h-64 sm:w-64 md:mr-6 lg:h-72 lg:w-72'
            )}
        >
            <img
                alt=""
                src={img}
                className="absolute inset-0 h-full w-full object-cover"
            />
        </figure>
    )
}

const EventShowcase = async () => {
    const items: Event[] = await fetchEvents()
    const images = items.flatMap((event) => event.imageUrls.slice(0, 2))
    const firstRow = images.slice(0, Math.ceil(images.length / 2))
    const secondRow = images.slice(Math.ceil(images.length / 2))

    return (
        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center sm:px-6 md:px-8">
            {/* Title */}
            <TextScramble
                duration={1}
                className="text-primary text-5xl font-extrabold tracking-tight md:text-7xl"
            >
                Gallery
            </TextScramble>

            {/* Description */}
            <TextEffect
                per="char"
                preset="blur"
                speedReveal={2}
                className="mt-6 max-w-2xl text-xl text-gray-400 md:text-2xl"
            >
                A glimpse into our past events — moments of learning,
                collaboration, and fun.
            </TextEffect>

            {/* Gallery */}
            <ScrollVelocityContainer className="my-8 sm:my-10 md:my-12">
                <ScrollVelocityRow direction={1} baseVelocity={10}>
                    {firstRow.map((img: any, idx: number) => (
                        <ImageCard key={`${img}-${idx}`} img={img} />
                    ))}
                </ScrollVelocityRow>
                <ScrollVelocityRow direction={-1} baseVelocity={10}>
                    {secondRow.map((img: any, idx: number) => (
                        <ImageCard key={`${img}-${idx}`} img={img} />
                    ))}
                </ScrollVelocityRow>
            </ScrollVelocityContainer>

            {/* Button */}
            <Link href={'/events'}>
                <InteractiveHoverButton>
                    Relive the Moments
                </InteractiveHoverButton>
            </Link>
        </section>
    )
}

export default EventShowcase
