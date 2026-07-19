'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { RegisterModal } from '@/components/RegisterModal'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import type { TournamentLeaderboardEntry } from '@/db/types'

interface LeaderboardClientProps {
    leaderboardData: {
        id: string
        fullName: string
        codeforcesHandle: string
        leetcodeHandle: string | null
        createdAt: Date
        rating: number
        rank: string
        maxRating?: number
    }[]
    tournamentData: TournamentLeaderboardEntry[]
}

export default function LeaderboardClient({
    leaderboardData,
    tournamentData,
}: LeaderboardClientProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const tabParam = searchParams.get('tab')
    const [activeTab, setActiveTab] = useState(
        tabParam === 'tournament' ? 'tournament' : 'global'
    )

    useEffect(() => {
        const newTab = tabParam === 'tournament' ? 'tournament' : 'global'
        setActiveTab(newTab)
    }, [tabParam])

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', value)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    // Get unique contest names for tournament table headers
    const contestNames =
        tournamentData.length > 0
            ? [
                  ...new Set(
                      tournamentData.flatMap((e) =>
                          e.scores.map((s) => s.contest.name)
                      )
                  ),
              ]
            : []

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Leaderboard
            </TextScramble>

            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="mb-8">
                    <TabsTrigger value="global">Global</TabsTrigger>
                    <TabsTrigger value="tournament">Tournament</TabsTrigger>
                </TabsList>

                <TabsContent value="global">
                    <div className="space-y-8">
                        <RegisterModal />
                        <LeaderboardTable data={leaderboardData} />
                    </div>
                </TabsContent>

                <TabsContent value="tournament">
                    {tournamentData.length === 0 ? (
                        <div className="text-muted-foreground flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
                            <p className="text-center text-lg">
                                Leaderboard will update as we progress through
                                our tournament
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            #
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>CF Handle</TableHead>
                                        {contestNames.map((name) => (
                                            <TableHead
                                                key={name}
                                                className="text-center"
                                            >
                                                {name}
                                            </TableHead>
                                        ))}
                                        <TableHead className="text-center font-bold">
                                            Total
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tournamentData.map((entry, index) => (
                                        <TableRow key={entry.participant.id}>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {entry.participant.name}
                                            </TableCell>
                                            <TableCell>
                                                <a
                                                    href={`https://codeforces.com/profile/${entry.participant.codeforcesHandle}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    {
                                                        entry.participant
                                                            .codeforcesHandle
                                                    }
                                                </a>
                                            </TableCell>
                                            {contestNames.map((name) => {
                                                const score = entry.scores.find(
                                                    (s) =>
                                                        s.contest.name === name
                                                )
                                                return (
                                                    <TableCell
                                                        key={name}
                                                        className="text-center"
                                                    >
                                                        {score?.points ?? '-'}
                                                    </TableCell>
                                                )
                                            })}
                                            <TableCell className="text-center font-bold">
                                                {entry.totalPoints}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    )
}
