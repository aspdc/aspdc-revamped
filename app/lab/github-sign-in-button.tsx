'use client'

import { useState } from 'react'
import { Github } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function GitHubSignInButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGitHubSignIn = async () => {
        setIsLoading(true)
        try {
            await authClient.signIn.social({
                provider: 'github',
                callbackURL: '/lab',
            })
        } catch (error) {
            toast.error('An error occurred during GitHub sign-in')
            console.error('GitHub sign-in error:', error)
            setIsLoading(false)
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={handleGitHubSignIn}
        >
            <Github className="mr-2 size-4" />
            {isLoading ? 'Redirecting...' : 'Sign in with GitHub'}
        </Button>
    )
}
