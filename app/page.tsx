import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

export default function Home() {
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev Event <br /> You Can&apos;t Miss</h1>
      <p className="text-center mt-4">Hackathons, Meetups and Confreneces. All in one place</p>
      <ExploreBtn />


      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ol className="events">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
