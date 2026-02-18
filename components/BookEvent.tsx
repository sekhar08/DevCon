'use client';

import React, { useState } from "react";
import { createUserBooking } from "@/lib/actions/booking.action";

const BookEvent = ({ eventId }: { eventId: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [alreadyBookedEmail, setAlreadyBookedEmail] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setAlreadyBookedEmail(null);

        const { success, alreadyBooked } = await createUserBooking({ eventId, email });

        if (success) {
            setSubmitted(true);
            return;
        }

        if (alreadyBooked) {
            setSubmitted(false);
            setAlreadyBookedEmail(email);

            const message = `Booking failed: ${email} is already registered for this event.`;
            alert(message);
        }

    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form
                    onSubmit={(e) => {
                        if (!email.trim()) {
                            e.preventDefault();
                            alert("Email is missing");
                            return;
                        }
                        handleSubmit(e);
                    }}
                >
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                        />
                    </div>

                    <button
                        type="submit"
                        className="button-submit"
                        disabled={!email.trim()}
                    >
                        Submit
                    </button>

                    {alreadyBookedEmail && (
                        <p className="already-booked-msg">
                            Booking failed: <strong>{alreadyBookedEmail}</strong> is already registered for this event.
                        </p>
                    )}
                </form>
            )}
        </div>
    )
}
export default BookEvent