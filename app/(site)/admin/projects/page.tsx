import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchProjects } from '@/db/queries'
import ProjectsAdminClient from './client'
import { Suspense } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

async function ProjectsContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const projects = await fetchProjects()

    return <ProjectsAdminClient initialData={projects} />
}

export default async function ProjectsAdminPage() {
    return (
        <Suspense
            fallback={
                <Card>
                    <CardHeader>
                        <CardTitle>Loading Projects...</CardTitle>
                        <CardDescription>
                            Please wait while we fetch the data.
                        </CardDescription>
                    </CardHeader>
                </Card>
            }
        >
            <ProjectsContent />
        </Suspense>
    )
}
