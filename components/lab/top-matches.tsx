'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getCharacterImageUrl, type CharacterMatch } from '@/lib/lab/characters'

type TopMatchesProps = {
    matches: CharacterMatch[]
}

function MatchAvatar({ src, alt }: { src: string; alt: string }) {
    const [imgSrc, setImgSrc] = useState(src)
    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setImgSrc('/placeholder.svg')}
        />
    )
}

export function TopMatches({ matches }: TopMatchesProps) {
    return (
        <section className="bg-background text-foreground relative w-full px-4 py-12 font-sans">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
                {/* Section Header */}
                <div className="mb-2 text-center">
                    <span className="text-muted-foreground font-mono text-xs uppercase">
                        DEVELOPER PERSONA ALIGNMENT
                    </span>
                    <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Top 3 Developer Archetype Matches
                    </h2>
                    <p className="text-muted-foreground mt-1 max-w-xl text-center font-mono text-xs sm:text-sm">
                        Calculated by comparing your coding speed, refactoring
                        frequency, and repo complexity against standard
                        developer personas.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
                    {matches.map((match, idx) => {
                        const matchImg = getCharacterImageUrl(match.id)
                        const isPrimary = idx === 0

                        return (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className={`relative flex flex-col justify-between rounded-xl border p-6 shadow-sm ${
                                    isPrimary
                                        ? 'border-primary bg-card shadow-md'
                                        : 'border-border bg-card'
                                }`}
                            >
                                <div>
                                    {/* Top Rank Header */}
                                    <div className="text-muted-foreground mb-4 flex items-center justify-between font-mono text-xs">
                                        <span>MATCH #{idx + 1}</span>
                                        {isPrimary && (
                                            <span className="text-primary font-bold">
                                                PRIMARY MATCH
                                            </span>
                                        )}
                                    </div>

                                    {/* Avatar & Name */}
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="border-border bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border">
                                            <MatchAvatar
                                                src={matchImg}
                                                alt={match.name}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-foreground text-lg font-extrabold tracking-tight">
                                                {match.name}
                                            </h3>
                                            <span className="text-muted-foreground font-mono text-xs uppercase">
                                                {match.id.replace(/-/g, ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Similarity Bar */}
                                    <div className="mb-4 space-y-1.5 font-mono text-xs">
                                        <div className="text-muted-foreground flex items-center justify-between">
                                            <span>SIMILARITY RATING</span>
                                            <span className="text-foreground font-bold">
                                                {Math.round(match.similarity)}%
                                            </span>
                                        </div>
                                        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                                            <div
                                                className="bg-primary h-full rounded-full"
                                                style={{
                                                    width: `${Math.min(100, Math.max(0, match.similarity))}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Layman Explanation */}
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        {match.explanation}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
