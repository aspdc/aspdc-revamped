'use client'

import { motion } from 'framer-motion'
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts'
import { TRAIT_IDS, type TraitVector } from '@/lib/lab/types'
import { getTraitLabel } from '@/lib/lab/traits'

type TraitRadarProps = {
    traits: TraitVector
}

export function TraitRadarChart({ traits }: TraitRadarProps) {
    const chartData = TRAIT_IDS.map((traitId) => ({
        traitId,
        label: getTraitLabel(traitId),
        score: traits[traitId] ?? 0,
    }))

    const sorted = [...chartData].sort((a, b) => b.score - a.score)
    const topTraits = sorted.slice(0, 3)
    const avgScore = Math.round(
        chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length
    )

    return (
        <section className="bg-background text-foreground relative w-full px-4 py-12 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex w-full max-w-6xl flex-col items-center"
            >
                {/* Section Header */}
                <div className="mb-2 text-center">
                    <span className="text-muted-foreground font-mono text-xs uppercase">
                        CODING HABITS & VECTOR BREAKDOWN
                    </span>
                    <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                        15-Point Coding Style Analysis
                    </h2>
                    <p className="text-muted-foreground mt-1 max-w-xl text-center font-mono text-xs sm:text-sm">
                        Measures your commit timing, refactoring frequency,
                        language diversity, and codebase architectural focus.
                    </p>
                </div>

                {/* Main Card */}
                <div className="border-border bg-card mt-8 grid w-full grid-cols-1 gap-8 rounded-xl border p-6 shadow-md md:p-8 lg:grid-cols-12">
                    {/* Radar Chart Column */}
                    <div className="relative flex min-h-[380px] w-full flex-col items-center justify-center lg:col-span-8">
                        <ResponsiveContainer width="100%" height={400}>
                            <RadarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    bottom: 20,
                                    left: 30,
                                }}
                            >
                                <PolarGrid
                                    stroke="var(--border)"
                                    strokeDasharray="3 3"
                                />
                                <PolarAngleAxis
                                    dataKey="label"
                                    stroke="var(--foreground)"
                                    tick={{
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 10,
                                        fontFamily: 'var(--font-mono)',
                                        fontWeight: 600,
                                    }}
                                />
                                <PolarRadiusAxis
                                    angle={30}
                                    domain={[0, 100]}
                                    stroke="var(--border)"
                                    tick={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (
                                            active &&
                                            payload &&
                                            payload.length
                                        ) {
                                            const data = payload[0].payload
                                            return (
                                                <div className="border-border bg-card rounded-lg border px-3 py-2 font-mono text-xs shadow-md">
                                                    <p className="text-foreground font-bold">
                                                        {data.label}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        Rating: {data.score} /
                                                        100
                                                    </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Radar
                                    name="Coding Habits"
                                    dataKey="score"
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    fill="var(--primary)"
                                    fillOpacity={0.25}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary & Metric Explanations */}
                    <div className="border-border bg-background/50 flex flex-col justify-center space-y-4 rounded-lg border p-5 font-mono text-xs lg:col-span-4">
                        <div className="border-border border-b pb-3">
                            <span className="text-foreground font-bold uppercase">
                                TOP CODING TRAITS
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="border-border bg-card flex items-center justify-between rounded-md border p-2.5">
                                <span className="text-muted-foreground">
                                    Average Trait Score
                                </span>
                                <span className="text-foreground font-bold">
                                    {avgScore} / 100
                                </span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-muted-foreground font-semibold">
                                    Your Strongest Characteristics:
                                </p>
                                {topTraits.map((t, idx) => (
                                    <div
                                        key={t.traitId}
                                        className="border-border bg-card flex items-center justify-between rounded-md border px-3 py-2"
                                    >
                                        <span className="text-foreground font-medium">
                                            {idx + 1}. {t.label}
                                        </span>
                                        <span className="text-primary font-bold">
                                            {t.score}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-border bg-muted/40 text-muted-foreground space-y-1 rounded-lg border p-3 font-sans text-[11px] leading-relaxed">
                            <div className="text-foreground font-mono text-xs font-bold">
                                WHAT THESE METRICS MEAN:
                            </div>
                            <p>
                                Higher scores indicate strong tendencies in
                                specific coding styles—such as high commit
                                velocity, frequent code refactoring, or
                                multi-language repository management.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
