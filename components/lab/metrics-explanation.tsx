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
                        <AccordionItem title="Commit Volume — 35%">
                            <p className="text-muted-foreground">
                                How many commits you pushed in the last 90 days,
                                weighted against the number of original repos
                                you own. More pushes across more repos means a
                                higher volume score.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="Repo Quality — 35%">
                            <p className="text-muted-foreground">
                                Whether your repos have descriptions, README
                                files, relevant topic tags, and a reasonable
                                star or fork count. This measures how polished
                                and documented your work is — not just that it
                                exists.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="Commit Discipline — 30%">
                            <p className="text-muted-foreground">
                                How regularly you commit over time. Measured by
                                how many distinct days you were active and how
                                evenly spaced your pushes were — not just total
                                count. Erratic bursts score lower than steady
                                daily contributions.
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
                                Your 15 trait scores form a vector — think of it
                                as a fingerprint in 15-dimensional space. We
                                compare that fingerprint against pre-defined
                                developer archetype vectors using{' '}
                                <strong className="text-foreground">
                                    cosine similarity
                                </strong>
                                , the same technique search engines use to match
                                documents. The percentage tells you how
                                directionally similar your coding style is to
                                each archetype.
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
