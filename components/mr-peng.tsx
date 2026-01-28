'use client'

import Image from 'next/image'
import type React from 'react'
import { SafeHtmlContent } from '@/components/safe-html'

import { useState, useRef, useEffect } from 'react'

interface MrPengProps {
    messages: string[]
    image: string
}

export function MrPeng({ messages, image }: MrPengProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const [showBubble, setShowBubble] = useState(false)
    const petRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const allMessages = messages

    const handlePetClick = () => {
        if (showBubble) {
            setCurrentMessageIndex((prev) => (prev + 1) % allMessages.length)
        }
        setShowBubble(true)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Reset hide timer on click
        timeoutRef.current = setTimeout(() => {
            setShowBubble(false)
        }, 150000)
    }

    return (
        <>
            <style>
                {`
                    @keyframes mr-peng-float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                `}
            </style>
            <div
                ref={petRef}
                className="pointer-events-auto fixed right-4 bottom-4 z-50 select-none md:right-8 md:bottom-8"
                style={{
                    animation: 'mr-peng-float 3s ease-in-out infinite',
                }}
            >
                {/* Message Bubble */}
                {showBubble && allMessages.length > 0 && (
                    <div className="absolute right-0 bottom-[4.5rem] z-50 mb-2 w-40 rounded-lg border-2 border-black bg-white px-3 py-2 shadow-lg md:bottom-22 md:w-56 md:px-4 md:py-3">
                        <button
                            onClick={() => setShowBubble(false)}
                            className="absolute top-2 left-2 text-black transition-colors hover:text-gray-600"
                            aria-label="Close message"
                        >
                            ✕
                        </button>
                        <SafeHtmlContent
                            className="[&_a]:text-primary hover:[&_a]:text-primary/80 text-center font-mono text-xs leading-relaxed font-bold whitespace-pre-wrap text-black [&_a]:underline"
                            content={allMessages[currentMessageIndex]}
                        />
                        <div
                            className="absolute right-6 -bottom-3 h-4 w-4 transform bg-white md:right-10"
                            style={{
                                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                            }}
                        ></div>
                    </div>
                )}

                {/* Pet Image */}
                <div
                    className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    onClick={handlePetClick}
                >
                    <Image
                        src={image || '/mr-peng.png'}
                        alt="Mr. Peng - ASPDC Mascot"
                        height={80}
                        width={80}
                        className="pixel-perfect h-16 w-16 drop-shadow-lg md:h-20 md:w-20"
                        style={
                            {
                                imageRendering: 'crisp-edges',
                            } as React.CSSProperties
                        }
                        priority={false}
                        quality={85}
                    />
                </div>
            </div>
        </>
    )
}
