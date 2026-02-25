"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, X, Terminal, UserPlus, Upload } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4 py-12">
            <div className="relative w-full max-w-lg bg-dark-100 border border-primary/20 p-8 shadow-[0_0_40px_rgba(89,222,202,0.05)] backdrop-blur-xl group z-10">
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
                            <span className="font-martian-mono text-xs uppercase tracking-[0.3em] font-bold">System.Registry</span>
                        </div>
                        <h1 className="font-schibsted-grotesk text-3xl font-bold text-white tracking-tight">
                            NEW_USER_PROTOCOL
                        </h1>
                        <p className="font-martian-mono text-xs uppercase tracking-wider text-light-200/50">
                            Provide parameters to generate clearance
                        </p>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="first-name" className="font-martian-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                                    Param: First_Name
                                </label>
                                <input
                                    id="first-name"
                                    placeholder="JAY"
                                    required
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                    className="w-full bg-dark-200/40 border-b-2 border-t-0 border-x-0 border-border-dark/60 px-4 py-3 text-light-100 focus:outline-none focus:border-primary focus:bg-dark-200/60 transition-all font-martian-mono text-sm placeholder:text-light-200/20 rounded-t-md rounded-b-none"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="last-name" className="font-martian-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                                    Param: Last_Name
                                </label>
                                <input
                                    id="last-name"
                                    placeholder="DOE"
                                    required
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                    className="w-full bg-dark-200/40 border-b-2 border-t-0 border-x-0 border-border-dark/60 px-4 py-3 text-light-100 focus:outline-none focus:border-primary focus:bg-dark-200/60 transition-all font-martian-mono text-sm placeholder:text-light-200/20 rounded-t-md rounded-b-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-martian-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                                Identifier [Email]
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="operator@devcon.net"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full bg-dark-200/40 border-b-2 border-t-0 border-x-0 border-border-dark/60 px-4 py-3 text-light-100 focus:outline-none focus:border-primary focus:bg-dark-200/60 transition-all font-martian-mono text-sm placeholder:text-light-200/20 rounded-t-md rounded-b-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="font-martian-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                                    Set Passkey
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="w-full bg-dark-200/40 border-b-2 border-t-0 border-x-0 border-border-dark/60 px-4 py-3 text-light-100 focus:outline-none focus:border-primary focus:bg-dark-200/60 transition-all font-martian-mono text-sm placeholder:text-light-200/20 rounded-t-md rounded-b-none"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password_confirmation" className="font-martian-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                                    Verify Passkey
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="w-full bg-dark-200/40 border-b-2 border-t-0 border-x-0 border-border-dark/60 px-4 py-3 text-light-100 focus:outline-none focus:border-primary focus:bg-dark-200/60 transition-all font-martian-mono text-sm placeholder:text-light-200/20 rounded-t-md rounded-b-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="font-martian-mono text-[10px] uppercase tracking-[0.2em] text-primary/70 mb-1">
                                Avatar_Data [Optional]
                            </label>
                            <div className="flex items-center gap-4">
                                {imagePreview ? (
                                    <div className="relative w-16 h-16 rounded-sm overflow-hidden border border-primary/40 group/avatar">
                                        <Image
                                            src={imagePreview}
                                            alt="Avatar preview"
                                            fill
                                            style={{ objectFit: "cover" }}
                                            className="opacity-80 group-hover/avatar:opacity-100 transition-opacity"
                                        />
                                        <div
                                            className="absolute inset-0 bg-red-500/20 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity backdrop-blur-[2px]"
                                            onClick={() => {
                                                setImage(null);
                                                setImagePreview(null);
                                                const el = document.getElementById('image-upload') as HTMLInputElement;
                                                if (el) el.value = '';
                                            }}
                                        >
                                            <X size={20} className="text-white drop-shadow-md" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-sm border border-dashed border-border-dark/80 bg-dark-200/30 flex items-center justify-center shrink-0">
                                        <Upload size={18} className="text-light-200/30" />
                                    </div>
                                )}

                                <div className="relative flex-1">
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full bg-dark-200/40 border border-border-dark/60 border-dashed rounded-md px-4 py-3 flex items-center justify-between text-light-200/50 hover:border-primary/40 hover:text-primary/70 transition-colors font-martian-mono text-xs tracking-wider cursor-pointer">
                                        <span>{imagePreview ? 'REPLACE_IMAGE' : 'SELECT_IMAGE_FILE'}</span>
                                        <Upload size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password || password !== passwordConfirmation}
                            onClick={async () => {
                                if (password !== passwordConfirmation) {
                                    toast.error("Passkeys do not match");
                                    return;
                                }
                                await signUp.email({
                                    email,
                                    password,
                                    name: `${firstName} ${lastName}`,
                                    image: image ? await convertImageToBase64(image) : "",
                                    callbackURL: "/",
                                    fetchOptions: {
                                        onResponse: () => setLoading(false),
                                        onRequest: () => setLoading(true),
                                        onError: (ctx) => toast.error(ctx.error.message),
                                        onSuccess: () => router.push("/"),
                                    },
                                });
                            }}
                            className="group relative w-full flex items-center justify-center gap-2 py-4 mt-4 bg-primary text-[#030708] font-martian-mono uppercase tracking-[0.2em] font-bold text-sm overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(89,222,202,0.4)] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <UserPlus size={18} className="mr-1" />
                                    <span>Compile Registry</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Sign-in Link */}
                    <div className="mt-2 pt-6 border-t border-border-dark flex justify-center text-center">
                        <p className="font-martian-mono text-xs text-light-200/50 uppercase tracking-widest">
                            Registry exists?{" "}
                            <Link href="/sign-in" className="text-primary hover:text-white transition-colors underline decoration-primary/30 hover:decoration-white underline-offset-4 font-bold ml-1">
                                Initiate Session
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
