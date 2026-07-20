import { TextScramble } from '@/components/motion-primitives/text-scramble'
import AoCLeaderboard from '@/components/AoCLeaderboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'

interface Member {
    id: number
    name: string
    stars: number
    local_score: number
    last_star_ts: number
    completion_day_level: Record<
        string,
        Record<string, { get_star_ts: number; star_index: number }>
    >
}

interface LeaderboardData {
    event: string
    owner_id: number
    num_days: number
    day1_ts: number
    members: Record<string, Member>
}

async function getLeaderboardData(): Promise<LeaderboardData | null> {
    try {
        const response = await fetch(process.env.AOC_URL || '', {
            next: { revalidate: 900 }, // Revalidate every 15 minutes
        })

        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return null
    }
}

const AoCPage = async () => {
    // Check if AoC feature is enabled
    if (process.env.NEXT_PUBLIC_ENABLE_AOC !== 'true') {
        notFound()
    }

    const data = await getLeaderboardData()

    return (
        <main className="mx-auto min-h-screen max-w-7xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Advent of Code 2025
            </TextScramble>

            {/* Leaderboard Section */}
            <AoCLeaderboard data={data} />

            {/* Instructions Section */}
            <Card className="bg-card/50 border-primary/20 mt-8 mb-4 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-primary text-2xl">
                        🎄 Join the Challenge
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-muted-foreground space-y-3">
                        <p className="text-foreground font-semibold">
                            Hey @everyone
                        </p>
                        <p>
                            ASPDC is excited to kick off{' '}
                            <strong className="text-primary">
                                Advent of Code 2025
                            </strong>{' '}
                            — the annual puzzle grind where coders chase stars
                            like it's exam season all over again.
                        </p>

                        <div className="space-y-2">
                            <h3 className="text-foreground text-lg font-semibold">
                                1. What is Advent of Code?
                            </h3>
                            <p>
                                Advent of Code (AoC) is a daily programming
                                puzzle series running for{' '}
                                <strong>12 days</strong> this year 🌟. Every day
                                at <strong>10:30 AM IST</strong>, a fresh puzzle
                                drops. You solve it, grab stars, and level up
                                your brain cells.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-foreground text-lg font-semibold">
                                2. How the Format Works
                            </h3>
                            <ul className="list-none space-y-1 pl-4">
                                <li>🕒 New puzzle every day for 12 days</li>
                                <li>⭐ Each day has two parts</li>
                                <li>💻 Any programming language works</li>
                                <li>🏆 Faster solves climb the leaderboards</li>
                            </ul>
                            <p className="italic">
                                Think of it as a workout for your logic muscles.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-foreground text-lg font-semibold">
                                3. ASPDC Private Leaderboard
                            </h3>
                            <p>
                                We've set up a private leaderboard so you can
                                battle it out with fellow ASPDC members 🧑‍💻🔥
                            </p>

                            <div className="bg-background/50 border-primary/30 rounded-lg border p-4">
                                <h4 className="text-primary mb-2 font-semibold">
                                    How to Join:
                                </h4>
                                <ol className="list-inside list-decimal space-y-1">
                                    <li>
                                        Visit{' '}
                                        <a
                                            href="https://adventofcode.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            https://adventofcode.com
                                        </a>
                                    </li>
                                    <li>Log in</li>
                                    <li>
                                        Go to{' '}
                                        <strong>
                                            Leaderboard → Join Private
                                            Leaderboard
                                        </strong>
                                    </li>
                                    <li>
                                        Enter this code:{' '}
                                        <code className="bg-primary/20 text-primary rounded px-2 py-1 font-mono">
                                            3814476-41207aad
                                        </code>
                                    </li>
                                    <li>
                                        Solve puzzles, collect stars, and flex
                                        lightly
                                    </li>
                                    <li>Leaderboard updates on its own</li>
                                </ol>
                            </div>

                            <p className="text-destructive font-semibold">
                                ⚠️ Hurry up, only 200 people can join the
                                leaderboard!
                            </p>
                        </div>

                        <p className="text-foreground pt-2 font-semibold">
                            Gear up for 12 days of coding, chaos, and
                            competitive suffering. Happy star hunting :]
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}

export default AoCPage
