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
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
                {/* Section Header */}
                <div className="mb-2 text-center">
                    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                        Developer Persona Alignment
                    </span>
                    <h2 className="text-foreground mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Top 3 Developer Archetype Matches
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-base leading-relaxed">
                        Ranked by how closely your 15 coding traits match each
                        developer archetype. The percentage is a cosine
                        similarity score — higher means your coding style is
                        more like that archetype.
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
                                    <div className="text-muted-foreground mb-4 flex items-center justify-between font-mono text-xs tracking-widest uppercase">
                                        <span>Match #{idx + 1}</span>
                                        {isPrimary && (
                                            <span className="text-primary font-bold">
                                                Primary Match
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
                                    <div className="mb-4 space-y-1.5">
                                        <div className="text-muted-foreground flex items-center justify-between font-mono text-xs tracking-widest uppercase">
                                            <span>Similarity</span>
                                            <span className="text-foreground font-bold">
                                                {match.similarity.toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min(100, Math.max(0, match.similarity))}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Layman Explanation */}
                                    <p className="text-muted-foreground text-base leading-relaxed">
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
