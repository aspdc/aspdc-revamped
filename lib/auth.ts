import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db/drizzle' // your drizzle instance
import * as schema from '@/db/schema'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg', // or "mysql", "sqlite"
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
        disableSignUp: true, // Disable signup - only allow login with existing credentials
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
})
