"use client";

import { useState, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client";

function NavLinks({ isMobile, closeMenu }: { isMobile?: boolean, closeMenu?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const session = useSession();
    const dynamicLinks = [
        { name: "Home", href: "/" },
        { name: "Events", href: "/events" },
        session.data
            ? { name: "Create Event", href: "/createEvent" }
            : { name: "Sign In", href: "/auth" }
    ];

    return (
        <ul className={isMobile
            ? "flex flex-col items-center gap-4 px-4 py-8"
            : "flex items-center gap-1 p-1 bg-dark-200/50 backdrop-blur-sm rounded-full border border-border-dark/40"}>
            {dynamicLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${isMobile ? 'w-full text-center text-lg py-3' : ''} ${isActive ? "text-primary" : "text-light-200 hover:text-white"}`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId={isMobile ? undefined : "nav-pill"}
                                className={`absolute inset-0 bg-primary/10 border border-primary/20 rounded-full ${isMobile ? 'block' : ''}`}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{link.name}</span>
                    </Link>
                );
            })}
            {session.data && (
                <button
                    onClick={async () => {
                        await signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push("/auth");
                                }
                            }
                        });
                        if (closeMenu) closeMenu();
                    }}
                    className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${isMobile ? 'w-full text-center text-lg py-3' : ''} text-light-200 hover:text-red-500`}
                >
                    <span className="relative z-10">Sign Out</span>
                </button>
            )}
        </ul>
    );
}

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark-100/90 border-b border-border-dark/60">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo Section */}
                <Link href="/" className="logo relative z-50 shrink-0">
                    <Image src="/icons/logo.png" width={24} height={24} alt="DevCon logo" />
                    <p>DevEvent</p>
                </Link>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden z-50 p-2 -mr-2 text-light-200 hover:text-primary transition-colors focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>

                {/* Desktop Nav Links */}
                <Suspense fallback={<div className="hidden md:block w-[300px] h-[40px] bg-dark-200/50 rounded-full animate-pulse" />}>
                    <div className="hidden md:block">
                        <NavLinks />
                    </div>
                </Suspense>
            </nav>

            {/* Mobile Nav Overlay Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden border-b border-border-dark/60 bg-dark-100/95 backdrop-blur-3xl overflow-hidden shadow-2xl"
                    >
                        <Suspense fallback={<div className="w-full h-32 flex items-center justify-center text-primary/50 text-sm font-martian-mono">Loading Navigation...</div>}>
                            <NavLinks isMobile closeMenu={() => setIsOpen(false)} />
                        </Suspense>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar