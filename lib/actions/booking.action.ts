'use server';

import Booking, { IBooking } from '@/database/booking.model';
import connectDB from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Event from '@/database/event.model';

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

export const getEventAttendees = async ({ eventId }: { eventId: string }) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) return [];

        await connectDB();

        // Ensure the current user is the owner of this event
        const event = await Event.findById(eventId).lean();
        if (!event || event.userId !== session.user.id) {
            return [];
        }

        const attendees = await Booking.find({ eventId }).sort({ createdAt: -1 }).lean();

        return attendees.map((attendee: IBooking) => ({
            ...attendee,
            _id: attendee._id.toString(),
            eventId: attendee.eventId.toString(),
        }));
    } catch (e) {
        console.error('fetch attendees failed', e);
        return [];
    }
}

export const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'rejected') => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) return { success: false };

        await connectDB();

        // Look up the booking
        const booking = await Booking.findById(bookingId).lean();
        if (!booking) return { success: false };

        // Verify caller is owner of the event that the booking references
        const event = await Event.findById(booking.eventId).lean();
        if (!event || event.userId !== session.user.id) {
            return { success: false };
        }

        // Update booking status
        await Booking.findByIdAndUpdate(bookingId, { status });
        return { success: true };

    } catch (e) {
        console.error('update booking status failed', e);
        return { success: false };
    }
}
