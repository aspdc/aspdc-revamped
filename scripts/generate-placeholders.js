const fs = require('fs')
const path = require('path')

const characters = [
    { id: 'walter-white', symbol: 'Wa', name: 'Walter White' },
    { id: 'heisenberg', symbol: 'He', name: 'Heisenberg' },
    { id: 'jesse-pinkman', symbol: 'Je', name: 'Jesse Pinkman' },
    { id: 'gus-fring', symbol: 'Gu', name: 'Gus Fring' },
    { id: 'mike-ehrmantraut', symbol: 'Mk', name: 'Mike Ehrmantraut' },
    { id: 'saul-goodman', symbol: 'Sl', name: 'Saul Goodman' },
    { id: 'hank-schrader', symbol: 'Hk', name: 'Hank Schrader' },
    { id: 'tuco-salamanca', symbol: 'Tc', name: 'Tuco Salamanca' },
    { id: 'todd', symbol: 'Td', name: 'Todd' },
    { id: 'skinny-pete', symbol: 'Sk', name: 'Skinny Pete' },
    { id: 'badger', symbol: 'Bg', name: 'Badger' },
    { id: 'lydia', symbol: 'Ly', name: 'Lydia' },
    { id: 'hector-salamanca', symbol: 'Hc', name: 'Hector Salamanca' },
    { id: 'lalo-salamanca', symbol: 'Ll', name: 'Lalo Salamanca' },
]

const dir = path.join(process.cwd(), 'public', 'images', 'characters')
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
}

characters.forEach((c) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="bg" cx="50%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#0a3d1c" />
        <stop offset="100%" stop-color="#020d06" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="400" height="400" fill="url(#bg)" />
    <rect x="10" y="10" width="380" height="380" rx="16" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="8 4" opacity="0.4" />
    <rect x="20" y="20" width="360" height="360" rx="12" fill="none" stroke="#22c55e" stroke-width="1.5" opacity="0.8" />
    <text x="30" y="45" font-family="monospace" font-size="12" font-weight="bold" fill="#22c55e" letter-spacing="2" opacity="0.7">CLASSIFIED // PERSONA DOSSIER</text>
    
    <!-- Silhouette Avatar Icon -->
    <g transform="translate(140, 90)">
      <circle cx="60" cy="50" r="38" fill="#092914" stroke="#22c55e" stroke-width="2" opacity="0.9" />
      <path d="M 10 140 C 10 95, 110 95, 110 140 Z" fill="#092914" stroke="#22c55e" stroke-width="2" opacity="0.9" />
    </g>

    <!-- Periodic Element Symbol Box -->
    <g transform="translate(160, 240)">
      <rect x="0" y="0" width="80" height="80" rx="8" fill="#15803d" stroke="#22c55e" stroke-width="2" filter="url(#glow)" />
      <text x="12" y="52" font-family="sans-serif" font-size="38" font-weight="extrabold" fill="#ffffff">${c.symbol}</text>
    </g>

    <!-- Character Name -->
    <text x="200" y="350" font-family="sans-serif" font-size="22" font-weight="bold" fill="#22c55e" text-anchor="middle" letter-spacing="1" filter="url(#glow)">${c.name.toUpperCase()}</text>
  </svg>`
    fs.writeFileSync(path.join(dir, `${c.id}.svg`), svg)
})
console.log(
    'Successfully generated 14 SVG character placeholders in public/images/characters/'
)
