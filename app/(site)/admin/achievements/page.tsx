import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchAchievements } from '@/db/queries'
import AchievementsAdminClient from './client'
import { Suspense } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

async function AchievementsContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const achievements = await fetchAchievements()

    return <AchievementsAdminClient initialData={achievements} />
}

export default async function AchievementsAdminPage() {
    return (
        <Suspense
            fallback={
                <Card>
                    <CardHeader>
                        <CardTitle>Loading Achievements...</CardTitle>
                        <CardDescription>
                            Please wait while we fetch the data.
                        </CardDescription>
                    </CardHeader>
                </Card>
            }
        >
            <AchievementsContent />
        </Suspense>
    )
}
