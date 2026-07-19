import { and, eq } from 'drizzle-orm'
import { db } from '@/db/drizzle'
import { account } from '@/db/schema'

/**
 * Reads the GitHub OAuth access token for a user from the better-auth account table.
 */
export async function getGitHubAccessToken(userId: string): Promise<string> {
    const [row] = await db
        .select({ accessToken: account.accessToken })
        .from(account)
        .where(
            and(eq(account.userId, userId), eq(account.providerId, 'github'))
        )
        .limit(1)

    if (!row?.accessToken) {
        throw new Error(
            `No GitHub access token found for user ${userId}. Sign in with GitHub and try again.`
        )
    }

    return row.accessToken
}
