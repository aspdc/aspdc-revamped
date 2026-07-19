import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { canAccessAdmin } from './admin-access.ts'

describe('canAccessAdmin', () => {
    it('allows users with a credential account', () => {
        assert.equal(canAccessAdmin([{ providerId: 'credential' }]), true)
    })

    it('allows users who have both credential and github accounts', () => {
        assert.equal(
            canAccessAdmin([
                { providerId: 'github' },
                { providerId: 'credential' },
            ]),
            true
        )
    })

    it('denies GitHub OAuth-only users', () => {
        assert.equal(canAccessAdmin([{ providerId: 'github' }]), false)
    })

    it('denies users with no accounts', () => {
        assert.equal(canAccessAdmin([]), false)
    })
})
