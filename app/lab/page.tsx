import { Suspense } from 'react'
import { headers } from 'next/headers'
import { fetchLabProfilesByScore } from '@/db/queries'
import { auth } from '@/lib/auth'
import { formatLeaderboardEntries } from '@/lib/lab/leaderboard'
import { BreakingDevsLogo } from './breaking-devs-logo'
import { LabLeaderboard } from '@/components/lab/lab-leaderboard'
import { LabHeaderCta } from '@/components/lab/lab-header-cta'
import { ShieldAlert } from 'lucide-react'

export const metadata = {
    title: 'Leaderboard Index | Breaking Devs',
    description:
        'Public ranked index of all analyzed developer dossiers in the lab, ordered by developer score.',
}

async function LeaderboardContent() {
    const [profiles, session] = await Promise.all([
        fetchLabProfilesByScore(),
        auth.api.getSession({
            headers: await headers(),
        }),
    ])

    const entries = formatLeaderboardEntries(profiles)
    const isSignedIn = Boolean(session?.user?.id)

    return (
        <div className="flex min-h-screen flex-col bg-black font-[family-name:var(--font-space-grotesk)] text-white">
            {/* Sticky Header CTA */}
            <LabHeaderCta isSignedIn={isSignedIn} />

            <div className="relative flex flex-1 flex-col items-center overflow-hidden px-4 py-12">
                {/* Background glow & grid pattern */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-950/30 via-black to-black" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#052e1615_1px,transparent_1px),linear-gradient(to_bottom,#052e1615_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-10">
                    {/* Classified Stamp Aesthetic */}
                    <div className="inline-flex rotate-[-1deg] items-center gap-2 rounded-sm border-2 border-[#22c55e]/60 bg-[#22c55e]/10 px-3.5 py-1.5 font-mono text-xs font-extrabold tracking-[0.3em] text-[#22c55e] uppercase shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <ShieldAlert className="h-4 w-4 text-[#22c55e]" />
                        <span>CLASSIFIED // SUBJECT LEADERBOARD INDEX</span>
                    </div>

                    {/* Logo & Intro */}
                    <div className="flex flex-col items-center gap-4 text-center">
                        <BreakingDevsLogo animate={false} />
                        <p className="max-w-lg font-mono text-sm text-gray-400">
                            Public ranked dossiers of all analyzed subjects
                            ordered by developer score and purity.
                        </p>
                    </div>

                    {/* Leaderboard Table / List */}
                    <LabLeaderboard entries={entries} isSignedIn={isSignedIn} />
                </div>
            </div>
        </div>
    )
}

export default function LabLeaderboardPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-black">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                        <p className="font-mono text-xs text-green-400">
                            LOADING LEADERBOARD DOSSIERS...
                        </p>
                    </div>
                </div>
            }
        >
            <LeaderboardContent />
        </Suspense>
    )
}
