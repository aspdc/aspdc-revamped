import { relations } from 'drizzle-orm'
import {
    pgTable,
    uuid,
    text,
    timestamp,
    integer,
    varchar,
    date,
    boolean,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core'

// Events table
export const events = pgTable('events', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    date: timestamp().notNull(),
    details: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    imageUrls: text().array().default([]),
})

// Projects table
export const projects = pgTable('projects', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    author: text().notNull(),
    description: text().notNull(),
    liveLink: text(),
    githubUrl: text(),
    createdAt: timestamp().defaultNow().notNull(),
    projectBannerUrl: varchar({ length: 255 }),
})

// Leaderboard table
export const leaderboard = pgTable('leaderboard', {
    id: uuid().defaultRandom().primaryKey(),
    rank: integer().notNull(),
    username: text().notNull(),
    rating: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
})

// Leaderboard Users table
export const leaderboardUsers = pgTable('leaderboard_users', {
    id: uuid().defaultRandom().primaryKey(),
    fullName: text('full_name').notNull(),
    codeforcesHandle: text('codeforces_handle').notNull(),
    leetcodeHandle: text('leetcode_handle'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Achievements table
export const achievements = pgTable('achievements', {
    id: uuid().defaultRandom().primaryKey(),
    title: text().notNull(),
    description: text().notNull(),
    date: date().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    imageUrl: varchar({ length: 255 }),
})

// Upcoming events table
export const upcomingEvents = pgTable('upcoming_events', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    date: timestamp().notNull(),
    description: text().notNull(),
    location: text(),
    registrationLink: text(),
    createdAt: timestamp().defaultNow().notNull(),
    eventImageUrl: varchar({ length: 255 }),
})

// Blogs table
export const blogs = pgTable('blogs', {
    id: uuid().defaultRandom().primaryKey(),
    title: text().notNull(),
    author: text().notNull(),
    link: text().notNull(),
    publishDate: timestamp().notNull(),
    coverImage: text(),
    createdAt: timestamp().defaultNow().notNull(),
})

// Certificates table
export const certificates = pgTable('certificates', {
    id: uuid().defaultRandom().primaryKey(),
    token: text().notNull(),
    participantName: text().notNull(),
    eventName: text().notNull(),
    eventDate: timestamp().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
})

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})

export const session = pgTable(
    'session',
    {
        id: text('id').primaryKey(),
        expiresAt: timestamp('expires_at').notNull(),
        token: text('token').notNull().unique(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
    },
    (table) => [index('session_userId_idx').on(table.userId)]
)

export const account = pgTable(
    'account',
    {
        id: text('id').primaryKey(),
        accountId: text('account_id').notNull(),
        providerId: text('provider_id').notNull(),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        accessToken: text('access_token'),
        refreshToken: text('refresh_token'),
        idToken: text('id_token'),
        accessTokenExpiresAt: timestamp('access_token_expires_at'),
        refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
        scope: text('scope'),
        password: text('password'),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index('account_userId_idx').on(table.userId)]
)

export const verification = pgTable(
    'verification',
    {
        id: text('id').primaryKey(),
        identifier: text('identifier').notNull(),
        value: text('value').notNull(),
        expiresAt: timestamp('expires_at').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index('verification_identifier_idx').on(table.identifier)]
)

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}))

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}))

// Votes table for Ship-It voting
export const votes = pgTable(
    'votes',
    {
        id: uuid().defaultRandom().primaryKey(),
        projectId: text('project_id').notNull(), // Unique identifier from JSON (name + projectName)
        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => [
        index('votes_projectId_idx').on(table.projectId),
        index('votes_ipAddress_idx').on(table.ipAddress),
        // Prevent duplicate votes from same IP for same project
        uniqueIndex('votes_projectId_ipAddress_idx').on(
            table.projectId,
            table.ipAddress
        ),
    ]
)

// Tournament Contests
export const tournamentContests = pgTable('tournament_contests', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Tournament Participants
export const tournamentParticipants = pgTable('tournament_participants', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    codeforcesHandle: text('codeforces_handle').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Tournament Scores (junction table)
export const tournamentScores = pgTable(
    'tournament_scores',
    {
        id: uuid().defaultRandom().primaryKey(),
        participantId: uuid('participant_id')
            .notNull()
            .references(() => tournamentParticipants.id, {
                onDelete: 'cascade',
            }),
        contestId: uuid('contest_id')
            .notNull()
            .references(() => tournamentContests.id, { onDelete: 'cascade' }),
        points: integer().notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    },
    (table) => [
        index('tournament_scores_participantId_idx').on(table.participantId),
        index('tournament_scores_contestId_idx').on(table.contestId),
    ]
)

// Tournament Relations
export const tournamentParticipantRelations = relations(
    tournamentParticipants,
    ({ many }) => ({
        scores: many(tournamentScores),
    })
)

export const tournamentContestRelations = relations(
    tournamentContests,
    ({ many }) => ({
        scores: many(tournamentScores),
    })
)

export const tournamentScoreRelations = relations(
    tournamentScores,
    ({ one }) => ({
        participant: one(tournamentParticipants, {
            fields: [tournamentScores.participantId],
            references: [tournamentParticipants.id],
        }),
        contest: one(tournamentContests, {
            fields: [tournamentScores.contestId],
            references: [tournamentContests.id],
        }),
    })
)
