import { ImageResponse } from 'next/og'
import { fetchLabProfileByGithubUsername } from '@/db/queries'
import { CHARACTER_PROFILES } from '@/lib/lab/characters'

async function loadSpaceGroteskFont(): Promise<ArrayBuffer | null> {
    try {
        const response = await fetch(
            'https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.ttf',
            { next: { revalidate: 86400 } }
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
                backgroundColor: '#09090b',
                padding: '48px',
                fontFamily: fontData ? 'Space Grotesk' : 'sans-serif',
                color: '#f4f4f5',
                border: '4px solid #27272a',
                boxSizing: 'border-box',
            }}
        >
            {/* Header Strip */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '2px solid #27272a',
                    paddingBottom: '20px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: '#18181b',
                        border: '1px solid #27272a',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        color: '#22c55e',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                    }}
                >
                    DEVELOPER PROFILE ANALYSIS
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '20px',
                        color: '#a1a1aa',
                    }}
                >
                    GITHUB:{' '}
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
                        letterSpacing: '3px',
                        color: '#a1a1aa',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                    }}
                >
                    PRIMARY DEVELOPER ARCHETYPE MATCH
                </div>

                <div
                    style={{
                        fontSize: '68px',
                        fontWeight: '800',
                        color: '#22c55e',
                        lineHeight: 1.1,
                        letterSpacing: '-1px',
                    }}
                >
                    {primaryCharacter.name}
                </div>

                <div
                    style={{
                        fontSize: '20px',
                        color: '#d4d4d8',
                        maxWidth: '900px',
                        lineHeight: 1.4,
                    }}
                >
                    {primaryCharacter.summary}
                </div>

                {/* Core Metrics Strip */}
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
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            padding: '10px 24px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#22c55e',
                        }}
                    >
                        Archetype Match:{' '}
                        <span style={{ color: '#ffffff' }}>
                            {profile.characterSimilarity.toFixed(2)}%
                        </span>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            padding: '10px 24px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#ffffff',
                        }}
                    >
                        Developer Score:{' '}
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
                    borderTop: '1px solid #27272a',
                    paddingTop: '16px',
                    fontSize: '16px',
                    color: '#71717a',
                }}
            >
                <div
                    style={{
                        color: '#22c55e',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                    }}
                >
                    BREAKING DEVS // DEVELOPER LAB
                </div>
                <div>VERIFIED PROFILE</div>
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
