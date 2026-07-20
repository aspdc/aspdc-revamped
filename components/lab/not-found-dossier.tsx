'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, FlaskConical } from 'lucide-react'

export function NotFoundDossier({ username }: { username: string }) {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-black px-4 py-16 font-[family-name:var(--font-space-grotesk)] text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mx-auto flex w-full max-w-lg flex-col items-center text-center"
            >
                {/* Stamp */}
                <div className="mb-6 inline-flex rotate-[-3deg] items-center gap-2 rounded-sm border-2 border-red-500/80 bg-red-950/30 px-4 py-1.5 font-mono text-xs font-extrabold tracking-[0.3em] text-red-400 uppercase shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <AlertTriangle className="h-4 w-4" />
                    <span>NO SUBJECT ON RECORD</span>
                </div>

                {/* Dossier Card */}
                <div className="w-full space-y-6 rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-950/10 via-black to-black p-8 shadow-2xl backdrop-blur-md">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                        <FlaskConical className="h-8 w-8" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Dossier Not Found
                        </h1>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Subject{' '}
                            <span className="font-mono font-bold text-gray-200">
                                @{username}
                            </span>{' '}
                            has not undergone laboratory profile analysis yet.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                        <Link
                            href="/lab/analyze"
                            prefetch={false}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#22c55e] bg-[#22c55e] px-6 py-2.5 text-sm font-bold text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all hover:bg-[#16a34a] sm:w-auto"
                        >
                            <span>Analyse A Profile</span>
                        </Link>
                        <Link
                            href="/lab"
                            prefetch={false}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-900/60 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-gray-500 hover:text-white sm:w-auto"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Return to Lab</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
