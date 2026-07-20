'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { authClient } from '@/lib/auth-client'
import { GitHubSignInButton } from '../github-sign-in-button'
import { BreakingDevsLogo } from '../breaking-devs-logo'
import { analyzeLabProfile } from '@/app/lab/actions'

const LOADING_STEPS = [
    { text: 'Connecting to GitHub API...' },
    { text: 'Fetching your repositories and activity...' },
    { text: 'Scoring commit volume and regularity...' },
    { text: 'Mapping your 15 coding trait scores...' },
    { text: 'Matching your traits against developer archetypes...' },
    { text: 'Building your developer profile...' },
] as const

type Phase = 'entry' | 'loading' | 'error'

export function AnalyzeClient() {
    const { data: session, isPending } = authClient.useSession()
    const [phase, setPhase] = useState<Phase>('entry')
    const [currentStep, setCurrentStep] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')

    const runAnalysis = useCallback(async () => {
        setPhase('loading')
        setCurrentStep(0)
        setErrorMessage('')

        const STEP_DURATION_MS = 3000

        // Start server analysis in parallel
        const analysisPromise = analyzeLabProfile().catch(() => ({
            ok: false as const,
            error: 'unknown' as const,
            message: 'Analysis failed unexpectedly. Please try again.',
        }))

        // Step sequentially through all 6 cinematic steps
        for (let step = 0; step < LOADING_STEPS.length; step++) {
            setCurrentStep(step)
            await new Promise((resolve) =>
                setTimeout(resolve, STEP_DURATION_MS)
            )
        }

        // Wait for server analysis to complete if still running
        const result = await analysisPromise

        if (result.ok) {
            await new Promise((resolve) => setTimeout(resolve, 400))
            window.location.href = `/lab/${result.profile.githubUsername}`
        } else {
            setErrorMessage(result.message)
            setPhase('error')
        }
    }, [])

    if (isPending) {
        return (
            <div className="flex min-h-dvh items-center justify-center">
                <div className="text-muted-foreground text-sm">Loading...</div>
            </div>
        )
    }

    if (!session?.user) {
        return (
            <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
                <BreakingDevsLogo animate={false} />
                <p className="text-muted-foreground text-sm">
                    Sign in with GitHub to analyse your developer profile.
                </p>
                <GitHubSignInButton />
            </div>
        )
    }

    return (
        <div className="bg-background relative flex min-h-dvh items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                {phase === 'entry' && <EntryView onAnalyze={runAnalysis} />}
                {phase === 'loading' && (
                    <LoadingView currentStep={currentStep} />
                )}
                {phase === 'error' && (
                    <ErrorView message={errorMessage} onRetry={runAnalysis} />
                )}
            </AnimatePresence>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/*  Entry View                                                         */
/* ------------------------------------------------------------------ */

function EntryView({ onAnalyze }: { onAnalyze: () => void }) {
    const smoothEase = [0.25, 0.1, 0.25, 1.0] as const

    return (
        <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-10 px-6 text-center">
            <div className="space-y-6">
                {/* Title Card (Cinematic layer-by-layer reveal) */}
                <BreakingDevsLogo animate={true} />

                {/* Layer 5: Separator line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.0, duration: 0.8, ease: smoothEase }}
                    className="bg-border mx-auto h-px w-48"
                />

                {/* Layer 6: Paragraph description */}
                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 1.25,
                        duration: 0.8,
                        ease: smoothEase,
                    }}
                    className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed"
                >
                    Analyse your GitHub activity to see your developer score, 15
                    coding trait scores, and which developer archetype your
                    coding style most closely matches.
                </motion.p>
            </div>

            {/* Layer 7: Glowing CTA button */}
            <motion.button
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8, ease: smoothEase }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onAnalyze}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-1.5 text-base font-bold tracking-wide text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all hover:border-green-500/70 hover:bg-green-500/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] sm:px-5 sm:py-2 sm:text-lg"
            >
                {/* Inner radial glow pulse */}
                <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.25)_0%,_transparent_70%)]"
                    animate={{ opacity: [0.4, 0.85, 0.4] }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <span className="relative z-10">Analyse</span>
            </motion.button>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/*  Loading View                                                       */
/* ------------------------------------------------------------------ */

function LoadingView({ currentStep }: { currentStep: number }) {
    return (
        <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-10 px-6"
        >
            {/* Pulsing ring indicator */}
            <div className="relative flex h-24 w-24 items-center justify-center">
                <motion.div
                    className="absolute inset-0 rounded-full border border-green-500/30"
                    animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
                <motion.div
                    className="absolute inset-2 rounded-full border border-green-500/20"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        delay: 0.3,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
                <motion.div
                    className="text-primary font-mono text-3xl"
                    key={currentStep}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentStep + 1}
                </motion.div>
            </div>

            {/* Step text */}
            <div className="min-h-[3rem] text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentStep}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4 }}
                        className="font-mono text-sm font-medium text-green-400/90"
                    >
                        {LOADING_STEPS[currentStep].text}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2">
                {LOADING_STEPS.map((_, index) => (
                    <motion.div
                        key={index}
                        className="h-1.5 w-1.5 rounded-full"
                        animate={{
                            backgroundColor:
                                index <= currentStep
                                    ? 'rgb(34 197 94)'
                                    : 'rgb(34 197 94 / 0.2)',
                            scale: index === currentStep ? 1.4 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </div>

            {/* Step counter */}
            <p className="text-muted-foreground text-xs tabular-nums">
                Step {currentStep + 1} of {LOADING_STEPS.length}
            </p>
        </motion.div>
    )
}

/* ------------------------------------------------------------------ */
/*  Error View                                                         */
/* ------------------------------------------------------------------ */

function ErrorView({
    message,
    onRetry,
}: {
    message: string
    onRetry: () => void
}) {
    return (
        <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6 px-6 text-center"
        >
            {/* Error icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
                <span className="text-2xl">⚠️</span>
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-red-400">
                    Analysis failed
                </h2>
                <p className="text-muted-foreground text-sm">{message}</p>
            </div>

            <button
                type="button"
                onClick={onRetry}
                className="cursor-pointer rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-semibold text-green-400 transition-colors hover:border-green-500/50 hover:bg-green-500/20"
            >
                Try again
            </button>
        </motion.div>
    )
}
