import { Suspense } from 'react'
import ConditionalNavbar from '@/components/ConditionalNavbar'
import DotGrid from '@/components/bits/DotGrid/DotGrid'
import Footer from '@/components/Footer'
import { MrPeng } from '@/components/mr-peng'

const mrPengMessages = [
    `I am Mr.Peng
The Mascot of ASPDC
Created by <a href="https://instagram.com/prea.yanshie" target="_blank" noreferrer>Priyanshi</a>`,
    `I'm trapped in a Next.js app! Send chimichangas! Or at least a <a href="https://github.com/ni3rav/aspdc-revamped" target="_blank">Pull Request</a>.`,
    `President thinks he's the main character. Cute. We all know <b>I'm</b> the one selling the merch.`,
    `You think your job is hard? Try floating here looking adorable while the DOM re-renders every 5 milliseconds.`,
    `Hey, check out the <a href="/aoc">AoC Leaderboard</a>. I bet I'm winning. What do you mean penguins can't code?`,
    `This website was built with 'Maximum Effort'. And by that, I mean prompting Co-Pilot. Don't tell anyone.`,
    `I'd break the fourth wall, but the CSS <code>overflow: hidden</code> is holding me back.`,
    `Join the club! We have cookies. Virtual cookies. They're stored in your browser. Accept them admins! `,
    `Check out the <a href="/projects">Projects</a>. Some are actually finished! Unlike my animations.`,
    `Looking for <a href="/events">Events</a>? We promise they're more organized than the timeline in X-Men movies.`,
    `Meet the <a href="/team">Team</a>. A ragtag group of misfits. Basically X-Force, but with more keyboards and less spandex.`,
    `Don't try to access the <a href="/admin">Admin</a> panel. It's guarded by a very angry wolverine. And by wolverine, I mean authentication middleware.`,
    `Visit <a href="/achievements">Achievements</a> to see us flexing. Weird flex, but okay.`,
]

export default function SiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <div className="relative w-screen">
                <div className="fixed inset-0 -z-10">
                    <DotGrid
                        dotSize={10}
                        baseColor="#111111"
                        activeColor="#23C55E"
                        className="h-full w-full"
                    />
                </div>
                <Suspense fallback={null}>
                    <ConditionalNavbar />
                </Suspense>
            </div>
            <div className="mt-9 sm:mt-0">{children}</div>
            <MrPeng image="/mr-peng.png" messages={mrPengMessages} />
            <Footer />
        </>
    )
}
