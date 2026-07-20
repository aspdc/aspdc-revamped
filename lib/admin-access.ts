export function canAccessAdmin(
    accounts: ReadonlyArray<{ providerId: string }>
): boolean {
    return accounts.some((account) => account.providerId === 'credential')
}
