import React from 'react'
import { notFound } from "next/navigation";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug, getEventBySlug } from '@/lib/actions/event.action';
import Image from "next/image";
import BookEvent from './BookEvent';
import EventCard from "@/components/EventCard";
import AttendeeCard from "@/components/AttendeeCard";
import { getEventAttendees } from '@/lib/actions/booking.action';
import { IBooking } from '@/database/booking.model';
import { Document } from "mongoose";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ShieldAlert } from "lucide-react";

type BookingCore = Omit<IBooking, keyof Document | '_id' | 'eventId'> & { _id: string, eventId: string };

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string; }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div className="pill" key={tag}>{tag}</div>
        ))}
    </div>
)

const EventDetails = async ({ params }: { params: Promise<string> }) => {

    const slug = await params;

    const event = await getEventBySlug(slug);

    if (!event) {
        return notFound();
    }

    const { title, description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

    if (!description) return notFound();

    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

    // Authentication + Authorization Check for Event Owner
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isOwner = session && session.user && session.user.id === event.userId;
    let attendees: BookingCore[] = [];
    if (isOwner) {
        attendees = await getEventAttendees({ eventId: event._id });
    }

    return (
        <section id="event">
            <div className="header">
                <h1>{title}</h1>
                <p className="text-xl sm:text-2xl text-light-100/80 leading-relaxed font-light mt-4">{description}</p>
            </div>

            <div className="details">
                {/*    Left Side - Event Content */}
                <div className="content">
                    <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>

                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    </section>

                    <EventAgenda agendaItems={agenda} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tags} />
                </div>

                {/*    Right Side - Booking Form & Host Controls */}
                <aside className="flex flex-col gap-6 w-full max-w-[400px]">
                    <div className="signup-card w-full">
                        <h2>RSVP for this Event</h2>

                        {/* The BookEvent component below checks if the user email is already booked for this event */}
                        <BookEvent eventId={event._id} />

                    </div>

                    {isOwner && (
                        <div className="bg-dark-200/40 border border-primary/20 p-6 rounded-2xl shadow-[0_0_20px_rgba(89,222,202,0.05)] backdrop-blur-md">
                            <div className="flex items-center gap-3 border-b border-primary/20 pb-4 mb-4">
                                <ShieldAlert size={20} className="text-primary" />
                                <h3 className="font-schibsted-grotesk text-xl font-bold tracking-tight text-white">
                                    Host Controls
                                </h3>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <p className="font-martian-mono text-xs text-light-200/70 tracking-widest uppercase">
                                    Incoming Requests
                                </p>
                                <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded-full">
                                    {attendees.length}
                                </span>
                            </div>

                            {attendees.length === 0 ? (
                                <p className="text-sm text-light-200/50 italic py-4">No reservations detected.</p>
                            ) : (
                                <div className="flex flex-col max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {attendees.map((attendee) => (
                                        <AttendeeCard key={attendee._id} attendee={{
                                            _id: attendee._id,
                                            email: attendee.email,
                                            status: attendee.status,
                                            createdAt: attendee.createdAt.toString()
                                        }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                        <EventCard key={similarEvent.title} {...similarEvent} />
                    ))}
                </div>
            </div>
        </section>
    )
}
export default EventDetails