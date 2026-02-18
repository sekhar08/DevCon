import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import cloudinary from "cloudinary";

export async function POST(request: NextRequest) {  
    try{
        await connectDB();
        const { title, description, overview, image, venue, location, date, time, mode, audience, agenda, organizer, tags } = await request.json();

        let event;

        try{
            
            const imageUrl = await cloudinary.v2.uploader.upload(image, {
                resource_type: 'image',
                folder: 'DevEvents',
            });
            console.log(imageUrl);

            event = await Event.create({ title, description, overview, image: imageUrl.secure_url, venue, location, date, time, mode, audience, agenda, organizer, tags });
        }
        catch(error){
            console.error(error);
            return NextResponse.json({ error: "Invalid event data" }, { status: 400 });
        }

        return NextResponse.json({ message: "Event created successfully", event:event }, { status: 201 });
    }



    catch(error){
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function GET(request: NextRequest) {
    try{
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
    }
    catch(error){
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}