import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Sparkles,
  Pin,
  Tag,
  Clock,
  BookOpen,
  Search,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { WikiDoc, User } from '../types';

interface WikiDocsViewProps {
  wikiDocs: WikiDoc[];
  members: User[];
  onCreateDoc: (docData: Partial<WikiDoc>) => void;
  onGenerateAiDoc: (title: string, category: string, topic: string) => Promise<void>;
}

export const WikiDocsView: React.FC<WikiDocsViewProps> = ({
  wikiDocs,
  members,
  onCreateDoc,
  onGenerateAiDoc
}) => {
  const [activeDoc, setActiveDoc] = useState<WikiDoc>(wikiDocs[0] || null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiDocTitle, setAiDocTitle] = useState('');
  const [aiDocCategory, setAiDocCategory] = useState('Engineering');
  const [aiDocTopic, setAiDocTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['All', 'Architecture', 'Engineering', 'Product', 'Onboarding'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDocs = wikiDocs.filter((d) => {
    if (selectedCategory !== 'All' && d.category !== selectedCategory) return false;
    return true;
  });

  const handleGenerate = async () => {
    if (!aiDocTitle.trim() || !aiDocTopic.trim()) return;
    setIsGenerating(true);
    try {
      await onGenerateAiDoc(aiDocTitle, aiDocCategory, aiDocTopic);
      setShowAiModal(false);
      setAiDocTitle('');
      setAiDocTopic('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Knowledge Base & Wiki Docs
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Notion-style markdown workspace with Gemini AI auto-documenter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Auto-Documenter</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Doc List, Right Doc Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Sidebar (Doc Tree & Search) */}
        <div className="md:col-span-4 flex flex-col bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 overflow-hidden shadow-2xs">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Doc List Stream */}
          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const author = members.find((m) => m.id === doc.authorId);
              const isActive = activeDoc?.id === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setActiveDoc(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isActive
                      ? 'bg-purple-50/80 border-purple-300 shadow-2xs'
                      : 'bg-slate-50/60 border-slate-200/80 hover:border-purple-200 hover:bg-purple-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-slate-900 truncate max-w-[200px]">
                      {doc.title}
                    </span>
                    {doc.pinned && <Pin className="w-3.5 h-3.5 text-purple-600 fill-current" />}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold border border-slate-300/50">
                      {doc.category}
                    </span>
                    <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Viewer */}
        <div className="md:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 overflow-y-auto space-y-4 shadow-2xs">
          {activeDoc ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                      {activeDoc.category}
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      {activeDoc.title}
                    </h2>
                  </div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <span>
                      Author: {members.find((m) => m.id === activeDoc.authorId)?.name || 'Team Member'}
                    </span>
                    <span>•</span>
                    <span>Last updated: {new Date(activeDoc.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Document Markdown Render */}
              <div className="prose max-w-none text-xs leading-relaxed space-y-3 font-sans">
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-xs">
                  {activeDoc.content}
                </pre>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 font-medium">Select a document from the left list</div>
          )}
        </div>
      </div>

      {/* AI Document Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Gemini AI Auto-Documenter
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. OAuth Gateway & Rate Limiting Spec"
                  value={aiDocTitle}
                  onChange={(e) => setAiDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Category</label>
                <select
                  value={aiDocCategory}
                  onChange={(e) => setAiDocCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Product">Product</option>
                  <option value="Onboarding">Onboarding</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Topic / Technical Brief</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Multi-region row-level security isolation, JWT verification middleware, and SOC2 audit benchmarks"
                  value={aiDocTopic}
                  onChange={(e) => setAiDocTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !aiDocTitle.trim() || !aiDocTopic.trim()}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Generating Doc...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Complete Spec</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
