import React from 'react'
import { Dcardcode } from '@/components/Dcardcode'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { Project } from '@/db/types'
import { fetchProjects } from '@/db/queries'
import EmptyStateCard from '@/components/EmptyStateCard'

const Projects = async () => {
    const projects: Project[] = await fetchProjects()

    if (!projects || projects.length === 0) {
        return (
            <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-8 py-12 md:py-32 lg:px-0">
                <EmptyStateCard
                    emoji="🛠️"
                    heading="No Projects Found"
                    subtext="Stay tuned — new projects will appear here soon!"
                />
            </main>
        )
    }

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Projects Showcase
            </TextScramble>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                {projects.map((project) => (
                    <Dcardcode
                        key={project.id}
                        title={project.name}
                        author={project.author}
                        description={project.description}
                        imgUrl={project.projectBannerUrl ?? undefined}
                        github_url={project.githubUrl ?? undefined}
                        liveUrl={project.liveLink ?? undefined}
                    />
                ))}
            </div>
        </main>
    )
}

export default Projects
