import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/916383969289?text=Hi%20MentorWise%20AI%20team!%20I%20am%20a%20student%20looking%20for%20career%20guidance.";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MentorWise AI on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-cyber px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg glow-cyan hover:scale-[1.05] hover:brightness-110 transition sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
