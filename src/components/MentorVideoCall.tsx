import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, Loader2, X } from "lucide-react";
import avatarMeta from "@/assets/agents/mentor-avatar-3d.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

const MAX_SECONDS = 20 * 60; // 20-minute hard cap

type Props = { open: boolean; onClose: () => void };

export function MentorVideoCall({ open, onClose }: Props) {
  return (
    <ConversationProvider>
      <MentorVideoCallContent open={open} onClose={onClose} />
    </ConversationProvider>
  );
}

function MentorVideoCallContent({ open, onClose }: Props) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const conversation = useConversation({
    onConnect: () => setError(null),
    onError: (e) => {
      const msg = typeof e === "string" ? e : (e as { message?: string })?.message ?? "Call error";
      setError(msg);
    },
  });

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  // Animate mouth from agent output audio level
  useEffect(() => {
    if (!isConnected) return;
    const loop = () => {
      try {
        const v = conversation.getOutputVolume?.() ?? 0;
        setMouthOpen(Math.min(1, v * 2.2));
      } catch {
        // ignore
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isConnected, conversation]);

  // Session timer + auto-end at 20 min
  useEffect(() => {
    if (!isConnected) {
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((s) => {
        const next = s + 1;
        if (next >= MAX_SECONDS) {
          void conversation.endSession();
        }
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected, conversation]);

  const start = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Please sign in to start a mentor call");
      const res = await fetch("/api/elevenlabs/mentor-token", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Token failed (${res.status})`);
      }
      const { token: convToken, error: tokErr } = (await res.json()) as { token?: string; error?: string };
      if (!convToken) throw new Error(tokErr || "No token received");
      await conversation.startSession({
        conversationToken: convToken,
        connectionType: "webrtc",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start call");
    } finally {
      setConnecting(false);
    }
  }, [conversation]);

  const end = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch {
      // ignore
    }
  }, [conversation]);

  const toggleMute = useCallback(async () => {
    try {
      await conversation.setVolume?.({ volume: muted ? 1 : 0 });
      setMuted((m) => !m);
    } catch {
      // ignore
    }
  }, [conversation, muted]);

  // End call and cleanup when closing
  useEffect(() => {
    if (!open && isConnected) void conversation.endSession();
  }, [open, isConnected, conversation]);

  if (!open) return null;

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const remaining = MAX_SECONDS - elapsed;
  const lowTime = remaining <= 60;

  // Mouth scaling values
  const mouthScale = 0.4 + mouthOpen * 0.9;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" hidden={!isConnected} />
          <div className="font-display font-semibold text-foreground">1-on-1 Mentor Call</div>
          {isConnected && (
            <span className={`text-xs font-mono ${lowTime ? "text-magenta" : "text-muted-foreground"}`}>
              {mm}:{ss} / 20:00
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted/40"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Avatar stage */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[oklch(0.18_0.04_270)]" />
        <div
          className="absolute inset-0 opacity-60 transition-opacity duration-300"
          style={{
            background: isSpeaking
              ? "radial-gradient(circle at 50% 45%, oklch(0.65 0.2 200 / 0.35), transparent 55%)"
              : "radial-gradient(circle at 50% 45%, oklch(0.5 0.1 280 / 0.25), transparent 55%)",
          }}
        />

        <div className="relative">
          {/* Pulsing halo when speaking */}
          <div
            className="absolute -inset-6 rounded-full transition-all duration-200"
            style={{
              boxShadow: isSpeaking
                ? `0 0 ${40 + mouthOpen * 80}px ${10 + mouthOpen * 20}px oklch(0.65 0.2 200 / 0.45)`
                : "0 0 30px 4px oklch(0.5 0.1 280 / 0.25)",
            }}
          />
          <div className="relative h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-[2rem] overflow-hidden ring-1 ring-border/70 bg-background">
            <img
              src={avatarMeta.url}
              alt="3D mentor avatar"
              width={768}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            {/* Animated mouth overlay (simulated lip-sync from audio level) */}
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[oklch(0.15_0.04_30)] transition-[transform,opacity] duration-75"
              style={{
                bottom: "26%",
                width: "14%",
                height: "3.5%",
                opacity: isSpeaking ? 0.85 : 0,
                transform: `translateX(-50%) scaleY(${mouthScale}) scaleX(${0.85 + mouthOpen * 0.3})`,
                transformOrigin: "center",
              }}
            />
          </div>
          <div className="mt-3 text-center text-sm text-muted-foreground">
            {connecting
              ? "Connecting…"
              : isConnected
                ? isSpeaking
                  ? "Mentor is speaking…"
                  : "Mentor is listening — speak naturally"
                : "Tap Start to begin your call"}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-2 text-sm text-magenta">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="border-t border-border/60 px-4 py-4 flex items-center justify-center gap-3 bg-background/80">
        {!isConnected ? (
          <button
            onClick={start}
            disabled={connecting}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-cyber to-magenta px-6 py-3 text-sm font-semibold text-primary-foreground glow-cyan disabled:opacity-50"
          >
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
            {connecting ? "Connecting…" : "Start Video Call"}
          </button>
        ) : (
          <>
            <button
              onClick={toggleMute}
              className={`inline-flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-border/70 ${muted ? "bg-magenta/20 text-magenta" : "bg-muted/40 text-foreground"}`}
              aria-label={muted ? "Unmute mentor" : "Mute mentor"}
            >
              {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <button
              onClick={end}
              className="inline-flex items-center gap-2 rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              <PhoneOff className="h-4 w-4" /> End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
}
