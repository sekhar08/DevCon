/* eslint-disable */
"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Bot, X, Send, User, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import EventCard from "@/components/EventCard";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, input, handleInputChange, handleSubmit, isLoading, append, setInput } = useChat({
        api: '/api/chat',
        maxSteps: 5,
    } as any) as any;

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bottom-20 right-0 w-[400px] h-[550px] bg-dark-200/95 backdrop-blur-2xl border border-primary/20 rounded-2xl shadow-[0_0_40px_rgba(89,222,202,0.15)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border-dark/60 bg-dark-300/40">
                            <div className="flex items-center gap-2 text-primary">
                                <Sparkles size={18} />
                                <span className="font-martian-mono text-sm tracking-widest font-bold uppercase">DevCon Support</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-light-200/60 hover:text-white transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 custom-scrollbar relative">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-light-200/50">
                                    <div className="w-16 h-16 rounded-full bg-dark-300 border border-primary/20 flex items-center justify-center mb-2">
                                        <Bot size={32} className="text-primary/50" />
                                    </div>
                                    <p className="font-martian-mono text-[11px] uppercase tracking-[0.2em] leading-relaxed px-6 text-primary/70">
                                        Hello Operative.<br /><br /> Ask me to find hackathons, web events, or AI summits inside the DevCon mainframe.
                                    </p>
                                </div>
                            )}

                            {messages.map((m: any) => (
                                <div key={m.id} className={`flex gap-3 w-full ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${m.role === 'user' ? 'bg-primary text-[#030708]' : 'bg-dark-300 border border-primary/30 text-primary'}`}>
                                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`flex flex-col gap-3 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        {m.content && (
                                            <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-primary text-[#030708] rounded-tr-sm font-medium' : 'bg-dark-300/80 border border-border-dark/50 text-light-100 rounded-tl-sm'}`}>
                                                {m.content}
                                            </div>
                                        )}
                                        {m.toolInvocations?.map((toolInvocation: any) => {
                                            const toolCallId = toolInvocation.toolCallId;
                                            if (toolInvocation.toolName === 'searchEvents') {
                                                if ('result' in toolInvocation) {
                                                    const events = toolInvocation.result;
                                                    if (!events || events.length === 0) {
                                                        return <div key={toolCallId} className="text-xs text-light-200/50 italic px-2 bg-dark-300 py-2 rounded-lg border border-border-dark/30">No relevant events found in the mainframe.</div>;
                                                    }
                                                    return (
                                                        <div key={toolCallId} className="flex gap-4 overflow-x-auto w-full max-w-[300px] snap-x custom-scrollbar py-2 -my-2 pl-1 pr-6">
                                                            {events.map((event: any) => (
                                                                <div key={event._id} className="snap-start shrink-0 w-[240px]">
                                                                    <div className="scale-90 origin-top-left -mb-4 -mr-4">
                                                                        <EventCard {...event} />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={toolCallId} className="text-[10px] text-primary/70 animate-pulse font-martian-mono uppercase tracking-widest px-2 pb-2">Querying Database...</div>;
                                                }
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            ))}
                            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-dark-300 border border-primary/30 text-primary flex items-center justify-center shrink-0 mt-1">
                                        <Bot size={14} />
                                    </div>
                                    <div className="px-4 py-3 bg-dark-300/80 border border-border-dark/50 text-light-100 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[46px]">
                                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-4 bg-dark-300/60 border-t border-border-dark/60 mt-auto">
                            <div className="relative flex items-center group">
                                <input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Ask for an event..."
                                    className="w-full bg-dark-200/50 border border-border-dark/60 rounded-full pl-5 pr-12 py-3.5 text-sm text-light-100 focus:outline-none focus:border-primary/50 focus:bg-dark-200/80 focus:shadow-[0_0_15px_rgba(89,222,202,0.1)] placeholder:text-light-200/40 transition-all font-schibsted-grotesk"
                                />
                                <button type="submit" disabled={!input || input.trim() === ''} className="absolute right-1.5 p-2.5 bg-primary text-[#030708] rounded-full hover:bg-white disabled:opacity-30 disabled:hover:bg-primary transition-colors cursor-pointer shrink-0">
                                    <Send size={16} className="-ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(89,222,202,0.3)] transition-all duration-300 cursor-pointer ${isOpen ? 'bg-dark-300 text-primary scale-90 border border-primary/30' : 'bg-primary text-[#030708] hover:scale-105 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]'}`}
            >
                {isOpen ? <X size={26} /> : <div className="relative"><Bot size={28} /><span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-primary" /></div>}
            </button>
        </div>
    );
}
