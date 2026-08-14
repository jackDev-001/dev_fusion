import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Zap,
  Bot,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { User, AICopilotInsight } from '../types';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  aiInsights: AICopilotInsight[];
  onSendPrompt: (prompt: string) => Promise<string>;
  onApplyAiAction: (actionType: string, payload: any) => void;
}

interface ChatTurn {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  aiInsights,
  onSendPrompt,
  onApplyAiAction
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      id: 'm_1',
      sender: 'ai',
      text: `Hello ${currentUser.name}! I am your **Nexus AI CTO Copilot** powered by Gemini. I have analyzed your workspace context:\n\n- **Sprint 24 Status**: 28/42 Story Points completed (66% velocity)\n- **Active Bottleneck**: Marcus Chen is assigned 3 tasks totaling 26 hours due in 48h.\n\nHow can I assist your engineering leadership today?`,
      timestamp: new Date().toISOString()
    }
  ]);

  const quickPrompts = [
    'What are the biggest risks in Sprint 24?',
    'Who is overloaded on the team?',
    'Summarize current project health',
    'Recommend sprint rebalancing plan'
  ];

  const handleSend = async (promptToSend?: string) => {
    const text = promptToSend || input;
    if (!text.trim() || loading) return;

    const userTurn: ChatTurn = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userTurn]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await onSendPrompt(text);
      const aiTurn: ChatTurn = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, aiTurn]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: `⚠️ Error reaching Gemini AI Copilot service: ${err.message}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-slate-900 text-white shadow-2xl z-50 flex flex-col border-l border-indigo-500/30">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-900/80 via-slate-900 to-indigo-900/80 border-b border-indigo-500/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-purple-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
              Nexus AI CTO Copilot
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-500/30 text-amber-300 border border-purple-400/30">
                Gemini 3.6
              </span>
            </h2>
            <p className="text-[10px] text-slate-300">Live Workspace Context Aware</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Insights Banner */}
      {aiInsights.length > 0 && (
        <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-xs shrink-0 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-amber-300">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Active AI Recommendation
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {aiInsights[0].description}
          </p>
          {aiInsights[0].actionLabel && (
            <button
              onClick={() => {
                if (aiInsights[0].actionPayload?.taskId) {
                  onApplyAiAction('REASSIGN_TASK', aiInsights[0].actionPayload);
                }
              }}
              className="mt-1 px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>{aiInsights[0].actionLabel}</span>
            </button>
          )}
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-amber-300 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none font-sans whitespace-pre-wrap'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium italic">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>Gemini AI is analyzing workspace telemetry...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestions Pills */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80 space-y-2 shrink-0">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Suggested CTO Queries
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask Gemini CTO Copilot anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-50 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
