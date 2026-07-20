// app/verify/page.tsx
import { db } from '@/db/drizzle'
import { certificates } from '@/db/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Suspense } from 'react'

type Params = Promise<{
    token: string
}>

// Return a placeholder token for build-time validation with cacheComponents
// This satisfies the requirement while keeping the route dynamic at runtime
export async function generateStaticParams() {
    return [{ token: 'build-validation-token' }]
}

async function VerifyContent({ params }: { params: Params }) {
    const { token } = await params

    if (!token) {
        return (
            <Card className="border-border bg-card text-card-foreground min-h-48">
                <CardHeader>
                    <CardTitle>Certificate Verification</CardTitle>
                    <CardDescription className="text-destructive">
                        Missing token. Please use a valid verification link.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    // Hash the token with SHA-256
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Find certificate by hashed token
    const [record] = await db
        .select()
        .from(certificates)
        .where(eq(certificates.token, tokenHash))
        .limit(1)

    if (!record) {
        return (
            <Card className="border-border bg-card text-card-foreground min-h-48">
                <CardHeader>
                    <CardTitle>Certificate Verification</CardTitle>
                    <CardDescription className="text-destructive">
                        Invalid or forged certificate. No matching record was
                        found.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="border-border bg-card text-card-foreground min-h-48">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                    <CardTitle className="text-2xl">
                        Certificate Verified
                    </CardTitle>
                    <CardDescription>
                        The certificate details match a valid record in our
                        system.
                    </CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0 self-center">
                    Valid
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="text-muted-foreground text-sm sm:col-span-1">
                        Participant
                    </div>
                    <div className="text-foreground text-sm font-medium sm:col-span-2">
                        {record.participantName}
                    </div>

                    <div className="text-muted-foreground text-sm sm:col-span-1">
                        Event
                    </div>
                    <div className="text-foreground text-sm font-medium sm:col-span-2">
                        {record.eventName}
                    </div>

                    <div className="text-muted-foreground text-sm sm:col-span-1">
                        Date
                    </div>
                    <div className="text-foreground text-sm font-medium sm:col-span-2">
                        {record.eventDate.toLocaleDateString()}
                    </div>
                </div>
                <p className="text-muted-foreground text-sm">
                    If the name on the printed certificate does not exactly
                    match the participant listed above, treat the document as
                    forged.
                </p>
            </CardContent>
        </Card>
    )
}

export default async function VerifyPage({ params }: { params: Params }) {
    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <Suspense
                fallback={
                    <Card className="border-border bg-card text-card-foreground min-h-48">
                        <CardHeader>
                            <CardTitle>Certificate Verification</CardTitle>
                            <CardDescription>
                                Verifying certificate...
                            </CardDescription>
                        </CardHeader>
                    </Card>
                }
            >
                <VerifyContent params={params} />
            </Suspense>
        </main>
    )
}
