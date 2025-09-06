import React from 'react'

export default function EmptyStateCard({
    emoji,
    heading,
    subtext,
    className = '',
}: {
    emoji: string
    heading: string
    subtext: string
    className?: string
}) {
    return (
        <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 text-neutral-200 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                <span className="animate-bounce text-7xl">{emoji}</span>
                <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                    {heading}
                </h2>
                <p className="mt-2 text-neutral-400">{subtext}</p>
            </div>
        </section>
    )
}
