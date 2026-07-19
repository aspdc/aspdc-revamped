import React from 'react'
import { Dcardcode } from '@/components/Dcardcode'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { Project } from '@/db/types'
import { fetchProjects } from '@/db/queries'

const Projects = async () => {
    const projects: Project[] = await fetchProjects()

    if (projects.length === 0)
        return (
            <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
                <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                    Achievements
                </TextScramble>
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                    <span className="animate-bounce text-7xl">💡</span>
                    <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                        No Projects Yet
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Innovation takes time — your projects will appear here
                        soon!
                    </p>
                </div>
            </main>
        )

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
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
