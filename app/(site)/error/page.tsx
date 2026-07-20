import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="bg-background flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardContent className="pt-6">
                    <div className="text-muted-foreground mb-4 font-mono text-6xl">
                        oops!
                    </div>
                    <h1 className="text-foreground mb-2 text-2xl font-semibold">
                        something went wrong
                    </h1>
                    <p className="text-muted-foreground mb-6 text-sm">
                        maybe retry ?
                    </p>
                    <div className="flex gap-2">
                        <Link href="/" className="flex-1">
                            <Button variant="ghost" className="cursor-pointer">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                return home{' '}
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
