import Contributiors from '@/components/home/Contributiors'
import EventShowcase from '@/components/home/EventShowcase'
import FAQ from '@/components/home/FAQ'
import Hero from '@/components/home/Hero'
import {
    ScrollVelocityContainer,
    ScrollVelocityRow,
} from '@/components/magicui/scroll-based-velocity'

const page = () => {
    return (
        <div className="min-h-dvh">
            <Hero />
            <EventShowcase />
            <ScrollVelocityContainer className="text-4xl font-bold md:text-5xl">
                <ScrollVelocityRow
                    baseVelocity={20}
                    direction={1}
                >{`Learn . Code . Innovate . `}</ScrollVelocityRow>
            </ScrollVelocityContainer>
            <Contributiors />
            <FAQ />
        </div>
    )
}

export default page
