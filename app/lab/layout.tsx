export default function LabLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <div className="bg-background min-h-dvh">{children}</div>
}
