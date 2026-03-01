import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 12
const MAX_LIMIT = 50
const UPSTREAM_TIMEOUT_MS = 25_000

export const maxDuration = 30

function parsePositiveInt(value: string | null, fallback: number) {
    if (!value) {
        return fallback
    }

    const parsed = Number.parseInt(value, 10)

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback
    }

    return parsed
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const page = parsePositiveInt(searchParams.get('page'), DEFAULT_PAGE)
    const limit = Math.min(
        parsePositiveInt(searchParams.get('limit'), DEFAULT_LIMIT),
        MAX_LIMIT
    )

    const upstreamParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    })
    const timeoutController = new AbortController()
    const timeout = setTimeout(
        () => timeoutController.abort(),
        UPSTREAM_TIMEOUT_MS
    )

    try {
        const upstreamResponse = await fetch(
            `https://unistop-backend.vercel.app/api/events?${upstreamParams.toString()}`,
            {
                headers: {
                    Accept: 'application/json',
                },
                cache: 'no-store',
                signal: timeoutController.signal,
            }
        )

        if (!upstreamResponse.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch Unistop events' },
                { status: upstreamResponse.status }
            )
        }

        const payload = await upstreamResponse.json()
        return NextResponse.json(payload)
    } catch {
        return NextResponse.json(
            { error: 'Unable to reach Unistop events service' },
            { status: 502 }
        )
    } finally {
        clearTimeout(timeout)
    }
}
