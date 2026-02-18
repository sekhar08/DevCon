import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> },
) {
    try {
        await connectDB();
        const { slug } = await context.params;
        const event = await Event.findOne({ slug }).lean();
        return NextResponse.json({ message: "Event fetched successfully", event }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
}
