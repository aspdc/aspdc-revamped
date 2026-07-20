import { describe, expect, it } from 'vitest'
import { CHARACTER_PROFILES, assignCharacter } from './characters'
import { emptyTraitVector } from './traits'

describe('assignCharacter', () => {
    it('defines all character profiles without duplicates', () => {
        expect(CHARACTER_PROFILES).toHaveLength(14)
        const ids = new Set(CHARACTER_PROFILES.map((profile) => profile.id))
        expect(ids.size).toBe(14)
        expect(ids.has('lalo-salamanca')).toBe(true)
        expect(ids.has('hector-salamanca')).toBe(true)
        expect(ids.has('gale-boetticher')).toBe(false)
        expect(ids.has('the-cousins')).toBe(false)
        expect(ids.has('don-eladio')).toBe(false)
    })

    it('returns exactly three distinct characters sorted by similarity', () => {
        const matches = assignCharacter(emptyTraitVector(50))
        expect(matches).toHaveLength(3)
        const ids = matches.map((match) => match.id)
        expect(new Set(ids).size).toBe(3)
        expect(matches[0].similarity).toBeGreaterThanOrEqual(
            matches[1].similarity
        )
        expect(matches[1].similarity).toBeGreaterThanOrEqual(
            matches[2].similarity
        )
    })

    it('returns a character as top match when given their exact trait vector', () => {
        for (const profile of CHARACTER_PROFILES) {
            const matches = assignCharacter(profile.traits)
            expect(matches[0].id).toBe(profile.id)
            expect(matches[0].similarity).toBeGreaterThanOrEqual(99)
        }
    })

    it('is deterministic for the same vector', () => {
        const vector = CHARACTER_PROFILES[0].traits
        expect(assignCharacter(vector)).toEqual(assignCharacter(vector))
    })
})
