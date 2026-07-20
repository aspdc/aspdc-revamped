import React, { Suspense } from 'react'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { getVoteCounts } from '@/db/queries'
import projectsData from './projects.json'
import ShipItClient from './client'

// Generate unique ID for each project
// Using index ensures React keys are unique, even if there are duplicate entries
function generateProjectId(
    name: string,
    projectName: string,
    index: number
): string {
    // Include index to ensure uniqueness for React keys
    return `${name}|${projectName}|${index}`
}

// Add IDs to projects with index to ensure uniqueness for React keys
const projectsWithIds = projectsData.map((project, index) => ({
    ...project,
    id: generateProjectId(project.name, project.projectName, index),
    // Store original index for reference
    originalIndex: index,
}))

async function ShipItContent() {
    const voteCounts = await getVoteCounts()

    // Merge vote counts with projects
    const projectsWithVotes = projectsWithIds.map((project) => ({
        ...project,
        voteCount: voteCounts[project.id] || 0,
    }))

    // Helper function to check if project has a valid image
    function hasValidImage(projectImageUrl: string | null): boolean {
        if (!projectImageUrl || projectImageUrl === 'N/A') return false
        // Check if it's a Google Drive folder link (not a direct image)
        if (projectImageUrl.includes('drive.google.com/drive/folders')) {
            return false
        }
        return true
    }

    // Sort: first by vote count (descending), then by image presence (projects with images first)
    const sortedProjects = [...projectsWithVotes].sort((a, b) => {
        // First sort by vote count
        if (b.voteCount !== a.voteCount) {
            return b.voteCount - a.voteCount
        }
        // Then sort by image presence (projects with images come first)
        const aHasImage = hasValidImage(a.projectImageUrl)
        const bHasImage = hasValidImage(b.projectImageUrl)
        if (aHasImage && !bHasImage) return -1
        if (!aHasImage && bHasImage) return 1
        return 0
    })

    return (
        <ShipItClient
            initialProjects={sortedProjects}
            initialVoteCounts={voteCounts}
        />
    )
}

export default async function ShipItPage() {
    return (
        <main className="mx-auto min-h-screen max-w-7xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <div className="mb-8 md:mb-16">
                <TextScramble className="text-primary mb-4 text-2xl font-bold uppercase md:text-4xl">
                    Ship It Voting
                </TextScramble>
                <p className="text-neutral-400">
                    Vote for your favorite projects! You can vote for up to 2
                    projects.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="flex items-center justify-center py-12">
                        <div className="text-muted-foreground text-center">
                            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                            <p className="text-neutral-400">
                                Loading projects...
                            </p>
                        </div>
                    </div>
                }
            >
                <ShipItContent />
            </Suspense>
        </main>
    )
}
