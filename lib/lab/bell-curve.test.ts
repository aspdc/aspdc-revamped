import { describe, expect, it } from 'vitest'
import { calculateBellCurveStats } from './bell-curve'

describe('calculateBellCurveStats', () => {
    it('handles an empty profiles list gracefully', () => {
        const stats = calculateBellCurveStats(75, [])
        expect(stats.totalSubjects).toBe(1)
        expect(stats.rank).toBe(1)
        expect(stats.usersAbove).toBe(0)
        expect(stats.usersBelow).toBe(0)
        expect(stats.userScore).toBe(75)
        expect(stats.distribution.length).toBeGreaterThan(40)
    })

    it('calculates correct rank and bounds for multiple subjects', () => {
        const profiles = [
            { developerScore: 90 },
            { developerScore: 80 },
            { developerScore: 70 },
            { developerScore: 60 },
            { developerScore: 50 },
        ]

        const stats = calculateBellCurveStats(80, profiles)
        expect(stats.totalSubjects).toBe(5)
        expect(stats.rank).toBe(2) // 90 is above 80
        expect(stats.usersAbove).toBe(1)
        expect(stats.usersBelow).toBe(3) // 70, 60, 50
        expect(stats.percentile).toBeGreaterThan(50)
    })

    it('marks user position correctly in distribution points', () => {
        const profiles = [{ developerScore: 65 }]
        const stats = calculateBellCurveStats(65, profiles)
        const userPoint = stats.distribution.find((p) => p.isUserPosition)
        expect(userPoint).toBeDefined()
        expect(userPoint?.score).toBe(64) // closest step to 65 (64 or 66)
    })

    it('clamps user score between 0 and 100', () => {
        const statsLow = calculateBellCurveStats(-10, [])
        expect(statsLow.userScore).toBe(0)

        const statsHigh = calculateBellCurveStats(120, [])
        expect(statsHigh.userScore).toBe(100)
    })
})
