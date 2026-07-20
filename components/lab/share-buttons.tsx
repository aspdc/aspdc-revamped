'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Copy, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type ShareButtonsProps = {
    username: string
}

export function ShareButtons({ username }: ShareButtonsProps) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleDownload = async () => {
        if (isDownloading) return
        setIsDownloading(true)
        try {
            const ogUrl = `/api/lab/og/${encodeURIComponent(username)}`
            const response = await fetch(ogUrl)

            if (!response.ok) {
                throw new Error('Failed to generate dossier image')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = `${username}-breaking-dev.png`
            document.body.appendChild(anchor)
            anchor.click()
            document.body.removeChild(anchor)
            window.URL.revokeObjectURL(url)

            toast.success('Dossier downloaded successfully!')
        } catch (error) {
            console.error('Download error:', error)
            toast.error('Could not download dossier. Please try again.')
        } finally {
            setIsDownloading(false)
        }
    }

    const handleCopyLink = async () => {
        try {
            const profileUrl = `${window.location.origin}/lab/${encodeURIComponent(username)}`
            await navigator.clipboard.writeText(profileUrl)
            setCopied(true)
            toast.success('Profile link copied to clipboard!')
            setTimeout(() => {
                setCopied(false)
            }, 2500)
        } catch (error) {
            console.error('Copy link error:', error)
            toast.error('Failed to copy link.')
        }
    }

    return (
        <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-xl border border-green-500/20 bg-green-950/20 p-2 backdrop-blur-md">
            {/* Download Dossier Button */}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="group inline-flex items-center gap-2 rounded-lg border border-[#22c55e]/50 bg-[#22c55e]/15 px-4 py-2.5 font-mono text-xs font-bold tracking-wide text-[#22c55e] transition-all hover:border-[#22c55e] hover:bg-[#22c55e]/25 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50"
                type="button"
            >
                {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#22c55e]" />
                ) : (
                    <Download className="h-4 w-4 text-[#22c55e] transition-transform group-hover:-translate-y-0.5" />
                )}
                <span>
                    {isDownloading
                        ? 'GENERATING DOSSIER...'
                        : 'DOWNLOAD DOSSIER'}
                </span>
            </motion.button>

            {/* Copy Profile Link Button */}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopyLink}
                className="group inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-black/60 px-4 py-2.5 font-mono text-xs font-semibold text-gray-300 transition-all hover:border-green-500/60 hover:text-white"
                type="button"
            >
                <AnimatePresence mode="wait">
                    {copied ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1.5 text-green-400"
                        >
                            <Check className="h-4 w-4" />
                            <span>COPIED TO CLIPBOARD</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="copy"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1.5"
                        >
                            <Copy className="h-4 w-4 text-gray-400 transition-colors group-hover:text-green-400" />
                            <span>COPY DOSSIER LINK</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}
