"use client";

import { useState, Suspense, useEffect, useRef } from "react"
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const baseLinks = [
        { name: "Home", href: "/" },
        { name: "Events", href: "/events" },
    ];

    if (!session.data) {
        baseLinks.push({ name: "Sign In", href: "/auth" });
    }

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth");
                }
            }
        });
        if (closeMenu) closeMenu();
    };

    return (
        <ul className={isMobile
            ? "flex flex-col items-center gap-4 px-4 py-8"
            : "flex items-center gap-1 p-1 bg-dark-200/50 backdrop-blur-sm rounded-full border border-border-dark/40"}>
            {baseLinks.map((link) => {
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
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center justify-center rounded-full border-2 transition-colors focus:outline-none ml-1 ${isDropdownOpen ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                    >
                        {session.data.user?.image ? (
                            <Image
                                src={session.data.user.image}
                                alt="Profile"
                                width={36}
                                height={36}
                                className="rounded-full object-cover w-9 h-9"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {session.data.user?.name?.charAt(0)?.toUpperCase() || session.data.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`${isMobile ? 'relative mt-4 w-[200px] text-center' : 'absolute right-0 mt-2 w-48'} rounded-xl bg-dark-200 border border-border-dark/60 shadow-xl overflow-hidden z-[100]`}
                            >
                                <div className="py-2 flex flex-col">
                                    <Link
                                        href="/your-events"
                                        onClick={() => { setIsDropdownOpen(false); if (closeMenu) closeMenu(); }}
                                        className="block px-4 py-2.5 text-sm text-light-200 hover:bg-dark-300 hover:text-white transition-colors"
                                    >
                                        Your events
                                    </Link>
                                    <Link
                                        href="/createEvent"
                                        onClick={() => { setIsDropdownOpen(false); if (closeMenu) closeMenu(); }}
                                        className="block px-4 py-2.5 text-sm text-light-200 hover:bg-dark-300 hover:text-white transition-colors"
                                    >
                                        Create Event
                                    </Link>
                                    <div className="h-px bg-border-dark/60 my-1"></div>
                                    <button
                                        onClick={handleSignOut}
                                        className={`w-full px-4 py-2.5 text-sm text-red-500 hover:bg-dark-300 hover:text-red-400 transition-colors ${isMobile ? 'text-center' : 'text-left'}`}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
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