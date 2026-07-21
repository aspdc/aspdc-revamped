/**
 * Re-evaluate all lab profiles using the latest analysis engine.
 *
 * Reads every row in `lab_profiles`, re-runs `runAnalysisPipeline` on the
 * stored `githubSnapshot`, and updates `characterId`, `characterSimilarity`,
 * `developerScore`, `traitScores`, and achievements in-place.
 *
 * Usage:
 *   npx tsx db/reval-all.ts              # live run
 *   npx tsx db/reval-all.ts --dry-run    # preview without writing
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

async function main() {
    // Dynamic imports — dotenv must load BEFORE drizzle reads DATABASE_URL
    const { eq } = await import('drizzle-orm')
    const { db } = await import('./drizzle')
    const { labProfiles, labAchievements } = await import('./schema')
    const { runAnalysisPipeline } = await import('@/lib/lab/analyze')
    type GitHubSnapshot = import('@/lib/lab/types').GitHubSnapshot

    function isGitHubSnapshot(value: unknown): value is GitHubSnapshot {
        if (!value || typeof value !== 'object') return false
        const v = value as Record<string, unknown>
        return (
            typeof v.login === 'string' &&
            typeof v.accountCreatedAt === 'string' &&
            typeof v.followers === 'number' &&
            typeof v.following === 'number' &&
            typeof v.publicRepos === 'number' &&
            Array.isArray(v.repos) &&
            Array.isArray(v.events)
        )
    }

    const DRY_RUN = process.argv.includes('--dry-run')

    console.log(
        DRY_RUN
            ? '\n🔍 DRY RUN — no database writes will be made.\n'
            : '\n🚀 LIVE RUN — updating all lab profiles.\n'
    )

    const rows = await db.select().from(labProfiles)
    console.log(`Found ${rows.length} lab profile(s) to re-evaluate.\n`)

    let updated = 0
    let skipped = 0
    let errored = 0

    for (const row of rows) {
        const label = `${row.githubUsername} (${row.id})`

        // Extract the snapshot from the persisted JSONB.
        // The persisted shape is { capturedAt, snapshot } — unwrap it.
        const persisted = row.githubSnapshot as Record<string, unknown>
        const snapshot = persisted.snapshot ?? persisted

        if (!isGitHubSnapshot(snapshot)) {
            console.log(`  ⚠️  ${label}: invalid snapshot shape — skipping`)
            skipped++
            continue
        }

        try {
            const analysis = runAnalysisPipeline(snapshot)

            const changed =
                row.characterId !== analysis.characterId ||
                row.developerScore !== analysis.developerScore

            const charChanged =
                row.characterId !== analysis.characterId
                    ? ` (${row.characterId} → ${analysis.characterId})`
                    : ''
            const scoreChanged =
                row.developerScore !== analysis.developerScore
                    ? ` score ${row.developerScore} → ${analysis.developerScore}`
                    : ''

            console.log(
                `  ${changed ? '✏️ ' : '✅'} ${label}${charChanged}${scoreChanged}`
            )

            if (!DRY_RUN) {
                await db
                    .update(labProfiles)
                    .set({
                        characterId: analysis.characterId,
                        characterSimilarity: analysis.characterSimilarity,
                        developerScore: analysis.developerScore,
                        traitScores: analysis.traitScores,
                    })
                    .where(eq(labProfiles.id, row.id))

                // Re-compute achievements
                await db
                    .delete(labAchievements)
                    .where(eq(labAchievements.profileId, row.id))

                if (analysis.achievements.length > 0) {
                    await db.insert(labAchievements).values(
                        analysis.achievements.map((a) => ({
                            profileId: row.id,
                            achievementId: a.id,
                            unlockedAt: row.analyzedAt,
                        }))
                    )
                }
            }

            updated++
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error)
            console.log(`  ❌ ${label}: ${msg}`)
            errored++
        }
    }

    console.log(`\n--- Summary ---`)
    console.log(`  Updated:  ${updated}`)
    console.log(`  Skipped:  ${skipped}`)
    console.log(`  Errored:  ${errored}`)
    console.log(`  Total:    ${rows.length}`)
    if (DRY_RUN) {
        console.log(`\n  Re-run without --dry-run to apply changes.\n`)
    } else {
        console.log(`\n  ✅ Done.\n`)
    }
}

main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
})
