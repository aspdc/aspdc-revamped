import { Suspense } from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { GitHubSignInButton } from './github-sign-in-button'

async function LabContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    return (
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Breaking Dev
                </h1>
                <p className="text-muted-foreground text-sm">
                    Sign in with GitHub to enter the lab and analyse your
                    developer profile.
                </p>
            </div>
            {session ? (
                <p className="text-sm">
                    Signed in as{' '}
                    <span className="font-medium">{session.user.name}</span>
                </p>
            ) : (
                <GitHubSignInButton />
            )}
        </div>
    )
}

export default function LabPage() {
    return (
        <Suspense
            fallback={
                <div className="mx-auto flex min-h-dvh max-w-lg items-center justify-center px-4 py-16 text-center">
                    <p className="text-muted-foreground text-sm">Loading...</p>
                </div>
            }
        >
            <LabContent />
        </Suspense>
    )
}
