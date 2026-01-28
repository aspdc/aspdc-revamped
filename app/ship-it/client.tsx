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
import { Github, Heart, ExternalLink, Play, Info } from 'lucide-react'
import { addVote, removeVote } from '@/db/mutations'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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
    const router = useRouter()
    const [projects, setProjects] = useState(initialProjects)
    const [votedProjects, setVotedProjects] = useState<Set<string>>(new Set())
    const [isVoting, setIsVoting] = useState<string | null>(null)

    // Load voted projects from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const votes = JSON.parse(stored) as string[]
                setVotedProjects(new Set(votes))
            } catch (error) {
                console.error('Error parsing stored votes:', error)
            }
        }
    }, [])

    const handleVote = async (projectId: string) => {
        if (isVoting) return

        const isVoted = votedProjects.has(projectId)

        if (isVoted) {
            // Remove vote
            setIsVoting(projectId)
            try {
                // Get IP address from headers (will be handled server-side)
                await removeVote(projectId)

                const newVotedProjects = new Set(votedProjects)
                newVotedProjects.delete(projectId)
                setVotedProjects(newVotedProjects)
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(Array.from(newVotedProjects))
                )

                // Update vote count locally
                setProjects((prev) =>
                    prev.map((p) =>
                        p.id === projectId
                            ? { ...p, voteCount: Math.max(0, p.voteCount - 1) }
                            : p
                    )
                )

                toast.success('Vote removed')
                router.refresh()
            } catch (error) {
                console.error('Error removing vote:', error)
                toast.error('Failed to remove vote')
            } finally {
                setIsVoting(null)
            }
        } else {
            // Add vote
            if (votedProjects.size >= MAX_VOTES) {
                toast.error(`You can only vote for ${MAX_VOTES} projects`)
                return
            }

            setIsVoting(projectId)
            try {
                await addVote(projectId)

                const newVotedProjects = new Set(votedProjects)
                newVotedProjects.add(projectId)
                setVotedProjects(newVotedProjects)
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(Array.from(newVotedProjects))
                )

                // Update vote count locally
                setProjects((prev) =>
                    prev.map((p) =>
                        p.id === projectId
                            ? { ...p, voteCount: p.voteCount + 1 }
                            : p
                    )
                )

                toast.success('Vote added!')
                router.refresh()
            } catch (error) {
                console.error('Error adding vote:', error)
                toast.error('Failed to add vote')
            } finally {
                setIsVoting(null)
            }
        }
    }

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

    const votesRemaining = MAX_VOTES - votedProjects.size

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Your Votes
                        </h3>
                        <p className="text-sm text-neutral-400">
                            {votedProjects.size} of {MAX_VOTES} votes used
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">
                            {votesRemaining}
                        </div>
                        <div className="text-xs text-neutral-400">
                            {votesRemaining === 1 ? 'vote' : 'votes'} remaining
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => {
                    const isVoted = votedProjects.has(project.id)
                    const canVote = votedProjects.size < MAX_VOTES || isVoted

                    return (
                        <CardContainer
                            key={project.id}
                            className="inter-var w-full"
                        >
                            <CardBody className="group/card relative min-h-[32rem] w-full overflow-hidden rounded-xl border border-white/[0.2] bg-black p-4 hover:shadow-2xl hover:shadow-emerald-500/[0.1] sm:p-6">
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
                                            as="button"
                                            onClick={() =>
                                                handleVote(project.id)
                                            }
                                            disabled={
                                                !canVote ||
                                                isVoting === project.id
                                            }
                                            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 ${
                                                isVoted
                                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                    : canVote
                                                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                      : 'cursor-not-allowed bg-neutral-800/50 text-neutral-500'
                                            }`}
                                        >
                                            <Heart
                                                size={18}
                                                className={
                                                    isVoted
                                                        ? 'fill-current'
                                                        : ''
                                                }
                                            />
                                            <span className="truncate">
                                                {isVoted ? 'Unvote' : 'Vote'} (
                                                {project.voteCount})
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
