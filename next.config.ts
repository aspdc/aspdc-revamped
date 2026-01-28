import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    cacheComponents: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.zenblog.com',
            },
            {
                protocol: 'https',
                hostname: 'files.catbox.moe',
            },
            {
                protocol: 'https',
                hostname: 'ibb.co',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'example.com',
            },
        ],
        // Image optimization settings for different network conditions
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp', 'image/avif'],
        qualities: [75, 85],
        // Optimize for different viewport sizes
        minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    },
}

export default nextConfig
