import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import QueryProvider from '@/lib/query-provider'
import Navbar from '@/components/Navbar'
import DotGrid from '@/components/bits/DotGrid/DotGrid'
import Footer from '@/components/Footer'
import { ClerkProvider } from '@clerk/nextjs'

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'ASPDC',
    icons: '/Frame2.png',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider
            appearance={{
                elements: {
                    footer: 'hidden',
                },
            }}
        >
            <html lang="en">
                <head>
                    <link
                        rel="icon"
                        href="Frame2.png"
                        type="image/png"
                        sizes="any"
                    />
                    <link rel="apple-touch-icon" href="Frame2.png" />
                </head>
                <body
                    className={`${spaceGrotesk.className} secnone overflow-x-hidden antialiased`}
                >
                    <Toaster richColors position="top-right" />
                    <QueryProvider>
                        <div className="relative w-screen">
                            <div className="fixed inset-0 -z-10">
                                <DotGrid
                                    dotSize={10}
                                    baseColor="#111111"
                                    activeColor="#23C55E"
                                    className="h-full w-full"
                                />
                            </div>
                            <Navbar />
                        </div>
                        <div className="mt-9 sm:mt-0">{children}</div>
                        <Footer />
                    </QueryProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
