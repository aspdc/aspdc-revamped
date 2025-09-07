'use client'
import Link from 'next/link'
import { useState } from 'react'
import WrapButton from '../ui/wrap-button'
import { ChevronDown, Phone } from 'lucide-react'
import { TextScramble } from '../motion-primitives/text-scramble'
import { TextEffect } from '../motion-primitives/text-effect'
import { motion } from 'framer-motion'
import Image from 'next/image'

const Hero = () => {
    const [isTrigger, setIsTrigger] = useState(true)
    return (
        <main className="flex h-screen flex-col text-white">
            {/* Navbar */}
            <motion.div className="z-10 hidden items-center justify-between px-4 py-6 lg:flex lg:px-8">
                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <Link href="/" className="bg-black">
                        <Image
                            height={40}
                            width={130}
                            src="/aspdc.png"
                            alt="ASPDC logo"
                        />
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <WrapButton href="#contact">
                        <Phone size={15} />
                        <span className="text-white">Contact Us</span>
                    </WrapButton>
                </motion.div>
            </motion.div>

            {/* Main hero content */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    <TextScramble
                        duration={1}
                        className="text-primary text-5xl font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl"
                        trigger={isTrigger}
                        onHoverStart={() => setIsTrigger(true)}
                        onScrambleComplete={() => setIsTrigger(false)}
                    >
                        ASPDC
                    </TextScramble>
                </motion.div>

                <TextEffect
                    per="word"
                    preset="blur"
                    className="mt-4 text-2xl text-gray-200 sm:text-3xl md:text-4xl"
                >
                    For the Students, By the Students
                </TextEffect>

                <TextEffect
                    per="word"
                    preset="blur"
                    className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-400 sm:text-xl"
                >
                    Adani Students Programming and Developement Club (ASPDC) is
                    a welcoming space to learn, grow, and innovate across web
                    development, AI, and competitive programming at Adani
                    University.
                </TextEffect>
            </div>

            <motion.div
                initial={{ y: -20, filter: 'blur(12px)', opacity: 0 }}
                animate={{ y: 0, filter: 'blur(0)', opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-10 flex flex-col items-center justify-center gap-3 text-xl"
            >
                <p className="sr-only">Scroll down to explore</p>
                <motion.p
                    aria-hidden="true"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'mirror',
                    }}
                >
                    Scroll down to explore
                </motion.p>
                <ChevronDown aria-hidden="true" />
            </motion.div>
        </main>
    )
}

export default Hero
