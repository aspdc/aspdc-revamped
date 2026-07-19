'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logoutAction() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        await auth.api.signOut({
            headers: await headers(),
        })
    }

    redirect('/login')
}
