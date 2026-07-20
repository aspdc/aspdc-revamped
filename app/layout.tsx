import type { Metadata } from 'next'
import { Space_Grotesk, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
    variable: '--font-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'ASPDC',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${spaceGrotesk.variable} ${geistMono.variable} overflow-x-hidden font-sans antialiased select-none`}
            >
                <Toaster richColors position="top-right" />
                {children}
            </body>
        </html>
    )
}
