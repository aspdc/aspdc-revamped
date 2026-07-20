import { describe, expect, it } from 'vitest'
import { scoreDeveloper } from './developer-score'
import { emptyTraitVector } from './traits'
import { TRAIT_IDS } from './types'

describe('scoreDeveloper', () => {
    it('always returns an integer in [0, 100]', () => {
        const samples = [
            emptyTraitVector(0),
            emptyTraitVector(50),
            emptyTraitVector(100),
            Object.fromEntries(
                TRAIT_IDS.map((id, index) => [id, (index * 17) % 101])
            ) as ReturnType<typeof emptyTraitVector>,
        ]

        for (const vector of samples) {
            const score = scoreDeveloper(vector)
            expect(Number.isInteger(score)).toBe(true)
            expect(score).toBeGreaterThanOrEqual(0)
            expect(score).toBeLessThanOrEqual(100)
        }
    })

    it('is monotonic for uniformly higher trait vectors', () => {
        const low = emptyTraitVector(20)
        const mid = emptyTraitVector(55)
        const high = emptyTraitVector(90)

        expect(scoreDeveloper(high)).toBeGreaterThanOrEqual(scoreDeveloper(mid))
        expect(scoreDeveloper(mid)).toBeGreaterThanOrEqual(scoreDeveloper(low))
    })
})
