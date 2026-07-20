'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
    Award,
    ExternalLink,
    ShieldAlert,
    Sparkles,
    UserCheck,
    FlaskConical,
} from 'lucide-react'
import type { LabLeaderboardEntry } from '@/lib/lab/leaderboard'

type LabLeaderboardProps = {
    entries: LabLeaderboardEntry[]
    isSignedIn?: boolean
}

export function LabLeaderboard({
    entries,
    isSignedIn = false,
}: LabLeaderboardProps) {
    return (
        <div className="w-full max-w-5xl space-y-6">
            {entries.length === 0 ? (
                <EmptyState />
            ) : (
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.07,
                            },
                        },
                    }}
                    className="space-y-3"
                >
                    {entries.map((entry) => (
                        <LeaderboardRow key={entry.id} entry={entry} />
                    ))}
                </motion.div>
            )}
        </div>
    )
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-green-500/30 bg-gradient-to-b from-green-950/20 via-black/80 to-black p-12 text-center shadow-xl backdrop-blur-md"
        >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                <FlaskConical className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="mb-2 font-mono text-lg font-bold tracking-wider text-white uppercase">
                No subjects on file — be the first to enter the lab
            </h3>
            <p className="mb-6 max-w-md text-sm text-gray-400">
                The laboratory index is empty. Run your GitHub profile analysis
                to generate your dossier and claim rank #1.
            </p>
            <Link
                href="/lab/analyze"
                className="group inline-flex items-center gap-2 rounded-lg border border-[#22c55e] bg-[#22c55e] px-6 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-105 hover:bg-[#16a34a] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            >
                <UserCheck className="h-4 w-4" />
                <span>Enter the Lab</span>
            </Link>
        </motion.div>
    )
}

function LeaderboardRow({ entry }: { entry: LabLeaderboardEntry }) {
    const [imgError, setImgError] = useState(false)
    const isTop1 = entry.rank === 1
    const isTop2 = entry.rank === 2
    const isTop3 = entry.rank === 3
    const isTopThree = isTop1 || isTop2 || isTop3

    // Visual distinctions for Top 3 using existing palette tokens
    const rankStyle = isTop1
        ? {
              card: 'border-amber-500/50 bg-gradient-to-r from-amber-950/20 via-black to-black shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-500/80',
              badge: 'border-amber-500/60 bg-amber-500/20 text-amber-300',
              scoreBar: 'from-amber-500 to-yellow-400',
              rankText: 'text-amber-400 font-extrabold',
          }
        : isTop2
          ? {
                card: 'border-slate-400/40 bg-gradient-to-r from-slate-900/30 via-black to-black shadow-[0_0_15px_rgba(203,213,225,0.1)] hover:border-slate-400/70',
                badge: 'border-slate-400/50 bg-slate-400/15 text-slate-200',
                scoreBar: 'from-slate-400 to-slate-200',
                rankText: 'text-slate-300 font-bold',
            }
          : isTop3
            ? {
                  card: 'border-amber-700/50 bg-gradient-to-r from-amber-950/15 via-black to-black shadow-[0_0_15px_rgba(180,83,9,0.1)] hover:border-amber-700/80',
                  badge: 'border-amber-700/50 bg-amber-700/20 text-amber-400',
                  scoreBar: 'from-amber-700 to-amber-500',
                  rankText: 'text-amber-500 font-bold',
              }
            : {
                  card: 'border-green-500/15 bg-black/60 hover:border-green-500/40 hover:bg-green-950/20 shadow-md',
                  badge: 'border-green-500/20 bg-green-500/10 text-green-400',
                  scoreBar: 'from-green-600 to-green-400',
                  rankText: 'text-gray-400 font-semibold',
              }

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 15 },
                show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
                },
            }}
            className={`group relative flex flex-col justify-between gap-4 rounded-xl border p-4 backdrop-blur-sm transition-all duration-200 sm:flex-row sm:items-center ${rankStyle.card}`}
        >
            {/* Left Section: Rank, Avatar, Username & Character */}
            <div className="flex items-center gap-4">
                {/* Numeric Rank */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center font-mono text-lg">
                    {isTop1 ? (
                        <div className="flex items-center gap-1">
                            <span className={rankStyle.rankText}>#1</span>
                            <Sparkles className="h-4 w-4 animate-pulse text-amber-400" />
                        </div>
                    ) : (
                        <span className={rankStyle.rankText}>
                            #{entry.rank}
                        </span>
                    )}
                </div>

                {/* Avatar */}
                <Link
                    href={`/lab/${entry.githubUsername}`}
                    className="relative shrink-0 overflow-hidden rounded-full border border-green-500/30 transition-transform group-hover:scale-105"
                >
                    {imgError ? (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-950/60 font-mono text-sm font-bold text-green-400">
                            {entry.githubUsername.slice(0, 2).toUpperCase()}
                        </div>
                    ) : (
                        <Image
                            src={entry.avatarUrl}
                            alt={entry.githubUsername}
                            width={44}
                            height={44}
                            className="h-11 w-11 rounded-full object-cover"
                            onError={() => setImgError(true)}
                            unoptimized
                        />
                    )}
                </Link>

                {/* User Info */}
                <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/lab/${entry.githubUsername}`}
                            className="max-w-[180px] truncate font-mono text-base font-bold text-white transition-colors hover:text-green-400 hover:underline sm:max-w-[240px]"
                        >
                            @{entry.githubUsername}
                        </Link>
                        <Link
                            href={`/lab/${entry.githubUsername}`}
                            className="text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-green-400"
                            title="View dossier"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Character Badge */}
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs ${rankStyle.badge}`}
                        >
                            {isTopThree && <Award className="h-3 w-3" />}
                            <span>{entry.characterName}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Section: Developer Score & Progress Bar */}
            <div className="flex items-center justify-between gap-4 border-t border-green-500/10 pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
                <div className="flex flex-col items-start gap-1 sm:items-end">
                    <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-xs text-gray-400">SCORE:</span>
                        <span className="text-xl font-extrabold text-white">
                            {entry.developerScore}
                        </span>
                        <span className="text-xs text-gray-500">/100</span>
                    </div>

                    {/* Score fill bar */}
                    <div className="h-2 w-32 overflow-hidden rounded-full border border-green-500/20 bg-green-950/60 sm:w-40">
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${rankStyle.scoreBar} transition-all duration-500`}
                            style={{
                                width: `${Math.min(100, Math.max(0, entry.developerScore))}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
