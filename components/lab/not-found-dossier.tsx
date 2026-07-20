'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function NotFoundDossier({ username }: { username: string }) {
    return (
        <div className="bg-background text-foreground flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex w-full max-w-lg flex-col items-center text-center"
            >
                {/* Profile Card */}
                <div className="border-border bg-card w-full space-y-6 rounded-xl border p-8 shadow-md">
                    <div className="text-muted-foreground font-mono text-xs font-bold uppercase">
                        PROFILE NOT ANALYZED
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Developer Profile Not Found
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Developer{' '}
                            <span className="text-foreground font-mono font-bold">
                                @{username}
                            </span>{' '}
                            has not been analyzed yet.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                        <Link
                            href="/lab/analyze"
                            prefetch={false}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 text-sm font-bold transition-all sm:w-auto"
                        >
                            Analyze GitHub Profile
                        </Link>
                        <Link
                            href="/lab"
                            prefetch={false}
                            className="border-border bg-muted text-foreground hover:bg-border rounded-lg border px-5 py-2.5 text-sm font-medium transition-all sm:w-auto"
                        >
                            Back to Leaderboard
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
