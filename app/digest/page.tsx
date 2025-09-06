import OtherPosts from '@/components/digest/OtherPosts'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { fetchAllDigest } from '@/lib/cms'
import Image from 'next/image'
import Link from 'next/link'

async function AllDigest() {
    const posts = await fetchAllDigest().then((res) => res?.data)
    // this is new

    if (!posts || posts.length === 0) {
        return (
            <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
                <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                    DIGEST
                </TextScramble>
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                    <span className="animate-bounce text-7xl">📰</span>
                    <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                        No Digests Yet
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Stay tuned — fresh articles will appear here soon!
                    </p>
                </div>
            </main>
        )
    }
    const latestPost = posts.splice(0, 1)[0]

    return (
        <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                DIGEST
            </TextScramble>

            {/* Featured Post */}
            <Link
                href={`/digest/${latestPost.slug}`}
                className="group hover:bg-primary/6 mb-16 grid items-center gap-8 rounded-lg bg-white/3 backdrop-blur-sm md:grid-cols-2"
            >
                {/* Left - Image */}
                <div className="relative overflow-hidden rounded-xl shadow-md">
                    <Image
                        src={latestPost.cover_image || '/placeholder.svg'}
                        alt={latestPost.title}
                        width={600}
                        height={400}
                        className="h-[300px] w-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                </div>

                {/* Right - Details */}
                <div className="flex flex-col justify-center gap-4">
                    {latestPost.category && (
                        <span className="bg-primary/90 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium text-white">
                            {latestPost.category.name}
                        </span>
                    )}

                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                        {latestPost.title}
                    </h2>

                    <p className="text-sm text-gray-200">
                        {latestPost.excerpt}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-300">
                        <Image
                            src={latestPost.authors[0].image_url}
                            alt={latestPost.authors[0].name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="font-medium">
                            {latestPost.authors[0].name}
                        </span>
                        <span>•</span>
                        <time>
                            {new Date(
                                latestPost.published_at
                            ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </time>
                    </div>
                </div>
            </Link>

            <div className="bg-primary/40 my-10 h-1 w-full rounded-full md:hidden" />

            <OtherPosts latestPost={latestPost} posts={posts} />
        </main>
    )
}

export default AllDigest
