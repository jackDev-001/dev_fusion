import React, { useState } from 'react';
import {
  Calendar,
  Video,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  Zap
} from 'lucide-react';
import { Meeting, User } from '../types';

interface MeetingsViewProps {
  meetings: Meeting[];
  members: User[];
  onApplyAiAction: (actionType: string, payload: any) => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({
  meetings,
  members,
  onApplyAiAction
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting>(meetings[0] || null);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Meetings & Google Calendar Sync
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integrated meeting notes, Zoom/Meet links, and AI Action Item Task Extractor
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Meetings Stream */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 overflow-y-auto">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Scheduled Meetings ({meetings.length})
          </h2>

          {meetings.map((m) => {
            const isActive = selectedMeeting?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMeeting(m)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-2xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>{m.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    {m.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(m.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail & AI Action Extractor */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 overflow-y-auto space-y-6">
          {selectedMeeting ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedMeeting.title}
                  </h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Organizer: {members.find((u) => u.id === selectedMeeting.organizerId)?.name}
                  </div>
                </div>

                <a
                  href={selectedMeeting.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Google Meet</span>
                </a>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Meeting Notes & Key Takeaways
                </h3>
                <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedMeeting.notes}
                </p>
              </div>

              {/* Action Items & AI Extractor */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Extracted Action Items
                  </h3>

                  <button
                    onClick={() => onApplyAiAction('EXTRACT_MEETING_TASKS', { meetingId: selectedMeeting.id })}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Auto-Create Tasks via AI</span>
                  </button>
                </div>

                {selectedMeeting.actionItems && selectedMeeting.actionItems.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMeeting.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">No action items recorded yet</div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">Select a meeting to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};
