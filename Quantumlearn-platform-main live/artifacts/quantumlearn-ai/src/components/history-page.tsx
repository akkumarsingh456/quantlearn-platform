import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Calendar,
  Check,
  CircleDot,
  Code2,
  Download,
  Filter,
  FlaskConical,
  GraduationCap,
  History as HistoryIcon,
  MessageCircle,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'wouter';
import type { HistoryEntry, HistoryType, HistoryStatus } from '@/lib/activity-history';
import {
  getStoredHistory,
  saveHistoryEntries,
  deleteHistoryEntry,
  clearHistoryEntries,
  resetHistoryToSeed,
  exportHistoryAsJson,
} from '@/lib/activity-history';
import { VSCodeEditor } from '@/components/vscode-editor';

interface Learner {
  name: string;
  email: string;
  learningLevel: string;
  joinedAt: string;
  completed: string[];
  streak: number;
  runs: number;
  quizScore: number;
  predictionAttempts: number;
  predictionCorrect: number;
}

interface HistoryPageProps {
  learner: Learner;
}

export function HistoryPage({ learner }: HistoryPageProps) {
  const scope = learner.email || 'guest';
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<HistoryType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<HistoryStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'most-visited'>('newest');
  const [inspectingEntry, setInspectingEntry] = useState<HistoryEntry | null>(null);
  const [showVsCodeStudio, setShowVsCodeStudio] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load history from storage on mount
  useEffect(() => {
    const loaded = getStoredHistory(scope, learner.completed);
    setEntries(loaded);
  }, [scope, learner.completed]);

  // Listen for real-time activity events dispatched anywhere in the app
  useEffect(() => {
    const handleActivityLogged = () => {
      const refreshed = getStoredHistory(scope, learner.completed);
      setEntries(refreshed);
    };

    window.addEventListener('ql-activity-logged', handleActivityLogged);
    return () => window.removeEventListener('ql-activity-logged', handleActivityLogged);
  }, [scope, learner.completed]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handle single deletion
  const handleDelete = (id: string) => {
    const updated = deleteHistoryEntry(scope, id);
    setEntries(updated);
    setDeleteConfirmId(null);
    showToast('Activity record removed.');
  };

  // Handle clear all
  const handleClearAll = () => {
    clearHistoryEntries(scope);
    setEntries([]);
    setShowClearConfirm(false);
    showToast('Activity history cleared.');
  };

  // Handle seed reset
  const handleResetSeed = () => {
    const seeded = resetHistoryToSeed(scope);
    setEntries(seeded);
    showToast('Loaded standard quantum experiment history.');
  };

  // Handle JSON export
  const handleExport = () => {
    const jsonStr = exportHistoryAsJson(entries);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantumlearn_history_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('History exported as JSON.');
  };

  // Metrics summary
  const stats = useMemo(() => {
    const total = entries.length;
    const circuits = entries.filter((e) => e.resourceType === 'circuit').length;
    const lessons = entries.filter((e) => e.resourceType === 'lesson').length;
    const practice = entries.filter((e) => e.resourceType === 'practice').length;
    const tutor = entries.filter((e) => e.resourceType === 'tutor').length;
    const predictions = entries.filter((e) => e.actionType === 'PREDICTION');
    const matched = predictions.filter((p) => p.details?.predictionMatch).length;
    const accuracy = predictions.length > 0 ? Math.round((matched / predictions.length) * 100) : null;

    return { total, circuits, lessons, practice, tutor, accuracy };
  }, [entries]);

  // Filtered and sorted entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (selectedType !== 'all' && entry.resourceType !== selectedType) return false;
        if (selectedStatus !== 'all' && entry.status !== selectedStatus) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = entry.title.toLowerCase().includes(q);
          const matchDesc = entry.description.toLowerCase().includes(q);
          const matchGates = entry.details?.gateNames?.some((g) => g.toLowerCase().includes(q));
          const matchType = entry.resourceType.toLowerCase().includes(q);
          return matchTitle || matchDesc || matchGates || matchType;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'most-visited') {
          return (b.visits || 1) - (a.visits || 1);
        }
        const timeA = new Date(a.lastVisitedAt).getTime();
        const timeB = new Date(b.lastVisitedAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [entries, selectedType, selectedStatus, searchQuery, sortOrder]);

  // Group entries by relative date
  const groupedEntries = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups: { label: string; items: HistoryEntry[] }[] = [
      { label: 'Today', items: [] },
      { label: 'Yesterday', items: [] },
      { label: 'Earlier This Week', items: [] },
      { label: 'Older Experiments & Activities', items: [] },
    ];

    filteredEntries.forEach((entry) => {
      const entryDate = new Date(entry.lastVisitedAt);
      if (entryDate >= today) {
        groups[0].items.push(entry);
      } else if (entryDate >= yesterday) {
        groups[1].items.push(entry);
      } else if (entryDate >= thisWeek) {
        groups[2].items.push(entry);
      } else {
        groups[3].items.push(entry);
      }
    });

    return groups.filter((g) => g.items.length > 0);
  }, [filteredEntries]);

  // Type metadata helper
  const getTypeInfo = (type: HistoryType) => {
    switch (type) {
      case 'circuit':
        return {
          icon: FlaskConical,
          label: 'Circuit Simulation',
          color: 'text-[hsl(var(--primary))]',
          bg: 'bg-[hsl(var(--primary)/.12)]',
          badgeClass: 'border-[hsl(var(--primary)/.3)] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]',
        };
      case 'lesson':
        return {
          icon: BookOpen,
          label: 'Concept Lesson',
          color: 'text-[#16877D]',
          bg: 'bg-[#16877D]/12',
          badgeClass: 'border-[#16877D]/30 bg-[#16877D]/10 text-[#16877D]',
        };
      case 'visualization':
        return {
          icon: CircleDot,
          label: 'Qubit Explorer',
          color: 'text-[#E5B567]',
          bg: 'bg-[#E5B567]/15',
          badgeClass: 'border-[#E5B567]/30 bg-[#E5B567]/10 text-[#A67823]',
        };
      case 'algorithm':
        return {
          icon: BrainCircuit,
          label: 'Quantum Algorithm',
          color: 'text-[#8E44AD]',
          bg: 'bg-[#8E44AD]/12',
          badgeClass: 'border-[#8E44AD]/30 bg-[#8E44AD]/10 text-[#8E44AD]',
        };
      case 'practice':
        return {
          icon: Target,
          label: 'Practice & Quiz',
          color: 'text-[hsl(var(--accent))]',
          bg: 'bg-[hsl(var(--accent)/.12)]',
          badgeClass: 'border-[hsl(var(--accent)/.3)] bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))]',
        };
      case 'tutor':
        return {
          icon: MessageCircle,
          label: 'AI Tutor Session',
          color: 'text-[#2980B9]',
          bg: 'bg-[#2980B9]/12',
          badgeClass: 'border-[#2980B9]/30 bg-[#2980B9]/10 text-[#2980B9]',
        };
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="ql-rise mx-auto max-w-[1380px] space-y-8" data-testid="history-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <Check size={16} className="text-[hsl(var(--primary))]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VS Code Editor Modal Overlay */}
      {(inspectingEntry || showVsCodeStudio) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-5xl">
            <VSCodeEditor
              entry={inspectingEntry}
              isModal
              onClose={() => {
                setInspectingEntry(null);
                setShowVsCodeStudio(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clear History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="ql-card w-full max-w-md p-6 shadow-2xl">
            <h3 className="ql-serif text-2xl font-bold">Clear activity history?</h3>
            <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              This will remove all recorded circuit runs, lesson visits, and practice logs from this device. You can reload standard sample data anytime.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="ql-button ql-button-quiet"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="ql-button ql-button-coral"
                data-testid="button-confirm-clear"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="ql-kicker mb-2 flex items-center gap-2">
            <HistoryIcon size={14} /> Activity Log &amp; Lab Notebook
          </p>
          <h1 className="ql-serif text-4xl tracking-[-.04em] md:text-5xl">
            Experiment &amp; Learning History
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            A comprehensive, verifiable audit log of every quantum circuit simulation, qubit state analysis, studied algorithm, practice challenge, and AI tutor discussion.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowVsCodeStudio(true)}
            className="ql-button ql-button-primary flex items-center gap-2 shadow-sm"
            data-testid="button-open-vscode-studio"
          >
            <Code2 size={16} /> Open in VS Code Studio
          </button>
          <button
            onClick={handleExport}
            className="ql-button ql-button-quiet flex items-center gap-2"
            title="Download full history as JSON"
            data-testid="button-export-history"
          >
            <Download size={15} /> Export JSON
          </button>
          <button
            onClick={handleResetSeed}
            className="ql-button ql-button-quiet flex items-center gap-2"
            title="Restore default quantum experiments"
            data-testid="button-seed-history"
          >
            <RotateCcw size={14} /> Restore Sample Data
          </button>
          {entries.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="ql-button ql-button-quiet text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/.1)] px-3"
              title="Clear all activity history"
              data-testid="button-clear-history"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Bar */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ql-card p-5 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="ql-kicker">All Activities</span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]">
              <HistoryIcon size={16} />
            </span>
          </div>
          <p className="ql-serif mt-3 text-4xl">{stats.total}</p>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            Total recorded interactions
          </p>
        </div>

        <div className="ql-card p-5 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="ql-kicker">Circuit Runs</span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]">
              <FlaskConical size={16} />
            </span>
          </div>
          <p className="ql-serif mt-3 text-4xl">{stats.circuits}</p>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            Local Aer simulations executed
          </p>
        </div>

        <div className="ql-card p-5 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="ql-kicker">Concepts &amp; Theory</span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-[#16877D]/15 text-[#16877D]">
              <BookOpen size={16} />
            </span>
          </div>
          <p className="ql-serif mt-3 text-4xl">{stats.lessons}</p>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            Lessons &amp; modules explored
          </p>
        </div>

        <div className="ql-card p-5 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="ql-kicker !text-[hsl(var(--accent))]">Practice &amp; Recall</span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-[hsl(var(--accent)/.12)] text-[hsl(var(--accent))]">
              <Target size={16} />
            </span>
          </div>
          <p className="ql-serif mt-3 text-4xl">{stats.practice}</p>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            Challenge sessions completed
          </p>
        </div>
      </section>

      {/* Filter, Search & Category Navigation Bar */}
      <section className="ql-card p-5 space-y-4">
        {/* Top Filter Controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments by title, gate (H, CZ), keyword..."
              className="ql-input pl-10 text-sm"
              data-testid="input-history-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Sort & Status Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2.5 py-1.5 text-xs font-bold"
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="simulated">Simulated</option>
                <option value="in-progress">In progress</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2.5 py-1.5 text-xs font-bold"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="most-visited">Most visited</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[hsl(var(--border)/.6)]">
          {[
            { id: 'all', label: 'All Activities', count: entries.length },
            { id: 'circuit', label: '🔬 Circuit Simulations', count: stats.circuits },
            { id: 'lesson', label: '📚 Lessons & Topics', count: stats.lessons },
            { id: 'visualization', label: '💡 Qubit Explorer', count: entries.filter((e) => e.resourceType === 'visualization').length },
            { id: 'algorithm', label: '⚡ Algorithms', count: entries.filter((e) => e.resourceType === 'algorithm').length },
            { id: 'practice', label: '🎯 Practice Quizzes', count: stats.practice },
            { id: 'tutor', label: '🤖 AI Tutor', count: stats.tutor },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id as any)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedType === cat.id
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm'
                  : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/.4)] hover:text-[hsl(var(--foreground))]'
              }`}
              data-testid={`filter-type-${cat.id}`}
            >
              <span>{cat.label}</span>
              <span
                className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
                  selectedType === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Timeline Content */}
      <section className="space-y-8" data-testid="timeline-activity-list">
        {groupedEntries.length === 0 ? (
          <div className="ql-card p-12 text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
              <HistoryIcon size={28} />
            </div>
            <h3 className="ql-serif text-2xl font-bold">No activities match your filters</h3>
            <p className="mx-auto max-w-md text-sm text-[hsl(var(--muted-foreground))]">
              Try adjusting your search query, selecting &ldquo;All Activities&rdquo;, or load sample quantum experiments.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
                className="ql-button ql-button-quiet"
              >
                Clear Filters
              </button>
              <button
                onClick={handleResetSeed}
                className="ql-button ql-button-primary"
              >
                Load Sample Activities
              </button>
            </div>
          </div>
        ) : (
          groupedEntries.map((group) => (
            <div key={group.label} className="space-y-4">
              {/* Date Group Header */}
              <div className="flex items-center gap-3">
                <span className="ql-kicker !text-xs font-black">{group.label}</span>
                <span className="h-px flex-1 bg-[hsl(var(--border))]" />
                <span className="ql-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                  {group.items.length} {group.items.length === 1 ? 'event' : 'events'}
                </span>
              </div>

              {/* Items in Group */}
              <div className="grid gap-4">
                {group.items.map((entry) => {
                  const typeInfo = getTypeInfo(entry.resourceType);
                  const Icon = typeInfo.icon;
                  const isDeleting = deleteConfirmId === entry.id;

                  return (
                    <div
                      key={entry.id}
                      className="ql-card group relative p-5 md:p-6 transition-all hover:border-[hsl(var(--primary)/.4)] hover:shadow-md"
                      data-testid={`history-entry-${entry.id}`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        {/* Left Icon and Title details */}
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${typeInfo.bg} ${typeInfo.color} shadow-xs`}
                          >
                            <Icon size={20} strokeWidth={2.2} />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${typeInfo.badgeClass}`}
                              >
                                {typeInfo.label}
                              </span>
                              <span className="rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
                                {entry.status.toUpperCase()}
                              </span>
                              {entry.visits > 1 && (
                                <span className="ql-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                                  · {entry.visits} visits
                                </span>
                              )}
                              <span className="ql-mono text-[10.5px] text-[hsl(var(--muted-foreground))]">
                                · {formatTimestamp(entry.lastVisitedAt)}
                              </span>
                            </div>

                            <Link
                              href={entry.href}
                              className="inline-block text-lg font-black hover:text-[hsl(var(--primary))] transition-colors"
                            >
                              {entry.title}
                            </Link>

                            <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))] max-w-3xl">
                              {entry.description}
                            </p>

                            {/* Specific contextual metadata based on resource type */}
                            {entry.details && (
                              <div className="mt-3 flex flex-wrap items-center gap-2 pt-2">
                                {/* Applied Gates */}
                                {entry.details.gateNames && entry.details.gateNames.length > 0 && (
                                  <div className="flex items-center gap-1.5 rounded-lg bg-[hsl(var(--muted)/.8)] px-2.5 py-1 text-xs">
                                    <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">
                                      Gates:
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {entry.details.gateNames.map((g, idx) => (
                                        <span
                                          key={idx}
                                          className="ql-mono rounded bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-1.5 py-0.2 text-[10px] font-bold text-[hsl(var(--primary))]"
                                        >
                                          {g}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Dominant Measured State */}
                                {entry.details.dominantState && (
                                  <div className="flex items-center gap-1 rounded-lg bg-[hsl(var(--primary)/.1)] px-2.5 py-1 text-xs font-bold text-[hsl(var(--primary))]">
                                    <Sparkles size={12} />
                                    <span>Dominant: |{entry.details.dominantState}⟩</span>
                                  </div>
                                )}

                                {/* Prediction Result */}
                                {entry.details.prediction && (
                                  <div
                                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                                      entry.details.predictionMatch
                                        ? 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'
                                        : 'bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))]'
                                    }`}
                                  >
                                    {entry.details.predictionMatch ? <Check size={13} /> : <Zap size={13} />}
                                    <span>Prediction: {entry.details.prediction}</span>
                                  </div>
                                )}

                                {/* Quiz Score */}
                                {entry.details.score !== undefined && (
                                  <div className="flex items-center gap-1 rounded-lg bg-[hsl(var(--accent)/.12)] px-2.5 py-1 text-xs font-bold text-[hsl(var(--accent))]">
                                    <Target size={13} />
                                    <span>
                                      Score: {entry.details.score}/{entry.details.totalQuestions} ({entry.details.accuracy}%)
                                    </span>
                                  </div>
                                )}

                                {/* AI Tutor Mode */}
                                {entry.details.tutorMode && (
                                  <div className="flex items-center gap-1 rounded-lg bg-[#2980B9]/10 px-2.5 py-1 text-xs font-bold text-[#2980B9]">
                                    <MessageCircle size={13} />
                                    <span>Mode: {entry.details.tutorMode}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                          {/* Inspect in VS Code button */}
                          <button
                            onClick={() => setInspectingEntry(entry)}
                            className="flex items-center gap-1.5 rounded-xl border border-[#3C3C3C] bg-[#1E1E1E] px-3 py-1.5 text-xs font-bold text-[#CCCCCC] hover:border-[#007ACC] hover:text-white transition-all shadow-xs"
                            title="Inspect simulation script in VS Code editor"
                            data-testid={`button-inspect-vscode-${entry.id}`}
                          >
                            <Code2 size={13} className="text-[#007ACC]" />
                            <span>VS Code</span>
                          </button>

                          {/* Re-run / Visit Page Link */}
                          <Link
                            href={entry.href}
                            className="ql-button ql-button-quiet text-xs py-1 px-3"
                            data-testid={`button-open-${entry.id}`}
                          >
                            <span>Open</span>
                            <ArrowRight size={13} />
                          </Link>

                          {/* Delete Entry */}
                          {isDeleting ? (
                            <div className="flex items-center gap-1 bg-[hsl(var(--accent)/.1)] rounded-xl p-1">
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="rounded px-2 py-1 text-[11px] font-bold text-white bg-[hsl(var(--accent))]"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="rounded px-1.5 py-1 text-[11px] text-[hsl(var(--muted-foreground))]"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(entry.id)}
                              className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] opacity-50 hover:opacity-100 hover:text-[hsl(var(--accent))] transition-all"
                              title="Delete this history record"
                              data-testid={`button-delete-${entry.id}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Bottom Pro-tip info banner */}
      <div className="rounded-2xl border border-dashed border-[hsl(var(--primary)/.35)] bg-[hsl(var(--primary)/.05)] p-5">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="mt-0.5 text-[hsl(var(--primary))] shrink-0" />
          <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            <strong className="text-[hsl(var(--foreground))]">Complete Lab Notebook:</strong> Every simulation run you make in the Circuit Lab, every gate tested in the Qubit Explorer, and every practice challenge completed is automatically written to this history log. Use the <strong className="text-[hsl(var(--foreground))]">VS Code Studio</strong> button above or on any entry to view and execute reproducible Qiskit code locally.
          </p>
        </div>
      </div>
    </div>
  );
}
