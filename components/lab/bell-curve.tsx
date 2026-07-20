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
                className="mx-auto flex w-full max-w-4xl flex-col items-center"
            >
                {/* Section Header */}
                <div className="mb-2 text-center">
                    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                        Global Developer Comparison
                    </span>
                    <h2 className="text-foreground mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Where You Rank Globally
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-relaxed">
                        Your Developer Score of{' '}
                        <strong className="text-foreground">{userScore}</strong>{' '}
                        plotted against all other developers who have run
                        analysis. The curve shows the distribution.
                    </p>
                </div>

                {/* Stat Callouts Grid */}
                <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
                        <div className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                            Percentile
                        </div>
                        <div className="text-primary mt-1 font-mono text-2xl font-extrabold">
                            Top {100 - stats.percentile}%
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm">
                            Higher than {stats.percentile}% of developers
                        </div>
                    </div>

                    <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
                        <div className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                            Global Rank
                        </div>
                        <div className="text-foreground mt-1 font-mono text-2xl font-extrabold">
                            #{stats.rank}
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm">
                            Out of {stats.totalSubjects} developers
                        </div>
                    </div>

                    <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
                        <div className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                            Above You
                        </div>
                        <div className="text-foreground mt-1 font-mono text-2xl font-extrabold">
                            {stats.usersAbove}
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm">
                            Developers with a higher score
                        </div>
                    </div>

                    <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
                        <div className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                            Below You
                        </div>
                        <div className="text-foreground mt-1 font-mono text-2xl font-extrabold">
                            {stats.usersBelow}
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm">
                            Developers with a lower score
                        </div>
                    </div>
                </div>

                {/* Bell Curve Chart Container */}
                <div className="border-border bg-card relative mt-6 w-full rounded-xl border p-6 shadow-md sm:p-8">
                    <div className="border-border mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                        <span className="text-foreground font-semibold">
                            Score Distribution
                        </span>
                        <div className="text-muted-foreground text-sm">
                            Your score:{' '}
                            <span className="text-primary font-mono font-bold">
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

                    <div className="border-border bg-muted/40 mt-4 rounded-lg border p-4 text-sm leading-relaxed">
                        <p className="text-foreground mb-1 font-semibold">
                            How rankings are calculated
                        </p>
                        <p className="text-muted-foreground">
                            Your developer score is calculated from commit
                            volume (35%), repo quality and documentation (35%),
                            and how consistently you push code over the 90-day
                            window (30%). The curve shows where the full
                            population of analysed developers falls.
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
