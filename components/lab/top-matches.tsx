'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Crown, Sparkles } from 'lucide-react'
import { getCharacterImageUrl, type CharacterMatch } from '@/lib/lab/characters'

type TopMatchesProps = {
    matches: CharacterMatch[]
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] as const },
    },
}

export function TopMatches({ matches }: TopMatchesProps) {
    const topThree = matches.slice(0, 3)

    return (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 font-[family-name:var(--font-space-grotesk)]">
            {/* Section Header */}
            <div className="mb-12 space-y-2 text-center">
                <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#22c55e] uppercase">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>CLASSIFIED ANALYSIS // ALIGNMENT</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Top 3 Character Matches
                </h2>
                <p className="mx-auto max-w-lg text-sm text-gray-400">
                    Cosine similarity vector mapping against known lab personas.
                </p>
            </div>

            {/* Cards Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3"
            >
                {topThree.map((match, index) => {
                    const isPrimary = index === 0
                    const matchImg =
                        match.image || getCharacterImageUrl(match.id)

                    return (
                        <motion.div
                            key={match.id}
                            variants={itemVariants}
                            className={`flex flex-col justify-between rounded-xl p-6 transition-all duration-300 ${
                                isPrimary
                                    ? 'relative border-2 border-[#22c55e] bg-gradient-to-b from-[#15453D]/40 via-green-950/20 to-black shadow-[0_0_30px_rgba(34,197,94,0.2)] md:-translate-y-2'
                                    : 'border border-green-500/20 bg-black/60 backdrop-blur-sm hover:border-green-500/40'
                            }`}
                        >
                            <div>
                                {/* Header badge for primary match */}
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="font-mono text-xs text-gray-400">
                                        RANK #{index + 1}
                                    </span>
                                    {isPrimary && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22c55e]/50 bg-[#22c55e]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#22c55e] uppercase">
                                            <Crown className="h-3 w-3" />
                                            PRIMARY MATCH
                                        </span>
                                    )}
                                </div>

                                {/* Character Avatar Thumbnail + Name */}
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-green-500/30 bg-green-950/50">
                                        <Image
                                            src={matchImg}
                                            alt={match.name}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement
                                                target.srcset =
                                                    '/placeholder.svg'
                                                target.src = '/placeholder.svg'
                                            }}
                                        />
                                    </div>
                                    <h3
                                        className={`text-xl font-extrabold tracking-tight ${
                                            isPrimary
                                                ? 'text-[#22c55e]'
                                                : 'text-white'
                                        }`}
                                    >
                                        {match.name}
                                    </h3>
                                </div>

                                {/* Similarity Fill Bar */}
                                <div className="mb-4 space-y-1.5">
                                    <div className="flex items-center justify-between font-mono text-xs">
                                        <span className="text-gray-400">
                                            SIMILARITY
                                        </span>
                                        <span className="font-bold text-[#22c55e]">
                                            {match.similarity}%
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full border border-green-500/30 bg-green-950/60">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{
                                                width: `${match.similarity}%`,
                                            }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 1,
                                                delay: 0.2 + index * 0.1,
                                            }}
                                            className="h-full rounded-full bg-[#22c55e]"
                                        />
                                    </div>
                                </div>

                                {/* Explanation */}
                                <p className="text-sm leading-relaxed text-gray-300">
                                    {match.explanation}
                                </p>
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        </section>
    )
}
