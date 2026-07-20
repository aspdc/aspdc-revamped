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
        <div className="inline-flex flex-wrap items-center justify-center gap-3 font-sans">
            {/* Download Profile Image Button */}
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-xs font-bold transition-all disabled:opacity-50"
                type="button"
            >
                {isDownloading
                    ? 'Generating Image...'
                    : 'Download Profile Image'}
            </button>

            {/* Copy Profile Link Button */}
            <button
                onClick={handleCopyLink}
                className="border-border bg-card text-foreground hover:bg-muted rounded-lg border px-4 py-2 font-mono text-xs font-medium transition-all"
                type="button"
            >
                {copied ? 'Copied to Clipboard' : 'Copy Profile Link'}
            </button>
        </div>
    )
}
