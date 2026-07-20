'use client'

export function LabFooter() {
    return (
        <footer className="border-border bg-card/40 border-t px-4 py-8 text-center font-sans">
            <div className="text-muted-foreground mx-auto max-w-2xl text-sm">
                <p className="leading-relaxed lowercase">
                    hey there human sitting behind that screen staring at code
                    metrics i am{' '}
                    <a
                        href="https://github.com/ni3rav"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary font-mono underline"
                    >
                        ni3rav
                    </a>{' '}
                    a massive breaking bad fan who used agents to write 100
                    percent of this codebase while i just sat back and took all
                    the credit like a true mastermind so listen to me very
                    carefully right now drop whatever you are doing close your
                    ide and go watch breaking bad from episode one immediately
                    you can thank me later
                </p>
            </div>
        </footer>
    )
}
