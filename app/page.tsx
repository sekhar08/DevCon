import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

export default async function Home() {
  const events = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
  const data = await events.json();
  console.log(data.events);  
  const eventsData = data.events;
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
