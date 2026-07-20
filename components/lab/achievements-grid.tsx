'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Award } from 'lucide-react'
import type { Achievement } from '@/lib/lab/achievements'
import { AchievementIcon } from './achievement-icon'

type AchievementsGridProps = {
    achievements: Achievement[]
    totalAvailable?: number
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const },
    },
}

export function AchievementsGrid({
    achievements,
    totalAvailable = 13,
}: AchievementsGridProps) {
    return (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 font-[family-name:var(--font-space-grotesk)]">
            {/* Section Header */}
            <div className="mb-12 space-y-2 text-center">
                <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#22c55e] uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>DOSSIER RECORDS // COMMENDATIONS</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Classified Commendations
                </h2>
                <div className="mt-2 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-3.5 py-1 font-mono text-xs font-bold text-green-400">
                    {achievements.length} / {totalAvailable} UNLOCKED
                </div>
            </div>

            {achievements.length === 0 ? (
                <div className="mx-auto max-w-md rounded-xl border border-green-500/20 bg-black/60 p-8 text-center backdrop-blur-sm">
                    <Award className="text-muted-foreground/40 mx-auto mb-3 h-10 w-10" />
                    <p className="text-sm font-medium text-gray-400">
                        No laboratory commendations unlocked yet.
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        Increase repository purity and discipline to earn
                        badges.
                    </p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {achievements.map((achievement) => (
                        <motion.div
                            key={achievement.id}
                            variants={itemVariants}
                            className="group relative flex items-start gap-4 rounded-xl border border-[#22c55e]/40 bg-gradient-to-br from-[#15453D]/30 via-green-950/20 to-black/90 p-5 shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all duration-300 hover:border-[#22c55e]/70 hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]"
                        >
                            {/* Icon Container */}
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-[#22c55e]/60 bg-[#22c55e]/15 text-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.25)] transition-transform group-hover:scale-110">
                                <AchievementIcon
                                    iconKey={achievement.icon}
                                    className="h-6 w-6"
                                />
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1 space-y-1">
                                <h3 className="truncate text-base font-bold tracking-tight text-white">
                                    {achievement.name}
                                </h3>
                                <p className="line-clamp-3 text-xs leading-relaxed text-gray-300">
                                    {achievement.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </section>
    )
}
