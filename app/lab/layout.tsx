import { LabFooter } from '@/components/lab/lab-footer'

export default function LabLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="bg-background flex min-h-dvh flex-col justify-between">
            <div className="flex-1">{children}</div>
            <LabFooter />
        </div>
    )
}
