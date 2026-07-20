'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

type LabHeaderCtaProps = {
    isSignedIn?: boolean
}

export function LabHeaderCta({ isSignedIn = false }: LabHeaderCtaProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 px-4 py-3.5 backdrop-blur-md transition-all">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 font-sans">
                {/* Left: Branding */}
                <Link
                    href="/lab"
                    prefetch={false}
                    className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#22c55e]/40 bg-[#22c55e]/15 font-mono text-xs font-bold text-[#22c55e]">
                        Br
                    </div>
                    <span className="text-base font-extrabold tracking-tight text-white">
                        Breaking<span className="text-[#22c55e]">Devs</span>
                    </span>
                </Link>

                {/* Right: CTA button */}
                <Link
                    href="/lab/analyze"
                    prefetch={false}
                    className="group inline-flex items-center gap-2 rounded-full border border-[#22c55e] bg-[#22c55e] px-4 py-1.5 font-mono text-xs font-bold text-black shadow-[0_0_15px_rgba(34,197,94,0.25)] transition-all hover:scale-105 hover:bg-[#16a34a]"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                        {isSignedIn ? 'Run Analysis' : 'Analyse Profile'}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </header>
    )
}
