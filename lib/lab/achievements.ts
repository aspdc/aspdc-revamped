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
        description: 'Scientist over 75 with three or more chemical formulae.',
        icon: 'flask',
        unlock: ({ vector, snapshot }) =>
            vector.Scientist > 75 && uniqueLanguageCount(snapshot) >= 3,
    },
    {
        id: 'better-call-saul',
        name: 'Better Call Saul',
        description: 'Communication over 75. You could sell a merge conflict.',
        icon: 'gavel',
        unlock: ({ vector }) => vector.Communication > 75,
    },
    {
        id: 'tightened-up',
        name: 'Tightened Up',
        description: 'Architect over 75 — the operation looks legitimate.',
        icon: 'chicken',
        unlock: ({ vector }) => vector.Architect > 75,
    },
    {
        id: 'no-half-measures',
        name: 'No Half Measures',
        description: 'Consistency over 75. Half measures are for rookies.',
        icon: 'measure',
        unlock: ({ vector }) => vector.Consistency > 75,
    },
    {
        id: 'this-is-not-meth',
        name: 'This Is Not Meth',
        description: 'Documentation over 75. Label your samples.',
        icon: 'label',
        unlock: ({ vector }) => vector.Documentation > 75,
    },
    {
        id: 'yeah-science',
        name: 'Yeah Science',
        description: 'Curiosity over 75. Always one more experiment.',
        icon: 'spark',
        unlock: ({ vector }) => vector.Curiosity > 75,
    },
    {
        id: 'the-one-who-builds',
        name: 'The One Who Builds',
        description: 'Builder over 75 with at least five laboratories.',
        icon: 'hammer',
        unlock: ({ vector, snapshot }) =>
            vector.Builder > 75 && snapshot.repos.length >= 5,
    },
    {
        id: 'associate-network',
        name: 'Associate Network',
        description: 'TeamPlayer over 70 with 5+ associates.',
        icon: 'network',
        unlock: ({ vector, snapshot }) =>
            vector.TeamPlayer > 70 && snapshot.followers >= 5,
    },
    {
        id: 'open-the-lab',
        name: 'Open The Lab',
        description: 'OpenSource over 70 — share the formula.',
        icon: 'unlock',
        unlock: ({ vector }) => vector.OpenSource > 70,
    },
    {
        id: 'empire-business',
        name: 'Empire Business',
        description: 'Leadership over 75. It is not personal.',
        icon: 'empire',
        unlock: ({ vector }) => vector.Leadership > 75,
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
