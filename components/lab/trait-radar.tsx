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
import { TRAIT_IDS, type TraitId, type TraitVector } from '@/lib/lab/types'
import { getTraitLabel, getTraitDescription } from '@/lib/lab/traits'

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
    const avgScore = Math.round(
        chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length
    )

    return (
        <section className="bg-background text-foreground relative w-full px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex w-full max-w-4xl flex-col"
            >
                {/* Section Header */}
                <div className="mb-8 text-center">
                    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                        CODING BEHAVIOUR BREAKDOWN
                    </span>
                    <h2 className="text-foreground mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        15 Coding Trait Scores
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-base leading-relaxed">
                        Each trait is scored 0–100 based on what GitHub can see
                        about how you code — commit frequency, language variety,
                        documentation habits, collaboration, and more. Click any
                        trait below the chart to read what it measures.
                    </p>
                </div>

                {/* Main Card: Radar + Top Stats */}
                <div className="border-border bg-card grid w-full grid-cols-1 gap-0 rounded-xl border shadow-md lg:grid-cols-12">
                    {/* Radar Chart */}
                    <div className="lg:border-border flex min-h-[360px] flex-col items-center justify-center p-6 lg:col-span-8 lg:border-r">
                        <ResponsiveContainer width="100%" height={380}>
                            <RadarChart
                                data={chartData}
                                margin={{
                                    top: 24,
                                    right: 36,
                                    bottom: 24,
                                    left: 36,
                                }}
                            >
                                <PolarGrid
                                    stroke="var(--border)"
                                    strokeDasharray="3 3"
                                />
                                <PolarAngleAxis
                                    dataKey="label"
                                    tick={{
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 11,
                                        fontFamily: 'var(--font-mono)',
                                        fontWeight: 600,
                                    }}
                                />
                                <PolarRadiusAxis
                                    angle={30}
                                    domain={[0, 100]}
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
                                            const desc = getTraitDescription(
                                                data.traitId as TraitId
                                            )
                                            return (
                                                <div className="border-border bg-card max-w-xs rounded-lg border px-3 py-2.5 shadow-lg">
                                                    <p className="text-foreground mb-1 text-sm font-bold">
                                                        {data.label}
                                                    </p>
                                                    <p className="text-primary mb-1.5 font-mono text-xs font-semibold">
                                                        Score: {data.score} /
                                                        100
                                                    </p>
                                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                                        {desc}
                                                    </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Radar
                                    name="Traits"
                                    dataKey="score"
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    fill="var(--primary)"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="flex flex-col justify-center gap-4 p-6 lg:col-span-4">
                        <div className="border-border border-b pb-3">
                            <p className="text-muted-foreground text-xs tracking-widest uppercase">
                                Summary
                            </p>
                        </div>

                        {/* Average */}
                        <div className="border-border bg-background rounded-lg border p-4">
                            <p className="text-muted-foreground text-sm">
                                Average across all 15 traits
                            </p>
                            <p className="text-foreground mt-1 font-mono text-3xl font-extrabold">
                                {avgScore}
                                <span className="text-muted-foreground text-sm font-normal">
                                    {' '}
                                    / 100
                                </span>
                            </p>
                        </div>

                        {/* Top 3 */}
                        <div>
                            <p className="text-muted-foreground mb-2 text-xs tracking-widest uppercase">
                                Strongest Traits
                            </p>
                            <div className="space-y-2">
                                {sorted.slice(0, 3).map((t, idx) => (
                                    <div
                                        key={t.traitId}
                                        className="border-border bg-background flex items-center justify-between rounded-md border px-3 py-2"
                                    >
                                        <span className="text-foreground text-sm font-medium">
                                            {idx + 1}. {t.label}
                                        </span>
                                        <span className="text-primary font-mono text-sm font-bold">
                                            {t.score}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom 3 */}
                        <div>
                            <p className="text-muted-foreground mb-2 text-xs tracking-widest uppercase">
                                Weakest Traits
                            </p>
                            <div className="space-y-2">
                                {sorted.slice(-3).map((t, idx) => (
                                    <div
                                        key={t.traitId}
                                        className="border-border bg-background flex items-center justify-between rounded-md border px-3 py-2"
                                    >
                                        <span className="text-foreground text-sm font-medium">
                                            {13 + idx}. {t.label}
                                        </span>
                                        <span className="text-muted-foreground font-mono text-sm font-bold">
                                            {t.score}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
