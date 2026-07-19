export type {
    GitHubEventSummary,
    GitHubRepoSummary,
    GitHubSnapshot,
    TraitId,
    TraitVector,
} from './types'
export { TRAIT_IDS } from './types'
export { emptyTraitVector, isTraitId, scoreTraits } from './traits'
export {
    CHARACTER_PROFILES,
    assignCharacter,
    type CharacterId,
    type CharacterMatch,
    type CharacterProfile,
} from './characters'
export { scoreDeveloper } from './developer-score'
export {
    ACHIEVEMENTS,
    unlockAchievements,
    type Achievement,
    type AchievementContext,
    type AchievementDefinition,
} from './achievements'
