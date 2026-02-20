import { Suspense } from "react";
import { cookies } from "next/headers";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { getEvents } from "@/lib/actions/event.action";
import BlurIn from "@/components/BlurIn";
import { StaggerContainer, FadeInUp } from "@/components/StaggerIn";

async function EventsList() {
  // Ensure this component reads request data before any underlying time-based work
  await cookies();

  const events = await getEvents();

  return (
    <StaggerContainer className="events">
      {events.map((event) => (
        <FadeInUp key={event.title} className="w-full">
          <EventCard {...event} />
        </FadeInUp>
      ))}
    </StaggerContainer>
  );
}

export default function Home() {
  return (
    <section
      id="home"
      className="flex flex-col items-center text-center gap-10 pt-6 sm:pt-10 relative"
    >
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[60vw] h-[300px] opacity-10 pointer-events-none blur-[100px] mix-blend-screen bg-primary" />

      <div className="max-w-4xl space-y-6 z-10 flex flex-col items-center justify-center pt-8">
        <BlurIn delay={0.1}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-dark-200/50 border border-primary/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] font-martian-mono tracking-[0.3em] text-primary/80 uppercase">
              Curated for developers worldwide
            </p>
          </div>
        </BlurIn>

        <BlurIn delay={0.2} className="w-full">
          <h1>
            The Hub for Every Dev Event <br /> You Can&apos;t Miss
          </h1>
        </BlurIn>

        <BlurIn delay={0.3}>
          <p className="subheading max-w-2xl mx-auto">
            Hackathons, meetups, and conferences – all in one place. Discover
            what&apos;s next for your career and community.
          </p>
        </BlurIn>
      </div>

      <BlurIn delay={0.4} className="z-10 mt-2">
        <ExploreBtn />
      </BlurIn>

      <BlurIn delay={0.5} className="featured-panel relative overflow-hidden z-10 w-full group">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay transition-opacity duration-700 group-hover:opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="featured-header relative z-10 mb-8 border-b border-border-dark/50 pb-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary/70 block" />
              <p className="featured-kicker text-primary">Featured lineup</p>
            </div>
            <h3 className="text-3xl font-schibsted-grotesk tracking-tight">Upcoming events</h3>
          </div>
          <p className="hidden text-sm text-light-200/60 sm:block max-w-[280px] text-right leading-relaxed">
            Handpicked experiences from the global dev community.
          </p>
        </div>

        <div className="relative z-10">
          <Suspense fallback={<div className="h-40 flex items-center justify-center font-martian-mono text-sm text-primary/50 animate-pulse">Loading events...</div>}>
            <EventsList />
          </Suspense>
        </div>
      </BlurIn>
    </section>
  );
}
