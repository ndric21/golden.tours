import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Send, Sparkles, User, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { getDestinations, getPackages } from "@/lib/destinations";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  references?: { type: "destination" | "package"; slug: string; name: string; image?: string }[];
}

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Jambo! I'm Jua, your Golden Tours AI travel consultant. 🌍\n\nI specialize exclusively in East Africa — Tanzania, Kenya, Uganda and Rwanda. Tell me who's traveling, your budget, how many days you have, and what excites you (safari, gorillas, Kilimanjaro, beaches, culture) — and I'll build real, realistic recommendations around it.\n\nWhat are you dreaming up?",
};

function findReferences(text: string, catalog: { type: "destination" | "package"; slug: string; name: string; image?: string }[]) {
  const lower = text.toLowerCase();
  const found: typeof catalog = [];
  for (const item of catalog) {
    if (lower.includes(item.name.toLowerCase())) {
      found.push(item);
      if (found.length >= 3) break;
    }
  }
  return found;
}

export function Chat({ embedded = false }: { embedded?: boolean }) {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [catalog, setCatalog] = useState<{ type: "destination" | "package"; slug: string; name: string; image?: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([getDestinations(), getPackages()])
      .then(([dests, pkgs]) => {
        setCatalog([
          ...dests.map((d) => ({ type: "destination" as const, slug: d.slug, name: d.name, image: d.image })),
          ...pkgs.map((p) => ({ type: "package" as const, slug: p.id, name: p.title, image: p.image })),
        ]);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || !user) return;
    setError("");
    setInput("");

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setSending(true);

    try {
      let convId = conversationId;
      if (!convId) {
        const { data, error: convErr } = await supabase
          .from("conversations")
          .insert({ user_id: user.id, title: text.slice(0, 60) })
          .select()
          .single();
        if (convErr) throw convErr;
        convId = data.id;
        setConversationId(convId);
      }
      await supabase.from("messages").insert({ conversation_id: convId, role: "user", content: text });

      const history = nextMessages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      const { data: session } = await supabase.auth.getSession();
      const { data, error: fnErr } = await supabase.functions.invoke("chat", {
        body: { messages: history, mode: "chat" },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });
      if (fnErr) throw fnErr;
      if (data?.error) throw new Error(data.error);

      const reply: string = data.reply;
      await supabase.from("messages").insert({ conversation_id: convId, role: "assistant", content: reply });

      setMessages((prev) => [...prev, { role: "assistant", content: reply, references: findReferences(reply, catalog) }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong reaching Jua. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className={`flex ${embedded ? "h-[520px]" : "h-[calc(100vh-220px)] min-h-[500px]"} flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card text-center`}>
        <Sparkles className="h-8 w-8 text-gold" />
        <p className="text-sm text-muted-foreground">Sign in to chat with Jua, our AI travel consultant.</p>
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        embedded ? "h-[520px]" : "h-[calc(100vh-220px)] min-h-[500px]"
      } flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-gold animate-fade-in-up`}
    >
      <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-gold/10 to-accent/20 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">Jua — Golden Tours AI</p>
          <p className="text-xs text-muted-foreground">East Africa travel consultant · always online</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 scrollbar-thin sm:px-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                m.role === "user" ? "bg-accent text-foreground" : "bg-gradient-gold text-primary-foreground"
              }`}
            >
              {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </span>
            <div className={`flex max-w-[80%] flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user" ? "rounded-tr-sm bg-gradient-gold text-primary-foreground" : "rounded-tl-sm border border-border bg-accent/30 text-foreground"
                }`}
              >
                {m.content}
              </div>
              {m.references && m.references.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {m.references.map((ref) => (
                    <Link
                      key={ref.slug}
                      to="/"
                      className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 pr-3 text-xs font-medium shadow-sm transition-colors hover:border-gold/40"
                    >
                      {ref.image && <img src={ref.image} alt="" className="h-8 w-10 rounded-lg object-cover" />}
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gold" /> {ref.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-accent/30 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Jua is thinking…
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500">{error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-border bg-card p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about safaris, gorilla trekking, Kilimanjaro, budgets, seasons…"
          className="flex-1 rounded-xl bg-input border border-border px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex items-center gap-2 rounded-xl bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
