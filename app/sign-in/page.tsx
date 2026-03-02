import SignIn from "@/components/sign-in";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function AuthGuard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session && session.user) {
        redirect("/");
    }

    return <SignIn />;
}

export default function SignInRoute() {
    return (
        <div className="flex w-full items-center justify-center min-h-[calc(100vh-140px)]">
            <Suspense fallback={<div className="font-martian-mono text-primary/50 text-sm tracking-widest uppercase animate-pulse">Initializing Auth Matrix...</div>}>
                <AuthGuard />
            </Suspense>
        </div>
    );
}
