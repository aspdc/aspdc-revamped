'use client'

import UpcomingEventsPage from '@/components/UpcomingEvents'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UpcomingEvent } from '@/db/types'
import {
    Calendar,
    ExternalLink,
    LoaderCircle,
    MapPin,
    RefreshCcw,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type UnistopEvent = {
    id: number
    created_at: string
    title: string
    description: string
    startDate: string | null
    endDate: string | null
    hostedBy: string
    type: string
    deadline: string | null
    verified: boolean
    tags: string[]
    redirectURL: string
}

type UnistopResponse = {
    data: UnistopEvent[]
    page: number
    limit: number
    total: number
    totalPages: number
}

const UNISTOP_LIMIT = 12
const VALID_TABS = ['aspdc', 'unistop'] as const

function getValidTab(tab: string | null): (typeof VALID_TABS)[number] {
    return VALID_TABS.includes(tab as (typeof VALID_TABS)[number])
        ? (tab as (typeof VALID_TABS)[number])
        : 'aspdc'
}

function UnistopEventsView() {
    const [events, setEvents] = useState<UnistopEvent[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    const safeTotalPages = useMemo(() => Math.max(totalPages, 1), [totalPages])

    useEffect(() => {
        const controller = new AbortController()

        const fetchUnistopEvents = async () => {
            setLoading(true)
            setError(null)

            try {
                const search = new URLSearchParams({
                    page: String(page),
                    limit: String(UNISTOP_LIMIT),
                })
                const response = await fetch(
                    `/api/unistop/events?${search.toString()}`,
                    {
                        signal: controller.signal,
                        cache: 'no-store',
                    }
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch Unistop events')
                }

                const payload = (await response.json()) as UnistopResponse
                setEvents(Array.isArray(payload.data) ? payload.data : [])
                setTotalPages(payload.totalPages || 1)
                setTotal(payload.total || 0)
            } catch (fetchError) {
                if (controller.signal.aborted) {
                    return
                }
                setError(
                    fetchError instanceof Error
                        ? fetchError.message
                        : 'Something went wrong while loading events'
                )
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchUnistopEvents()

        return () => controller.abort()
    }, [page, refreshKey])

    const handlePrevious = () => setPage((current) => Math.max(current - 1, 1))
    const handleNext = () =>
        setPage((current) => Math.min(current + 1, safeTotalPages))

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <LoaderCircle className="size-4 animate-spin" />
                    Loading Unistop events...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-10 text-center">
                <p className="text-destructive text-sm">{error}</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRefreshKey((current) => current + 1)}
                    className="gap-2"
                >
                    <RefreshCcw className="size-4" />
                    Try again
                </Button>
            </div>
        )
    }

    if (events.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                <span className="animate-bounce text-7xl">🛰️</span>
                <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                    No Unistop Events
                </h2>
                <p className="mt-2 text-neutral-400">
                    Check back later for new opportunities.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <p className="text-2xl font-bold">Unistop Events</p>
                <Link
                    href="https://unistop.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-800/60 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur-sm transition hover:border-white/20 hover:text-white"
                >
                    Visit Unistop <ExternalLink size={12} />
                </Link>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    Showing page {page} of {safeTotalPages} ({total} events)
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={page <= 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={page >= safeTotalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 text-neutral-200 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <article
                        key={event.id}
                        className="group hover:shadow-primary/30 hover:border-primary/40 relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/70 to-neutral-800/30 shadow-lg backdrop-blur-md"
                    >
                        <div className="relative flex flex-1 flex-col justify-between p-6">
                            <div>
                                <h2 className="text-primary mb-2 text-xl leading-tight font-extrabold md:text-2xl">
                                    {event.title}
                                </h2>
                            </div>

                            <div className="mt-6 space-y-2 text-sm text-neutral-300">
                                {event.deadline && (
                                    <div className="flex items-center gap-2">
                                        <Calendar
                                            size={16}
                                            className="text-primary shrink-0"
                                        />
                                        <span>
                                            Deadline:{' '}
                                            {new Date(
                                                event.deadline
                                            ).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <MapPin
                                        size={16}
                                        className="text-primary shrink-0"
                                    />
                                    <span>{event.hostedBy}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Link
                                    href={event.redirectURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-black shadow transition hover:scale-105 active:scale-95"
                                >
                                    Open Event <ExternalLink size={16} />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </div>
    )
}

export default function UpcomingEventsTabs({
    events,
}: {
    events: UpcomingEvent[]
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const tab = getValidTab(search)

    const handleTabChange = (value: string) => {
        const validTab = getValidTab(value)
        const params = new URLSearchParams(searchParams.toString())
        params.set('search', validTab)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-8">
                <TabsTrigger value="aspdc">ASPDC</TabsTrigger>
                <TabsTrigger value="unistop">Unistop</TabsTrigger>
            </TabsList>

            <TabsContent value="aspdc">
                <UpcomingEventsPage events={events} />
            </TabsContent>

            <TabsContent value="unistop">
                <UnistopEventsView />
            </TabsContent>
        </Tabs>
    )
}
