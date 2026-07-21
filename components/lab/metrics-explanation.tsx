'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TRAIT_IDS, type TraitId } from '@/lib/lab/types'
import { getTraitLabel, getTraitDescription } from '@/lib/lab/traits'

// ─── Shared accordion item ────────────────────────────────────────────────────

function AccordionItem({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border-border overflow-hidden rounded-lg border">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="hover:bg-muted/40 flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors"
            >
                <span className="text-foreground text-base font-semibold">
                    {title}
                </span>
                <span className="text-muted-foreground shrink-0 text-xs">
                    {open ? '▲' : '▼'}
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="border-border border-t px-4 py-4 text-base leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Trait accordion item ─────────────────────────────────────────────────────

function TraitAccordionItem({
    traitId,
    rank,
}: {
    traitId: TraitId
    rank: number
}) {
    const [open, setOpen] = useState(false)
    const label = getTraitLabel(traitId)
    const description = getTraitDescription(traitId)

    return (
        <div className="border-border overflow-hidden rounded-lg border">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="hover:bg-muted/40 flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground w-6 shrink-0 font-mono text-xs">
                        {rank}.
                    </span>
                    <span className="text-foreground text-base font-semibold">
                        {label}
                    </span>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                    {open ? '▲' : '▼'}
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <p className="border-border text-muted-foreground border-t px-4 py-3 text-base leading-relaxed">
                            {description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MetricsExplanation() {
    return (
        <section className="bg-background text-foreground relative w-full px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex w-full max-w-4xl flex-col gap-8"
            >
                {/* Section Header */}
                <div className="text-center">
                    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                        Methodology
                    </span>
                    <h2 className="text-foreground mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        How Your Profile is Built
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-base leading-relaxed">
                        Everything here is computed from public GitHub data — no
                        opinions, no manual scoring. Expand any section below to
                        read exactly what we measure and how.
                    </p>
                </div>

                {/* Block 1: Developer Score */}
                <div>
                    <h3 className="text-foreground mb-3 text-lg font-bold">
                        Developer Score (0 – 100)
                    </h3>
                    <div className="space-y-2">
                        <AccordionItem title="Engineering Fundamentals — Volume & Quality">
                            <p className="text-muted-foreground">
                                Measures commit volume across original
                                repositories, repository presentation
                                (descriptions, topic tags, languages), and
                                active contribution frequency.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="Technical Range & Exploration">
                            <p className="text-muted-foreground">
                                Evaluates multi-language mastery and breadth of
                                project domains. Working across diverse stacks
                                raises your Scientist and Curiosity scores.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="Consistency & Discipline">
                            <p className="text-muted-foreground">
                                Analyzes regularity of commit patterns over
                                time. Steady, sustained coding activity across
                                the 90-day window scores higher than erratic
                                single-day bursts.
                            </p>
                        </AccordionItem>
                    </div>
                </div>

                {/* Block 2: Archetype Matching */}
                <div>
                    <h3 className="text-foreground mb-3 text-lg font-bold">
                        Archetype Match %
                    </h3>
                    <div className="space-y-2">
                        <AccordionItem title="How matching works">
                            <p className="text-muted-foreground">
                                Your 15 trait scores form a 15-dimensional
                                vector. We compare your coding profile against
                                each developer archetype using a blended
                                similarity algorithm combining vector direction
                                with signature trait emphasis. The percentage
                                measures how closely your developer habits align
                                with that archetype.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="What the percentages mean">
                            <ul className="text-muted-foreground space-y-2">
                                <li>
                                    <strong className="text-foreground">
                                        90–100%
                                    </strong>{' '}
                                    — Your habits are an almost identical
                                    pattern to this archetype.
                                </li>
                                <li>
                                    <strong className="text-foreground">
                                        70–89%
                                    </strong>{' '}
                                    — Strong alignment. You share most of the
                                    same tendencies.
                                </li>
                                <li>
                                    <strong className="text-foreground">
                                        50–69%
                                    </strong>{' '}
                                    — Moderate match. Some traits align, others
                                    diverge.
                                </li>
                                <li>
                                    <strong className="text-foreground">
                                        Below 50%
                                    </strong>{' '}
                                    — Weak match. Your coding style is quite
                                    different from this archetype.
                                </li>
                            </ul>
                        </AccordionItem>
                    </div>
                </div>

                {/* Block 3: What each trait measures */}
                <div>
                    <h3 className="text-foreground mb-1 text-lg font-bold">
                        What each trait measures
                    </h3>
                    <p className="text-muted-foreground mb-3 text-base leading-relaxed">
                        Each of the 15 traits is scored 0–100. Click any trait
                        to read what it measures and what a high score means.
                    </p>
                    <div className="space-y-2">
                        {TRAIT_IDS.map((traitId, idx) => (
                            <TraitAccordionItem
                                key={traitId}
                                traitId={traitId as TraitId}
                                rank={idx + 1}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
