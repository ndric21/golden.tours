import { useState, useEffect } from "react";
import { MessageSquare, Search, User, Bot, Clock } from "lucide-react";
import { enquiryStore, type Enquiry } from "@/lib/store";

export function ChatLogsSection() {
  const [logs, setLogs] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    enquiryStore
      .getAll()
      .then((all) => setLogs(all.filter((e) => e.messages && e.messages.length > 0)))
      .catch(console.error);
  }, []);

  const filtered = logs.filter(
    (l) =>
      !search ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.userEmail.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedLog = logs.find((l) => l.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)] animate-fade-in-up">
      {/* List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 border-r border-white/5 pr-0 lg:pr-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin pr-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="h-6 w-6 text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/40">No chat logs found</p>
            </div>
          ) : (
            filtered.map((l) => (
              <div
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedId === l.id
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium text-white truncate">{l.userName}</h4>
                  <span className="text-[10px] text-white/30 whitespace-nowrap ml-2">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-white/40 truncate">
                  {l.messages[l.messages.length - 1]?.content || "No messages"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 flex flex-col bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
        {selectedLog ? (
          <>
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{selectedLog.userName}</h3>
                <p className="text-xs text-white/40">{selectedLog.userEmail}</p>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-medium text-white/50">
                {selectedLog.messages.length} messages
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {selectedLog.messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "assistant" ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`h-6 w-6 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                      m.role === "assistant"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <Bot className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                      m.role === "assistant"
                        ? "bg-white/5 text-white/80 rounded-tl-none"
                        : "bg-amber-500/10 border border-amber-500/20 text-white rounded-tr-none"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <MessageSquare className="h-12 w-12 text-white/10 mb-4" />
            <p className="text-sm text-white/50">
              Select a chat log to view the conversation history
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
