'use client';

import React, { useState } from "react";
import { createBooking } from "@/lib/actions/booking.action";

const BookEvent = (
    {
        eventId,
        slug,
        onEmailAlreadyBookedMessage,
    }: {
        eventId: string;
        slug: string;
        onEmailAlreadyBookedMessage?: (email: string) => React.ReactNode;
    },
) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [alreadyBookedEmail, setAlreadyBookedEmail] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setAlreadyBookedEmail(null);

        const { success, alreadyBooked } = await createBooking({ eventId, email });

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
            ): (
                <form onSubmit={handleSubmit}>
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

                    <button type="submit" className="button-submit">Submit</button>

                    {alreadyBookedEmail && onEmailAlreadyBookedMessage && (
                        <>
                            {onEmailAlreadyBookedMessage(alreadyBookedEmail)}
                        </>
                    )}
                </form>
            )}
        </div>
    )
}
export default BookEvent