'use server'

import { headers } from 'next/headers'
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
import type {
    Achievement,
    Blog,
    Event,
    LeaderboardEntry,
    LeaderboardUser,
    NewAchievement,
    NewBlog,
    NewEvent,
    NewLeaderboardEntry,
    NewLeaderboardUser,
    NewProject,
    NewTournamentContest,
    NewTournamentParticipant,
    NewTournamentScore,
    NewUpcomingEvent,
    Project,
    TournamentParticipant,
    UpcomingEvent,
} from '@/db/types'
import { eq, and } from 'drizzle-orm'

// ----------------- Date Helpers -----------------
function normalizeDate(date: Date | string): Date {
    return date instanceof Date ? date : new Date(date)
}

function normalizeDateString(date: Date | string): string {
    const dateObj = normalizeDate(date)
    return dateObj.toISOString().split('T')[0]
}

// ----------------- Insertions -----------------
export async function addProject(project: NewProject) {
    try {
        await db.insert(projects).values(project)
    } catch (error) {
        console.error('Error in addProject:', error)
        throw error
    }
}

export async function addAchievement(achievement: NewAchievement) {
    try {
        await db.insert(achievements).values({
            ...achievement,
            date: normalizeDateString(achievement.date),
        })
    } catch (error) {
        console.error('Error in addAchievement:', error)
        throw error
    }
}

export async function addBlog(blog: NewBlog) {
    try {
        await db.insert(blogs).values({
            ...blog,
            publishDate: normalizeDate(blog.publishDate),
        })
    } catch (error) {
        console.error('Error in addBlog:', error)
        throw error
    }
}

export async function addEvent(event: NewEvent) {
    try {
        await db.insert(events).values({
            ...event,
            date: normalizeDate(event.date),
            imageUrls: event.imageUrls ?? [],
        })
    } catch (error) {
        console.error('Error in addEvent:', error)
        throw error
    }
}

export async function addLeaderboardEntry(entry: NewLeaderboardEntry) {
    try {
        await db.insert(leaderboard).values(entry)
    } catch (error) {
        console.error('Error in addLeaderboardEntry:', error)
        throw error
    }
}

export async function addUpcomingEvent(event: NewUpcomingEvent) {
    try {
        await db.insert(upcomingEvents).values({
            ...event,
            date: normalizeDate(event.date),
        })
    } catch (error) {
        console.error('Error in addUpcomingEvent:', error)
        throw error
    }
}

export async function addLeaderboardUser(user: NewLeaderboardUser) {
    try {
        await db.insert(leaderboardUsers).values(user)
    } catch (error) {
        console.error('Error in addLeaderboardUser:', error)
        throw error
    }
}

