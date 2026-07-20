import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { canAccessAdmin } from '@/lib/admin-access'

export async function proxy(request: NextRequest) {
    // Check if the route is under /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const requestHeaders = await headers()
        const session = await auth.api.getSession({
            headers: requestHeaders,
        })

        // THIS IS NOT SECURE!
        // This is the recommended approach to optimistically redirect users
        // We recommend handling auth checks in each page/route
        if (!session) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('from', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }

        const accounts = await auth.api.listUserAccounts({
            headers: requestHeaders,
        })

        if (!canAccessAdmin(accounts)) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'], // Specify the routes the proxy applies to
}
