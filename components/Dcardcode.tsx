'use client'

import React from 'react'
import Image from 'next/image'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { Github } from 'lucide-react'

export function Dcardcode({
    author,
    title,
    description,
    imgUrl,
    liveUrl,
    github_url,
}: {
    author?: string
    title?: string
    description?: string
    imgUrl?: string
    liveUrl?: string
    github_url?: string
}) {
    return (
        <CardContainer className="inter-var w-full">
            <CardBody className="group/card relative min-h-[28rem] w-full rounded-xl border border-white/[0.2] bg-black p-4 hover:shadow-2xl hover:shadow-emerald-500/[0.1] sm:p-6">
                <CardItem
                    translateZ="70"
                    className="text-lg font-bold text-white sm:text-xl"
                >
                    <div className="flex flex-col gap-1">
                        <span className="truncate">{title}</span>
                        <span className="text-sm text-gray-400">
                            by {author}
                        </span>
                    </div>
                </CardItem>

                <CardItem
                    as="p"
                    translateZ="50"
                    className="mt-6 line-clamp-2 text-sm text-neutral-200/85"
                >
                    {description}
                </CardItem>

                <CardItem translateZ="70" className="mt-4 w-full">
                    {imgUrl && (
                        <Image
                            src={imgUrl}
                            height={500}
                            width={500}
                            className="h-40 w-full rounded-xl object-cover group-hover/card:shadow-xl sm:h-48"
                            alt="thumbnail"
                            quality={85}
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    )}
                </CardItem>

                <div className="mt-4 flex items-center justify-between sm:mt-8">
                    <CardItem
                        translateZ="30"
                        as="a"
                        href={github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:text-md hover:text-primary text-primary flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium sm:px-4 xl:text-white"
                    >
                        <Github size={18} />
                        Source Code
                    </CardItem>

                    {liveUrl && (
                        <CardItem
                            translateZ="30"
                            as="a"
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sm:text-md hover:text-primary text-primary rounded-xl bg-gradient-to-r from-white to-gray-200 px-3 py-2 text-sm font-semibold shadow-md sm:px-4 xl:text-black"
                        >
                            Live Demo →
                        </CardItem>
                    )}
                </div>
            </CardBody>
        </CardContainer>
    )
}
