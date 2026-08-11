import 'dotenv/config'
import readline from 'readline'
import crypto from 'crypto'
import { eq, and } from 'drizzle-orm'
import { hashPassword } from 'better-auth/crypto'
import { db } from '../db/drizzle'
import { user, account } from '../db/schema'

async function promptInput(query: string, isPassword = false): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise((resolve) => {
        if (isPassword && process.stdin.isTTY) {
            process.stdout.write(query)
            let input = ''
            process.stdin.setRawMode(true)
            process.stdin.resume()

            const onData = (char: Buffer) => {
                const str = char.toString('utf8')
                if (str === '\n' || str === '\r' || str === '\u0004') {
                    process.stdin.setRawMode(false)
                    process.stdin.pause()
                    process.stdin.removeListener('data', onData)
                    process.stdout.write('\n')
                    rl.close()
                    resolve(input.trim())
                } else if (str === '\u0003') {
                    process.exit(1)
                } else if (str === '\u007f' || str === '\b') {
                    if (input.length > 0) {
                        input = input.slice(0, -1)
                        process.stdout.write('\b \b')
                    }
                } else {
                    input += str
                    process.stdout.write('*')
                }
            }

            process.stdin.on('data', onData)
        } else {
            rl.question(query, (answer) => {
                rl.close()
                resolve(answer.trim())
            })
        }
    })
}

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error(
            'Error: DATABASE_URL environment variable is not set in .env file.'
        )
        process.exit(1)
    }

    const args = process.argv.slice(2)
    let email = args[0]
    let password = args[1]
    let name = args[2]

    if (!email) {
        email = await promptInput('Enter admin email address: ')
    }

    if (!password) {
        password = await promptInput('Enter admin password: ', true)
    }

    if (!email || !password) {
        console.error('Error: Email and password are required.')
        process.exit(1)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        console.error('Error: Invalid email format.')
        process.exit(1)
    }

    if (password.length < 6) {
        console.error('Error: Password must be at least 6 characters long.')
        process.exit(1)
    }

    const normalizedEmail = email.toLowerCase()

    if (!name) {
        const emailPrefix = normalizedEmail.split('@')[0]
        name = emailPrefix
            ? emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)
            : 'Admin'
    }

    console.log(`Processing admin user for: ${normalizedEmail}...`)

    const hashedPassword = await hashPassword(password)

    const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, normalizedEmail))

    let userId: string

    if (existingUser) {
        userId = existingUser.id
        console.log(`Found existing user with ID: ${userId}`)

        const [existingAccount] = await db
            .select()
            .from(account)
            .where(
                and(
                    eq(account.userId, userId),
                    eq(account.providerId, 'credential')
                )
            )

        if (existingAccount) {
            await db
                .update(account)
                .set({
                    password: hashedPassword,
                    updatedAt: new Date(),
                })
                .where(eq(account.id, existingAccount.id))

            console.log(
                `\x1b[32m%s\x1b[0m`,
                `✅ Successfully updated password for existing admin user (${normalizedEmail}).`
            )
        } else {
            const accountId = crypto.randomUUID()
            await db.insert(account).values({
                id: accountId,
                accountId: userId,
                providerId: 'credential',
                userId: userId,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            console.log(
                `\x1b[32m%s\x1b[0m`,
                `✅ Successfully added credential login to existing user (${normalizedEmail}).`
            )
        }
    } else {
        userId = crypto.randomUUID()
        const accountId = crypto.randomUUID()
        const now = new Date()

        await db.insert(user).values({
            id: userId,
            name: name,
            email: normalizedEmail,
            emailVerified: true,
            createdAt: now,
            updatedAt: now,
        })

        await db.insert(account).values({
            id: accountId,
            accountId: userId,
            providerId: 'credential',
            userId: userId,
            password: hashedPassword,
            createdAt: now,
            updatedAt: now,
        })

        console.log(
            `\x1b[32m%s\x1b[0m`,
            `✅ Successfully created admin user: ${normalizedEmail} (ID: ${userId}).`
        )
    }

    console.log(`You can now log in at /login using ${normalizedEmail}.`)
    process.exit(0)
}

main().catch((err) => {
    console.error('Failed to create admin user:', err)
    process.exit(1)
})
