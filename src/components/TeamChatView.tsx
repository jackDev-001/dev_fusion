import React, { useState } from 'react';
import {
  MessageSquare,
  Hash,
  Lock,
  Send,
  Users,
  Terminal
} from 'lucide-react';
import { ChatChannel, ChatMessage, User } from '../types';
import { UserAvatar } from './UserAvatar';

interface TeamChatViewProps {
  channels: ChatChannel[];
  messages: ChatMessage[];
  members: User[];
  currentUser: User;
  onSendMessage: (channelId: string, content: string) => void;
}

export const TeamChatView: React.FC<TeamChatViewProps> = ({
  channels,
  messages,
  members,
  currentUser,
  onSendMessage
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>(channels[0]?.id || 'ch_1');
  const [inputText, setInputText] = useState('');

  const activeChannel = channels.find((c) => c.id === activeChannelId);
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(activeChannelId, inputText);
    setInputText('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Team Chat & Collaboration
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Channels, thread discussions, and integrated workspace bot (@NexusBot)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Channels Stream */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 overflow-y-auto">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Workspace Channels
          </h2>

          <div className="space-y-1">
            {channels.map((ch) => {
              const isActive = ch.id === activeChannelId;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {ch.type === 'PRIVATE' ? <Lock className="w-3.5 h-3.5" /> : <Hash className="w-3.5 h-3.5" />}
                    <span>{ch.name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-800'}`}>
                    {ch.membersCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Message Feed & Chat Input */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
          {/* Channel Info Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-500 font-bold" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {activeChannel?.name}
              </span>
              <span className="text-xs text-slate-400 truncate max-w-xs">
                — {activeChannel?.topic}
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3 overflow-y-auto space-y-4">
            {channelMessages.map((msg) => {
              const sender = members.find((m) => m.id === msg.senderId);
              const isAi = msg.isAiResponse || msg.senderId === 'ai_bot';

              return (
                <div key={msg.id} className="flex gap-3 text-xs group">
                  {isAi ? (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <Terminal className="w-4 h-4" />
                    </div>
                  ) : (
                    <UserAvatar
                      name={sender?.name || 'User'}
                      className="w-8 h-8 rounded-full text-xs font-black shrink-0"
                    />
                  )}

                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isAi ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                        {isAi ? 'NexusBot' : sender?.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        isAi
                          ? 'bg-indigo-50 border border-indigo-200 text-slate-800 font-medium whitespace-pre-wrap'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder={`Message #${activeChannel?.name || 'channel'}... (Tip: Mention @NexusBot for instant sprint analysis)`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
            />
            <button
              onClick={handleSend}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
