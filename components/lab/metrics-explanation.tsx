'use client'

import { motion } from 'framer-motion'

export function MetricsExplanation() {
    return (
        <section className="bg-background text-foreground relative w-full px-4 py-12 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex w-full max-w-6xl flex-col items-center text-left"
            >
                {/* Section Header */}
                <div className="mb-8 text-center">
                    <span className="text-muted-foreground font-mono text-xs uppercase">
                        METHODOLOGY & METRICS EXPLANATION
                    </span>
                    <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                        How Your GitHub Profile is Analyzed
                    </h2>
                    <p className="text-muted-foreground mt-1 max-w-xl text-center font-mono text-xs sm:text-sm">
                        A breakdown of how raw GitHub activity is converted into
                        Developer Scores, Archetype Matches, and Trait Vectors.
                    </p>
                </div>

                {/* Explanation Cards Grid */}
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Pillar 1: Developer Score */}
                    <div className="border-border bg-card space-y-3 rounded-xl border p-6 shadow-sm">
                        <div className="text-primary font-mono text-xs font-bold uppercase">
                            1. DEVELOPER SCORE (0 - 100)
                        </div>
                        <h3 className="text-foreground text-base font-extrabold">
                            Activity, Quality & Consistency
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Your overall score evaluates commit volume over the
                            last 90 days (35%), repo craftsmanship and
                            documentation (35%), and daily commit regularity
                            (30%).
                        </p>
                    </div>

                    {/* Pillar 2: Persona Matching */}
                    <div className="border-border bg-card space-y-3 rounded-xl border p-6 shadow-sm">
                        <div className="text-primary font-mono text-xs font-bold uppercase">
                            2. ARCHETYPE MATCHING
                        </div>
                        <h3 className="text-foreground text-base font-extrabold">
                            Cosine Vector Similarity
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Your 15 coding traits form a multi-dimensional
                            vector. We compute the mathematical cosine
                            similarity against standard developer archetypes to
                            determine your persona match.
                        </p>
                    </div>

                    {/* Pillar 3: 15 Trait Vectors */}
                    <div className="border-border bg-card space-y-3 rounded-xl border p-6 shadow-sm">
                        <div className="text-primary font-mono text-xs font-bold uppercase">
                            3. 15-POINT TRAIT VECTORS
                        </div>
                        <h3 className="text-foreground text-base font-extrabold">
                            Behavioral Coding Traits
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Measures Builder (new code), Architect (structure &
                            READMEs), Scientist (language diversity),
                            Consistency (regular gaps), and TeamPlayer (PR
                            reviews & comments).
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
