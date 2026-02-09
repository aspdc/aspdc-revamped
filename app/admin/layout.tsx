import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logoutAction } from './actions'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'

async function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const adminLinks = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/achievements', label: 'Achievements' },
        { href: '/admin/blogs', label: 'Blogs' },
        { href: '/admin/events', label: 'Events' },
        { href: '/admin/projects', label: 'Projects' },
        { href: '/admin/upcoming', label: 'Upcoming Events' },
        { href: '/admin/leaderboard', label: 'Leaderboard' },
        { href: '/admin/tournament', label: 'Tournament' },
    ]

    return (
        <div className="bg-background min-h-screen">
            <nav className="border-border bg-card border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <h1 className="text-lg font-semibold">Admin Panel</h1>
                        <div className="flex gap-2">
                            {adminLinks.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <Button variant="ghost" size="sm" asChild>
                                        <span>{link.label}</span>
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-muted-foreground text-sm">
                            {session.user.email}
                        </span>
                        <form action={logoutAction}>
                            <Button type="submit" variant="outline" size="sm">
                                Logout
                            </Button>
                        </form>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto px-4 py-8">
                <Analytics />
                {children}
            </main>
        </div>
    )
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Suspense
            fallback={
                <div className="bg-background min-h-screen">
                    <nav className="border-border bg-card border-b">
                        <div className="container mx-auto flex h-16 items-center justify-between px-4">
                            <h1 className="text-lg font-semibold">
                                Admin Panel
                            </h1>
                        </div>
                    </nav>
                    <main className="container mx-auto px-4 py-8">
                        <div>Loading...</div>
                    </main>
                </div>
            }
        >
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </Suspense>
    )
}
