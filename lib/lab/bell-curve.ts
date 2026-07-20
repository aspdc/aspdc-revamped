import { LabProfile } from '@/db/types'

export type BellCurveDataPoint = {
    score: number
    density: number
    isUserPosition?: boolean
}

export type BellCurveStats = {
    totalSubjects: number
    rank: number
    percentile: number
    usersAbove: number
    usersBelow: number
    userScore: number
    userDensity: number
    distribution: BellCurveDataPoint[]
}

/**
 * Computes global ranking statistics and a smooth normal distribution curve
 * for developer scores across all analyzed profiles.
 */
export function calculateBellCurveStats(
    userScore: number,
    allProfiles:
        | Array<Pick<LabProfile, 'developerScore'>>
        | Array<{ developerScore: number }>
): BellCurveStats {
    const scores = allProfiles
        .map((p) => p.developerScore)
        .sort((a, b) => a - b)
    const totalSubjects = scores.length || 1

    const userScoreClamped = Math.min(100, Math.max(0, userScore))

    let usersAbove = 0
    let usersBelow = 0
    let equalCount = 0

    for (const score of scores) {
        if (score > userScoreClamped) {
            usersAbove++
        } else if (score < userScoreClamped) {
            usersBelow++
        } else {
            equalCount++
        }
    }

    // Rank 1 is the highest score
    const rank = usersAbove + 1

    // Percentile: % of users at or below current user's score
    // When there's 1 user, percentile is 100 (top 100%)
    let percentile = 100
    if (totalSubjects > 1) {
        const fractionBelow = (usersBelow + equalCount * 0.5) / totalSubjects
        percentile = Math.min(99, Math.max(1, Math.round(fractionBelow * 100)))
    } else {
        percentile = 99
    }

    // Compute distribution curve parameters (mean & standard deviation)
    let mean = 50
    let stdDev = 15

    if (scores.length >= 5) {
        const sum = scores.reduce((acc, val) => acc + val, 0)
        mean = sum / scores.length
        const variance =
            scores.reduce((acc, val) => acc + (val - mean) ** 2, 0) /
            scores.length
        stdDev = Math.max(12, Math.sqrt(variance))
    }

    // Generate distribution data points from x = 0 to 100 (step = 2)
    const step = 2
    const distribution: BellCurveDataPoint[] = []
    let maxDensityRaw = 0

    // Gaussian probability density function f(x)
    const pdf = (x: number) => {
        const exponent = -0.5 * ((x - mean) / stdDev) ** 2
        return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent)
    }

    const rawPoints: Array<{ score: number; densityRaw: number }> = []
    for (let x = 0; x <= 100; x += step) {
        const d = pdf(x)
        if (d > maxDensityRaw) {
            maxDensityRaw = d
        }
        rawPoints.push({ score: x, densityRaw: d })
    }

    // Scale peak density to 100 for clean visualization
    const scale = maxDensityRaw > 0 ? 100 / maxDensityRaw : 100

    let closestPointIndex = 0
    let minDistance = Infinity

    rawPoints.forEach((pt, index) => {
        const normalizedDensity = Math.round(pt.densityRaw * scale * 10) / 10
        const distance = Math.abs(pt.score - userScoreClamped)
        if (distance < minDistance) {
            minDistance = distance
            closestPointIndex = index
        }
        distribution.push({
            score: pt.score,
            density: normalizedDensity,
        })
    })

    if (distribution[closestPointIndex]) {
        distribution[closestPointIndex].isUserPosition = true
    }

    const userDensity = pdf(userScoreClamped) * scale

    return {
        totalSubjects,
        rank,
        percentile,
        usersAbove,
        usersBelow,
        userScore: userScoreClamped,
        userDensity: Math.round(userDensity * 10) / 10,
        distribution,
    }
}
