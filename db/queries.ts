import { cacheLife } from 'next/cache'
import { db } from '@/db/drizzle'
import {
    achievements,
    blogs,
    events,
    leaderboard,
    leaderboardUsers,
    projects,
    tournamentContests,
    tournamentParticipants,
    tournamentScores,
    upcomingEvents,
    votes,
} from '@/db/schema'
import {
    Achievement,
    Blog,
    Event,
    LeaderboardEntry,
    LeaderboardUser,
    Project,
    TournamentContest,
    TournamentLeaderboardEntry,
    TournamentParticipant,
    TournamentScore,
    UpcomingEvent,
} from '@/db/types'
import { asc, desc, eq, sql } from 'drizzle-orm'

// ----------------- Achievements -----------------
export async function fetchAchievements(): Promise<Achievement[]> {
    'use cache'
    cacheLife('hours')

    try {
        const rows = await db
            .select()
            .from(achievements)
            .orderBy(desc(achievements.date))
        return rows.map((row) => ({
            ...row,
            date: new Date(row.date),
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching achievements:', error)
        return []
    }
}

// ----------------- Blogs -----------------
export async function fetchBlogs(): Promise<Blog[]> {
    'use cache'
    cacheLife('hours')

    try {
        const rows = await db
            .select()
            .from(blogs)
            .orderBy(desc(blogs.publishDate))
        return rows.map((row) => ({
            ...row,
            publishDate: new Date(row.publishDate),
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching blogs:', error)
        return []
    }
}

// ----------------- Events -----------------
export async function fetchEvents(): Promise<Event[]> {
    'use cache'
    cacheLife('hours')

    try {
        const rows = await db.select().from(events).orderBy(desc(events.date))
        return rows.map((row) => ({
            ...row,
            date: new Date(row.date),
            createdAt: new Date(row.createdAt),
            imageUrls: row.imageUrls ?? [],
        }))
    } catch (error) {
        console.error('Error fetching events:', error)
        return []
    }
}

// ----------------- Leaderboard -----------------
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
        const rows = await db
            .select()
            .from(leaderboard)
            .orderBy(desc(leaderboard.rating))
        return rows.map((row) => ({
            ...row,
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return []
    }
}

// ----------------- Projects -----------------
export async function fetchProjects(): Promise<Project[]> {
    'use cache'
    cacheLife('hours')

    try {
        const rows = await db
            .select()
            .from(projects)
            .orderBy(asc(projects.name))
        return rows.map((row) => ({
            ...row,
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching projects:', error)
        return []
    }
}

// ----------------- Upcoming Events -----------------
export async function fetchUpcomingEvents(): Promise<UpcomingEvent[]> {
    'use cache'
    cacheLife({ stale: 1800, revalidate: 3600 }) // 30 min stale, 1 hour revalidate

    try {
        const rows = await db
            .select()
            .from(upcomingEvents)
            .orderBy(asc(upcomingEvents.name))
        return rows.map((row) => ({
            ...row,
            date: new Date(row.date),
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching upcoming events:', error)
        return []
    }
}

// ----------------- Votes (Ship-It) -----------------
export async function getVoteCounts(): Promise<Record<string, number>> {
    'use cache'
    cacheLife({ stale: 30, revalidate: 60 }) // 30 seconds stale, 1 minute revalidate

    try {
        const voteCounts = await db
            .select({
                projectId: votes.projectId,
                count: sql<number>`count(*)::int`,
            })
            .from(votes)
            .groupBy(votes.projectId)

        const countsMap: Record<string, number> = {}
        for (const row of voteCounts) {
            countsMap[row.projectId] = row.count
        }
        return countsMap
    } catch (error) {
        console.error('Error fetching vote counts:', error)
        return {}
    }
}

export async function getVoteCount(projectId: string): Promise<number> {
    try {
        const result = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(votes)
            .where(eq(votes.projectId, projectId))

        return result[0]?.count || 0
    } catch (error) {
        console.error('Error fetching vote count:', error)
        return 0
    }
}

// ----------------- Leaderboard Users -----------------
export async function fetchLeaderboardUsers(): Promise<LeaderboardUser[]> {
    'use cache'
    cacheLife('minutes')

    try {
        return await db
            .select()
            .from(leaderboardUsers)
            .orderBy(asc(leaderboardUsers.createdAt))
    } catch (error) {
        console.error('Error fetching leaderboard users:', error)
        return []
    }
}

// ----------------- Tournament -----------------
export async function fetchTournamentContests(): Promise<TournamentContest[]> {
    'use cache'
    cacheLife('minutes')

    try {
        return await db
            .select()
            .from(tournamentContests)
            .orderBy(asc(tournamentContests.createdAt))
    } catch (error) {
        console.error('Error fetching tournament contests:', error)
        return []
    }
}

export async function fetchTournamentParticipants(): Promise<
    TournamentParticipant[]
> {
    'use cache'
    cacheLife('minutes')

    try {
        return await db
            .select()
            .from(tournamentParticipants)
            .orderBy(asc(tournamentParticipants.name))
    } catch (error) {
        console.error('Error fetching tournament participants:', error)
        return []
    }
}

export async function fetchTournamentScores(): Promise<TournamentScore[]> {
    'use cache'
    cacheLife('minutes')

    try {
        return await db.select().from(tournamentScores)
    } catch (error) {
        console.error('Error fetching tournament scores:', error)
        return []
    }
}

export async function fetchTournamentLeaderboard(): Promise<
    TournamentLeaderboardEntry[]
> {
    'use cache'
    cacheLife('minutes')

    try {
        const participants = await db.select().from(tournamentParticipants)
        const scores = await db.select().from(tournamentScores)
        const contests = await db.select().from(tournamentContests)

        const contestMap = new Map(contests.map((c) => [c.id, c]))

        const leaderboard: TournamentLeaderboardEntry[] = participants.map(
            (p) => {
                const participantScores = scores.filter(
                    (s) => s.participantId === p.id
                )
                const scoreDetails = participantScores.map((s) => ({
                    contest: contestMap.get(s.contestId)!,
                    points: s.points,
                }))
                const totalPoints = participantScores.reduce(
                    (sum, s) => sum + s.points,
                    0
                )

                return {
                    participant: p,
                    scores: scoreDetails,
                    totalPoints,
                }
            }
        )

        // Sort by total points descending
        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints)

        return leaderboard
    } catch (error) {
        console.error('Error fetching tournament leaderboard:', error)
        return []
    }
}
