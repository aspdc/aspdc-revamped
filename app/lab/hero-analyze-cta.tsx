'use client'

import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export function HeroAnalyzeCta() {
    const { data: session } = authClient.useSession()
    const isSignedIn = Boolean(session?.user?.id)

    return (
        <Link
            href="/lab/analyze"
            prefetch={false}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 text-sm font-bold transition-all"
        >
            {isSignedIn ? 'Run Analysis' : 'Analyze Your Profile'}
        </Link>
    )
}