// ----------------- Updates -----------------
export async function updateProject(id: string, updates: Partial<Project>) {
    try {
        return await db
            .update(projects)
            .set(updates)
            .where(eq(projects.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateProject:', error)
        throw error
    }
}

export async function updateAchievement(
    id: string,
    data: Partial<Achievement>
) {
    const { date, ...rest } = data
    const adaptedData = {
        ...rest,
        ...(date && { date: normalizeDateString(date) }),
    }

    try {
        await db
            .update(achievements)
            .set(adaptedData)
            .where(eq(achievements.id, id))
    } catch (error) {
        console.error('Error in updateAchievement:', error)
        throw error
    }
}

export async function updateBlog(id: string, updates: Partial<Blog>) {
    try {
        const adaptedData = {
            ...updates,
            ...(updates.publishDate && {
                publishDate: normalizeDate(updates.publishDate),
            }),
        }
        return await db
            .update(blogs)
            .set(adaptedData)
            .where(eq(blogs.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateBlog:', error)
        throw error
    }
}

export async function updateEvent(id: string, updates: Partial<Event>) {
    try {
        const adaptedData = {
            ...updates,
            ...(updates.date && { date: normalizeDate(updates.date) }),
            ...(updates.imageUrls !== undefined && {
                imageUrls: updates.imageUrls ?? [],
            }),
        }
        return await db
            .update(events)
            .set(adaptedData)
            .where(eq(events.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateEvent:', error)
        throw error
    }
}

export async function updateLeaderboardEntry(
    id: string,
    updates: Partial<LeaderboardEntry>
) {
    try {
        return await db
            .update(leaderboard)
            .set(updates)
            .where(eq(leaderboard.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateLeaderboardEntry:', error)
        throw error
    }
}

export async function updateUpcomingEvent(
    id: string,
    updates: Partial<UpcomingEvent>
) {
    try {
        const adaptedData = {
            ...updates,
            ...(updates.date && { date: normalizeDate(updates.date) }),
        }
        return await db
            .update(upcomingEvents)
            .set(adaptedData)
            .where(eq(upcomingEvents.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateUpcomingEvent:', error)
        throw error
    }
}

export async function updateLeaderboardUser(
    id: string,
    updates: Partial<LeaderboardUser>
) {
    try {
        return await db
            .update(leaderboardUsers)
            .set(updates)
            .where(eq(leaderboardUsers.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateLeaderboardUser:', error)
        throw error
    }
}

// ----------------- Deletions -----------------
export async function deleteProject(id: string) {
    try {
        await db.delete(projects).where(eq(projects.id, id))
    } catch (error) {
        console.error('Error in deleteProject:', error)
        throw error
    }
}

export async function deleteAchievement(id: string) {
    try {
        await db.delete(achievements).where(eq(achievements.id, id))
    } catch (error) {
        console.error('Error in deleteAchievement:', error)
        throw error
    }
}

export async function deleteBlog(id: string) {
    try {
        await db.delete(blogs).where(eq(blogs.id, id))
    } catch (error) {
        console.error('Error in deleteBlog:', error)
        throw error
    }
}

export async function deleteEvent(id: string) {
    try {
        await db.delete(events).where(eq(events.id, id))
    } catch (error) {
        console.error('Error in deleteEvent:', error)
        throw error
    }
}

export async function deleteLeaderboardEntry(id: string) {
    try {
        await db.delete(leaderboard).where(eq(leaderboard.id, id))
    } catch (error) {
        console.error('Error in deleteLeaderboardEntry:', error)
        throw error
    }
}

export async function deleteUpcomingEvent(id: string) {
    try {
        await db.delete(upcomingEvents).where(eq(upcomingEvents.id, id))
    } catch (error) {
        console.error('Error in deleteUpcomingEvent:', error)
        throw error
    }
}

export async function deleteLeaderboardUser(id: string) {
    try {
        await db.delete(leaderboardUsers).where(eq(leaderboardUsers.id, id))
    } catch (error) {
        console.error('Error in deleteLeaderboardUser:', error)
        throw error
    }
}

// ----------------- Votes (Ship-It) -----------------
async function getClientIP(): Promise<string | null> {
    try {
        const headersList = await headers()
        // Try various headers that might contain the IP
        const forwarded = headersList.get('x-forwarded-for')
        const realIP = headersList.get('x-real-ip')
        const cfConnectingIP = headersList.get('cf-connecting-ip')

        if (forwarded) {
            return forwarded.split(',')[0].trim()
        }
        if (realIP) {
            return realIP
        }
        if (cfConnectingIP) {
            return cfConnectingIP
        }
        return null
    } catch {
        return null
    }
}

async function getUserAgent(): Promise<string | null> {
    try {
        const headersList = await headers()
        return headersList.get('user-agent')
    } catch {
        return null
    }
}

export async function addVote(projectId: string) {
    try {
        const ipAddress = await getClientIP()
        const userAgent = await getUserAgent()

        await db.insert(votes).values({
            projectId,
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
        })
    } catch (error) {
        // If duplicate vote (same IP + project), silently fail or handle gracefully
        console.error('Error in addVote:', error)
        throw error
    }
}

export async function removeVote(projectId: string) {
    try {
        const ipAddress = await getClientIP()

        if (ipAddress) {
            await db
                .delete(votes)
                .where(
                    and(
                        eq(votes.projectId, projectId),
                        eq(votes.ipAddress, ipAddress)
                    )
                )
        } else {
            // If no IP, try to delete any vote for this project (less secure but works)
            await db.delete(votes).where(eq(votes.projectId, projectId))
        }
    } catch (error) {
        console.error('Error in removeVote:', error)
        throw error
    }
}

// ----------------- Tournament -----------------
export async function addTournamentContest(contest: NewTournamentContest) {
    try {
        await db.insert(tournamentContests).values(contest)
    } catch (error) {
        console.error('Error in addTournamentContest:', error)
        throw error
    }
}

export async function deleteTournamentContest(id: string) {
    try {
        await db.delete(tournamentContests).where(eq(tournamentContests.id, id))
    } catch (error) {
        console.error('Error in deleteTournamentContest:', error)
        throw error
    }
}

export async function addTournamentParticipant(
    participant: NewTournamentParticipant
) {
    try {
        await db.insert(tournamentParticipants).values(participant)
    } catch (error) {
        console.error('Error in addTournamentParticipant:', error)
        throw error
    }
}

export async function updateTournamentParticipant(
    id: string,
    updates: Partial<TournamentParticipant>
) {
    try {
        return await db
            .update(tournamentParticipants)
            .set(updates)
            .where(eq(tournamentParticipants.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateTournamentParticipant:', error)
        throw error
    }
}

export async function deleteTournamentParticipant(id: string) {
    try {
        await db
            .delete(tournamentParticipants)
            .where(eq(tournamentParticipants.id, id))
    } catch (error) {
        console.error('Error in deleteTournamentParticipant:', error)
        throw error
    }
}

export async function addTournamentScore(score: NewTournamentScore) {
    try {
        await db.insert(tournamentScores).values(score)
    } catch (error) {
        console.error('Error in addTournamentScore:', error)
        throw error
    }
}

export async function updateTournamentScore(id: string, points: number) {
    try {
        return await db
            .update(tournamentScores)
            .set({ points })
            .where(eq(tournamentScores.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateTournamentScore:', error)
        throw error
    }
}

export async function deleteTournamentScore(id: string) {
    try {
        await db.delete(tournamentScores).where(eq(tournamentScores.id, id))
    } catch (error) {
        console.error('Error in deleteTournamentScore:', error)
        throw error
    }
}
