import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Volume2, MessageSquare, Compass, Zap } from 'lucide-react';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, initialPrompt }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
    {
      role: 'model',
      content: `**Namaste! I am your Delhi Guide companion.** 🛺\n\nI provide instant, factual answers for Delhi's monuments, real metro & bus schedules, food spots, and fair prices so you never get overcharged.\n\n*How can I help you explore Delhi today?*`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vibe, setVibe] = useState('All-round Explorer');
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(undefined, initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSpeak = (idx: number, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingIdx === idx) {
        window.speechSynthesis.cancel();
        setSpeakingIdx(null);
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingIdx(null);
      utterance.onerror = () => setSpeakingIdx(null);
      setSpeakingIdx(idx);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || input;
    if (!query.trim() || loading) return;

    const userMessage = { role: 'user' as const, content: query };
    const historySnapshot = [...messages];

    // Append user message and placeholder for streaming reply
    setMessages((prev) => [...prev, userMessage, { role: 'model', content: '' }]);
    if (!customQuery) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historySnapshot,
          vibe,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Streaming unavailable');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const payload = trimmed.slice(6);
          if (payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: 'model',
                  content: accumulated,
                };
                return next;
              });
            }
          } catch {
            // ignore partial json chunk
          }
        }
      }

      // If nothing was accumulated, trigger fast single response
      if (!accumulated.trim()) {
        throw new Error('Empty stream');
      }
    } catch {
      // Fast fallback to regular chat
      try {
        const fallbackRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            history: historySnapshot,
            vibe,
          }),
        });
        const data = await fallbackRes.json();
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: 'model',
            content: data.reply || 'Here is your Delhi travel advice.',
          };
          return next;
        });
      } catch {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: 'model',
            content: `**Delhi Tour Guide:** For "${query}", ASI monuments (Red Fort, Qutub Minar, Humayun’s Tomb) cost ₹50 for Indians and ₹600 for foreigners. Delhi Metro operates from 5:30 AM to 11:30 PM with 1-Day Tourist Cards for ₹200.`,
          };
          return next;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[88vh] flex flex-col bg-[#070c1a] border border-blue-500/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0c152a] via-[#080e1d] to-[#060a14] border-b border-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-950 border border-blue-400/50">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-heading tracking-wide">
                  Delhi Travel Guide
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 text-[9px] font-bold flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-blue-400" /> Fast Stream
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Instant City Concierge &bull; Fair Price Sentinel &bull; Transit Expert
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="bg-[#0e172a] text-[11px] text-blue-300 border border-blue-900/60 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="All-round Explorer">All-round Explorer</option>
              <option value="Solo Traveler Safety">Solo Safety Mode</option>
              <option value="Budget Backpacker">Backpacker Vibe</option>
              <option value="Foodie Trail">Foodie Vibe</option>
            </select>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-950 text-slate-400 hover:text-white border border-blue-900/40 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#091021] border-b border-blue-950/80 flex gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => handleSend(undefined, 'What is the best 1-day itinerary for Old Delhi?')}
            className="px-2.5 py-1 rounded-lg bg-[#0e172d] hover:bg-blue-900/50 text-slate-300 hover:text-white border border-blue-900/40 whitespace-nowrap cursor-pointer transition-colors"
          >
            🏰 1-Day Old Delhi Plan
          </button>
          <button
            onClick={() => handleSend(undefined, 'What should an auto from NDLS to Janpath cost?')}
            className="px-2.5 py-1 rounded-lg bg-[#0e172d] hover:bg-blue-900/50 text-slate-300 hover:text-white border border-blue-900/40 whitespace-nowrap cursor-pointer transition-colors"
          >
            🛺 Auto fare NDLS to Janpath
          </button>
          <button
            onClick={() => handleSend(undefined, 'Where can I eat the best Chole Bhature safely?')}
            className="px-2.5 py-1 rounded-lg bg-[#0e172d] hover:bg-blue-900/50 text-slate-300 hover:text-white border border-blue-900/40 whitespace-nowrap cursor-pointer transition-colors"
          >
            🍛 Safe Chole Bhature
          </button>
          <button
            onClick={() => handleSend(undefined, 'What are the Metro Tourist Card options?')}
            className="px-2.5 py-1 rounded-lg bg-[#0e172d] hover:bg-blue-900/50 text-slate-300 hover:text-white border border-blue-900/40 whitespace-nowrap cursor-pointer transition-colors"
          >
            🚇 Metro Tourist Cards
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isLastMessage = idx === messages.length - 1;
            const isStreamingThis = isLastMessage && msg.role === 'model' && loading;

            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-1 shadow-md shadow-blue-950">
                    <Compass className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs md:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-950'
                      : 'bg-[#0c1426] border border-blue-900/50 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.content ? (
                    <>
                      {msg.content}
                      {isStreamingThis && (
                        <span className="inline-block w-2 h-3.5 ml-1 bg-blue-400 animate-pulse align-middle" />
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 py-0.5 text-blue-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                      <span className="italic text-xs text-slate-400">Replying...</span>
                    </div>
                  )}

                  {msg.role === 'model' && msg.content && !isStreamingThis && (
                    <div className="mt-2 pt-2 border-t border-blue-950 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Verified Delhi Travel Concierge</span>
                      <button
                        onClick={() => handleSpeak(idx, msg.content)}
                        className={`text-[11px] flex items-center gap-1 font-semibold px-2 py-0.5 rounded cursor-pointer ${
                          speakingIdx === idx
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'text-blue-400 hover:text-blue-300'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{speakingIdx === idx ? 'Stop Audio' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[#080e1c] border-t border-blue-950 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything: monuments, prices, bargaining phrases, metro routes..."
            className="flex-1 bg-[#0b1324] border border-blue-900/50 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-950 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
