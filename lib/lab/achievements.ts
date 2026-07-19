import type { GitHubSnapshot, TraitVector } from './types'

export type AchievementDefinition = {
    id: string
    name: string
    description: string
    icon: string
    unlock: (context: AchievementContext) => boolean
}

export type Achievement = {
    id: string
    name: string
    description: string
    icon: string
}

export type AchievementContext = {
    vector: TraitVector
    snapshot: GitHubSnapshot
    rank?: number
}

function uniqueLanguageCount(snapshot: GitHubSnapshot): number {
    return new Set(
        snapshot.repos
            .map((repo) => repo.language)
            .filter((language): language is string => Boolean(language))
    ).size
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
    {
        id: 'the-blue-sky',
        name: 'The Blue Sky',
        description: '99.1% pure Discipline. The crystal of consistency.',
        icon: 'blue-sky',
        unlock: ({ vector }) => vector.Discipline > 90,
    },
    {
        id: 'say-my-name',
        name: 'Say My Name',
        description: 'You are in the global top 10. Respect the rank.',
        icon: 'crown',
        unlock: ({ rank }) => rank !== undefined && rank <= 10,
    },
    {
        id: 'i-am-the-danger',
        name: 'I Am The Danger',
        description: 'Chaos above 85. You knock.',
        icon: 'danger',
        unlock: ({ vector }) => vector.Chaos > 85,
    },
    {
        id: 'science-bitch',
        name: 'Science, Bitch!',
        description: 'Scientist over 80 with five or more chemical formulae.',
        icon: 'flask',
        unlock: ({ vector, snapshot }) =>
            vector.Scientist > 80 && uniqueLanguageCount(snapshot) >= 5,
    },
    {
        id: 'better-call-saul',
        name: 'Better Call Saul',
        description: 'Communication over 85. You could sell a merge conflict.',
        icon: 'gavel',
        unlock: ({ vector }) => vector.Communication > 85,
    },
    {
        id: 'tightened-up',
        name: 'Tightened Up',
        description: 'Architect over 85 — the operation looks legitimate.',
        icon: 'chicken',
        unlock: ({ vector }) => vector.Architect > 85,
    },
    {
        id: 'no-half-measures',
        name: 'No Half Measures',
        description: 'Consistency over 85. Half measures are for rookies.',
        icon: 'measure',
        unlock: ({ vector }) => vector.Consistency > 85,
    },
    {
        id: 'this-is-not-meth',
        name: 'This Is Not Meth',
        description: 'Documentation over 85. Label your samples.',
        icon: 'label',
        unlock: ({ vector }) => vector.Documentation > 85,
    },
    {
        id: 'yeah-science',
        name: 'Yeah Science',
        description: 'Curiosity over 85. Always one more experiment.',
        icon: 'spark',
        unlock: ({ vector }) => vector.Curiosity > 85,
    },
    {
        id: 'the-one-who-builds',
        name: 'The One Who Builds',
        description: 'Builder over 85 with at least eight laboratories.',
        icon: 'hammer',
        unlock: ({ vector, snapshot }) =>
            vector.Builder > 85 && snapshot.repos.length >= 8,
    },
    {
        id: 'associate-network',
        name: 'Associate Network',
        description: 'TeamPlayer over 80 with 25+ associates.',
        icon: 'network',
        unlock: ({ vector, snapshot }) =>
            vector.TeamPlayer > 80 && snapshot.followers >= 25,
    },
    {
        id: 'open-the-lab',
        name: 'Open The Lab',
        description: 'OpenSource over 80 — share the formula.',
        icon: 'unlock',
        unlock: ({ vector }) => vector.OpenSource > 80,
    },
    {
        id: 'empire-business',
        name: 'Empire Business',
        description: 'Leadership over 85. It is not personal.',
        icon: 'empire',
        unlock: ({ vector }) => vector.Leadership > 85,
    },
]

export function unlockAchievements(
    vector: TraitVector,
    snapshot: GitHubSnapshot,
    options: { rank?: number } = {}
): Achievement[] {
    const context: AchievementContext = {
        vector,
        snapshot,
        rank: options.rank,
    }

    return ACHIEVEMENTS.filter((achievement) =>
        achievement.unlock(context)
    ).map(({ id, name, description, icon }) => ({
        id,
        name,
        description,
        icon,
    }))
}
