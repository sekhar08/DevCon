"use client"

import { useState } from "react";
import { Loader2, Terminal, ChevronRight } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    return (
        <div className="w-full h-full flex items-center justify-center p-4 py-12">
            <div className="relative w-full max-w-md bg-dark-100 border border-primary/20 p-8 shadow-[0_0_40px_rgba(89,222,202,0.05)] backdrop-blur-xl group z-10">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary" />

                {/* Scanlines Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#59deca_2px,#59deca_4px)]" />

                <div className="relative z-10 flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <Terminal size={20} className="animate-pulse" />
                            <span className="font-martian-mono text-xs uppercase tracking-[0.3em] font-bold">System.Auth</span>
                        </div>
                        <h1 className="font-schibsted-grotesk text-3xl font-bold text-white tracking-tight">
                            INITIATE_SESSION
                        </h1>
                        <p className="font-martian-mono text-xs uppercase tracking-wider text-light-200/50">
                            Enter credentials to access mainframe
                        </p>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2 relative group/input">
                            <label htmlFor="email" className="font-martian-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                                Identifier [Email]
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="sysadmin@devcon.net"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full bg-dark-200/40 border-b-2 border-t-0 border-x-0 border-border-dark/60 px-4 py-3 text-light-100 focus:outline-none focus:border-primary focus:bg-dark-200/60 transition-all font-martian-mono text-sm placeholder:text-light-200/20 rounded-t-md rounded-b-none"
                            />
                        </div>

                        <div className="flex flex-col gap-2 relative group/input">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="font-martian-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                                    Passkey [Password]
                                </label>
                                <Link
                                    href="#"
                                    className="font-martian-mono text-[10px] uppercase tracking-wider text-primary/50 hover:text-primary transition-colors hover:underline"
                                >
                                    Forgot Passkey?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-200/40 border-b-2 border-t-0 border-x-0 border-border-dark/60 px-4 py-3 text-light-100 focus:outline-none focus:border-primary focus:bg-dark-200/60 transition-all font-martian-mono text-sm placeholder:text-light-200/20 rounded-t-md rounded-b-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="peer appearance-none w-4 h-4 border border-primary/40 rounded-sm bg-dark-200/40 checked:bg-primary checked:border-primary cursor-pointer transition-colors"
                                    onChange={() => setRememberMe(!rememberMe)}
                                    checked={rememberMe}
                                />
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 peer-checked:opacity-100 text-[#030708]">
                                    <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                                        <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <label htmlFor="remember" className="font-martian-mono text-xs uppercase tracking-wider text-light-200/70 cursor-pointer select-none">
                                Persist Session
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            onClick={async () => {
                                await signIn.email({
                                    email,
                                    password,
                                    rememberMe,
                                    fetchOptions: {
                                        onRequest: () => setLoading(true),
                                        onResponse: () => setLoading(false),
                                        onSuccess: () => router.push("/"),
                                    },
                                });
                            }}
                            className="group relative w-full flex items-center justify-center gap-2 py-4 mt-2 bg-primary text-[#030708] font-martian-mono uppercase tracking-[0.2em] font-bold text-sm overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(89,222,202,0.4)] hover:bg-white disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Execute</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center my-2">
                        <div className="flex-grow border-t border-primary/10"></div>
                        <span className="flex-shrink-0 mx-4 font-martian-mono text-[9px] uppercase tracking-[0.3em] text-light-200/30">
                            External Auth
                        </span>
                        <div className="flex-grow border-t border-primary/10"></div>
                    </div>

                    {/* Social Auth */}
                    <div className="flex flex-col gap-3">
                        <button
                            disabled={loading}
                            onClick={async () => {
                                await signIn.social({
                                    provider: "google",
                                    callbackURL: "/",
                                    fetchOptions: {
                                        onRequest: () => setLoading(true),
                                        onResponse: () => setLoading(false),
                                    },
                                });
                            }}
                            className="cursor-pointer w-full flex items-center justify-center gap-3 py-3 bg-dark-200/30 border border-primary/20 text-light-100 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all font-martian-mono text-xs tracking-wider uppercase group cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 262" className="group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">
                                <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                                <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                            </svg>
                            Connect Google
                        </button>

                        <button
                            disabled={loading}
                            onClick={async () => {
                                await signIn.social({
                                    provider: "github",
                                    callbackURL: "/",
                                    fetchOptions: {
                                        onRequest: () => setLoading(true),
                                        onResponse: () => setLoading(false),
                                    },
                                });
                            }}
                            className="cursor-pointer w-full flex items-center justify-center gap-3 py-3 bg-dark-200/30 border border-primary/20 text-light-100 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all font-martian-mono text-xs tracking-wider uppercase group cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
                                <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path>
                            </svg>
                            Connect GitHub
                        </button>
                    </div>

                    {/* Sign-up Link */}
                    <div className="mt-2 pt-6 border-t border-border-dark flex justify-center text-center">
                        <p className="font-martian-mono text-xs text-light-200/50 uppercase tracking-widest">
                            No credentials?{" "}
                            <Link href="/sign-up" className="text-primary hover:text-white transition-colors underline decoration-primary/30 hover:decoration-white underline-offset-4 font-bold ml-1">
                                Initiate Sign-Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
