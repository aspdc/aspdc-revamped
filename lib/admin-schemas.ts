import { z } from 'zod'

// Achievement schemas
export const achievementSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    date: z.string().or(z.date()),
    imageUrl: z.string().url().optional().or(z.literal('')),
})

export const achievementUpdateSchema = achievementSchema.partial()

// Blog schemas
export const blogSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    link: z.string().url('Must be a valid URL'),
    publishDate: z.string().or(z.date()),
    coverImage: z.string().url().optional().or(z.literal('')),
})

export const blogUpdateSchema = blogSchema.partial()

// Event schemas
export const eventSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    date: z.union([z.string(), z.date()]),
    details: z.string().min(1, 'Details are required'),
    imageUrls: z.array(z.string().url()).optional().default([]),
})

export const eventUpdateSchema = eventSchema.partial()

// Project schemas
export const projectSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    author: z.string().min(1, 'Author is required'),
    description: z.string().min(1, 'Description is required'),
    liveLink: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    projectBannerUrl: z.string().url().optional().or(z.literal('')),
})

export const projectUpdateSchema = projectSchema.partial()

// Upcoming Event schemas
export const upcomingEventSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    date: z.string().or(z.date()),
    description: z.string().min(1, 'Description is required'),
    location: z.string().optional().or(z.literal('')),
    registrationLink: z.string().url().optional().or(z.literal('')),
    eventImageUrl: z.string().url().optional().or(z.literal('')),
})

export const upcomingEventUpdateSchema = upcomingEventSchema.partial()

// Leaderboard schemas
export const leaderboardSchema = z.object({
    rank: z.number().int().positive('Rank must be a positive integer'),
    username: z.string().min(1, 'Username is required'),
    rating: z.number().int().min(0, 'Rating must be non-negative'),
})

export const leaderboardUpdateSchema = leaderboardSchema.partial()

// Leaderboard User schemas
export const leaderboardUserSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    codeforcesHandle: z.string().min(1, 'Codeforces handle is required'),
    leetcodeHandle: z.string().optional().or(z.literal('')),
})

export const leaderboardUserUpdateSchema = leaderboardUserSchema.partial()

// Tournament Contest schemas
export const tournamentContestSchema = z.object({
    name: z.string().min(1, 'Contest name is required'),
})

// Tournament Participant schemas
export const tournamentParticipantSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    codeforcesHandle: z.string().min(1, 'Codeforces handle is required'),
})

export const tournamentParticipantUpdateSchema =
    tournamentParticipantSchema.partial()

// Tournament Score schemas
export const tournamentScoreSchema = z.object({
    participantId: z.string().uuid('Invalid participant'),
    contestId: z.string().uuid('Invalid contest'),
    points: z.number().int().min(0, 'Points must be non-negative'),
})
