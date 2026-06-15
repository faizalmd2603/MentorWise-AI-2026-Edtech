import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, useMemo, memo } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { getLiveKitToken } from "@/lib/events.functions";
import { supabase } from "@/integrations/supabase/client";
import { Room, RoomEvent, Track, type RemoteTrack, type RemoteParticipant } from "livekit-client";
import { Mic, MicOff, Hand, Send, LogIn, ArrowLeft, Smile, Radio } from "lucide-react";

export const Route = createFileRoute("/events/")({
  component: LiveEventRoom,
});

type Msg = {
  id: string; user_id: string; user_name: string; is_host: boolean;
  kind: string; content: string; created_at: string;
};

const EMOJIS = ["👍", "❤️", "🎉", "😂", "🔥", "👏", "🙏", "💡"];

const ChatMessage = memo(({ m }: { m: Msg }) => {
  if (m.kind === "hand_raise" || m.kind === "hand_lower") {
    return <div className="text-[11px] text-yellow-300/70">✋ {m.user_name} {m.kind === "hand_raise" ? "raised" : "lowered"} their hand</div>;
  }
  return (
    <div className="group flex gap-2.5">
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
});

ChatMessage.displayName = "ChatMessage";

function LiveEventRoom() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const tokenFn = useServerFn(getLiveKitToken);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState<number>(1);
  const [activeReactions, setActiveReactions] = useState<{ id: string; emoji: string }[]>([]);
  const roomRef = useRef<Room | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auth
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (data.user) {
        const meta: any = data.user.user_metadata || {};
        setUser({ id: data.user.id, name: meta.full_name || meta.display_name || data.user.email || "Guest" });
      }
      setAuthChecked(true);
    });
  }, []);

  // Load event + messages + realtime
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: ev } = await supabase.from("live_events").select("*").eq("id", eventId).maybeSingle();
      if (mounted) setEvent(ev);
      // Limit initial load to 200 messages for better performance
      const { data: msgs } = await supabase
        .from("event_messages").select("*").eq("event_id", eventId)
        .order("created_at", { ascending: true }).limit(200);
      if (mounted && msgs) setMessages(msgs as Msg[]);
    })();

    const channel = supabase
      .channel(`event-${eventId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "event_messages", filter: `event_id=eq.${eventId}` },
        (payload) => {
          const m = payload.new as Msg;
          // Use functional update to avoid stale closures and batch state updates
          setMessages((prev) => {
             const next = [...prev, m];
             // Cap history in memory to 500 items
             return next.length > 500 ? next.slice(-500) : next;
          });
          if (m.kind === "reaction") {
            const id = `${m.id}-${Math.random()}`;
            setActiveReactions((p) => [...p, { id, emoji: m.content }]);
            setTimeout(() => setActiveReactions((p) => p.filter((r) => r.id !== id)), 3000);
          }
        })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "live_events", filter: `id=eq.${eventId}` },
        (payload) => setEvent(payload.new))
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(channel); };
  }, [eventId]);

  useEffect(() => {
    // Only scroll if we are near bottom or a new message from user arrived
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Connect LiveKit
  useEffect(() => {
    if (!user || !event) return;
    let cancelled = false;
    (async () => {
      try {
        const { token, wsUrl, isHost: host } = await tokenFn({ data: { event_id: eventId } });
        if (cancelled) return;
        setIsHost(host);
        const room = new Room({ adaptiveStream: true, dynacast: true });
        roomRef.current = room;

        room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub, participant: RemoteParticipant) => {
          if (track.kind === Track.Kind.Video && videoRef.current) {
            track.attach(videoRef.current);
          } else if (track.kind === Track.Kind.Audio && audioRef.current) {
            track.attach(audioRef.current);
          }
          void participant;
        });
        room.on(RoomEvent.ParticipantConnected, () => setParticipants(room.numParticipants + 1));
        room.on(RoomEvent.ParticipantDisconnected, () => setParticipants(room.numParticipants + 1));
        room.on(RoomEvent.Disconnected, () => setConnected(false));

        await room.connect(wsUrl, token);
        if (cancelled) { room.disconnect(); return; }
        setConnected(true);
        setParticipants(room.numParticipants + 1);

        if (host) {
          try { await room.localParticipant.setCameraEnabled(true); } catch {}
          try { await room.localParticipant.setMicrophoneEnabled(true); setMicOn(true); } catch {}
        }
      } catch (err) {
        console.error("LiveKit connect failed", err);
      }
    })();
    return () => {
      cancelled = true;
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
  }, [user, event, eventId, tokenFn]);

  const chatMessages = useMemo(() => 
    messages.filter((m) => m.kind !== "reaction"),
  [messages]);

  const raisedHands = useMemo(() => {
    const handsMap = new Map<string, string>();
    for (const m of messages) {
      if (m.kind === "hand_raise") handsMap.set(m.user_id, m.user_name);
      else if (m.kind === "hand_lower") handsMap.delete(m.user_id);
    }
    return Array.from(handsMap.entries());
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
    const currentText = text.trim();
    setText("");
    await postMessage("message", currentText);
  }

  async function toggleHand() {
    const nextHand = !handRaised;
    setHandRaised(nextHand);
    await postMessage(nextHand ? "hand_raise" : "hand_lower", nextHand ? "raised" : "lowered");
  }

  async function toggleMic() {
    if (!isHost || !roomRef.current) return;
    const next = !micOn;
    await roomRef.current.localParticipant.setMicrophoneEnabled(next);
    setMicOn(next);
  }

  if (!authChecked) return <SiteLayout><div className="p-12 text-center text-muted-foreground">Loading…</div></SiteLayout>;

  if (!user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <Radio className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">Sign in to join this event</h1>
          <p className="mt-2 text-sm text-muted-foreground">A free account is required to enter the live room, chat, and react.</p>
          <Link to="/auth" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            <LogIn className="h-4 w-4" /> Sign in / Sign up
          </Link>
        </div>
      </SiteLayout>
    );
  }

  if (!event) return <SiteLayout><div className="p-12 text-center text-muted-foreground">Event not found.</div></SiteLayout>;

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
          <div className="text-[11px] text-white/50">{participants} in room · {event.status}</div>
        </div>
        <div className="text-xs text-white/60">{isHost ? "Host" : "Listener"}</div>
      </div>

      <div className="grid h-[calc(100vh-56px)] grid-cols-1 lg:grid-cols-[1fr_360px]">
        {/* Stage */}
        <div className="relative flex flex-col bg-black">
          <div className="relative flex-1 overflow-hidden">
            <video ref={videoRef} className="h-full w-full object-contain" autoPlay playsInline muted={isHost} />
            <audio ref={audioRef} autoPlay />
            {!connected && (
              <div className="absolute inset-0 flex items-center justify-center text-white/60">Connecting to live stream…</div>
            )}
            {/* Floating reactions */}
            <div className="pointer-events-none absolute inset-0">
              {activeReactions.map((r) => (
                <div key={r.id} className="absolute bottom-10 animate-[float_3s_ease-out_forwards] text-4xl"
                  style={{ left: `${20 + Math.random() * 60}%` }}>
                  {r.emoji}
                </div>
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

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 border-t border-white/10 p-3">
            {isHost && (
              <button onClick={toggleMic} className={`flex h-11 w-11 items-center justify-center rounded-full transition ${micOn ? "bg-white/15 hover:bg-white/25" : "bg-red-500 hover:bg-red-600"}`}>
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
            )}
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
            {chatMessages.map((m) => (
              <ChatMessage key={m.id} m={m} />
            ))}
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
