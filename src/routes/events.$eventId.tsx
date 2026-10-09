import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { getMeetingLink } from "@/lib/events.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuthReady } from "@/hooks/use-auth-ready";
import { Hand, Send, LogIn, ArrowLeft, Smile, Radio, Video, ExternalLink, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/events/$eventId")({
  head: ({ params }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "description", content: "Join a member-only MentorWise AI live event with student discussions and mentor-led learning." },
      { property: "og:title", content: "Live Event — MentorWise AI" },
      { property: "og:description", content: "Member-only student discussions and mentor-led learning at MentorWise AI." },
      { title: "Live Event — MentorWise AI" },
      // Event rooms require sign-in; keep them out of search indexes.
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:url", content: `https://mentorwiseaiedtechservice.lovable.app/events/${params.eventId}` },
    ],
  }),
  component: LiveEventRoom,
});

type Msg = {
  id: string; user_id: string; user_name: string; is_host: boolean;
  kind: string; content: string; created_at: string;
};

const EMOJIS = ["👍", "❤️", "🎉", "😂", "🔥", "👏", "🙏", "💡"];

function LiveEventRoom() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const linkFn = useServerFn(getMeetingLink);
  const auth = useAuthReady();
  const user = auth.user ? { id: auth.user.id, name: auth.displayName } : null;
  const [event, setEvent] = useState<any>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeReactions, setActiveReactions] = useState<{ id: string; emoji: string; left: number }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.isReady || !user) return;
    let mounted = true;
    (async () => {
      const { data: ev } = await supabase.from("live_events")
        .select("id, title, description, host_name, scheduled_at, status, created_at, updated_at")
        .eq("id", eventId).maybeSingle();
      if (mounted) setEvent(ev);
      const { data: msgs } = await supabase
        .from("event_messages").select("*").eq("event_id", eventId)
        .order("created_at", { ascending: true }).limit(500);
      if (mounted && msgs) setMessages(msgs as Msg[]);
      try {
        const res = await linkFn({ data: { event_id: eventId } });
        if (mounted) { setMeetingUrl(res.meetingUrl); setIsHost(res.isHost); }
      } catch (err) { console.error(err); }
    })();

    const channel = supabase
      .channel(`event-${eventId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "event_messages", filter: `event_id=eq.${eventId}` },
        (payload) => {
          const m = payload.new as Msg;
          setMessages((prev) => [...prev, m]);
          if (m.kind === "reaction") {
            const id = `${m.id}-${Math.random()}`;
            setActiveReactions((p) => [...p, { id, emoji: m.content, left: 20 + Math.random() * 60 }]);
            setTimeout(() => setActiveReactions((p) => p.filter((r) => r.id !== id)), 3000);
          }
        })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "live_events", filter: `id=eq.${eventId}` },
        (payload) => setEvent(payload.new))
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(channel); };
  }, [auth.isReady, user?.id, eventId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function postMessage(kind: string, content: string) {
    if (!user) return;
    await supabase.from("event_messages").insert({
      event_id: eventId, user_id: user.id, user_name: user.name,
      is_host: isHost, kind, content,
    });
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await postMessage("message", text.trim());
    setText("");
  }

  async function toggleHand() {
    setHandRaised((v) => !v);
    await postMessage(handRaised ? "hand_lower" : "hand_raise", handRaised ? "lowered" : "raised");
  }

  async function copyLink() {
    if (!meetingUrl) return;
    await navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!auth.isReady) return <SiteLayout><div className="p-12 text-center text-muted-foreground">Restoring your session…</div></SiteLayout>;

  if (!user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <Radio className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">Sign in to join this event</h1>
          <p className="mt-2 text-sm text-muted-foreground">A free account is required to join the meeting, chat, and react.</p>
          <Link to="/auth" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            <LogIn className="h-4 w-4" /> Sign in / Sign up
          </Link>
        </div>
      </SiteLayout>
    );
  }

  if (!event) return <SiteLayout><div className="p-12 text-center text-muted-foreground">Event not found.</div></SiteLayout>;

  const raisedHands = Array.from(
    messages.reduce((acc, m) => {
      if (m.kind === "hand_raise") acc.set(m.user_id, m.user_name);
      if (m.kind === "hand_lower") acc.delete(m.user_id);
      return acc;
    }, new Map<string, string>()).entries()
  );

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <button onClick={() => navigate({ to: "/events" })} className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            {event.status === "live" && <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />}
            {event.title}
          </div>
          <div className="text-[11px] text-white/50">{event.status}</div>
        </div>
        <div className="text-xs text-white/60">{isHost ? "Host" : "Attendee"}</div>
      </div>

      <div className="grid h-[calc(100vh-56px)] grid-cols-1 lg:grid-cols-[1fr_360px]">
        {/* Stage — Meet launcher */}
        <div className="relative flex flex-col bg-gradient-to-br from-[#0b0d12] via-[#101424] to-[#0b0d12]">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold">Google Meet session</h2>
              <p className="mt-2 text-sm text-white/60">
                {meetingUrl
                  ? "Join the video call in a new tab. Chat and reactions stay here."
                  : isHost
                    ? "No meeting link set for this event yet."
                    : "Host hasn't shared the meeting link yet."}
              </p>
              {meetingUrl && (
                <div className="mt-5 flex flex-col gap-2">
                  <a href={meetingUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition">
                    <ExternalLink className="h-4 w-4" /> Join Google Meet
                  </a>
                  <button onClick={copyLink} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-white/80 hover:bg-white/10">
                    {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy link</>}
                  </button>
                  <p className="mt-1 break-all text-[11px] text-white/40">{meetingUrl}</p>
                </div>
              )}
            </div>
            <div className="pointer-events-none absolute inset-0">
              {activeReactions.map((r) => (
                <div key={r.id} className="absolute bottom-10 animate-[float_3s_ease-out_forwards] text-4xl"
                  style={{ left: `${r.left}%` }}>{r.emoji}</div>
              ))}
            </div>
            {raisedHands.length > 0 && (
              <div className="absolute left-3 top-3 max-w-xs rounded-xl bg-black/60 px-3 py-2 backdrop-blur">
                <div className="flex items-center gap-1.5 text-xs font-semibold"><Hand className="h-3.5 w-3.5 text-yellow-400" /> Raised hands ({raisedHands.length})</div>
                <ul className="mt-1 text-[11px] text-white/80">
                  {raisedHands.slice(0, 5).map(([id, name]) => <li key={id}>· {name}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 border-t border-white/10 p-3">
            <button onClick={toggleHand} className={`flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${handRaised ? "bg-yellow-400 text-black" : "bg-white/10 hover:bg-white/20"}`}>
              <Hand className="h-4 w-4" /> {handRaised ? "Lower hand" : "Raise hand"}
            </button>
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
              {EMOJIS.slice(0, 5).map((e) => (
                <button key={e} onClick={() => postMessage("reaction", e)} className="rounded-full px-1.5 text-lg hover:scale-125 transition">{e}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat panel */}
        <aside className="flex flex-col border-l border-white/10 bg-[#0e1116]">
          <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold"># live-chat</div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.filter((m) => m.kind !== "reaction").map((m) => {
              if (m.kind === "hand_raise" || m.kind === "hand_lower") {
                return <div key={m.id} className="text-[11px] text-yellow-300/70">✋ {m.user_name} {m.kind === "hand_raise" ? "raised" : "lowered"} their hand</div>;
              }
              return (
                <div key={m.id} className="group flex gap-2.5">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.is_host ? "bg-gradient-to-br from-pink-500 to-violet-500" : "bg-gradient-to-br from-sky-500 to-indigo-600"}`}>
                    {m.user_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-sm font-semibold ${m.is_host ? "text-pink-300" : "text-white"}`}>{m.user_name}</span>
                      {m.is_host && <span className="rounded bg-pink-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-pink-300">Host</span>}
                      <span className="text-[10px] text-white/40">{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="break-words text-[14px] text-white/90">{m.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={sendChat} className="relative border-t border-white/10 p-3">
            {showEmoji && (
              <div className="absolute bottom-16 right-3 grid grid-cols-4 gap-1 rounded-xl bg-[#1a1d24] p-2 shadow-xl">
                {EMOJIS.map((e) => (
                  <button key={e} type="button" onClick={() => { setText((t) => t + e); setShowEmoji(false); }} className="rounded-md p-1.5 text-xl hover:bg-white/10">{e}</button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-xl bg-[#1a1d24] px-3 py-2">
              <button type="button" onClick={() => setShowEmoji((v) => !v)} className="text-white/60 hover:text-white"><Smile className="h-5 w-5" /></button>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message #live-chat" className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40" />
              <button type="submit" className="text-primary hover:text-white"><Send className="h-4 w-4" /></button>
            </div>
          </form>
        </aside>
      </div>

      <style>{`@keyframes float { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-200px) scale(1.3); opacity: 0; } }`}</style>
    </div>
  );
}
