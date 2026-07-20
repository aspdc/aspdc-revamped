'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import {
    getCharacterImageUrl,
    type CharacterProfile,
} from '@/lib/lab/characters'
import { ShareButtons } from './share-buttons'

type CharacterHeroProps = {
    username: string
    character: CharacterProfile
    similarity: number
    developerScore: number
    explanation: string
    profileUserId?: string
}

export function CharacterHero({
    username,
    character,
    similarity,
    developerScore,
    explanation,
    profileUserId,
}: CharacterHeroProps) {
    const { data: session } = authClient.useSession()
    const isOwner = Boolean(
        session?.user?.id && profileUserId && session.user.id === profileUserId
    )
    const initialImgSrc = character.image || getCharacterImageUrl(character.id)
    const [imgSrc, setImgSrc] = useState(initialImgSrc)

    return (
        <section className="bg-background text-foreground relative flex flex-col items-center justify-center px-4 py-12 font-sans md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex w-full max-w-4xl flex-col items-center text-center"
            >
                {/* Main Card */}
                <div className="border-border bg-card w-full rounded-xl border p-6 shadow-xl md:p-10">
                    {/* Header Info */}
                    <div className="border-border text-muted-foreground mb-8 flex flex-wrap items-center justify-between gap-3 border-b pb-4 font-mono text-xs">
                        <div>DEVELOPER PROFILE ANALYSIS</div>
                        <div>
                            GITHUB HANDLER:{' '}
                            <span className="text-foreground font-bold">
                                @{username}
                            </span>
                        </div>
                    </div>

                    {/* Character & Metrics Overview */}
                    <div className="grid grid-cols-1 items-center gap-8 text-left md:grid-cols-12">
                        {/* Portrait */}
                        <div className="flex flex-col items-center md:col-span-5">
                            <div className="border-border bg-muted relative h-52 w-52 overflow-hidden rounded-xl border p-1 shadow-md sm:h-60 sm:w-60">
                                <Image
                                    src={imgSrc}
                                    alt={character.name}
                                    fill
                                    className="rounded-lg object-cover"
                                    priority
                                    onError={() =>
                                        setImgSrc('/placeholder.svg')
                                    }
                                />
                            </div>
                            <div className="text-muted-foreground mt-3 font-mono text-xs tracking-wider uppercase">
                                {character.id.replace(/-/g, ' ')}
                            </div>
                        </div>

                        {/* Details & Layman Explanations */}
                        <div className="space-y-5 md:col-span-7">
                            <div>
                                <span className="text-muted-foreground font-mono text-xs uppercase">
                                    PRIMARY DEVELOPER ARCHETYPE MATCH
                                </span>
                                <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    {character.name}
                                </h1>
                            </div>

                            {/* Core Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Match Similarity */}
                                <div className="border-border bg-background/50 rounded-lg border p-4">
                                    <div className="text-muted-foreground font-mono text-xs">
                                        ARCHETYPE MATCH
                                    </div>
                                    <div className="text-primary mt-1 font-mono text-3xl font-extrabold">
                                        {Math.round(similarity)}%
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-xs leading-normal">
                                        How closely your commit patterns match
                                        this persona.
                                    </p>
                                </div>

                                {/* Developer Score */}
                                <div className="border-border bg-background/50 rounded-lg border p-4">
                                    <div className="text-muted-foreground font-mono text-xs">
                                        DEVELOPER SCORE
                                    </div>
                                    <div className="text-foreground mt-1 font-mono text-3xl font-extrabold">
                                        {developerScore}
                                        <span className="text-muted-foreground text-xs font-normal">
                                            {' '}
                                            / 100
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-xs leading-normal">
                                        Rating based on commit volume,
                                        consistency, and repo impact.
                                    </p>
                                </div>
                            </div>

                            {/* Plain English Explanation */}
                            <div className="border-border bg-muted/40 text-muted-foreground space-y-1 rounded-lg border p-4 text-xs leading-relaxed">
                                <div className="text-foreground font-mono font-bold">
                                    WHY YOU MATCHED THIS PERSONA:
                                </div>
                                <p>{explanation || character.summary}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sharing Strip */}
                    <div className="border-border mt-8 border-t pt-6">
                        <ShareButtons username={username} />
                    </div>

                    {/* Actions */}
                    <div className="border-border mt-6 flex flex-col items-center justify-center gap-4 border-t pt-6 sm:flex-row">
                        {isOwner ? (
                            <Link
                                href="/lab/analyze"
                                prefetch={false}
                                className="border-border bg-muted text-foreground hover:bg-border rounded-lg border px-5 py-2.5 text-sm font-medium transition-all"
                            >
                                Re-analyse Profile
                            </Link>
                        ) : (
                            <Link
                                href="/lab/analyze"
                                prefetch={false}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 text-sm font-bold transition-all"
                            >
                                Analyse Your Own Profile
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
