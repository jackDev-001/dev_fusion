import React, { useState } from 'react';
import {
  Search,
  X,
  Kanban,
  FileText,
  Calendar,
  MessageSquare,
  User as UserIcon,
  ArrowRight
} from 'lucide-react';
import { Task, WikiDoc, Meeting, User, ChatChannel } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  wikiDocs: WikiDoc[];
  meetings: Meeting[];
  members: User[];
  channels: ChatChannel[];
  onNavigate: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  wikiDocs,
  meetings,
  members,
  channels,
  onNavigate
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchingTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)) : tasks.slice(0, 3);
  const matchingDocs = q ? wikiDocs.filter((d) => d.title.toLowerCase().includes(q)) : wikiDocs.slice(0, 2);
  const matchingMeetings = q ? meetings.filter((m) => m.title.toLowerCase().includes(q)) : meetings.slice(0, 2);

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden space-y-2">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search tasks, docs, meetings, team members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
          {/* Tasks Section */}
          {matchingTasks.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Kanban className="w-3.5 h-3.5 text-indigo-500" />
                <span>Tasks ({matchingTasks.length})</span>
              </div>
              <div className="space-y-1">
                {matchingTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onNavigate('kanban');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-slate-800 dark:text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.code}</span>
                      <span>{t.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Docs Section */}
          {matchingDocs.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>Docs ({matchingDocs.length})</span>
              </div>
              <div className="space-y-1">
                {matchingDocs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onNavigate('docs');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-slate-800 dark:text-slate-200"
                  >
                    <span>{d.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meetings Section */}
          {matchingMeetings.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Meetings ({matchingMeetings.length})</span>
              </div>
              <div className="space-y-1">
                {matchingMeetings.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onNavigate('meetings');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-slate-800 dark:text-slate-200"
                  >
                    <span>{m.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
