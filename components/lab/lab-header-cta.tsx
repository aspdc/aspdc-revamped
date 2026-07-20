'use client'

import Link from 'next/link'
import { FlaskConical, ArrowRight, UserCheck } from 'lucide-react'

type LabHeaderCtaProps = {
    isSignedIn?: boolean
}

export function LabHeaderCta({ isSignedIn = false }: LabHeaderCtaProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-green-500/20 bg-black/85 px-4 py-3 backdrop-blur-md transition-all">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 font-[family-name:var(--font-space-grotesk)]">
                {/* Left: Quick title/tag */}
                <Link
                    href="/lab"
                    className="flex items-center gap-2 font-mono text-xs tracking-wider text-gray-300 transition-colors hover:text-green-400"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    <span className="font-bold text-green-400">LAB</span>
                    <span className="text-gray-600">//</span>
                    <span className="hidden text-gray-400 sm:inline">
                        LEADERBOARD INDEX
                    </span>
                </Link>

                {/* Right: CTA button */}
                <Link
                    href="/lab/analyze"
                    className="group inline-flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-3.5 py-1.5 font-mono text-xs font-bold text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all hover:border-green-500/70 hover:bg-green-500/20 hover:text-green-300 sm:px-4 sm:py-2 sm:text-sm"
                >
                    <FlaskConical className="h-4 w-4 text-green-400" />
                    <span>
                        {isSignedIn ? 'Run Analysis' : 'Analyse Your Profile'}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </header>
    )
}
