import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PartyPopper } from 'lucide-react'

interface Particle {
    x: number
    y: number
    emoji: string
    size: number
    velocity: { x: number; y: number }
    rotation: number
    rotationSpeed: number
}

const EmojiConfetti: React.FC = () => {
    const [isExploding, setIsExploding] = useState(false)
    const buttonRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particles = useRef<Particle[]>([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const emojis = ['🧑‍💻', '🖥️', '🐍', '🌍', '✨', '⚡', '🖱️', '💿']

    useEffect(() => {
        if (isExploding) {
            const canvas = canvasRef.current
            const button = buttonRef.current
            if (!canvas || !button) return

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            const updateCanvasSize = () => {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
            }

            updateCanvasSize()
            window.addEventListener('resize', updateCanvasSize)

            const buttonRect = button.getBoundingClientRect()
            const centerX = buttonRect.left + buttonRect.width / 2
            const centerY = buttonRect.top + buttonRect.height / 2

            for (let i = 0; i < 50; i++) {
                const angle = Math.random() * Math.PI * 2
                const velocity = 5 + Math.random() * 5
                particles.current.push({
                    x: centerX,
                    y: centerY,
                    emoji: emojis[Math.floor(Math.random() * emojis.length)],
                    size: 20 + Math.random() * 20,
                    velocity: {
                        x: Math.cos(angle) * velocity,
                        y: Math.sin(angle) * velocity,
                    },
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.2,
                })
            }

            const animate = () => {
                if (!ctx) return
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                particles.current = particles.current.filter((particle) => {
                    particle.x += particle.velocity.x
                    particle.y += particle.velocity.y
                    particle.velocity.y += 0.1 // gravity
                    particle.rotation += particle.rotationSpeed

                    if (particle.y < canvas.height) {
                        ctx.save()
                        ctx.translate(particle.x, particle.y)
                        ctx.rotate(particle.rotation)
                        ctx.font = `${particle.size}px Arial`
                        ctx.textAlign = 'center'
                        ctx.textBaseline = 'middle'
                        ctx.fillText(particle.emoji, 0, 0)
                        ctx.restore()
                        return true
                    }
                    return false
                })

                if (particles.current.length > 0) {
                    requestAnimationFrame(animate)
                } else {
                    setIsExploding(false)
                }
            }

            animate()

            return () => {
                window.removeEventListener('resize', updateCanvasSize)
            }
        }
    }, [isExploding, emojis])

    const handleClick = () => {
        particles.current = []
        setIsExploding(true)
    }

    return (
        <div
            onClick={handleClick}
            ref={buttonRef}
            className="group flex size-10 cursor-pointer items-center justify-center rounded-lg border border-stone-700 transition-colors hover:border-stone-100 sm:size-12 md:size-14"
        >
            <motion.div
                className="transform-gpu opacity-70 transition-opacity group-hover:opacity-100"
                whileTap={{ scale: 0.95 }}
            >
                <PartyPopper />
            </motion.div>
            {isExploding && (
                <canvas
                    ref={canvasRef}
                    className="pointer-events-none fixed inset-0"
                    style={{ zIndex: 9999 }}
                />
            )}
        </div>
    )
}

export default EmojiConfetti
