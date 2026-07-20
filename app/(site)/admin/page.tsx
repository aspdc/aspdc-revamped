import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    fetchAchievements,
    fetchBlogs,
    fetchEvents,
    fetchLeaderboardUsers,
    fetchProjects,
    fetchUpcomingEvents,
} from '@/db/queries'
import { Suspense } from 'react'

async function DashboardContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    // Fetch counts for dashboard
    const [
        achievements,
        blogs,
        events,
        projects,
        upcomingEvents,
        leaderboardUsers,
    ] = await Promise.all([
        fetchAchievements(),
        fetchBlogs(),
        fetchEvents(),
        fetchProjects(),
        fetchUpcomingEvents(),
        fetchLeaderboardUsers(),
    ])

    const stats = [
        {
            label: 'Achievements',
            count: achievements.length,
            href: '/admin/achievements',
        },
        { label: 'Blogs', count: blogs.length, href: '/admin/blogs' },
        { label: 'Events', count: events.length, href: '/admin/events' },
        { label: 'Projects', count: projects.length, href: '/admin/projects' },
        {
            label: 'Upcoming Events',
            count: upcomingEvents.length,
            href: '/admin/upcoming',
        },
        {
            label: 'Leaderboard Users',
            count: leaderboardUsers.length,
            href: '/admin/leaderboard',
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your content and data
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader>
                            <CardTitle>{stat.label}</CardTitle>
                            <CardDescription>
                                Total: {stat.count} items
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <Link href={stat.href}>
                                    Manage {stat.label}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default async function AdminDashboard() {
    return (
        <Suspense
            fallback={
                <Card>
                    <CardHeader>
                        <CardTitle>Loading Dashboard...</CardTitle>
                        <CardDescription>
                            Please wait while we fetch the data.
                        </CardDescription>
                    </CardHeader>
                </Card>
            }
        >
            <DashboardContent />
        </Suspense>
    )
}
