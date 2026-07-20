'use client'

import { authClient } from '@/lib/auth-client'
import { GitHubSignInButton } from './github-sign-in-button'
import { BreakingDevsLogo } from './breaking-devs-logo'
import Link from 'next/link'

export default function LabPage() {
    const { data: session, isPending } = authClient.useSession()

    return (
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
            <div className="space-y-4">
                <BreakingDevsLogo animate={false} />
                <p className="text-muted-foreground text-sm">
                    {isPending
                        ? 'Loading...'
                        : session
                          ? `Signed in as ${session.user.name || session.user.email}`
                          : 'Sign in with GitHub to enter the lab and analyse your developer profile.'}
                </p>
            </div>

            {!isPending &&
                (session ? (
                    <Link
                        href="/lab/analyze"
                        className="rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-semibold text-green-400 transition-colors hover:border-green-500/50 hover:bg-green-500/20"
                    >
                        Enter the lab
                    </Link>
                ) : (
                    <GitHubSignInButton />
                ))}
        </div>
    )
}
