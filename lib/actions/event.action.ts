'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { cookies } from "next/headers";

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