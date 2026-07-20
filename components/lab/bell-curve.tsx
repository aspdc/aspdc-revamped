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

    const closestPoint = stats.distribution.find((p) => p.isUserPosition) || {
        score: Math.round(userScore),
        density: stats.userDensity,
    }

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
                        GLOBAL DEVELOPER COMPARISON
                    </span>
                    <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Developer Score Distribution
                    </h2>
                    <p className="text-muted-foreground mt-1 max-w-xl text-center font-mono text-xs sm:text-sm">
                        Shows where @{username}&apos;s score of {userScore}{' '}
                        places them relative to all analyzed developers.
                    </p>
                </div>

                {/* Stat Callouts Grid */}
                <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
                        <div className="text-muted-foreground font-mono text-xs">
                            PERCENTILE
                        </div>
                        <div className="text-primary mt-1 font-mono text-2xl font-extrabold">
                            Top {100 - stats.percentile}%
                        </div>
                        <div className="text-muted-foreground mt-1 font-mono text-[11px]">
                            Higher than {stats.percentile}% of developers
                        </div>
                    </div>

                    <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
                        <div className="text-muted-foreground font-mono text-xs">
                            GLOBAL RANK
                        </div>
                        <div className="text-foreground mt-1 font-mono text-2xl font-extrabold">
                            #{stats.rank}
                        </div>
                        <div className="text-muted-foreground mt-1 font-mono text-[11px]">
                            Out of {stats.totalSubjects} developers analyzed
                        </div>
                    </div>

                    <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
                        <div className="text-muted-foreground font-mono text-xs">
                            HIGHER SCORES
                        </div>
                        <div className="text-foreground mt-1 font-mono text-2xl font-extrabold">
                            {stats.usersAbove}
                        </div>
                        <div className="text-muted-foreground mt-1 font-mono text-[11px]">
                            Developers with a higher score
                        </div>
                    </div>

                    <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
                        <div className="text-muted-foreground font-mono text-xs">
                            LOWER SCORES
                        </div>
                        <div className="text-foreground mt-1 font-mono text-2xl font-extrabold">
                            {stats.usersBelow}
                        </div>
                        <div className="text-muted-foreground mt-1 font-mono text-[11px]">
                            Developers with a lower score
                        </div>
                    </div>
                </div>

                {/* Bell Curve Chart Container */}
                <div className="border-border bg-card relative mt-6 w-full rounded-xl border p-6 shadow-md sm:p-8">
                    <div className="border-border mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3 font-mono text-xs">
                        <span className="text-foreground font-bold uppercase">
                            DEVELOPER SCORE BELL CURVE
                        </span>
                        <div className="text-muted-foreground">
                            Score:{' '}
                            <span className="text-primary font-bold">
                                {userScore} / 100
                            </span>
                        </div>
                    </div>

                    <div className="min-h-[340px] w-full">
                        <ResponsiveContainer width="100%" height={340}>
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
                                            stopColor="var(--primary)"
                                            stopOpacity={0.4}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--primary)"
                                            stopOpacity={0.05}
                                        />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="score"
                                    stroke="var(--border)"
                                    tick={{
                                        fill: 'var(--muted-foreground)',
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
                                                <div className="border-border bg-card rounded-lg border px-3 py-2 font-mono text-xs shadow-md">
                                                    <p className="text-foreground font-bold">
                                                        Score Bucket:{' '}
                                                        {data.score}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        Density: {data.density}%
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
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    fill="url(#bellCurveGradient)"
                                />
                                <ReferenceLine
                                    x={closestPoint.score}
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                />
                                <ReferenceDot
                                    x={closestPoint.score}
                                    y={closestPoint.density}
                                    r={6}
                                    fill="var(--primary)"
                                    stroke="var(--background)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="border-border bg-muted/40 text-muted-foreground mt-4 space-y-1 rounded-lg border p-4 font-sans text-xs leading-relaxed">
                        <div className="text-foreground font-mono text-xs font-bold">
                            HOW RANKINGS ARE CALCULATED:
                        </div>
                        <p>
                            Your developer score is calculated from repository
                            activity, commit regularity, code variety, and pull
                            request involvement. The curve represents the
                            overall distribution of all developers index.
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
