import {
    createAuthClient
} from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV === "production" ? "https://dev-con-ruddy.vercel.app" : "http://localhost:3000",
});

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;
