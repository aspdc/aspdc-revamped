'use client'

import { motion } from 'framer-motion'
import type { Achievement } from '@/lib/lab/achievements'

type AchievementsGridProps = {
    achievements: Achievement[]
    totalAvailable?: number
}

export function AchievementsGrid({
    achievements,
    totalAvailable = 13,
}: AchievementsGridProps) {
    return (
        <section className="bg-background text-foreground relative w-full px-4 py-12 font-sans">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
                {/* Section Header */}
                <div className="mb-2 text-center">
                    <span className="text-muted-foreground font-mono text-xs uppercase">
                        RECOGNITION & MILESTONES
                    </span>
                    <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Developer Milestones & Badges
                    </h2>
                    <p className="text-muted-foreground mt-1 font-mono text-xs sm:text-sm">
                        {achievements.length} of {totalAvailable} achievements
                        unlocked from your GitHub repository history.
                    </p>
                </div>

                {achievements.length === 0 ? (
                    <div className="border-border bg-card mx-auto mt-8 max-w-md rounded-xl border p-8 text-center shadow-sm">
                        <p className="text-foreground text-sm font-semibold">
                            No developer milestones unlocked yet.
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                            Keep pushing commits, opening pull requests, and
                            maintaining repositories to earn milestone badges.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {achievements.map((achievement) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="border-border bg-card flex flex-col justify-between rounded-xl border p-5 shadow-sm"
                            >
                                <div className="space-y-1">
                                    <div className="text-primary font-mono text-xs font-bold">
                                        UNLOCKED MILESTONE
                                    </div>
                                    <h3 className="text-foreground text-base font-extrabold tracking-tight">
                                        {achievement.name}
                                    </h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        {achievement.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
