"use client"

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function SignInPage() {
    const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

    const handleGoogleSignIn = async () => {
        setLoadingProvider("google");
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } finally {
            // Depending on redirect, this might not execute, but good practice
            setTimeout(() => setLoadingProvider(null), 1000)
        }
    };

    const handleGithubSignIn = async () => {
        setLoadingProvider("github");
        try {
            await signIn.social({
                provider: "github",
                callbackURL: "/",
            });
        } finally {
            setTimeout(() => setLoadingProvider(null), 1000)
        }
    };

    return (
        <div className="flex w-full items-center justify-center min-h-[calc(100vh-140px)]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative"
            >
                {/* Visual Flair Backgrounds */}
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />

                <div className="glass card-shadow flex w-full flex-col gap-8 rounded-2xl border border-border-dark p-8 sm:p-10 relative z-10 overflow-hidden">

                    {/* Scanline overlay effect */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
                        style={{
                            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--primary) 2px, var(--primary) 4px)'
                        }}
                    />

                    {/* Header */}
                    <div className="flex flex-col items-center gap-3 text-center mb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 10px var(--primary)' }}></span>
                            <span className="text-[10px] font-martian-mono tracking-[0.3em] uppercase text-light-200">System Login</span>
                            <span className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 10px var(--primary)' }}></span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-schibsted-grotesk tracking-tight text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-sm font-martian-mono text-light-200/60 max-w-[280px]">
                            Authenticate to access your dashboard and manage events.
                        </p>
                    </div>

                    {/* Auth Providers */}
                    <div className="flex flex-col gap-4 relative z-10">
                        {/* Google Button */}
                        <button
                            disabled={loadingProvider !== null}
                            onClick={handleGoogleSignIn}
                            className={cn(
                                "group relative flex items-center justify-center gap-3 w-full py-4 rounded-xl text-sm font-bold tracking-wider uppercase cursor-pointer transition-all duration-300 border border-border-dark/60",
                                "bg-dark-200/80 text-light-100 hover:border-primary/40 hover:bg-dark-200",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
                            {loadingProvider === "google" ? (
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            ) : (
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262">
                                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                                </svg>
                            )}
                            <span className="font-martian-mono text-xs mt-[2px] relative z-10">Google</span>
                        </button>

                        {/* Github Button */}
                        <button
                            disabled={loadingProvider !== null}
                            onClick={handleGithubSignIn}
                            className={cn(
                                "group relative flex items-center justify-center gap-3 w-full py-4 rounded-xl text-sm font-bold tracking-wider uppercase cursor-pointer transition-all duration-300 border border-border-dark/60",
                                "bg-dark-200/80 text-light-100 hover:border-primary/40 hover:bg-dark-200",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
                            {loadingProvider === "github" ? (
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            ) : (
                                <svg className="w-5 h-5 text-white filter drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" />
                                </svg>
                            )}
                            <span className="font-martian-mono text-xs mt-[2px] relative z-10">GitHub</span>
                        </button>
                    </div>

                    {/* Technical footer note */}
                    <div className="mt-4 border-t border-border-dark pt-6 text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-martian-mono text-primary/30">
                            SECURE CONNECTION // 2048-BIT ENCRYPTION
                        </p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}