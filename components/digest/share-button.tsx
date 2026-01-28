'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'

interface ShareButtonProps {
    title?: string
    className?: string
}

export function ShareButton({
    title = 'Share this post',
    className,
}: ShareButtonProps) {
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: document.title,
                    url: window.location.href,
                })
                toast.success('Post shared successfully!')
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(window.location.href)
                toast.success('Link copied to clipboard!')
            } else {
                const link = window.location.href
                const userConfirmed = window.confirm(
                    `Your device does not support automatic copying. Please copy the link manually:\n\n${link}`
                )
                if (userConfirmed) {
                    toast.success(
                        'Please paste the link where you want to share it.'
                    )
                } else {
                    toast.error('Sharing was cancelled.')
                }
            }
        } catch (err: unknown) {
            console.error('Sharing failed:', err)

            // Handle cancel case separately
            if (err instanceof DOMException && err.name === 'AbortError') {
                toast.info('Sharing was cancelled.')
            } else {
                toast.error('Failed to copy link automatically.')
            }
        }
    }

    return (
        <>
            <Toaster richColors position="top-right" />
            <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className={className}
                aria-label={title}
            >
                <Share2 className="mr-2 h-4 w-4" />
                Share
            </Button>
        </>
    )
}
