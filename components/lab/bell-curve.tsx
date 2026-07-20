'use client'

import { motion } from 'framer-motion'
import {
    Area,
    AreaChart,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { Award, BarChart3, TrendingUp, Users } from 'lucide-react'
import { calculateBellCurveStats } from '@/lib/lab/bell-curve'
import { LabProfile } from '@/db/types'

type BellCurveProps = {
    userScore: number
    username: string
    allProfiles:
        | Array<Pick<LabProfile, 'developerScore'>>
        | Array<{ developerScore: number }>
}

export function GlobalRankingBellCurve({
    userScore,
    username,
    allProfiles,
}: BellCurveProps) {
    const stats = calculateBellCurveStats(userScore, allProfiles)

    // Find exact or closest x-score point in distribution
    const closestPoint = stats.distribution.find((p) => p.isUserPosition) || {
        score: Math.round(userScore),
        density: stats.userDensity,
    }

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
                    <BarChart3 className="h-3.5 w-3.5 text-green-400" />
                    <span>SECTION 05 // GLOBAL DOSSIER RANKING</span>
                </div>

                <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Global Subject Distribution
                </h2>
                <p className="mb-8 max-w-xl text-center font-mono text-xs text-gray-400 sm:text-sm">
                    Population-level developer score bell curve showing @
                    {username}&apos;s position within the overall subject pool.
                </p>

                {/* Prominent Stat Callouts Grid */}
                <div className="mb-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border border-green-500/20 bg-gradient-to-b from-green-950/30 to-black p-4 shadow-lg backdrop-blur-md">
                        <div className="mb-1 flex items-center justify-between font-mono text-xs text-gray-400">
                            <span>PERCENTILE</span>
                            <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                        </div>
                        <div className="font-mono text-xl font-black text-green-400 sm:text-2xl">
                            Top {100 - stats.percentile}%
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-gray-400">
                            {stats.percentile}th percentile overall
                        </div>
                    </div>

                    <div className="rounded-xl border border-green-500/20 bg-gradient-to-b from-green-950/30 to-black p-4 shadow-lg backdrop-blur-md">
                        <div className="mb-1 flex items-center justify-between font-mono text-xs text-gray-400">
                            <span>GLOBAL RANK</span>
                            <Award className="h-3.5 w-3.5 text-green-400" />
                        </div>
                        <div className="font-mono text-xl font-black text-white sm:text-2xl">
                            #{stats.rank}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-gray-400">
                            of {stats.totalSubjects} analyzed subjects
                        </div>
                    </div>

                    <div className="rounded-xl border border-green-500/20 bg-gradient-to-b from-green-950/30 to-black p-4 shadow-lg backdrop-blur-md">
                        <div className="mb-1 flex items-center justify-between font-mono text-xs text-gray-400">
                            <span>HIGHER PURITY</span>
                            <Users className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <div className="font-mono text-xl font-black text-emerald-400 sm:text-2xl">
                            {stats.usersAbove}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-gray-400">
                            subjects scored above
                        </div>
                    </div>

                    <div className="rounded-xl border border-green-500/20 bg-gradient-to-b from-green-950/30 to-black p-4 shadow-lg backdrop-blur-md">
                        <div className="mb-1 flex items-center justify-between font-mono text-xs text-gray-400">
                            <span>LOWER PURITY</span>
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <div className="font-mono text-xl font-black text-gray-300 sm:text-2xl">
                            {stats.usersBelow}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-gray-400">
                            subjects scored below
                        </div>
                    </div>
                </div>

                {/* Prominent Main Bell Curve Chart Container */}
                <div className="relative w-full rounded-2xl border border-green-500/20 bg-gradient-to-b from-green-950/20 via-black/90 to-black p-4 shadow-2xl backdrop-blur-md sm:p-8">
                    <div className="mb-4 flex items-center justify-between border-b border-green-500/15 pb-3">
                        <span className="font-mono text-xs font-bold tracking-wider text-green-400 uppercase">
                            DEVELOPER SCORE GAUSSIAN DISTRIBUTION
                        </span>
                        <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                            <span>Subject Score: {userScore} / 100</span>
                        </div>
                    </div>

                    <div className="min-h-[350px] w-full">
                        <ResponsiveContainer width="100%" height={360}>
                            <AreaChart
                                data={stats.distribution}
                                margin={{
                                    top: 25,
                                    right: 30,
                                    left: 10,
                                    bottom: 25,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="bellCurveGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--chart-1)"
                                            stopOpacity={0.6}
                                        />
                                        <stop
                                            offset="50%"
                                            stopColor="var(--chart-2)"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--chart-5)"
                                            stopOpacity={0.05}
                                        />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="score"
                                    stroke="#4b5563"
                                    tick={{
                                        fill: '#9ca3af',
                                        fontSize: 11,
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                    label={{
                                        value: 'Developer Score (0 - 100)',
                                        position: 'insideBottom',
                                        offset: -12,
                                        fill: '#4ade80',
                                        fontSize: 11,
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                />
                                <YAxis hide domain={[0, 'auto']} />
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
                                                        Score Bucket:{' '}
                                                        {data.score}
                                                    </p>
                                                    <p className="font-mono text-gray-300">
                                                        Relative Density:{' '}
                                                        <span className="font-bold text-white">
                                                            {data.density}%
                                                        </span>
                                                    </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="density"
                                    stroke="var(--chart-1)"
                                    strokeWidth={2}
                                    fill="url(#bellCurveGradient)"
                                    isAnimationActive={true}
                                    animationDuration={1000}
                                />
                                <ReferenceLine
                                    x={closestPoint.score}
                                    stroke="#4ade80"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    label={{
                                        value: `@${username} (${userScore})`,
                                        position: 'top',
                                        fill: '#4ade80',
                                        fontSize: 11,
                                        fontFamily: 'var(--font-mono)',
                                        fontWeight: 'bold',
                                    }}
                                />
                                <ReferenceDot
                                    x={closestPoint.score}
                                    y={closestPoint.density}
                                    r={6}
                                    fill="#4ade80"
                                    stroke="#000"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
