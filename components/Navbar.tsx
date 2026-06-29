import MobileNavbar from './MobileNavbar'
import { NavBarLg, NavBarXl } from './ui/tubelight-navbar'

const Navbar = () => {
    const xlNavItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Achievements', url: '/achievements' },
        { name: 'Projects', url: '/projects' },
        { name: 'Digest', url: '/digest' },
        { name: 'Blogs', url: '/blogs' },
        { name: 'Leaderboard', url: '/leaderboard' },
    ]

    const lgNavItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Digest', url: '/digest' },
        { name: 'Achievements', url: '/achievements' },
        { name: 'Leaderboard', url: '/leaderboard' },
    ]

    return (
        <div>
            {/* desktop navbar */}
            <div className="hidden xl:block">
                <NavBarXl items={xlNavItems} className="text-white" />
            </div>

            <div className="hidden md:block xl:hidden">
                <NavBarLg items={lgNavItems} className="text-white" />
            </div>

            {/* mobile navbar*/}
            <div className="block md:hidden">
                <MobileNavbar items={lgNavItems} />
            </div>
        </div>
    )
}

export default Navbar
