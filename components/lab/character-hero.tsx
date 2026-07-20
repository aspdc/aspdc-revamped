'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShieldAlert, RefreshCw, ArrowRight, UserCheck } from 'lucide-react'
import {
    getCharacterImageUrl,
    type CharacterProfile,
} from '@/lib/lab/characters'

import Image from 'next/image'
import { ShareButtons } from './share-buttons'

type CharacterHeroProps = {
    username: string
    character: CharacterProfile
    similarity: number
    developerScore: number
    explanation: string
    isOwner: boolean
}

import { useState } from 'react'

export function CharacterHero({
    username,
    character,
    similarity,
    developerScore,
    explanation,
    isOwner,
}: CharacterHeroProps) {
    const initialImgSrc = character.image || getCharacterImageUrl(character.id)
    const [imgSrc, setImgSrc] = useState(initialImgSrc)

    return (
        <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-black px-4 py-12 font-[family-name:var(--font-space-grotesk)] text-white">
            {/* Background glow & subtle grid pattern */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-950/30 via-black to-black" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#052e1615_1px,transparent_1px),linear-gradient(to_bottom,#052e1615_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1.0] as const,
                }}
                className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center"
            >
                {/* Classified Stamp Aesthetic */}
                <div className="mb-6 inline-flex rotate-[-2deg] items-center gap-2 rounded-sm border-2 border-[#22c55e]/60 bg-[#22c55e]/10 px-3.5 py-1.5 font-mono text-xs font-extrabold tracking-[0.3em] text-[#22c55e] uppercase shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <ShieldAlert className="h-4 w-4 text-[#22c55e]" />
                    <span>CLASSIFIED // SUBJECT DOSSIER</span>
                </div>

                {/* Main Dossier Container */}
                <div className="relative w-full rounded-2xl border border-green-500/20 bg-gradient-to-b from-green-950/20 via-black/80 to-black p-6 shadow-2xl backdrop-blur-md sm:p-10">
                    {/* Top Status Header */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-green-500/15 pb-4 font-mono text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                            </span>
                            <span className="font-bold tracking-wider text-green-400 uppercase">
                                SUBJECT IDENTIFIED
                            </span>
                        </div>
                        <div className="font-mono text-gray-400">
                            TARGET:{' '}
                            <span className="font-semibold text-white">
                                @{username}
                            </span>
                        </div>
                    </div>

                    {/* Primary Character Reveal */}
                    <div className="space-y-4">
                        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                            PRIMARY LABORATORY MATCH
                        </p>

                        {/* Character Image / Portrait Placeholder Container */}
                        <div className="relative mx-auto my-4 h-44 w-44 overflow-hidden rounded-2xl border-2 border-[#22c55e]/40 bg-gradient-to-b from-green-950/60 to-black shadow-[0_0_25px_rgba(34,197,94,0.25)] sm:h-52 sm:w-52">
                            <Image
                                src={imgSrc}
                                alt={character.name}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                                priority
                                onError={() => setImgSrc('/placeholder.svg')}
                            />
                        </div>

                        <h1 className="text-5xl font-extrabold tracking-tight text-[#22c55e] drop-shadow-[0_0_25px_rgba(34,197,94,0.35)] sm:text-7xl">
                            {character.name}
                        </h1>

                        {/* Similarity & Developer Score Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                            <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-400">
                                Similarity Purity:{' '}
                                <span className="font-bold text-white">
                                    {Math.round(similarity)}%
                                </span>
                            </div>
                            <div className="rounded-full border border-green-500/20 bg-green-950/40 px-4 py-1.5 text-sm font-semibold text-gray-300">
                                Developer Score:{' '}
                                <span className="font-bold text-white">
                                    {developerScore}
                                </span>
                                <span className="text-xs text-gray-500">
                                    /100
                                </span>
                            </div>
                        </div>

                        {/* Character Match Explanation */}
                        <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
                            {explanation || character.summary}
                        </p>
                    </div>

                    {/* Sharing Strip */}
                    <div className="mt-6 border-t border-green-500/15 pt-6">
                        <ShareButtons username={username} />
                    </div>

                    {/* Owner vs Non-owner CTAs */}
                    <div className="mt-6 flex flex-col items-center justify-center gap-4 border-t border-green-500/15 pt-6 sm:flex-row">
                        {isOwner ? (
                            <Link
                                href="/lab/analyze"
                                prefetch={false}
                                className="group inline-flex items-center gap-2 rounded-lg border border-green-500/25 bg-green-500/5 px-4 py-2 text-xs font-semibold text-gray-300 transition-all hover:border-green-500/50 hover:bg-green-500/15 hover:text-green-400"
                            >
                                <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                                <span>Re-analyse Dossier</span>
                            </Link>
                        ) : (
                            <Link
                                href="/lab/analyze"
                                prefetch={false}
                                className="group inline-flex items-center gap-2 rounded-lg border border-[#22c55e] bg-[#22c55e] px-6 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-105 hover:bg-[#16a34a] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                            >
                                <UserCheck className="h-4 w-4" />
                                <span>Analyse Your Own Profile</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
