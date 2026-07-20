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
import { Activity, Beaker, Sparkles } from 'lucide-react'
import { TRAIT_IDS, type TraitVector } from '@/lib/lab/types'
import { getTraitLabel } from '@/lib/lab/traits'

type TraitRadarProps = {
    traits: TraitVector
}

export function TraitRadarChart({ traits }: TraitRadarProps) {
    // Transform traits into chart data array
    const chartData = TRAIT_IDS.map((traitId) => ({
        traitId,
        label: getTraitLabel(traitId),
        score: traits[traitId] ?? 0,
    }))

    // Calculate highest and lowest traits for summary callout
    const sorted = [...chartData].sort((a, b) => b.score - a.score)
    const topTraits = sorted.slice(0, 3)
    const avgScore = Math.round(
        chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length
    )

    return (
        <section className="relative w-full overflow-hidden bg-black px-4 py-12 font-[family-name:var(--font-space-grotesk)] text-white">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1.0] as const,
                }}
                className="mx-auto flex w-full max-w-6xl flex-col items-center"
            >
                {/* Header Badge */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-green-500/30 bg-green-950/40 px-3 py-1 font-mono text-xs tracking-wider text-green-400 uppercase">
                    <Beaker className="h-3.5 w-3.5 text-green-400" />
                    <span>SECTION 03 // CHEMICAL COMPOSITION</span>
                </div>

                <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Psychological Profile Radar
                </h2>
                <p className="mb-8 max-w-xl text-center font-mono text-xs text-gray-400 sm:text-sm">
                    Multi-axis spectral analysis mapping subject traits against
                    known lab standards across all 15 vectors.
                </p>

                {/* Main Content Container */}
                <div className="grid w-full grid-cols-1 gap-6 rounded-2xl border border-green-500/20 bg-gradient-to-b from-green-950/20 via-black/90 to-black p-4 shadow-2xl backdrop-blur-md lg:grid-cols-12 lg:p-8">
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
                                    stroke="rgba(34, 197, 94, 0.15)"
                                    strokeDasharray="3 3"
                                />
                                <PolarAngleAxis
                                    dataKey="label"
                                    stroke="#4ade80"
                                    tick={{
                                        fill: '#86efac',
                                        fontSize: 10,
                                        fontFamily: 'var(--font-mono)',
                                        fontWeight: 600,
                                    }}
                                />
                                <PolarRadiusAxis
                                    angle={30}
                                    domain={[0, 100]}
                                    stroke="rgba(34, 197, 94, 0.3)"
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
                                                <div className="rounded-lg border border-green-500/40 bg-black/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
                                                    <p className="font-mono font-bold text-green-400">
                                                        {data.label}
                                                    </p>
                                                    <p className="font-mono text-gray-300">
                                                        Raw Vector:{' '}
                                                        <span className="font-bold text-white">
                                                            {data.traitId}
                                                        </span>
                                                    </p>
                                                    <p className="font-mono text-green-400">
                                                        Purity Score:{' '}
                                                        <span className="font-extrabold text-white">
                                                            {data.score} / 100
                                                        </span>
                                                    </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Radar
                                    name="Trait Profile"
                                    dataKey="score"
                                    stroke="var(--chart-1)"
                                    strokeWidth={2}
                                    fill="var(--chart-1)"
                                    fillOpacity={0.4}
                                    isAnimationActive={true}
                                    animationDuration={1200}
                                    animationBegin={200}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary Callouts Side Column */}
                    <div className="flex flex-col justify-center space-y-4 rounded-xl border border-green-500/15 bg-black/60 p-5 lg:col-span-4">
                        <div className="flex items-center gap-2 border-b border-green-500/15 pb-3">
                            <Activity className="h-4 w-4 text-green-400" />
                            <span className="font-mono text-xs font-bold tracking-wider text-green-400 uppercase">
                                SPECTRAL METRICS
                            </span>
                        </div>

                        <div className="space-y-3 font-mono text-xs">
                            <div className="flex items-center justify-between rounded-lg border border-green-500/10 bg-green-950/20 p-2.5">
                                <span className="text-gray-400">
                                    Average Trait Index
                                </span>
                                <span className="font-bold text-green-400">
                                    {avgScore} / 100
                                </span>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center gap-1.5 text-gray-300">
                                    <Sparkles className="h-3.5 w-3.5 text-green-400" />
                                    <span className="font-bold">
                                        Dominant Compounds:
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {topTraits.map((t, idx) => (
                                        <div
                                            key={t.traitId}
                                            className="flex items-center justify-between rounded-md border border-green-500/20 bg-black/80 px-3 py-1.5"
                                        >
                                            <span className="text-gray-300">
                                                {idx + 1}. {t.label} (
                                                {t.traitId})
                                            </span>
                                            <span className="font-bold text-green-400">
                                                {t.score}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 rounded-lg border border-yellow-500/30 bg-yellow-950/20 p-3 font-mono text-[11px] text-yellow-300/90">
                            <span className="font-bold">DOSSIER NOTE:</span>{' '}
                            High purity in {topTraits[0]?.label} indicates
                            concentrated specialized capability.
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
