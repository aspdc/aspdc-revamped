import AchievementsPage from '@/components/AchievementsClient'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { fetchAchievements } from '@/db/queries'
import { Achievement } from '@/db/types'
import React from 'react'

const page = async () => {
    const achievements: Achievement[] = await fetchAchievements()

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Achievements
            </TextScramble>
            <AchievementsPage ach={achievements} />
        </main>
    )
}

export default page
