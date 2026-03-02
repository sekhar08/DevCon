'use server';

import Event, { IEvent } from '@/database/event.model';
import Booking, { IBooking } from '@/database/booking.model';
import connectDB from "@/lib/mongodb";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });
        if (!event) {
            return []
        }

        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();
    } catch {
        return [];
    }
}

export const getEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug }).lean();
        if (!event) return null;

        return {
            ...event,
            _id: event._id.toString()
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getEvents = async () => {
    try {
        // Access request data first so using current time (via DB driver) is allowed
        await cookies();

        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 }).lean();

        return events.map((event) => ({
            ...event,
            _id: event._id.toString(),
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getUserCreatedEvents = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) return [];

        await connectDB();
        const events = await Event.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

        return events.map((event: IEvent) => ({
            ...event,
            _id: event._id.toString(),
        }));
    } catch (error) {
        console.error("Error fetching user created events:", error);
        return [];
    }
}

export const getUserBookedEvents = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) return [];

        await connectDB();

        // Find all bookings for this user
        const bookings = await Booking.find({ userId: session.user.id }).lean();

        if (!bookings.length) return [];

        // Extract event IDs
        const eventIds = bookings.map((booking: IBooking) => booking.eventId);

        // Find all events that match these IDs
        const events = await Event.find({ _id: { $in: eventIds } }).sort({ createdAt: -1 }).lean();

        // Create a map to attach the status to the event if needed by the UI, 
        // passing standard event info for now
        return events.map((event: IEvent) => {
            const booking = bookings.find((b: IBooking) => b.eventId.toString() === event._id.toString());
            return {
                ...event,
                _id: event._id.toString(),
                bookingStatus: booking?.status || 'rsvp'
            };
        });
    } catch (error) {
        console.error("Error fetching user booked events:", error);
        return [];
    }
}