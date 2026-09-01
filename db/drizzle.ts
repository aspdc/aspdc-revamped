import { drizzle } from 'drizzle-orm/neon-http'

type DbInstance = ReturnType<typeof drizzle>

let _db: DbInstance | null = null

function getDb(): DbInstance {
    if (!_db) {
        if (!process.env.DATABASE_URL) {
            console.warn('DATABASE_URL is not set. Database queries will fail.')
        }
        _db = drizzle(process.env.DATABASE_URL!)
    }
    return _db
}

export const db = new Proxy({} as DbInstance, {
    get(_, prop) {
        return (getDb() as any)[prop]
    },
})
