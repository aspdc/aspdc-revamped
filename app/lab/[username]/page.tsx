import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { fetchLabProfileByGithubUsername } from '@/db/queries'
import { CHARACTER_PROFILES } from '@/lib/lab/characters'
import Link from 'next/link'

async function ProfileContent({ username }: { username: string }) {
    const profile = await fetchLabProfileByGithubUsername(username)

    if (!profile) {
        notFound()
    }

    const character = CHARACTER_PROFILES.find(
        (c) => c.id === profile.characterId
    )

    return (
        <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
            {/* Classified badge */}
            <div className="border-primary/40 text-primary/60 border-2 px-4 py-1 text-xs font-bold tracking-[0.3em] uppercase">
                Subject Dossier: @{profile.githubUsername}
            </div>

            {/* Character match */}
            <div className="space-y-4">
                <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                    Matched Subject
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-green-400 sm:text-5xl">
                    {character?.name || profile.characterId}
                </h1>
                <p className="text-muted-foreground mx-auto max-w-md text-sm">
                    {character?.summary}
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid w-full grid-cols-2 gap-4 rounded-xl border border-green-500/20 bg-green-500/5 p-6">
                <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium uppercase">
                        Developer Score
                    </p>
                    <p className="text-foreground text-3xl font-bold tracking-tight">
                        {profile.developerScore}
                        <span className="text-muted-foreground text-base">
                            /100
                        </span>
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium uppercase">
                        Similarity
                    </p>
                    <p className="text-foreground text-3xl font-bold tracking-tight">
                        {Math.round(profile.characterSimilarity)}%
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Link
                    href="/lab/analyze"
                    className="rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-2.5 text-sm font-semibold text-green-400 transition-colors hover:border-green-500/50 hover:bg-green-500/20"
                >
                    Re-analyse Dossier
                </Link>
            </div>
        </div>
    )
}

export default async function LabProfilePage({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params
    return (
        <Suspense
            fallback={
                <div className="flex min-h-dvh items-center justify-center">
                    <div className="text-muted-foreground text-sm">
                        Loading dossier...
                    </div>
                </div>
            }
        >
            <ProfileContent username={username} />
        </Suspense>
    )
}
