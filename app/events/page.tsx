import { Suspense } from "react";
import { cookies } from "next/headers";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/actions/event.action";
import BlurIn from "@/components/BlurIn";
import { StaggerContainer, FadeInUp } from "@/components/StaggerIn";

async function AllEvents() {
  await cookies();

  const events = await getEvents();

  if (events.length === 0) {
    return (
      <div className="w-full flex-center py-20 border border-dashed border-border-dark/60 rounded-xl bg-dark-200/20">
        <p className="font-martian-mono text-sm tracking-widest text-primary/60 uppercase">
          [ No events detected. System standby. ]
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer className="events relative z-10">
      {events.map((event) => (
        <FadeInUp key={event._id} className="h-full">
          <EventCard
            title={event.title}
            image={event.image}
            slug={event.slug}
            location={event.location}
            date={event.date}
            time={event.time}
          />
        </FadeInUp>
      ))}
    </StaggerContainer>
  );
}

const EventsPage = () => {
  return (
    <section id="events" className="flex flex-col gap-12 pt-6 sm:pt-10 pb-20 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute -left-[10%] top-[20%] w-[300px] h-[300px] bg-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border-dark/60 pb-8 relative z-10">
        <div className="space-y-4 max-w-2xl">
          <BlurIn delay={0.1}>
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary/80" />
              <p className="text-[10px] font-martian-mono tracking-[0.3em] uppercase text-primary/80">
                Global Registry
              </p>
            </div>
          </BlurIn>

          <BlurIn delay={0.2}>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-br from-white via-white to-light-200/50 bg-clip-text text-transparent">
              Event Directory
            </h1>
          </BlurIn>

          <BlurIn delay={0.3}>
            <p className="text-light-200/80 text-lg leading-relaxed max-w-xl">
              Access the complete schedule of developer operations. Synchronize your agenda with local meetups and global summits.
            </p>
          </BlurIn>
        </div>

        <BlurIn delay={0.4} className="flex gap-4 items-center">
          <div className="hidden md:flex gap-2">
            <div className="w-1 h-1 bg-border-dark" />
            <div className="w-1 h-1 bg-border-dark" />
            <div className="w-1 h-1 bg-border-dark" />
          </div>
          <div className="px-5 py-2.5 rounded border border-border-dark bg-dark-200/30 text-xs font-martian-mono tracking-widest text-light-200/50 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full border border-primary/50 relative flex items-center justify-center">
              <span className="w-1 h-1 bg-primary/80 rounded-full animate-ping" />
            </span>
            SYSTEM ONLINE
          </div>
        </BlurIn>
      </div>

      <div className="relative">
        {/* Subtle grid background to enhance Cyber-Industrial feel */}
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <Suspense fallback={
          <div className="w-full flex-center py-32 relative z-10 border border-border-dark/40 bg-dark-100/30 rounded-xl backdrop-blur-md">
            <div className="flex flex-col items-center gap-4">
              <span className="inline-block w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="font-martian-mono text-xs tracking-[0.2em] text-primary/50 uppercase">Loading Data...</p>
            </div>
          </div>
        }>
          <AllEvents />
        </Suspense>
      </div>
    </section>
  );
};

export default EventsPage;
