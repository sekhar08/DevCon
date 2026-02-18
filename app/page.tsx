import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { cacheLife } from "next/cache";
import connectDB from "@/lib/mongodb";
import { Event, type IEvent } from "@/database";

export default async function Home() {
  'use cache';

  cacheLife('minutes')
  await connectDB();
  const eventsData: IEvent[] = await Event.find().sort({ createdAt: -1 }).lean();
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev Event <br /> You Can&apos;t Miss</h1>
      <p className="text-center mt-4">Hackathons, Meetups and Confreneces. All in one place</p>
      <ExploreBtn />


      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ol className="events">
          {eventsData.map((event: any) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
