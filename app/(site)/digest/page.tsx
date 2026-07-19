import { Suspense } from 'react'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { FilterBarWrapper } from '@/components/digest/FilterBarWrapper'
import { PostsGrid } from '@/components/digest/PostsGrid'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DigestPageProps {
    searchParams: Promise<{
        category?: string
        tags?: string
        author?: string
        page?: string
    }>
}

export default function DigestPage({ searchParams }: DigestPageProps) {
    return (
        <main className="mx-auto min-h-screen max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
            <header className="mb-12">
                <TextScramble className="text-primary text-4xl font-bold tracking-tight uppercase md:text-5xl">
                    Digest
                </TextScramble>
                <p className="mt-3 text-base text-neutral-400 sm:text-lg">
                    Articles, insights, and stories from the community.
                </p>
            </header>

            <ContributeBanner />

            <Suspense fallback={<FilterBarSkeleton />}>
                <FilterBarWrapper searchParams={searchParams} />
            </Suspense>

            <Suspense fallback={<PostsGridSkeleton />}>
                <PostsGrid searchParams={searchParams} />
            </Suspense>
        </main>
    )
}

function ContributeBanner() {
    const subject = encodeURIComponent('Content Submission for ASPDC Digest')
    const body = encodeURIComponent(
        `Hi ASPDC Team,

I would like to contribute an article to the ASPDC Digest.

Topic: [Your proposed topic]

Brief Description: [2-3 sentences about what you plan to cover]

Target Audience: [Who would benefit from this article]

Estimated Length: [Short/Medium/Long]

Your Name: [Your full name]
Your Year & Branch: [e.g., 2nd Year, CSE]

Looking forward to your guidance!

Best regards`
    )
    const mailtoLink = `mailto:aspdc@adaniuni.ac.in?subject=${subject}&body=${body}`

    return (
        <div className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-4">
            <p className="text-sm text-neutral-300 sm:text-base">
                <span className="font-medium text-white">
                    Got something to share?
                </span>{' '}
                We welcome articles on tech, coding, projects, and more. Mail us
                your idea and we'll help you publish it.
            </p>
            <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary/90 shrink-0 gap-1.5 text-black"
            >
                <a href={mailtoLink}>
                    <Mail size={14} />
                    <span className="hidden sm:inline">Submit Idea</span>
                    <span className="sm:hidden">Mail</span>
                </a>
            </Button>
        </div>
    )
}

function FilterBarSkeleton() {
    return (
        <div className="mb-8 h-28 animate-pulse rounded-2xl bg-neutral-900" />
    )
}

function PostsGridSkeleton() {
    return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="h-72 animate-pulse rounded-2xl bg-neutral-900"
                />
            ))}
        </div>
    )
}
