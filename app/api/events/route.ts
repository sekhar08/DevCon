import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { title, description, overview, image, venue, location, date, time, mode, audience, agenda, organizer, tags } = await request.json();

        try {
            const imageUrl = await cloudinary.uploader.upload(image, {
                resource_type: "image",
                folder: "DevEvents",
            });

            const event = await Event.create({
                title, description, overview, image: imageUrl.secure_url,
                venue, location, date, time, mode, audience, agenda, organizer, tags,
            });

            return NextResponse.json({ message: "Event created successfully", event }, { status: 201 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Invalid event data" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}