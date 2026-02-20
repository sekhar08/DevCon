import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = params.then((p) => p.slug);

    return (
        <main>
            <Suspense fallback={
                <div className="w-full h-[60vh] flex-center">
                    <div className="flex flex-col items-center gap-4">
                        <span className="inline-block w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="font-martian-mono text-xs tracking-[0.2em] text-primary/50 uppercase">Decoding Event...</p>
                    </div>
                </div>
            }>
                <EventDetails params={slug} />
            </Suspense>
        </main>
    )
}
export default EventDetailsPage