"use client";

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

function Navbar() {
    const pathname = usePathname();

    const links = [
        { name: "Home", href: "/" },
        { name: "Events", href: "/events" },
        { name: "Create Event", href: "/createEvent" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark-100/50 border-b border-border-dark/60">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="logo">
                    <Image src="/icons/logo.png" width={24} height={24} alt="DevCon logo " />
                    <p>DevEvent</p>
                </Link>

                <ul className="hidden md:flex items-center gap-1 p-1 bg-dark-200/50 backdrop-blur-sm rounded-full border border-border-dark/40">
                    {links.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${isActive ? "text-primary" : "text-light-200 hover:text-white"}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        );
                    })}
                </ul>
            </nav>
        </header>
    )
}

export default Navbar