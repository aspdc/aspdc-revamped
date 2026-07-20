'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Crown, Sparkles, UserCheck } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
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
        <div className="w-full max-w-4xl space-y-4 font-sans">
            {entries.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="border-border bg-card overflow-x-auto rounded-xl border shadow-md">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border text-muted-foreground border-b font-mono text-xs uppercase hover:bg-transparent">
                                <TableHead className="w-[70px] text-center">
                                    RANK
                                </TableHead>
                                <TableHead>Developer</TableHead>
                                <TableHead>Archetype</TableHead>
                                <TableHead className="text-right">
                                    Developer Score
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.map((entry, index) => (
                                <LeaderboardRow
                                    key={entry.id}
                                    entry={entry}
                                    index={index}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

function EmptyState() {
    return (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border p-8 text-center shadow-md">
            <h3 className="text-foreground mb-1 text-base font-extrabold">
                No GitHub Profiles Analyzed Yet
            </h3>
            <p className="text-muted-foreground mb-5 max-w-sm text-xs">
                Be the first developer on the leaderboard! Analyze your GitHub
                profile to calculate your Developer Score and claim rank #1.
            </p>
            <Link
                href="/lab/analyze"
                prefetch={false}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 py-2 text-xs font-bold transition-all"
            >
                Analyze GitHub Profile
            </Link>
        </div>
    )
}

function LeaderboardRow({
    entry,
    index,
}: {
    entry: LabLeaderboardEntry
    index: number
}) {
    const [imgError, setImgError] = useState(false)

    return (
        <TableRow className="border-border hover:bg-muted/50 border-b transition-colors">
            {/* Rank */}
            <TableCell className="text-muted-foreground text-center font-mono text-xs font-bold">
                #{entry.rank}
            </TableCell>

            {/* Developer (Avatar + Username) */}
            <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/lab/${entry.githubUsername}`}
                        prefetch={false}
                        className="border-border relative shrink-0 overflow-hidden rounded-full border"
                    >
                        {imgError ? (
                            <div className="bg-muted text-primary flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold">
                                {entry.githubUsername.slice(0, 2).toUpperCase()}
                            </div>
                        ) : (
                            <Image
                                src={entry.avatarUrl}
                                alt={entry.githubUsername}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full object-cover"
                                onError={() => setImgError(true)}
                                unoptimized
                            />
                        )}
                    </Link>

                    <Link
                        href={`/lab/${entry.githubUsername}`}
                        prefetch={false}
                        className="text-foreground hover:text-primary font-mono text-sm font-bold transition-colors"
                    >
                        @{entry.githubUsername}
                    </Link>
                </div>
            </TableCell>

            {/* Archetype */}
            <TableCell className="text-primary font-mono text-xs font-semibold">
                <span>{entry.characterName}</span>
            </TableCell>

            {/* Score */}
            <TableCell className="text-right font-mono">
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-baseline gap-1">
                        <span className="text-foreground text-base font-extrabold">
                            {entry.developerScore}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                            /100
                        </span>
                    </div>
                    <div className="bg-muted h-1.5 w-24 overflow-hidden rounded-full">
                        <div
                            className="bg-primary h-full rounded-full"
                            style={{
                                width: `${Math.min(100, Math.max(0, entry.developerScore))}%`,
                            }}
                        />
                    </div>
                </div>
            </TableCell>
        </TableRow>
    )
}
