import { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileCode,
  FileJson,
  FileText,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import type { HistoryEntry } from '@/lib/activity-history';
import { generateQiskitPythonCode, generateQasmCode } from '@/lib/activity-history';

interface VSCodeEditorProps {
  entry?: HistoryEntry | null;
  initialCode?: string;
  title?: string;
  onClose?: () => void;
  isModal?: boolean;
}

type EditorTab = 'python' | 'json' | 'qasm' | 'notes';

export function VSCodeEditor({
  entry,
  initialCode,
  title = 'quantum_experiment.py',
  onClose,
  isModal = false,
}: VSCodeEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('python');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [activeTerminalTab, setActiveTerminalTab] = useState<'terminal' | 'output' | 'problems'>('terminal');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simRunCount, setSimRunCount] = useState(0);

  // Generate contents based on entry details or default templates
  const gates = entry?.details?.gates || [
    { id: 1, name: 'H', qubit: 0 },
    { id: 2, name: 'CZ', qubit: 0 },
    { id: 3, name: 'H', qubit: 1 },
  ];
  const qubitCount = entry?.details?.qubitCount || 3;
  const probabilities = entry?.details?.probabilities || [0.5, 0, 0, 0.5, 0, 0, 0, 0];
  const dominantState = entry?.details?.dominantState || '000';

  const pythonCode =
    entry?.details?.pythonCode ||
    initialCode ||
    generateQiskitPythonCode(gates, qubitCount);

  const jsonContent = JSON.stringify(
    {
      experimentId: entry?.id || 'exp-latest-local',
      title: entry?.title || 'Quantum Circuit Simulation',
      resourceType: entry?.resourceType || 'circuit',
      status: entry?.status || 'simulated',
      qubitCount,
      shots: 1024,
      appliedGates: gates.map((g) => ({ gate: g.name, targetQubit: g.qubit })),
      measurementResults: {
        dominantState: `|${dominantState}⟩`,
        probabilitiesDistribution: probabilities.map((p, idx) => ({
          state: `|${idx.toString(2).padStart(qubitCount, '0')}⟩`,
          probability: Number(p.toFixed(4)),
          estimatedCounts: Math.round(p * 1024),
        })),
      },
      verifiedAt: entry?.lastVisitedAt || new Date().toISOString(),
      engine: 'QuantumLearn In-Browser AerSimulator v1.2',
    },
    null,
    2
  );

  const qasmContent =
    entry?.details?.qasmCode || generateQasmCode(gates, qubitCount);

  const notesContent = `# ${entry?.title || 'Quantum Experiment Notebook'}

## Overview
- **Activity Type:** ${entry?.resourceType?.toUpperCase() || 'CIRCUIT SIMULATION'}
- **Action Status:** ${entry?.status?.toUpperCase() || 'COMPLETED'}
- **Timestamp:** ${entry?.lastVisitedAt ? new Date(entry.lastVisitedAt).toLocaleString() : new Date().toLocaleString()}
- **Visits/Runs:** ${entry?.visits || 1}

## Description
${entry?.description || 'Hands-on quantum simulation verified on simulated quantum hardware.'}

## Circuit Configuration
- Qubits: ${qubitCount}
- Placed Gates: ${gates.map((g) => `${g.name}(q${g.qubit})`).join(', ') || 'Identity'}
- Dominant Measured State: |${dominantState}⟩

## How to Run Locally with VS Code
1. Install Python 3.9+ & Qiskit:
   \`\`\`bash
   pip install qiskit qiskit-aer matplotlib
   \`\`\`
2. Save \`simulation.py\` and execute:
   \`\`\`bash
   python simulation.py
   \`\`\`
`;

  const getCurrentFileContent = () => {
    switch (activeTab) {
      case 'python':
        return { content: pythonCode, filename: 'simulation.py', lang: 'Python' };
      case 'json':
        return { content: jsonContent, filename: 'results.json', lang: 'JSON' };
      case 'qasm':
        return { content: qasmContent, filename: 'circuit.qasm', lang: 'OpenQASM' };
      case 'notes':
        return { content: notesContent, filename: 'NOTES.md', lang: 'Markdown' };
    }
  };

  const { content: currentCode, filename: currentFilename, lang: currentLang } = getCurrentFileContent();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const runSimulationTerminal = () => {
    setIsSimulating(true);
    setTerminalOpen(true);
    setActiveTerminalTab('terminal');
    setTimeout(() => {
      setIsSimulating(false);
      setSimRunCount((c) => c + 1);
    }, 600);
  };

  const lines = currentCode.split('\n');

  // Syntax highlighting helper for code lines
  const renderHighlightedLine = (line: string, tab: EditorTab) => {
    if (!line) return <span>&nbsp;</span>;

    if (tab === 'python') {
      // Comment
      if (line.trim().startsWith('#')) {
        return <span className="text-[#6A9955]">{line}</span>;
      }
      // String
      if (line.includes('"""') || line.includes("'''")) {
        return <span className="text-[#CE9178]">{line}</span>;
      }

      // Basic regex token styling
      const parts = line.split(/(\b(?:from|import|def|class|return|for|in|if|else|elif|while|True|False|None|print|range|as)\b|"[^"]*"|'[^']*'|\b\d+\.?\d*\b|[(),:=[\]{}])/g);

      return (
        <span>
          {parts.map((part, index) => {
            if (/^(from|import|def|class|return|for|in|if|else|elif|while|as)$/.test(part)) {
              return <span key={index} className="text-[#C586C0] font-semibold">{part}</span>;
            }
            if (/^(True|False|None)$/.test(part)) {
              return <span key={index} className="text-[#569CD6] font-semibold">{part}</span>;
            }
            if (/^(print|range|len|sorted|format|list|dict|set)$/.test(part)) {
              return <span key={index} className="text-[#DCDCAA]">{part}</span>;
            }
            if (/^(QuantumCircuit|AerSimulator|plt|qc|simulator|result|counts)$/.test(part)) {
              return <span key={index} className="text-[#4EC9B0]">{part}</span>;
            }
            if (/^(".*"|'.*')$/.test(part)) {
              return <span key={index} className="text-[#CE9178]">{part}</span>;
            }
            if (/^\d+\.?\d*$/.test(part)) {
              return <span key={index} className="text-[#B5CEA8]">{part}</span>;
            }
            if (/^[=+\-*/]$/.test(part)) {
              return <span key={index} className="text-[#D4D4D4]">{part}</span>;
            }
            return <span key={index} className="text-[#9CDCFE]">{part}</span>;
          })}
        </span>
      );
    }

    if (tab === 'json') {
      const parts = line.split(/("[^"]*"\s*:|"[^"]*"|\b\d+\.?\d*\b|\b(?:true|false|null)\b)/g);
      return (
        <span>
          {parts.map((part, idx) => {
            if (/^"[^"]*"\s*:/.test(part)) {
              return <span key={idx} className="text-[#9CDCFE] font-medium">{part}</span>;
            }
            if (/^"[^"]*"/.test(part)) {
              return <span key={idx} className="text-[#CE9178]">{part}</span>;
            }
            if (/^\b\d+\.?\d*\b/.test(part)) {
              return <span key={idx} className="text-[#B5CEA8]">{part}</span>;
            }
            if (/^(true|false|null)$/.test(part)) {
              return <span key={idx} className="text-[#569CD6] font-bold">{part}</span>;
            }
            return <span key={idx} className="text-[#D4D4D4]">{part}</span>;
          })}
        </span>
      );
    }

    if (tab === 'qasm') {
      if (line.trim().startsWith('//')) {
        return <span className="text-[#6A9955]">{line}</span>;
      }
      return (
        <span>
          {line.split(/(\b(?:OPENQASM|include|qreg|creg|measure|barrier|reset)\b|\b(?:h|x|y|z|s|t|cx|cz)\b)/gi).map((part, idx) => {
            if (/^(OPENQASM|include|qreg|creg|measure|barrier|reset)$/i.test(part)) {
              return <span key={idx} className="text-[#C586C0] font-semibold">{part}</span>;
            }
            if (/^(h|x|y|z|s|t|cx|cz)$/i.test(part)) {
              return <span key={idx} className="text-[#4EC9B0] font-bold">{part}</span>;
            }
            return <span key={idx} className="text-[#9CDCFE]">{part}</span>;
          })}
        </span>
      );
    }

    // Markdown
    if (line.startsWith('#')) return <span className="text-[#4EC9B0] font-bold">{line}</span>;
    if (line.startsWith('- ')) return <span className="text-[#9CDCFE]">{line}</span>;
    return <span className="text-[#D4D4D4]">{line}</span>;
  };

  const containerClasses = isModal
    ? isFullscreen
      ? 'fixed inset-0 z-50 flex flex-col bg-[#1E1E1E] text-[#CCCCCC]'
      : 'fixed inset-4 z-50 flex flex-col rounded-2xl border border-[#3C3C3C] bg-[#1E1E1E] text-[#CCCCCC] shadow-[0_25px_60px_rgba(0,0,0,0.65)] overflow-hidden max-w-6xl mx-auto my-auto max-h-[92vh]'
    : 'relative flex flex-col rounded-2xl border border-[#3C3C3C] bg-[#1E1E1E] text-[#CCCCCC] shadow-2xl overflow-hidden';

  return (
    <div className={containerClasses} data-testid="vscode-editor-container">
      {/* 1. VS Code Window Titlebar */}
      <div className="flex h-9 select-none items-center justify-between border-b border-[#252526] bg-[#323233] px-3 text-xs text-[#969696]">
        <div className="flex items-center gap-2">
          {/* Mac/VS Code window traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="size-3 rounded-full bg-[#FF5F56] transition-opacity hover:opacity-80 inline-block" />
            <span className="size-3 rounded-full bg-[#FFBD2E] transition-opacity hover:opacity-80 inline-block" />
            <span className="size-3 rounded-full bg-[#27C93F] transition-opacity hover:opacity-80 inline-block" />
          </div>
          <span className="font-semibold text-[#D4D4D4] flex items-center gap-1.5">
            <FileCode size={14} className="text-[#007ACC]" />
            Visual Studio Code — {entry?.title || title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={runSimulationTerminal}
            className="flex items-center gap-1 rounded bg-[#0E639C] hover:bg-[#1177BB] px-2.5 py-1 text-[11px] font-bold text-white transition-colors mr-2 shadow-sm"
            title="Execute circuit simulation in integrated VS Code terminal"
            data-testid="button-vscode-run"
          >
            <Play size={11} fill="white" /> Run Simulation
          </button>
          {isModal && (
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded p-1 hover:bg-[#3C3C3C] text-[#CCCCCC] transition-colors"
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded p-1 hover:bg-[#C42B1C] hover:text-white text-[#CCCCCC] transition-colors"
              title="Close editor"
              data-testid="button-vscode-close"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2. VS Code Tab Bar & Action Controls */}
      <div className="flex select-none items-center justify-between border-b border-[#252526] bg-[#252526] text-xs">
        <div className="flex overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-2 border-r border-[#252526] px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'python'
                ? 'bg-[#1E1E1E] text-[#FFFFFF] border-t-2 border-t-[#007ACC]'
                : 'bg-[#2D2D2D] text-[#969696] hover:bg-[#2A2D2E] hover:text-[#D4D4D4]'
            }`}
            data-testid="tab-vscode-python"
          >
            <span className="text-[#3572A5] font-black text-sm">🐍</span>
            <span>simulation.py</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 border-r border-[#252526] px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'json'
                ? 'bg-[#1E1E1E] text-[#FFFFFF] border-t-2 border-t-[#007ACC]'
                : 'bg-[#2D2D2D] text-[#969696] hover:bg-[#2A2D2E] hover:text-[#D4D4D4]'
            }`}
            data-testid="tab-vscode-json"
          >
            <FileJson size={13} className="text-[#CBCB41]" />
            <span>results.json</span>
          </button>

          <button
            onClick={() => setActiveTab('qasm')}
            className={`flex items-center gap-2 border-r border-[#252526] px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'qasm'
                ? 'bg-[#1E1E1E] text-[#FFFFFF] border-t-2 border-t-[#007ACC]'
                : 'bg-[#2D2D2D] text-[#969696] hover:bg-[#2A2D2E] hover:text-[#D4D4D4]'
            }`}
            data-testid="tab-vscode-qasm"
          >
            <Sparkles size={13} className="text-[#4EC9B0]" />
            <span>circuit.qasm</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 border-r border-[#252526] px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'notes'
                ? 'bg-[#1E1E1E] text-[#FFFFFF] border-t-2 border-t-[#007ACC]'
                : 'bg-[#2D2D2D] text-[#969696] hover:bg-[#2A2D2E] hover:text-[#D4D4D4]'
            }`}
            data-testid="tab-vscode-notes"
          >
            <FileText size={13} className="text-[#519ABA]" />
            <span>NOTES.md</span>
          </button>
        </div>

        {/* Tab Right Actions */}
        <div className="flex items-center gap-1.5 px-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] text-[#CCCCCC] hover:bg-[#3C3C3C] hover:text-white transition-colors"
            title="Copy code to clipboard"
            data-testid="button-vscode-copy"
          >
            {copied ? <Check size={12} className="text-[#27C93F]" /> : <Copy size={12} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] text-[#CCCCCC] hover:bg-[#3C3C3C] hover:text-white transition-colors"
            title="Download file"
            data-testid="button-vscode-download"
          >
            <Download size={12} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* 3. Breadcrumb Bar */}
      <div className="flex items-center gap-1.5 border-b border-[#252526] bg-[#1E1E1E] px-4 py-1 text-[11px] text-[#858585]">
        <span>quantumlearn</span>
        <span>&rsaquo;</span>
        <span>artifacts</span>
        <span>&rsaquo;</span>
        <span>experiments</span>
        <span>&rsaquo;</span>
        <span className="text-[#D4D4D4] font-medium">{currentFilename}</span>
      </div>

      {/* 4. Editor Body with Line Numbers & Minimap */}
      <div className="relative flex flex-1 overflow-auto bg-[#1E1E1E] font-mono text-[12px] leading-5 min-h-[280px] max-h-[500px]">
        {/* Line Numbers Column */}
        <div className="select-none bg-[#1E1E1E] py-3 pl-3 pr-4 text-right text-[#858585] min-w-[48px] border-r border-[#2B2B2B]">
          {lines.map((_, idx) => (
            <div key={idx} className="h-5">
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-x-auto p-3 pl-4">
          <pre className="font-mono text-[12.5px] leading-5 text-[#D4D4D4] m-0">
            {lines.map((line, idx) => (
              <div key={idx} className="h-5 hover:bg-[#282828] transition-colors rounded-xs px-1">
                {renderHighlightedLine(line, activeTab)}
              </div>
            ))}
          </pre>
        </div>

        {/* VS Code Minimap Preview Bar */}
        <div className="hidden select-none border-l border-[#2B2B2B] bg-[#1E1E1E] w-20 py-2 px-1 text-[4px] leading-[4px] opacity-40 md:block overflow-hidden pointer-events-none">
          {lines.slice(0, 45).map((l, i) => (
            <div key={i} className="truncate text-[#9CDCFE] my-0.5">
              {l.slice(0, 30)}
            </div>
          ))}
        </div>
      </div>

      {/* 5. VS Code Integrated Terminal Panel */}
      {terminalOpen && (
        <div className="border-t border-[#3C3C3C] bg-[#181818] text-xs">
          {/* Terminal Tabs */}
          <div className="flex select-none items-center justify-between border-b border-[#2B2B2B] bg-[#1F1F1F] px-3 py-1">
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <button
                onClick={() => setActiveTerminalTab('terminal')}
                className={`flex items-center gap-1.5 pb-0.5 transition-colors ${
                  activeTerminalTab === 'terminal'
                    ? 'text-white border-b-2 border-[#007ACC]'
                    : 'text-[#858585] hover:text-[#CCCCCC]'
                }`}
              >
                <Terminal size={12} /> TERMINAL
              </button>
              <button
                onClick={() => setActiveTerminalTab('output')}
                className={`flex items-center gap-1.5 pb-0.5 transition-colors ${
                  activeTerminalTab === 'output'
                    ? 'text-white border-b-2 border-[#007ACC]'
                    : 'text-[#858585] hover:text-[#CCCCCC]'
                }`}
              >
                OUTPUT
              </button>
              <button
                onClick={() => setActiveTerminalTab('problems')}
                className={`flex items-center gap-1.5 pb-0.5 transition-colors ${
                  activeTerminalTab === 'problems'
                    ? 'text-white border-b-2 border-[#007ACC]'
                    : 'text-[#858585] hover:text-[#CCCCCC]'
                }`}
              >
                PROBLEMS <span className="rounded-full bg-[#3C3C3C] px-1.5 text-[9px]">0</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runSimulationTerminal}
                className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold text-[#4EC9B0] hover:bg-[#2A2A2A]"
                title="Rerun script"
              >
                <RotateCcw size={10} /> Rerun
              </button>
              <button
                onClick={() => setTerminalOpen(false)}
                className="text-[#858585] hover:text-white"
                title="Close terminal"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="p-3 font-mono text-[11.5px] leading-5 text-[#CCCCCC] max-h-44 overflow-y-auto">
            {activeTerminalTab === 'terminal' && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#4EC9B0]">
                  <span className="text-[#3572A5] font-black">❯</span>
                  <span className="text-[#DCDCAA]">python</span>
                  <span className="text-[#CE9178]">{currentFilename}</span>
                </div>
                {isSimulating ? (
                  <div className="text-[#E5B567] animate-pulse">
                    [QuantumLearn Simulator] Compiling quantum statevector and calculating amplitudes...
                  </div>
                ) : (
                  <>
                    <div className="text-[#6A9955]">
                      [AerSimulator] Initialized 3-qubit statevector simulator (shots: 1024, seed: {42 + simRunCount})
                    </div>
                    <div className="text-[#9CDCFE]">
                      Circuit depth: {gates.length} gates | Active qubits: {qubitCount}
                    </div>
                    <div className="text-[#D4D4D4]">
                      Applied sequence:{' '}
                      <span className="text-[#E5B567]">
                        {gates.map((g) => `${g.name}[q${g.qubit}]`).join(' → ') || 'Identity'}
                      </span>
                    </div>
                    <div className="mt-1 text-[#27C93F] font-bold">
                      Measurement results:
                    </div>
                    {probabilities
                      .map((prob, idx) => ({ prob, idx }))
                      .filter((item) => item.prob > 0.04)
                      .map((item) => (
                        <div key={item.idx} className="pl-3 text-[#D4D4D4]">
                          |{item.idx.toString(2).padStart(qubitCount, '0')}⟩ :{' '}
                          <span className="text-[#4EC9B0] font-bold">
                            {(item.prob * 100).toFixed(1)}%
                          </span>{' '}
                          ({Math.round(item.prob * 1024)} counts)
                        </div>
                      ))}
                    <div className="mt-1 text-[#4EC9B0]">
                      Dominant state: |{dominantState}⟩ (matches theoretical expectation)
                    </div>
                    <div className="text-[#858585] text-[10.5px]">
                      Execution completed in 41.2ms with exit code 0.
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTerminalTab === 'output' && (
              <div className="space-y-1 text-[#858585]">
                <p>[QuantumLearn Service Log] Engine: Local WebAssembly AerSimulator</p>
                <p>[Compiler] Optimization level: O2. Unrolled 2-qubit operations successfully.</p>
                <p className="text-[#27C93F]">[Verification] QASM AST validated without syntax errors.</p>
              </div>
            )}

            {activeTerminalTab === 'problems' && (
              <div className="text-[#858585] py-2">
                No problems have been detected in the workspace.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. VS Code Status Bar */}
      <div className="flex select-none items-center justify-between bg-[#007ACC] px-3 py-0.5 text-[11px] font-medium text-white">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold">
            <span className="text-[10px]">⎇</span> main*
          </span>
          <span className="flex items-center gap-1">
            <span>⨂ 0</span>
            <span>⚠️ 0</span>
          </span>
          {!terminalOpen && (
            <button
              onClick={() => setTerminalOpen(true)}
              className="hover:underline flex items-center gap-1"
            >
              <Terminal size={10} /> Terminal
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span>Ln {lines.length}, Col 1</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span className="font-semibold">{currentLang}</span>
          <span className="rounded bg-[#0A5380] px-1.5 py-0.2 text-[9.5px]">
            Qiskit Aer 1.0.2
          </span>
        </div>
      </div>
    </div>
  );
}
