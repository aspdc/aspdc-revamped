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
        description:
            'High coding discipline and exceptionally consistent commits.',
        icon: 'blue-sky',
        unlock: ({ vector }) => vector.Discipline > 90,
    },
    {
        id: 'say-my-name',
        name: 'Say My Name',
        description:
            'Ranked in the global top 10 on the developer leaderboard.',
        icon: 'crown',
        unlock: ({ rank }) => rank !== undefined && rank <= 10,
    },
    {
        id: 'i-am-the-danger',
        name: 'I Am The Danger',
        description:
            'High code output with frequent major changes and refactors.',
        icon: 'danger',
        unlock: ({ vector }) => vector.Chaos > 85,
    },
    {
        id: 'science-bitch',
        name: 'Science, B***h!',
        description: 'Proficient across 3 or more programming languages.',
        icon: 'flask',
        unlock: ({ vector, snapshot }) =>
            vector.Scientist > 75 && uniqueLanguageCount(snapshot) >= 3,
    },
    {
        id: 'better-call-saul',
        name: 'Better Call Saul',
        description:
            'High communication score with active pull request discussions.',
        icon: 'gavel',
        unlock: ({ vector }) => vector.Communication > 75,
    },
    {
        id: 'tightened-up',
        name: 'Tightened Up',
        description:
            'Clean architecture score with well-structured project repositories.',
        icon: 'chicken',
        unlock: ({ vector }) => vector.Architect > 75,
    },
    {
        id: 'no-half-measures',
        name: 'No Half Measures',
        description: 'Steady, uninterrupted daily commit streaks.',
        icon: 'measure',
        unlock: ({ vector }) => vector.Consistency > 75,
    },
    {
        id: 'this-is-not-meth',
        name: 'This Is Not Meth',
        description:
            'Comprehensive documentation across all your public repositories.',
        icon: 'label',
        unlock: ({ vector }) => vector.Documentation > 75,
    },
    {
        id: 'yeah-science',
        name: 'Yeah Science',
        description:
            'High curiosity score with frequent exploration of new technologies.',
        icon: 'spark',
        unlock: ({ vector }) => vector.Curiosity > 75,
    },
    {
        id: 'the-one-who-builds',
        name: 'The One Who Builds',
        description: 'Maintains 5 or more active original repositories.',
        icon: 'hammer',
        unlock: ({ vector, snapshot }) =>
            vector.Builder > 75 && snapshot.repos.length >= 5,
    },
    {
        id: 'associate-network',
        name: 'Associate Network',
        description:
            'Strong collaboration score with 5 or more GitHub followers.',
        icon: 'network',
        unlock: ({ vector, snapshot }) =>
            vector.TeamPlayer > 70 && snapshot.followers >= 5,
    },
    {
        id: 'open-the-lab',
        name: 'Open The Lab',
        description:
            'High open-source contribution and public repository sharing.',
        icon: 'unlock',
        unlock: ({ vector }) => vector.OpenSource > 70,
    },
    {
        id: 'empire-business',
        name: 'Empire Business',
        description: 'High project leadership and repository management score.',
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
