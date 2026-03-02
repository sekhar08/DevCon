"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/lib/actions/booking.action";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";

interface Attendee {
    _id: string;
    email: string;
    status: 'rsvp' | 'confirmed' | 'rejected';
    createdAt: string;
}

export default function AttendeeCard({ attendee }: { attendee: Attendee }) {
    const [status, setStatus] = useState(attendee.status);
    const [loading, setLoading] = useState(false);

    const handleAction = async (newStatus: 'confirmed' | 'rejected') => {
        setLoading(true);
        try {
            const res = await updateBookingStatus(attendee._id, newStatus);
            if (res.success) {
                setStatus(newStatus);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-dark-200/50 border border-border-dark/60 rounded-xl mt-3 transition-colors hover:bg-dark-200/80">
            <div className="flex flex-col gap-1">
                <p className="font-martian-mono text-sm text-light-100 truncate max-w-[200px] sm:max-w-[300px]">
                    {attendee.email}
                </p>
                <div className="flex items-center gap-2">
                    {status === 'rsvp' && <Clock size={12} className="text-primary/70" />}
                    {status === 'confirmed' && <CheckCircle2 size={12} className="text-green-500" />}
                    {status === 'rejected' && <XCircle size={12} className="text-red-500" />}
                    <span className={`text-[10px] uppercase font-martian-mono tracking-wider ${status === 'confirmed' ? 'text-green-500' :
                            status === 'rejected' ? 'text-red-500' : 'text-primary/70'
                        }`}>
                        {status === 'rsvp' ? 'Pending Review' : status}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {loading ? (
                    <div className="p-2 border border-border-dark bg-dark-200 rounded-lg h-9 w-9 flex-center">
                        <Loader2 size={16} className="text-primary animate-spin" />
                    </div>
                ) : (
                    <>
                        {status !== 'confirmed' && (
                            <button
                                onClick={() => handleAction('confirmed')}
                                className="px-3 py-1.5 bg-dark-200/80 border border-green-500/30 text-green-500 hover:bg-green-500/10 hover:border-green-500/50 text-xs font-martian-mono uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1.5"
                                title="Approve"
                            >
                                <CheckCircle2 size={14} />
                                <span className="hidden sm:inline">Approve</span>
                            </button>
                        )}

                        {status !== 'rejected' && (
                            <button
                                onClick={() => handleAction('rejected')}
                                className="px-3 py-1.5 bg-dark-200/80 border border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 text-xs font-martian-mono uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1.5"
                                title="Reject"
                            >
                                <XCircle size={14} />
                                <span className="hidden sm:inline">Reject</span>
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
