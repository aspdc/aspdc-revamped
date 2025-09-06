'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react'
import EmptyStateCard from '@/components/EmptyStateCard'

// Framer Motion variants
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export default function Page() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const everything = [
        {
            domainName: 'Faculty Mentor',
            members: [
                {
                    id: 1,
                    name: 'Dr. Nikita Joshi',
                    role: 'Faculty Mentor',
                    avatar: '/team/nikitamam.jpeg',
                    blur: '/team/tiny/nikitamam.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
            ],
        },
        {
            domainName: 'Leadership',
            members: [
                {
                    id: 2,
                    name: 'Nirav Maheta',
                    role: 'President',
                    avatar: '/team/nirav.jpg',
                    blur: '/team/tiny/nirav.jpeg',
                    github: 'https://github.com/ni3rav',
                    instagram: null,
                    x: 'https://x.com/ni3rav',
                    linkedin: 'https://linkedin.com/in/nirav-mht',
                },
                {
                    id: 3,
                    name: 'Sahil Patel',
                    role: 'Vice President',
                    avatar: '/team/sahil.jpg',
                    blur: '/team/tiny/sahil.jpeg',
                    github: 'https://github.com/Sahil-796',
                    instagram: 'https://www.instagram.com/sahil_patel006__',
                    x: 'https://x.com/SahilPa82684047',
                    linkedin: null,
                },
            ],
        },
        {
            domainName: 'WebDev',
            members: [
                {
                    id: 4,
                    name: 'Harshil Upadhyay',
                    role: 'Lead',
                    avatar: '/team/harshil.jpg',
                    blur: '/team/tiny/harshil.jpeg',
                    github: 'https://github.com/Harshil000',
                    instagram: null,
                    x: null,
                    linkedin:
                        'https://www.linkedin.com/in/harshil-upadhyay-4285b2315?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                },
                {
                    id: 5,
                    name: 'Rudra Patel',
                    role: 'Member',
                    avatar: '/team/rudra.jpeg',
                    blur: '/team/tiny/rudra.jpeg',
                    github: 'https://github.com/RudraPatel5435',
                    instagram: null,
                    x: 'https://x.com/RudraPatel5435',
                    linkedin: null,
                },
                {
                    id: 6,
                    name: 'Dwij Gosai',
                    role: 'Member',
                    avatar: '/team/dwij.jpg',
                    blur: '/team/tiny/dwij.jpeg',
                    github: 'https://github.com/Dwij45',
                    instagram: 'https://www.instagram.com/dwijgosai/?hl=en',
                    x: 'https://x.com/Dwij45',
                    linkedin: 'http://www.linkedin.com/in/dwij-gosai',
                },
                {
                    id: 7,
                    name: 'Tirth Choksi',
                    role: 'Member',
                    avatar: '/team/tirthc.jpg',
                    blur: '/team/tiny/tirthc.jpeg',
                    github: 'https://github.com/tirth12345',
                    instagram:
                        'https://www.instagram.com/_tirth_chokshi_05?igsh=ZnBjb2g5Z3ljMjNk',
                    x: 'https://x.com/Noone_Tirth?t=fOFXjXpTrnbDCFK4eXoJcw&s=09',
                    linkedin:
                        'https://www.linkedin.com/in/tirth-chokshi-44b355295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                },
                {
                    id: 8,
                    name: 'Sharanya Nagar',
                    role: 'Member',
                    avatar: '/team/sharanya.jpg',
                    blur: '/team/tiny/sharanya.jpeg',
                    github: 'https://github.com/sharancreates',
                    instagram:
                        'https://www.instagram.com/alwaysharann?igsh=MXR0YjhwMHJzZWhsZg==',
                    x: null,
                    linkedin:
                        'https://www.linkedin.com/in/sharanya-nagar-5a1908336?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                },
            ],
        },
        {
            domainName: 'DSA',
            members: [
                {
                    id: 9,
                    name: 'Pratham Gavadia',
                    role: 'Lead',
                    avatar: '/team/prathams.jpg',
                    blur: '/team/tiny/prathams.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
                {
                    id: 10,
                    name: 'Pruthvi Navadiya',
                    role: 'Member',
                    avatar: '/team/pruthvi.jpeg',
                    blur: '/team/tiny/pruthvi.jpeg',
                    github: 'https://github.com/Pruthvi4563',
                    instagram: 'https://www.instagram.com/pruthvi_navadiya02',
                    x: 'https://x.com/PeaceKeeper_1',
                    linkedin: 'https://www.linkedin.com/in/pruthvi-navadiya',
                },
                {
                    id: 11,
                    name: 'Harry Panchal',
                    role: 'Member',
                    avatar: '/team/harry.jpg',
                    blur: '/team/tiny/harry.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
                {
                    id: 12,
                    name: 'Jhanvi Patel',
                    role: 'Member',
                    avatar: '/team/jhanvi.jpg',
                    blur: '/team/tiny/jhanvi.jpeg',
                    github: 'https://github.com/jhanvi857',
                    instagram: 'https://www.instagram.com/jhanvi_857/',
                    x: 'https://x.com/jhanvi_857',
                    linkedin:
                        'https://www.linkedin.com/in/jhanvi-patel-0a032b35a/',
                },
                {
                    id: 13,
                    name: 'Tirth Jain',
                    role: 'Member',
                    avatar: '/team/tirthj.jpg',
                    blur: '/team/tiny/tirth.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
            ],
        },
        {
            domainName: 'Machine Learning',
            members: [
                {
                    id: 14,
                    name: 'Vrajesh Sharma',
                    role: 'Lead',
                    avatar: '/team/vrajesh.jpg',
                    blur: '/team/tiny/vrajesh.jpeg',
                    github: 'https://github.com/Vrajesh-Sharma/',
                    instagram: 'https://www.instagram.com/its_vrajesh_sharma/',
                    x: 'https://x.com/vrajesharma/',
                    linkedin: 'https://www.linkedin.com/in/vrajesharma-7-dsa/',
                },
                {
                    id: 27,
                    name: 'Mohit Manglani',
                    role: 'Member',
                    avatar: '/team/mohit.jpeg',
                    blur: '/team/tiny/mohit.jpeg',
                    github: 'https://github.com/xXMohitXx',
                    instagram: 'https://www.instagram.com/mohit.127.0.0.1/',
                    x: 'https://x.com/MManglani777?t=8d524TJm5PpGwN8cuTA5nQ&s=09',
                    linkedin:
                        'https://www.linkedin.com/in/mohit-manglani-412997220/',
                },
                {
                    id: 15,
                    name: 'Saurabh Singh',
                    role: 'Member',
                    avatar: '/team/saurabh.jpg',
                    blur: '/team/tiny/saurabh.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
                {
                    id: 16,
                    name: 'Sharv Mehta',
                    role: 'Member',
                    avatar: '/team/sharv.jpg',
                    blur: '/team/tiny/sharv.jpeg',
                    github: 'https://github.com/Pokeavenger/',
                    instagram: 'https://www.instagram.com/sharv_0709',
                    x: null,
                    linkedin:
                        'https://www.linkedin.com/in/sharv-mehta-a0425329b',
                },
                {
                    id: 17,
                    name: 'Samarth Shrivastava',
                    role: 'Member',
                    avatar: '/team/samarth.jpeg',
                    blur: '/team/tiny/samarth.jpeg',
                    github: 'https://github.com/Bazuka13',
                    instagram:
                        'https://www.instagram.com/naam.samarth?igsh=MWxuN2JvcGx3bWtjOQ==',
                    x: null,
                    linkedin:
                        'https://www.linkedin.com/in/samarth-srivastava-862160326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                },
                {
                    id: 18,
                    name: 'Dhruval Patel',
                    role: 'Member',
                    avatar: '/team/dhruval.jpg',
                    blur: '/team/tiny/dhruval.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
            ],
        },
        {
            domainName: 'Design',
            members: [
                {
                    id: 19,
                    name: 'Yaksh Vadaliya',
                    role: 'Lead',
                    avatar: '/team/yaksh2.jpg',
                    blur: '/team/tiny/yaksh2.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
                {
                    id: 20,
                    name: 'Ved Parmar',
                    role: 'Lead',
                    avatar: '/team/ved.jpg',
                    blur: '/team/tiny/ved.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
            ],
        },
        {
            domainName: 'Public Relations',
            members: [
                {
                    id: 21,
                    name: 'Deep Adatiya',
                    role: 'Lead',
                    avatar: '/team/deep2.jpg',
                    blur: '/team/tiny/deep2.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
                {
                    id: 22,
                    name: 'Malhar Patel',
                    role: 'Member',
                    avatar: '/team/malhar.jpeg',
                    blur: '/team/tiny/malhar.jpeg',
                    github: null,
                    instagram: null,
                    x: null,
                    linkedin: null,
                },
                {
                    id: 23,
                    name: 'Darshi Prajapati',
                    role: 'Member',
                    avatar: '/team/darshi.jpg',
                    blur: '/team/tiny/darshi.jpeg',
                    github: 'https://github.com/darshi1707',
                    instagram:
                        'https://www.instagram.com/darshi.104?igsh=ZXE2ZXlkdDN5bmM=',
                    x: null,
                    linkedin:
                        'https://www.linkedin.com/in/darshi-prajapati-aa0116325',
                },
                {
                    id: 24,
                    name: 'Avyay Kachhia',
                    role: 'Member',
                    avatar: '/team/avyay.jpg',
                    blur: '/team/tiny/avyay.jpeg',
                    github: null,
                    instagram: 'https://www.instagram.com/_avi.y/',
                    x: null,
                    linkedin:
                        'https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav',
                },
                {
                    id: 25,
                    name: 'Heer Rana',
                    role: 'Member',
                    avatar: '/team/heer.jpg',
                    blur: '/team/tiny/heer.jpeg',
                    github: 'https://github.com/HeerRana',
                    instagram: 'https://www.instagram.com/heer_rana02',
                    x: 'https://x.com/heer_rana3',
                    linkedin: 'https://www.linkedin.com/in/heer-rana-604222304',
                },
            ],
        },
        {
            domainName: 'Social Media',
            members: [
                {
                    id: 26,
                    name: 'Pratham Patel',
                    role: 'Lead',
                    avatar: '/team/pratham-patel.jpg',
                    blur: '/team/tiny/pratham-patel.jpeg',
                    github: 'https://github.com/Patty122',
                    instagram:
                        'https://www.instagram.com/_._prathammm._?igsh=MXg5ajF5Zmk3amxpbw%3D%3D&utm_source=qr',
                    x: 'https://x.com/prathamm333?s=21',
                    linkedin:
                        'https://www.linkedin.com/in/pratham-patel-a53a7937a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
                },
            ],
        },
    ]

    if (!everything || everything.length === 0) {
        return (
            <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-8 py-12 md:py-32 lg:px-0">
                <EmptyStateCard
                    emoji="👥"
                    heading="No Team Members"
                    subtext="Our team will be revealed soon. Stay tuned!"
                />
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                The Faces Behind ASPDC
            </TextScramble>

            {everything.map((d, idx) => (
                <section key={idx}>
                    <TextEffect
                        per="char"
                        preset="blur"
                        speedReveal={0.6}
                        className="text-primary mb-3 text-xl font-medium"
                    >
                        {d.domainName}
                    </TextEffect>

                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="h-px bg-white"
                    />

                    <motion.div
                        className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {d.members.map((member) => (
                            <motion.div
                                key={member.id}
                                initial={{ y: 40, opacity: 0, scale: 0.8 }}
                                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <motion.div
                                    onHoverStart={() =>
                                        setHoveredIndex(member.id)
                                    }
                                    onHoverEnd={() => setHoveredIndex(null)}
                                    className="group relative h-[260px] w-full overflow-hidden rounded-2xl md:h-[320px]"
                                >
                                    {/* Background image */}
                                    <Image
                                        className="h-full w-full object-cover"
                                        blurDataURL={member.blur}
                                        src={member.avatar}
                                        alt={member.name}
                                        fill // ensures it fills the card
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                    {/* Description */}
                                    <div className="absolute bottom-2 left-3 rounded-lg bg-black/20 px-4 py-3 transition-all duration-300 group-hover:bottom-3">
                                        {/* Name + role */}
                                        <div className="">
                                            <p className="font-semibold">
                                                {member.name}
                                            </p>
                                            <p className="text-sm opacity-80">
                                                {member.role}
                                            </p>
                                        </div>

                                        {/* Hover icons */}
                                        <div className="mt-2 flex gap-2 lg:hidden">
                                            {member.instagram && (
                                                <Link
                                                    href={member.instagram}
                                                    target="_blank"
                                                >
                                                    <Instagram className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                </Link>
                                            )}
                                            {member.x && (
                                                <Link
                                                    href={member.x}
                                                    target="_blank"
                                                >
                                                    <Twitter className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                </Link>
                                            )}
                                            {member.linkedin && (
                                                <Link
                                                    href={member.linkedin}
                                                    target="_blank"
                                                >
                                                    <Linkedin className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                </Link>
                                            )}
                                            {member.github && (
                                                <Link
                                                    href={member.github}
                                                    target="_blank"
                                                >
                                                    <Github className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                </Link>
                                            )}
                                        </div>
                                        <AnimatePresence>
                                            {hoveredIndex === member.id && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                        scale: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    className="mt-2 hidden gap-2 lg:flex"
                                                >
                                                    {member.instagram && (
                                                        <Link
                                                            href={
                                                                member.instagram
                                                            }
                                                            target="_blank"
                                                        >
                                                            <Instagram className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                        </Link>
                                                    )}
                                                    {member.x && (
                                                        <Link
                                                            href={member.x}
                                                            target="_blank"
                                                        >
                                                            <Twitter className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                        </Link>
                                                    )}
                                                    {member.linkedin && (
                                                        <Link
                                                            href={
                                                                member.linkedin
                                                            }
                                                            target="_blank"
                                                        >
                                                            <Linkedin className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                        </Link>
                                                    )}
                                                    {member.github && (
                                                        <Link
                                                            href={member.github}
                                                            target="_blank"
                                                        >
                                                            <Github className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                        </Link>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            ))}
        </main>
    )
}
