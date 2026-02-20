'use client';

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const EVENT_MODES = ['Online', 'Offline', 'Hybrid'];

// ── Step config for the progress rail ─────────────────────────
const STEPS = [
    { id: 'basics', label: 'Basics' },
    { id: 'image', label: 'Visual' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'people', label: 'People' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'tags', label: 'Tags' },
];

export default function CreateEvent() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // ── Form state ──────────────────────────────────────────────
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [overview, setOverview] = useState('');
    const [venue, setVenue] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [mode, setMode] = useState(EVENT_MODES[0]);
    const [audience, setAudience] = useState('');
    const [organizer, setOrganizer] = useState('');

    // Image
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string>('');

    // Dynamic arrays
    const [agendaItems, setAgendaItems] = useState<string[]>(['']);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ── Image handler ───────────────────────────────────────────
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            setImageBase64(result);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    // ── Agenda helpers ──────────────────────────────────────────
    const addAgendaItem = () => setAgendaItems([...agendaItems, '']);
    const removeAgendaItem = (index: number) => {
        if (agendaItems.length === 1) return;
        setAgendaItems(agendaItems.filter((_, i) => i !== index));
    };
    const updateAgendaItem = (index: number, value: string) => {
        const updated = [...agendaItems];
        updated[index] = value;
        setAgendaItems(updated);
    };

    // ── Tag helpers ─────────────────────────────────────────────
    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput('');
        }
    };
    const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));
    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    // ── Submit ──────────────────────────────────────────────────
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const filteredAgenda = agendaItems.filter((a) => a.trim().length > 0);
        if (!title.trim()) return setError('Title is required.');
        if (!description.trim()) return setError('Description is required.');
        if (!overview.trim()) return setError('Overview is required.');
        if (!imageBase64) return setError('Please upload an event image.');
        if (!venue.trim()) return setError('Venue is required.');
        if (!location.trim()) return setError('Location is required.');
        if (!date) return setError('Date is required.');
        if (!time) return setError('Time is required.');
        if (!audience.trim()) return setError('Target audience is required.');
        if (filteredAgenda.length === 0) return setError('Add at least one agenda item.');
        if (!organizer.trim()) return setError('Organizer is required.');
        if (tags.length === 0) return setError('Add at least one tag.');

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    overview: overview.trim(),
                    image: imageBase64,
                    venue: venue.trim(),
                    location: location.trim(),
                    date,
                    time,
                    mode,
                    audience: audience.trim(),
                    agenda: filteredAgenda,
                    organizer: organizer.trim(),
                    tags,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }

            setSuccess('Event created successfully! Redirecting…');
            setTimeout(() => router.push('/'), 1500);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create event.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────
    return (
        <section
            id="create-event"
            className={mounted ? 'ce-mounted' : ''}
        >
            {/* ═══ Dramatic header ═══ */}
            <div className="ce-hero">
                <div className="ce-hero__badge">
                    <span className="ce-hero__dot" />
                    <span className="ce-hero__badge-text">INITIALISE // NEW EVENT</span>
                </div>
                <h1 className="ce-hero__title">
                    Launch<br />
                    <span className="ce-hero__title-accent">Your Event</span>
                </h1>
                <p className="ce-hero__desc">
                    Configure every detail below. Once you&apos;re ready, hit <strong>deploy</strong> to
                    publish your event to the community.
                </p>
            </div>

            {/* ═══ Status alerts ═══ */}
            {error && (
                <div className="ce-alert ce-alert--error" role="alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {error}
                </div>
            )}
            {success && (
                <div className="ce-alert ce-alert--success" role="status">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    {success}
                </div>
            )}

            {/* ═══ Main form with progress rail ═══ */}
            <div className="ce-layout">
                {/* ── Vertical progress rail (desktop) ─── */}
                <aside className="ce-rail" aria-hidden="true">
                    {STEPS.map((step, i) => (
                        <div key={step.id} className="ce-rail__step">
                            <span className="ce-rail__marker">{String(i + 1).padStart(2, '0')}</span>
                            <span className="ce-rail__label">{step.label}</span>
                        </div>
                    ))}
                    <div className="ce-rail__line" />
                </aside>

                {/* ── Form ─── */}
                <form onSubmit={handleSubmit} className="ce-form">

                    {/* ▸ Step 1 — Basics */}
                    <div className="ce-section" style={{ '--step-idx': 0 } as React.CSSProperties}>
                        <div className="ce-section__head">
                            <span className="ce-section__num">01</span>
                            <h2 className="ce-section__title">Basic Information</h2>
                        </div>
                        <div className="ce-section__body">
                            <div className="ce-field">
                                <label htmlFor="ce-title">Event Title</label>
                                <input id="ce-title" type="text" placeholder="e.g. DevCon 2026" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="ce-field">
                                <label htmlFor="ce-desc">Short Description</label>
                                <textarea id="ce-desc" placeholder="A one-liner about the event…" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="ce-field">
                                <label htmlFor="ce-overview">Overview</label>
                                <textarea id="ce-overview" placeholder="Detailed overview with key highlights…" rows={5} value={overview} onChange={(e) => setOverview(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* ▸ Step 2 — Image */}
                    <div className="ce-section" style={{ '--step-idx': 1 } as React.CSSProperties}>
                        <div className="ce-section__head">
                            <span className="ce-section__num">02</span>
                            <h2 className="ce-section__title">Event Visual</h2>
                        </div>
                        <div className="ce-section__body">
                            <div
                                className={`ce-dropzone ${imagePreview ? 'ce-dropzone--has-image' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview}
                                        alt="Event preview"
                                        fill
                                        className="ce-dropzone__img"
                                    />
                                ) : (
                                    <div className="ce-dropzone__inner">
                                        <div className="ce-dropzone__icon">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                        </div>
                                        <p className="ce-dropzone__text">Click to upload event poster</p>
                                        <p className="ce-dropzone__hint">JPG, PNG, WebP — max 10 MB</p>
                                    </div>
                                )}
                                <div className="ce-dropzone__scanlines" />
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>
                        </div>
                    </div>

                    {/* ▸ Step 3 — Logistics */}
                    <div className="ce-section" style={{ '--step-idx': 2 } as React.CSSProperties}>
                        <div className="ce-section__head">
                            <span className="ce-section__num">03</span>
                            <h2 className="ce-section__title">Logistics</h2>
                        </div>
                        <div className="ce-section__body">
                            <div className="ce-row">
                                <div className="ce-field">
                                    <label htmlFor="ce-venue">Venue</label>
                                    <input id="ce-venue" type="text" placeholder="Convention Centre Hall A" value={venue} onChange={(e) => setVenue(e.target.value)} />
                                </div>
                                <div className="ce-field">
                                    <label htmlFor="ce-location">Location</label>
                                    <input id="ce-location" type="text" placeholder="San Francisco, CA" value={location} onChange={(e) => setLocation(e.target.value)} />
                                </div>
                            </div>
                            <div className="ce-row ce-row--3col">
                                <div className="ce-field">
                                    <label htmlFor="ce-date">Date</label>
                                    <input id="ce-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                                <div className="ce-field">
                                    <label htmlFor="ce-time">Time</label>
                                    <input id="ce-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                                </div>
                                <div className="ce-field">
                                    <label htmlFor="ce-mode">Mode</label>
                                    <div className="ce-mode-group">
                                        {EVENT_MODES.map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                className={`ce-mode-btn ${mode === m ? 'ce-mode-btn--active' : ''}`}
                                                onClick={() => setMode(m)}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ▸ Step 4 — People */}
                    <div className="ce-section" style={{ '--step-idx': 3 } as React.CSSProperties}>
                        <div className="ce-section__head">
                            <span className="ce-section__num">04</span>
                            <h2 className="ce-section__title">People</h2>
                        </div>
                        <div className="ce-section__body">
                            <div className="ce-row">
                                <div className="ce-field">
                                    <label htmlFor="ce-audience">Target Audience</label>
                                    <input id="ce-audience" type="text" placeholder="Frontend developers, students…" value={audience} onChange={(e) => setAudience(e.target.value)} />
                                </div>
                                <div className="ce-field">
                                    <label htmlFor="ce-organizer">Organizer</label>
                                    <input id="ce-organizer" type="text" placeholder="DevCon Foundation" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ▸ Step 5 — Agenda */}
                    <div className="ce-section" style={{ '--step-idx': 4 } as React.CSSProperties}>
                        <div className="ce-section__head">
                            <span className="ce-section__num">05</span>
                            <h2 className="ce-section__title">Agenda</h2>
                        </div>
                        <div className="ce-section__body">
                            <div className="ce-agenda">
                                {agendaItems.map((item, index) => (
                                    <div key={index} className="ce-agenda__item">
                                        <div className="ce-agenda__rail">
                                            <span className="ce-agenda__dot" />
                                            {index < agendaItems.length - 1 && <span className="ce-agenda__connector" />}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder={`Session ${index + 1} — e.g. "Opening Keynote"`}
                                            value={item}
                                            onChange={(e) => updateAgendaItem(index, e.target.value)}
                                        />
                                        {agendaItems.length > 1 && (
                                            <button type="button" className="ce-agenda__remove" onClick={() => removeAgendaItem(index)} aria-label="Remove">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="ce-add-btn" onClick={addAgendaItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                Add session
                            </button>
                        </div>
                    </div>

                    {/* ▸ Step 6 — Tags */}
                    <div className="ce-section" style={{ '--step-idx': 5 } as React.CSSProperties}>
                        <div className="ce-section__head">
                            <span className="ce-section__num">06</span>
                            <h2 className="ce-section__title">Tags</h2>
                        </div>
                        <div className="ce-section__body">
                            {tags.length > 0 && (
                                <div className="ce-tags">
                                    {tags.map((tag) => (
                                        <span key={tag} className="ce-tag">
                                            <span className="ce-tag__hash">#</span>
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="ce-tag-input">
                                <input
                                    type="text"
                                    placeholder="Type tag + press Enter"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                />
                                <button type="button" className="ce-add-btn" onClick={addTag}>Add</button>
                            </div>
                        </div>
                    </div>

                    {/* ═══ Submit ═══ */}
                    <button type="submit" className="ce-submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="ce-submit__spinner" />
                                <span>Deploying…</span>
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                <span>Deploy Event</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}
