'use server';

import Booking from '@/database/booking.model';
import connectDB from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createUserBooking = async ({ eventId }: { eventId: string; }) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return { success: false, error: 'Unauthorized. Please sign in to book an event.' };
        }

        await connectDB();

        const normalizedEmail = session.user.email.trim().toLowerCase();
        const userId = session.user.id;

        // Check if a booking already exists for this event and user
        const existingBooking = await Booking.findOne({ eventId, userId });
        if (existingBooking) {
            return { success: false, alreadyBooked: true, bookingStatus: existingBooking.status };
        }

        const newBooking = await Booking.create({ eventId, email: normalizedEmail, userId });

        return { success: true, bookingStatus: newBooking.status };
    } catch (e: unknown) {
        // Handle potential race-condition duplicate key errors from the unique index
        if (e && typeof e === 'object' && 'code' in e && (e as { code: number }).code === 11000) {
            return { success: false, alreadyBooked: true, bookingStatus: 'rsvp' };
        }

        console.error('create booking failed', e);
        return { success: false };
    }
}

export const checkUserBooking = async ({ eventId }: { eventId: string; }) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return { success: true, isBooked: false, status: null }; // Not logged in means not booked
        }

        await connectDB();

        const userId = session.user.id;
        const existingBooking = await Booking.findOne({ eventId, userId });

        if (existingBooking) {
            return { success: true, isBooked: true, status: existingBooking.status };
        }

        return { success: true, isBooked: false, status: null };
    } catch (e) {
        console.error('check booking failed', e);
        return { success: false, isBooked: false, status: null };
    }
}
