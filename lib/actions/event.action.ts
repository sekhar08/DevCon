'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";

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

        // Ensure _id is string for client component props
        return {
            ...event,
            _id: event._id.toString()
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}