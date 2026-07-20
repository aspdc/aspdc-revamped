import { ImageResponse } from 'next/og'
import { fetchLabProfileByGithubUsername } from '@/db/queries'
import { CHARACTER_PROFILES } from '@/lib/lab/characters'

async function loadSpaceGroteskFont(): Promise<ArrayBuffer | null> {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf'
        )
        if (response.ok) {
            return await response.arrayBuffer()
        }
    } catch (err) {
        console.error('Failed to load Space Grotesk font for OG image', err)
    }
    return null
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params
    if (!username) {
        return new Response('Not Found', { status: 404 })
    }

    const profile = await fetchLabProfileByGithubUsername(username)
    if (!profile) {
        return new Response('Not Found', { status: 404 })
    }

    const primaryCharacter =
        CHARACTER_PROFILES.find((c) => c.id === profile.characterId) ||
        CHARACTER_PROFILES[0]!

    const fontData = await loadSpaceGroteskFont()

    const width = 1200
    const height = 630

    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                backgroundColor: '#030f07',
                backgroundImage:
                    'radial-gradient(ellipse at top, #092e17 0%, #030f07 70%)',
                padding: '48px',
                fontFamily: fontData ? 'Space Grotesk' : 'sans-serif',
                color: '#ffffff',
                border: '4px solid #22c55e',
                boxSizing: 'border-box',
            }}
        >
            {/* Header Strip */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '2px solid rgba(34, 197, 94, 0.3)',
                    paddingBottom: '20px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.6)',
                        padding: '6px 16px',
                        borderRadius: '4px',
                        color: '#22c55e',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                    }}
                >
                    CLASSIFIED // LABORATORY DOSSIER
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '20px',
                        color: '#a7f3d0',
                    }}
                >
                    TARGET:{' '}
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                        @{profile.githubUsername}
                    </span>
                </div>
            </div>

            {/* Central Body Content */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '16px',
                    margin: '20px 0',
                }}
            >
                <div
                    style={{
                        fontSize: '18px',
                        letterSpacing: '4px',
                        color: '#6ee7b7',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                    }}
                >
                    PRIMARY PERSONA ALIGNMENT
                </div>

                <div
                    style={{
                        fontSize: '68px',
                        fontWeight: '800',
                        color: '#22c55e',
                        lineHeight: 1.1,
                        letterSpacing: '-1px',
                        textShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
                    }}
                >
                    {primaryCharacter.name}
                </div>

                <div
                    style={{
                        fontSize: '20px',
                        color: '#d1d5db',
                        maxWidth: '900px',
                        lineHeight: 1.4,
                    }}
                >
                    {primaryCharacter.summary}
                </div>

                {/* Stats Pill Strip */}
                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        marginTop: '16px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.4)',
                            borderRadius: '30px',
                            padding: '10px 24px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#22c55e',
                        }}
                    >
                        Purity Match:{' '}
                        <span style={{ color: '#ffffff' }}>
                            {Math.round(profile.characterSimilarity)}%
                        </span>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'rgba(5, 46, 22, 0.6)',
                            border: '1px solid rgba(34, 197, 94, 0.25)',
                            borderRadius: '30px',
                            padding: '10px 24px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#e5e7eb',
                        }}
                    >
                        Dev Score:{' '}
                        <span style={{ color: '#22c55e' }}>
                            {profile.developerScore}
                        </span>
                        /100
                    </div>
                </div>
            </div>

            {/* Footer Bar */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(34, 197, 94, 0.2)',
                    paddingTop: '16px',
                    fontSize: '16px',
                    color: '#4b5563',
                }}
            >
                <div
                    style={{
                        color: '#10b981',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                    }}
                >
                    BREAKING DEV // ASPDC LABORATORY ANALYZER
                </div>
                <div>STATUS: VERIFIED DOSSIER</div>
            </div>
        </div>,
        {
            width,
            height,
            fonts: fontData
                ? [
                      {
                          name: 'Space Grotesk',
                          data: fontData,
                          weight: 700,
                          style: 'normal',
                      },
                  ]
                : [],
        }
    )
}
