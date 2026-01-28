'use client'

import { Blog } from '@/db/types'
import { PixelImage } from '@/components/magicui/pixel-image'
import { Calendar, ExternalLink, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'

function formatDate(input: string | Date) {
    const d = new Date(input)
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function BlogList({ posts }: { posts: Blog[] }) {
    if (!posts || posts.length === 0)
        return (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                <span className="animate-bounce text-7xl">✍️</span>
                <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                    No Blogs Yet
                </h2>
                <p className="mt-2 text-neutral-400">
                    Stories are in the making — your blogs will appear here
                    soon!
                </p>
            </div>
        )

    const handleShare = async ({ post }: { post: Blog }) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title,
                    text: `Check out this article: ${post.title} by ${post.author}`,
                    url: post.link,
                })
                toast.success('Post shared successfully!')
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(post.link)
                toast.success('Copied the link to clipboard!')
            } else {
                toast.error('Clipboard API not supported on this device.')
            }
        } catch (error) {
            console.error('Error sharing:', error)
            toast.error('Failed to share the link.')
        }
    }

    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
                const date = formatDate(post.publishDate)

                return (
                    <article
                        key={post.id}
                        className="group w-full"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'both',
                        }}
                    >
                        <div className="hover:border-primary relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-500 hover:bg-white/5">
                            {/* Image Section on top */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl">
                                {post.coverImage ? (
                                    <div className="relative h-full w-full">
                                        <PixelImage
                                            src={post.coverImage}
                                            customGrid={{ rows: 8, cols: 12 }}
                                            grayscaleAnimation
                                            pixelFadeInDuration={750}
                                            maxAnimationDelay={950}
                                            colorRevealDelay={950}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center bg-neutral-900 text-center">
                                        <div className="mb-3 text-6xl opacity-20">
                                            📚
                                        </div>
                                        <h3 className="text-lg font-bold text-neutral-300">
                                            No Image
                                        </h3>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-1 flex-col justify-between space-y-4 p-6 text-center">
                                <div className="space-y-3">
                                    {/* Title */}
                                    <h2 className="text-primary text-lg leading-tight font-black md:text-xl lg:text-2xl">
                                        {post.title}
                                    </h2>

                                    {/* Metadata */}
                                    <div className="flex flex-col flex-wrap items-center justify-center gap-3 text-xs text-neutral-400">
                                        <span>by {post.author}</span>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            <span>{date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex justify-center gap-2 pt-2">
                                    <a
                                        href={post.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/cta bg-primary inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-black transition-all duration-500 hover:scale-105 active:scale-95"
                                        aria-label={`Read article: ${post.title}`}
                                    >
                                        <span>Read</span>
                                        <ExternalLink
                                            size={16}
                                            className="transition-transform duration-300 group-hover/cta:translate-x-1"
                                        />
                                    </a>
                                    <Button
                                        onClick={() => handleShare({ post })}
                                        className="hover:bg-secondary cursor-pointer rounded-lg transition"
                                        variant="ghost"
                                    >
                                        Share
                                        <Share2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </article>
                )
            })}

            {/* Empty State */}
            {posts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                    <div className="mb-6 text-8xl opacity-20">📚</div>
                    <h3 className="mb-2 text-2xl font-bold text-neutral-300">
                        No articles yet
                    </h3>
                    <p className="max-w-md text-neutral-400">
                        Check back soon for the latest blog posts and articles.
                    </p>
                </div>
            )}
        </div>
    )
}
