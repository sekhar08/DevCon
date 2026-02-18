import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

type RouteParams = {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
        
    try{
        await connectDB();
        const { slug } = await params;
        const event = await Event.findOne({ slug }).lean();
        return NextResponse.json({ message: "Event fetched successfully", event }, { status: 200 });
    }
    catch(error){
        console.error(error);
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
}
