import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { GitHubSignInButton } from './github-sign-in-button'

export default async function LabPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    return (
        <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
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
