'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import Link from 'next/link'
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react'

// Framer Motion variants
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

import teamData from './team.json'

export default function Page() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const everything = teamData

    if (!everything || everything.length === 0) {
        return (
            <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
                <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                    Achievements
                </TextScramble>
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                    <span className="animate-bounce text-7xl">🤝</span>
                    <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                        No Team Members Yet
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Our team will be revealed soon. Stay tuned!
                    </p>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                The Faces Behind ASPDC
            </TextScramble>

            {everything.map((d, idx) => (
                <section key={idx}>
                    <TextEffect
                        per="char"
                        preset="blur"
                        speedReveal={0.6}
                        className="text-primary mb-3 text-xl font-medium"
                    >
                        {d.domainName}
                    </TextEffect>

                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="h-px bg-white"
                    />

                    <motion.div
                        className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {d.members.map((member) => (
                            <motion.div
                                key={member.id}
                                initial={{ y: 40, opacity: 0, scale: 0.8 }}
                                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <motion.div
                                    onHoverStart={() =>
                                        setHoveredIndex(member.id)
                                    }
                                    onHoverEnd={() => setHoveredIndex(null)}
                                    className="group relative h-[260px] w-full overflow-hidden rounded-2xl md:h-[320px]"
                                >
                                    {/* Background image */}
                                    <img
                                        className="h-full w-full object-cover"
                                        src={member.avatar}
                                        alt={member.name}
                                        loading="lazy"
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                    {/* Description */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-lg bg-black/20 px-4 py-3 transition-all duration-300 group-hover:bottom-3 xl:left-3 xl:translate-x-0">
                                        {/* Name + role */}
                                        <div className="">
                                            <p className="font-semibold">
                                                {member.name}
                                            </p>
                                            <p className="text-sm opacity-80">
                                                {member.role}
                                            </p>
                                        </div>

                                        {/* Hover icons */}
                                        <div className="mt-2 flex gap-2 xl:hidden">
                                            {member.instagram && (
                                                <Link
                                                    href={member.instagram}
                                                    target="_blank"
                                                >
                                                    <Instagram className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                </Link>
                                            )}
                                            {member.x && (
                                                <Link
                                                    href={member.x}
                                                    target="_blank"
                                                >
                                                    <Twitter className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                </Link>
                                            )}
                                            {member.linkedin && (
                                                <Link
                                                    href={member.linkedin}
                                                    target="_blank"
                                                >
                                                    <Linkedin className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                </Link>
                                            )}
                                            {member.github && (
                                                <Link
                                                    href={member.github}
                                                    target="_blank"
                                                >
                                                    <Github className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                </Link>
                                            )}
                                        </div>
                                        <AnimatePresence>
                                            {hoveredIndex === member.id && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                        scale: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    className="mt-2 hidden gap-2 xl:flex"
                                                >
                                                    {member.instagram && (
                                                        <Link
                                                            href={
                                                                member.instagram
                                                            }
                                                            target="_blank"
                                                        >
                                                            <Instagram className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                        </Link>
                                                    )}
                                                    {member.x && (
                                                        <Link
                                                            href={member.x}
                                                            target="_blank"
                                                        >
                                                            <Twitter className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                        </Link>
                                                    )}
                                                    {member.linkedin && (
                                                        <Link
                                                            href={
                                                                member.linkedin
                                                            }
                                                            target="_blank"
                                                        >
                                                            <Linkedin className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                        </Link>
                                                    )}
                                                    {member.github && (
                                                        <Link
                                                            href={member.github}
                                                            target="_blank"
                                                        >
                                                            <Github className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                        </Link>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            ))}
        </main>
    )
}
