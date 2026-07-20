'use client'

import { motion } from 'framer-motion'

export function BreakingDevsLogo({ animate = true }: { animate?: boolean }) {
    if (!animate) {
        return (
            <div className="relative flex flex-col items-start font-[family-name:var(--font-space-grotesk)] select-none">
                {/* Line 1: [Br]eaking */}
                <div className="flex items-center gap-0">
                    <div className="relative flex h-[3.75rem] w-[3.75rem] flex-shrink-0 items-center justify-center border-2 border-[#072508] bg-gradient-to-br from-[#15453D] via-[#0D592C] to-[#006C24] py-1.5 pr-0.5 pl-1.5 select-none sm:h-[4.25rem] sm:w-[4.25rem]">
                        <span className="absolute top-1 right-1 font-mono text-[9px] leading-none font-bold text-white/90 sm:top-1.5 sm:right-1.5 sm:text-[10px]">
                            35
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk)] text-4xl leading-none font-bold tracking-tight text-white sm:text-5xl">
                            Br
                        </span>
                    </div>
                    <span className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight text-[#22c55e] sm:text-5xl">
                        eaking
                    </span>
                </div>

                {/* Line 2: [De]velopers */}
                <div className="ml-[3.75rem] flex items-center gap-0 sm:ml-[4.25rem]">
                    <div className="relative flex h-[3.75rem] w-[3.75rem] flex-shrink-0 items-center justify-center border-2 border-[#072508] bg-gradient-to-br from-[#15453D] via-[#0D592C] to-[#006C24] px-1.5 py-1.5 select-none sm:h-[4.25rem] sm:w-[4.25rem]">
                        <span className="absolute top-1 right-1 font-mono text-[9px] leading-none font-bold text-white/90 sm:top-1.5 sm:right-1.5 sm:text-[10px]">
                            1
                        </span>
                        <span className="font-[family-name:var(--font-space-grotesk)] text-4xl leading-none font-bold tracking-tight text-white sm:text-5xl">
                            D
                        </span>
                    </div>
                    <span className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight text-[#22c55e] sm:text-5xl">
                        evelopers
                    </span>
                </div>
            </div>
        )
    }

    const smoothEase = [0.25, 0.1, 0.25, 1.0] as const

    return (
        <div className="relative flex flex-col items-start font-[family-name:var(--font-space-grotesk)] select-none">
            {/* Line 1: [Br]eaking */}
            <div className="flex items-center gap-0">
                {/* Layer 1: Top Box [Br] */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, ease: smoothEase }}
                    className="relative flex h-[3.75rem] w-[3.75rem] flex-shrink-0 items-center justify-center border-2 border-[#072508] bg-gradient-to-br from-[#15453D] via-[#0D592C] to-[#006C24] py-1.5 pr-0.5 pl-1.5 select-none sm:h-[4.25rem] sm:w-[4.25rem]"
                >
                    <span className="absolute top-1 right-1 font-mono text-[9px] leading-none font-bold text-white/90 sm:top-1.5 sm:right-1.5 sm:text-[10px]">
                        35
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk)] text-4xl leading-none font-bold tracking-tight text-white sm:text-5xl">
                        Br
                    </span>
                </motion.div>

                {/* Layer 2: Text "eaking" */}
                <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: 0.25,
                        duration: 0.9,
                        ease: smoothEase,
                    }}
                    className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight text-[#22c55e] sm:text-5xl"
                >
                    eaking
                </motion.span>
            </div>

            {/* Line 2: [De]velopers */}
            <div className="ml-[3.75rem] flex items-center gap-0 sm:ml-[4.25rem]">
                {/* Layer 3: Bottom Box [De] */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        delay: 0.5,
                        duration: 0.9,
                        ease: smoothEase,
                    }}
                    className="relative flex h-[3.75rem] w-[3.75rem] flex-shrink-0 items-center justify-center border-2 border-[#072508] bg-gradient-to-br from-[#15453D] via-[#0D592C] to-[#006C24] px-1.5 py-1.5 select-none sm:h-[4.25rem] sm:w-[4.25rem]"
                >
                    <span className="absolute top-1 right-1 font-mono text-[9px] leading-none font-bold text-white/90 sm:top-1.5 sm:right-1.5 sm:text-[10px]">
                        1
                    </span>
                    <span className="font-[family-name:var(--font-space-grotesk)] text-4xl leading-none font-bold tracking-tight text-white sm:text-5xl">
                        De
                    </span>
                </motion.div>

                {/* Layer 4: Text "velopers" */}
                <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: 0.75,
                        duration: 0.9,
                        ease: smoothEase,
                    }}
                    className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight text-[#22c55e] sm:text-5xl"
                >
                    velopers
                </motion.span>
            </div>
        </div>
    )
}
