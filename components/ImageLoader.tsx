import Image, { ImageProps } from 'next/image'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
    alt: string
    showSkeleton?: boolean
}

/**
 * Skeleton placeholder for images during loading
 */
export function ImageSkeleton() {
    return (
        <div className="relative h-full w-full">
            <Skeleton className="h-full w-full rounded-lg" />
        </div>
    )
}

/**
 * Image component with Suspense boundary for optimized loading
 * Supports streaming and lazy loading across all network conditions
 */
export function OptimizedImage({
    showSkeleton = true,
    ...props
}: OptimizedImageProps) {
    return (
        <Suspense fallback={showSkeleton ? <ImageSkeleton /> : null}>
            <Image
                {...props}
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23e5e7eb' width='1' height='1'/%3E%3C/svg%3E"
                loading="lazy"
            />
        </Suspense>
    )
}

/**
 * Image component with error handling and fallback
 * Useful for user-generated or external image URLs
 */
export function RemoteImage({
    onError,
    ...props
}: OptimizedImageProps & {
    onError?: (error: Error) => void
}) {
    const handleError = (error: any) => {
        console.warn(`Image failed to load: ${props.src}`, error)
        onError?.(error)
    }

    return (
        <Suspense fallback={<ImageSkeleton />}>
            <Image
                {...props}
                onError={handleError}
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23e5e7eb' width='1' height='1'/%3E%3C/svg%3E"
                loading="lazy"
            />
        </Suspense>
    )
}
