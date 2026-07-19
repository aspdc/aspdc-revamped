import { describe, expect, it } from 'vitest'
import { canAccessAdmin } from './admin-access'

describe('canAccessAdmin', () => {
    it('allows users with a credential account', () => {
        expect(canAccessAdmin([{ providerId: 'credential' }])).toBe(true)
    })

    it('allows users who have both credential and github accounts', () => {
        expect(
            canAccessAdmin([
                { providerId: 'github' },
                { providerId: 'credential' },
            ])
        ).toBe(true)
    })

    it('denies GitHub OAuth-only users', () => {
        expect(canAccessAdmin([{ providerId: 'github' }])).toBe(false)
    })

    it('denies users with no accounts', () => {
        expect(canAccessAdmin([])).toBe(false)
    })
})
