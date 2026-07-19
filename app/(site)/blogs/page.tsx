import { fetchBlogs } from '@/db/queries'
import { Blog } from '@/db/types'
import React from 'react'
import { BlogList } from '@/components/BlogList'
import { TextScramble } from '@/components/motion-primitives/text-scramble'

const Blogs = async () => {
    const posts: Blog[] = await fetchBlogs()

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Blogs
            </TextScramble>
            <BlogList posts={posts} />
        </main>
    )
}

export default Blogs
