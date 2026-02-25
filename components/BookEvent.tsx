'use client';

import React, { useState, useEffect } from "react";
import { createUserBooking, checkUserBooking } from "@/lib/actions/booking.action";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function BookEvent({ eventId }: { eventId: string }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'initializing'>('initializing');
    const [bookingStatus, setBookingStatus] = useState<'rsvp' | 'confirmed' | 'rejected' | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchStatus() {
            try {
                const res = await checkUserBooking({ eventId });
                if (isMounted) {
                    if (res?.isBooked) {
                        setBookingStatus(res.status as 'rsvp' | 'confirmed' | 'rejected');
                        setStatus('success');
                    } else {
                        setStatus('idle');
                    }
                }
            } catch {
                if (isMounted) setStatus('idle'); // Fallback to allowing registration
            }
        }

        fetchStatus();

        return () => { isMounted = false; };
    }, [eventId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage(null);

        try {
            const result = await createUserBooking({ eventId });

            if (result?.success || result?.alreadyBooked) {
                setStatus('success');
                setBookingStatus(result.bookingStatus as 'rsvp' | 'confirmed' | 'rejected');

                if (result.success) {
                    toast.success("Successfully sent RSVP request!");
                }
                return;
            }

            setStatus('error');
            if (result?.error) {
                setErrorMessage(result.error);
                toast.error(result.error);
            } else {
                setErrorMessage("An unexpected error occurred.");
                toast.error("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error('Booking error:', error);
            setStatus('error');
            setErrorMessage("System error during registration request.");
            toast.error("A system error occurred.");
        }
    }

    if (status === 'initializing') {
        return (
            <div className="flex items-center justify-center py-6 border border-border-dark/60 bg-dark-200/10 rounded-md">
                <Loader2 size={18} className="animate-spin text-primary opacity-50" />
            </div>
        );
    }

    if (status === 'success' && bookingStatus === 'confirmed') {
        return (
            <div className="bg-primary/10 border border-primary/30 rounded-md p-6 text-center shadow-[0_0_20px_rgba(89,222,202,0.1)] flex flex-col items-center gap-2">
                <CheckCircle2 size={24} className="text-primary mb-1" />
                <p className="font-martian-mono text-sm uppercase tracking-wider text-primary font-bold">
                    You&apos;re going!
                </p>
                <p className="text-light-200/70 text-xs mt-1">
                    Your spot at this event has been confirmed in the mainframe.
                </p>
            </div>
        );
    }

    if (status === 'success' && bookingStatus === 'rsvp') {
        return (
            <div className="bg-dark-200/40 border border-primary/20 rounded-md p-6 text-center shadow-[0_0_20px_rgba(89,222,202,0.05)]">
                <p className="font-martian-mono text-sm uppercase tracking-wider text-primary">
                    RSVP Registered
                </p>
                <p className="text-light-200/70 text-xs mt-2">
                    Organizer will approve the request, sit tight or code until then.
                </p>
            </div>
        );
    }

    if (status === 'success' && bookingStatus === 'rejected') {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-6 text-center">
                <p className="font-martian-mono text-sm uppercase tracking-wider text-red-400">
                    Registration Denied
                </p>
                <p className="text-light-200/70 text-xs mt-2">
                    The organizer has declined this registration request.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <button
                type="submit"
                disabled={status === 'loading'}
                className="group relative w-full flex items-center justify-center gap-2 py-4 bg-primary text-[#030708] font-martian-mono uppercase tracking-[0.2em] font-bold text-sm overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(89,222,202,0.4)] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-md"
            >
                {status === 'loading' ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    "Register to Event"
                )}
            </button>

            {errorMessage && (
                <p className="text-red-400 font-martian-mono text-[10px] uppercase tracking-wider text-center border border-red-500/10 bg-red-500/5 p-3 rounded-md">
                    [ERROR]: {errorMessage}
                </p>
            )}
        </form>
    );
}