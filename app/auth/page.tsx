"use client"

import SignInPage from "@/components/Signin-page";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function SignIn() {

    const session = useSession();

    if (session.data) {
        redirect("/");
    }

    return (
        <SignInPage />
    );
}