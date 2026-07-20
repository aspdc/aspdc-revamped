import {
    Building2,
    Crown,
    Flame,
    FlaskConical,
    Gavel,
    Hammer,
    Ruler,
    Sparkles,
    Tag,
    Unlock,
    Users,
    Utensils,
    Zap,
    Award,
} from 'lucide-react'

export function AchievementIcon({
    iconKey,
    className = 'h-5 w-5',
}: {
    iconKey: string
    className?: string
}) {
    switch (iconKey) {
        case 'blue-sky':
            return <Sparkles className={className} />
        case 'crown':
            return <Crown className={className} />
        case 'danger':
            return <Flame className={className} />
        case 'flask':
            return <FlaskConical className={className} />
        case 'gavel':
            return <Gavel className={className} />
        case 'chicken':
            return <Utensils className={className} />
        case 'measure':
            return <Ruler className={className} />
        case 'label':
            return <Tag className={className} />
        case 'spark':
            return <Zap className={className} />
        case 'hammer':
            return <Hammer className={className} />
        case 'network':
            return <Users className={className} />
        case 'unlock':
            return <Unlock className={className} />
        case 'empire':
            return <Building2 className={className} />
        default:
            return <Award className={className} />
    }
}
