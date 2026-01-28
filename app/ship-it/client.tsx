'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Github, ExternalLink, Play, Info, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'

const STORAGE_KEY = 'shipit-votes'
const MAX_VOTES = 2

interface Project {
    id: string
    name: string
    projectName: string
    shortProjectDescription: string
    gitHubRepositoryUrl: string
    liveProjectUrl: string | null
    projectImageUrl: string | null
    videoExplanationUrl: string | null
    voteCount: number
}

interface ShipItClientProps {
    initialProjects: Project[]
    initialVoteCounts: Record<string, number>
}

export default function ShipItClient({
    initialProjects,
    initialVoteCounts,
}: ShipItClientProps) {
    const [projects, setProjects] = useState(initialProjects)

    const getImageUrl = (url: string | null): string | undefined => {
        if (!url || url === 'N/A') return undefined
        // Handle Google Drive links - they need special handling
        if (url.includes('drive.google.com')) {
            // Extract file ID and convert to direct image link
            const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
            if (fileIdMatch) {
                return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`
            }
            // For folder links, return undefined
            return undefined
        }
        return url
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => {
                    // Determine rank (top 3)
                    const rank =
                        index === 0
                            ? 1
                            : index === 1
                              ? 2
                              : index === 2
                                ? 3
                                : null

                    const getRankBadgeColor = (rankNum: number | null) => {
                        switch (rankNum) {
                            case 1:
                                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            case 2:
                                return 'bg-gray-400/20 text-gray-300 border-gray-400/30'
                            case 3:
                                return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                            default:
                                return ''
                        }
                    }

                    const getRankLabel = (rankNum: number | null) => {
                        switch (rankNum) {
                            case 1:
                                return '🥇 1st Place'
                            case 2:
                                return '🥈 2nd Place'
                            case 3:
                                return '🥉 3rd Place'
                            default:
                                return ''
                        }
                    }

                    return (
                        <CardContainer
                            key={project.id}
                            className="inter-var w-full"
                        >
                            <CardBody className="group/card relative min-h-[32rem] w-full overflow-hidden rounded-xl border border-white/[0.2] bg-black p-4 hover:shadow-2xl hover:shadow-emerald-500/[0.1] sm:p-6">
                                {rank && (
                                    <CardItem
                                        translateZ="80"
                                        className={`absolute top-4 right-4 rounded-lg border px-3 py-1 text-xs font-bold ${getRankBadgeColor(rank)}`}
                                    >
                                        {getRankLabel(rank)}
                                    </CardItem>
                                )}
                                <CardItem
                                    translateZ="70"
                                    className="text-lg font-bold text-white sm:text-xl"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="truncate">
                                            {project.projectName}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            by {project.name}
                                        </span>
                                    </div>
                                </CardItem>

                                <CardItem translateZ="50" className="mt-4">
                                    <p className="line-clamp-3 text-sm text-neutral-200/85">
                                        {project.shortProjectDescription}
                                    </p>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="mt-2 flex items-center gap-1 text-xs text-emerald-400 transition-colors hover:text-emerald-300">
                                                <Info size={14} />
                                                Read full description
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl">
                                                    {project.projectName}
                                                </DialogTitle>
                                                <DialogDescription className="text-neutral-400">
                                                    by {project.name}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-4">
                                                <p className="leading-relaxed text-neutral-200">
                                                    {
                                                        project.shortProjectDescription
                                                    }
                                                </p>
                                            </div>
                                            <div className="mt-6 flex flex-wrap gap-2">
                                                <a
                                                    href={
                                                        project.gitHubRepositoryUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-700"
                                                >
                                                    <Github size={16} />
                                                    View on GitHub
                                                </a>
                                                {project.liveProjectUrl && (
                                                    <a
                                                        href={
                                                            project.liveProjectUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white transition-colors hover:bg-emerald-700"
                                                    >
                                                        <ExternalLink
                                                            size={16}
                                                        />
                                                        Live Demo
                                                    </a>
                                                )}
                                                {project.videoExplanationUrl && (
                                                    <a
                                                        href={
                                                            project.videoExplanationUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                                                    >
                                                        <Play size={16} />
                                                        Watch Video
                                                    </a>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardItem>

                                <CardItem
                                    translateZ="70"
                                    className="mt-4 w-full"
                                >
                                    {getImageUrl(project.projectImageUrl) ? (
                                        <Image
                                            src={getImageUrl(
                                                project.projectImageUrl
                                            )}
                                            height={500}
                                            width={500}
                                            className="h-40 w-full rounded-xl object-cover group-hover/card:shadow-xl sm:h-48"
                                            alt={project.projectName}
                                            quality={85}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <div className="flex h-40 w-full items-center justify-center rounded-xl bg-neutral-800/50 sm:h-48">
                                            <span className="text-neutral-500">
                                                No image
                                            </span>
                                        </div>
                                    )}
                                </CardItem>

                                <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:justify-between">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <CardItem
                                            translateZ="30"
                                            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-3 py-2 text-sm font-medium whitespace-nowrap text-emerald-400 sm:px-4"
                                        >
                                            <ThumbsUp
                                                size={18}
                                                className="shrink-0"
                                            />
                                            <span className="truncate">
                                                {project.voteCount}{' '}
                                                {project.voteCount === 1
                                                    ? 'vote'
                                                    : 'votes'}
                                            </span>
                                        </CardItem>

                                        {project.videoExplanationUrl && (
                                            <CardItem translateZ="30">
                                                <a
                                                    href={
                                                        project.videoExplanationUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-600/20 px-3 py-2 text-sm font-medium whitespace-nowrap text-blue-400 transition-all hover:bg-blue-600/30 hover:text-blue-300 sm:px-4"
                                                >
                                                    <Play
                                                        size={18}
                                                        className="shrink-0 fill-current"
                                                    />
                                                    <span className="hidden truncate sm:inline">
                                                        Watch Video
                                                    </span>
                                                </a>
                                            </CardItem>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <CardItem
                                            translateZ="30"
                                            as="a"
                                            href={project.gitHubRepositoryUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-primary text-primary flex shrink-0 cursor-pointer items-center gap-1 rounded-xl px-2 py-2 text-sm font-medium sm:px-3 xl:text-white"
                                        >
                                            <Github size={16} />
                                        </CardItem>

                                        {project.liveProjectUrl && (
                                            <CardItem
                                                translateZ="30"
                                                as="a"
                                                href={project.liveProjectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary text-primary flex shrink-0 cursor-pointer items-center gap-1 rounded-xl px-2 py-2 text-sm font-medium sm:px-3 xl:text-white"
                                            >
                                                <ExternalLink size={16} />
                                            </CardItem>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </CardContainer>
                    )
                })}
            </div>
        </div>
    )
}
