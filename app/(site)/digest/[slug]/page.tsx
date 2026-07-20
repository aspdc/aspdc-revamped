import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostContent } from '@/components/digest/PostContent'

interface PostPageProps {
    params: Promise<{
        slug: string
    }>
}

export default function PostPage({ params }: PostPageProps) {
    return (
        <main className="mx-auto min-h-screen max-w-4xl px-6 py-20 sm:px-8 lg:px-12">
            <Button
                variant="ghost"
                size="default"
                asChild
                className="mb-10 -ml-3"
            >
                <Link
                    href="/digest"
                    className="flex items-center gap-2 text-base text-neutral-400 hover:text-white"
                >
                    <ArrowLeft size={18} />
                    Back
                </Link>
            </Button>

            <Suspense fallback={<PostSkeleton />}>
                <PostContent params={params} />
            </Suspense>
        </main>
    )
}

function PostSkeleton() {
    return (
        <div className="animate-pulse space-y-5">
            <div className="h-8 w-24 rounded bg-neutral-800" />
            <div className="h-14 w-3/4 rounded bg-neutral-800" />
            <div className="h-5 w-48 rounded bg-neutral-800" />
            <div className="mt-8 h-96 w-full rounded-2xl bg-neutral-900" />
        </div>
    )
}
