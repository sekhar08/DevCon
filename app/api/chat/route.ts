import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: google('gemini-1.5-flash'),
        messages,
        system: "You are DevCon AI, a helpful AI assistant for the DevCon platform. Help users find events. If they ask for events, use the `searchEvents` tool to query the database using appropriate tags/keywords. Summarize the results nicely.",
        tools: {
            searchEvents: tool({
                description: 'Search the database for relevant dev events based on tags or keywords. Returns a list of events.',
                inputSchema: z.object({
                    tags: z.array(z.string()).describe('An array of tags or keywords. E.g. ["web", "ai", "hackathon"]'),
                }),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                execute: async ({ tags }: any) => {
                    await connectDB();
                    const query = tags.length > 0 ? { tags: { $in: tags.map((t: string) => new RegExp(t, 'i')) } } : {};
                    const events = await Event.find(query).limit(5).lean();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return events.map((e: any) => ({
                        ...e,
                        _id: e._id.toString(),
                        userId: e.userId.toString(),
                    }));
                },
            }),
        },
    });

    return result.toUIMessageStreamResponse();
}
