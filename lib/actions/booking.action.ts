'use server';

import Booking from '@/database/booking.model';
import connectDB from "@/lib/mongodb";

export const createUserBooking = async ({ eventId, email }: { eventId: string; email: string; }) => {
    try {
        await connectDB();

        const normalizedEmail = email.trim().toLowerCase();

        // Check if a booking already exists for this event and email
        const existingBooking = await Booking.findOne({ eventId, email: normalizedEmail });
        if (existingBooking) {
            return { success: false, alreadyBooked: true };
        }

        await Booking.create({ eventId, email: normalizedEmail });

        return { success: true };
    } catch (e: any) {
        // Handle potential race-condition duplicate key errors from the unique index
        if (e && typeof e === 'object' && 'code' in e && e.code === 11000) {
            return { success: false, alreadyBooked: true };
        }

        console.error('create booking failed', e);
        return { success: false };
    }
}
