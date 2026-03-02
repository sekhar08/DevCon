import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { title, description, overview, image, venue, location, date, time, mode, audience, agenda, organizer, tags } = await request.json();

        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true,
            });

            const imageUrl = await cloudinary.uploader.upload(image, {
                resource_type: "image",
                folder: "DevEvents",
            });

            const event = await Event.create({
                title, description, overview, image: imageUrl.secure_url,
                venue, location, date, time, mode, audience, agenda, organizer, tags,
                userId: session.user.id
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}