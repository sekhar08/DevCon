import { Suspense } from "react";
import { cookies } from "next/headers";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { getEvents } from "@/lib/actions/event.action";

async function EventsList() {
  const events = await getEvents();

  return (
    <ol className="events">
      {events.map((event) => (
        <li key={event.title}>
          <EventCard {...event} />
        </li>
      ))}
    </ol>
  );
}

export default function Home() {
  // Access request data before any underlying time-based operations
  cookies();

  return (
    <section
      id="home"
      className="flex flex-col items-center text-center gap-10 pt-6 sm:pt-10"
    >
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-martian-mono tracking-[0.25em] uppercase text-light-200">
          Curated for developers worldwide
        </p>
        <h1>
          The Hub for Every Dev Event <br /> You Can&apos;t Miss
        </h1>
        <p className="subheading">
          Hackathons, meetups, and conferences – all in one place. Discover
          what&apos;s next for your career and community.
        </p>
      </div>

      <ExploreBtn />

      <div className="featured-panel">
        <div className="featured-header">
          <div className="space-y-1 text-left">
            <p className="featured-kicker">Featured lineup</p>
            <h3>Upcoming events</h3>
          </div>
          <p className="hidden text-sm text-light-200 sm:block">
            Handpicked experiences from the global dev community.
          </p>
        </div>

        <Suspense fallback={<div>Loading events...</div>}>
          <EventsList />
        </Suspense>
      </div>
    </section>
  );
}
