export type HistoryType = 'circuit' | 'lesson' | 'algorithm' | 'visualization' | 'practice' | 'tutor';
export type HistoryStatus = 'started' | 'in-progress' | 'completed' | 'simulated';
export type HistoryActionType = 'VIEWED' | 'SIMULATION' | 'COMPLETED' | 'PREDICTION' | 'PRACTICE' | 'TUTOR_QUERY';

export interface GateItem {
  id: number;
  name: string;
  qubit: number;
}

export interface HistoryEntry {
  id: string;
  resourceType: HistoryType;
  title: string;
  href: string;
  firstVisitedAt: string;
  lastVisitedAt: string;
  visits: number;
  status: HistoryStatus;
  actionType: HistoryActionType;
  description: string;
  details?: {
    gates?: GateItem[];
    gateNames?: string[];
    qubitCount?: number;
    probabilities?: number[];
    dominantState?: string;
    prediction?: string;
    predictionMatch?: boolean;
    accuracy?: number;
    score?: number;
    totalQuestions?: number;
    tutorMode?: string;
    tutorPrompt?: string;
    topicId?: string;
    algorithmId?: string;
    pythonCode?: string;
    qasmCode?: string;
  };
}

export type NewActivityInput = {
  id?: string;
  resourceType: HistoryType;
  title: string;
  href: string;
  status: HistoryStatus;
  actionType: HistoryActionType;
  description: string;
  details?: HistoryEntry['details'];
};

export function generateQiskitPythonCode(gates: GateItem[] = [], qubitCount = 3): string {
  const operations = gates.map((gate) => {
    if (gate.name === 'CZ') return `qc.cz(${gate.qubit}, ${(gate.qubit + 1) % qubitCount})`;
    if (gate.name === 'DIFF') {
      return `# Grover Diffusion operator\nqc.h(range(${qubitCount}))\nqc.x(range(${qubitCount}))\nqc.h(${qubitCount - 1})\nqc.mcx(list(range(${qubitCount - 1})), ${qubitCount - 1})\nqc.h(${qubitCount - 1})\nqc.x(range(${qubitCount}))\nqc.h(range(${qubitCount}))`;
    }
    return `qc.${gate.name.toLowerCase()}(${gate.qubit})`;
  }).join('\n');

  return `#!/usr/bin/env python3
"""
QuantumLearn - Local Qiskit Simulation Script
Reproduce this exact quantum circuit simulation on your machine.
Requirements: pip install qiskit qiskit-aer matplotlib
"""

from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
import matplotlib.pyplot as plt

# 1. Initialize ${qubitCount}-qubit circuit with ${qubitCount} classical measurement bits
qc = QuantumCircuit(${qubitCount}, ${qubitCount})

# 2. Applied Gate Sequence
${operations || '# No gates placed - identity circuit'}

# 3. Measurement operations
qc.measure(range(${qubitCount}), range(${qubitCount}))

# 4. Execute on AerSimulator backend
simulator = AerSimulator()
job = simulator.run(qc, shots=1024)
result = job.result()
counts = result.get_counts(qc)

# 5. Output results
print("=" * 45)
print("QuantumLearn Simulation Counts (1024 shots):")
for state, count in sorted(counts.items()):
    probability = count / 1024
    print(f"  |{state}⟩ : {count} counts ({probability * 100:.1f}%)")
print("=" * 45)

# 6. Plot Probability Distribution
labels = [format(i, f'0{qubitCount}b') for i in range(2**qubitCount)]
probabilities = [counts.get(lbl, 0) / 1024 for lbl in labels]

fig, ax = plt.subplots(figsize=(8, 4.5))
ax.bar(labels, probabilities, color='#16877d', edgecolor='#10645c', width=0.55)
ax.set_ylabel('Measured Probability', fontsize=11)
ax.set_xlabel('Basis State |q⟩', fontsize=11)
ax.set_title('QuantumLearn Circuit Simulation Results', fontsize=13, fontweight='bold')
ax.set_ylim(0, 1.05)
plt.grid(axis='y', linestyle='--', alpha=0.3)
plt.tight_layout()
plt.show()
`;
}

export function generateQasmCode(gates: GateItem[] = [], qubitCount = 3): string {
  const gateLines = gates.map((gate) => {
    if (gate.name === 'CZ') return `cz q[${gate.qubit}], q[${(gate.qubit + 1) % qubitCount}];`;
    if (gate.name === 'DIFF') return `// Diffusion block\nh q;\nx q;\nh q[${qubitCount - 1}];\nx q;\nh q;`;
    return `${gate.name.toLowerCase()} q[${gate.qubit}];`;
  }).join('\n');

  return `OPENQASM 2.0;
include "qelib1.inc";

// QuantumLearn Circuit Export
qreg q[${qubitCount}];
creg c[${qubitCount}];

${gateLines || '// Empty circuit'}

measure q -> c;
`;
}

const DEFAULT_SEED_HISTORY: HistoryEntry[] = [
  {
    id: 'seed-hist-bell-state',
    resourceType: 'circuit',
    title: 'Bell State (EPR Pair) Entanglement Simulation',
    href: '/quantum-lab',
    firstVisitedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    lastVisitedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    visits: 4,
    status: 'simulated',
    actionType: 'SIMULATION',
    description: 'Executed 3-qubit circuit with Hadamard and Controlled-Z gates. Measured strong entanglement superposition across |000⟩ and |011⟩.',
    details: {
      gates: [
        { id: 101, name: 'H', qubit: 0 },
        { id: 102, name: 'CZ', qubit: 0 },
        { id: 103, name: 'H', qubit: 1 },
      ],
      gateNames: ['H (q0)', 'CZ (q0, q1)', 'H (q1)'],
      qubitCount: 3,
      probabilities: [0.5, 0, 0, 0.5, 0, 0, 0, 0],
      dominantState: '000',
      prediction: '000',
      predictionMatch: true,
      accuracy: 100,
      pythonCode: generateQiskitPythonCode([
        { id: 101, name: 'H', qubit: 0 },
        { id: 102, name: 'CZ', qubit: 0 },
        { id: 103, name: 'H', qubit: 1 },
      ], 3),
      qasmCode: generateQasmCode([
        { id: 101, name: 'H', qubit: 0 },
        { id: 102, name: 'CZ', qubit: 0 },
        { id: 103, name: 'H', qubit: 1 },
      ], 3),
    },
  },
  {
    id: 'seed-hist-qubit-explorer-hadamard',
    resourceType: 'visualization',
    title: 'Qubit Explorer: Hadamard Gate & Bloch Sphere Analysis',
    href: '/qubit-explorer',
    firstVisitedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    lastVisitedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    visits: 6,
    status: 'completed',
    actionType: 'PREDICTION',
    description: 'Tested single-qubit Hadamard gate starting from ground state |0⟩. Verified equal probability distribution (|0⟩: 50%, |1⟩: 50%) along the X-axis.',
    details: {
      gateNames: ['H (Hadamard)'],
      prediction: 'superposition',
      predictionMatch: true,
      accuracy: 100,
      dominantState: '0',
      probabilities: [0.5, 0.5],
      pythonCode: `from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
import matplotlib.pyplot as plt

qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)

result = AerSimulator().run(qc, shots=1024).result()
counts = result.get_counts()
print("Qubit Explorer H-Gate Counts:", counts)
plt.bar(['|0⟩', '|1⟩'], [counts.get('0', 0)/1024, counts.get('1', 0)/1024], color='#16877d')
plt.title('Hadamard Superposition Measurement')
plt.show()`,
    },
  },
  {
    id: 'seed-hist-lesson-what-is-quantum',
    resourceType: 'lesson',
    title: 'Lesson 01: What is quantum computing?',
    href: '/learn/what-is-quantum',
    firstVisitedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    lastVisitedAt: new Date(Date.now() - 3600 * 1000 * 22).toISOString(),
    visits: 3,
    status: 'completed',
    actionType: 'COMPLETED',
    description: 'Completed foundational lesson exploring physical information, quantum advantage over classical bits, and interference.',
    details: {
      topicId: 'what-is-quantum',
    },
  },
  {
    id: 'seed-hist-lesson-complex-numbers',
    resourceType: 'lesson',
    title: 'Lesson 02: Complex numbers for quantum states',
    href: '/learn/complex-numbers',
    firstVisitedAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
    lastVisitedAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
    visits: 2,
    status: 'completed',
    actionType: 'COMPLETED',
    description: 'Mastered reading real and imaginary amplitudes without notation barrier. Explored modulus squared and probability conservation.',
    details: {
      topicId: 'complex-numbers',
    },
  },
  {
    id: 'seed-hist-algorithm-grover',
    resourceType: 'algorithm',
    title: 'Grover’s Quantum Search Algorithm Study',
    href: '/algorithms/grover',
    firstVisitedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    lastVisitedAt: new Date(Date.now() - 3600 * 1000 * 44).toISOString(),
    visits: 5,
    status: 'in-progress',
    actionType: 'VIEWED',
    description: 'Analyzed quadratic speedup for unstructured search database problem. Examined Oracle phase inversion followed by Diffusion inversion-about-average.',
    details: {
      algorithmId: 'grover',
      gateNames: ['H', 'Oracle (CZ)', 'Diffusion (DIFF)'],
      pythonCode: generateQiskitPythonCode([
        { id: 1, name: 'H', qubit: 0 },
        { id: 2, name: 'H', qubit: 1 },
        { id: 3, name: 'CZ', qubit: 0 },
        { id: 4, name: 'DIFF', qubit: 0 },
      ], 3),
    },
  },
  {
    id: 'seed-hist-quiz-foundations',
    resourceType: 'practice',
    title: 'Practice Challenge: Quantum Fundamentals & Gates',
    href: '/quiz',
    firstVisitedAt: new Date(Date.now() - 3600 * 1000 * 52).toISOString(),
    lastVisitedAt: new Date(Date.now() - 3600 * 1000 * 52).toISOString(),
    visits: 2,
    status: 'completed',
    actionType: 'PRACTICE',
    description: 'Scored 100% (3/3) answering retrieval questions on Hadamard action, measurement collapse, and Grover amplification.',
    details: {
      score: 3,
      totalQuestions: 3,
      accuracy: 100,
    },
  },
  {
    id: 'seed-hist-tutor-session',
    resourceType: 'tutor',
    title: 'AI Tutor: Superposition vs Classical Mixed States',
    href: '/ai-tutor',
    firstVisitedAt: new Date(Date.now() - 3600 * 1000 * 70).toISOString(),
    lastVisitedAt: new Date(Date.now() - 3600 * 1000 * 70).toISOString(),
    visits: 1,
    status: 'completed',
    actionType: 'TUTOR_QUERY',
    description: 'Asked AI Tutor: "Why does H create superposition instead of a classical coin toss?" Tuned in Concept Explanation mode.',
    details: {
      tutorMode: 'explain-concept',
      tutorPrompt: 'Why does H create superposition instead of a classical coin toss?',
    },
  },
];

export function getHistoryStorageKey(scope: string = 'guest'): string {
  const cleanScope = scope.trim() || 'guest';
  return `ql-history:${cleanScope}`;
}

export function getStoredHistory(scope: string = 'guest', learnerCompleted: string[] = []): HistoryEntry[] {
  const primaryKey = getHistoryStorageKey(scope);
  const guestKey = 'ql-history:guest';

  let raw = typeof localStorage !== 'undefined' ? localStorage.getItem(primaryKey) : null;
  if (!raw && primaryKey !== guestKey && typeof localStorage !== 'undefined') {
    raw = localStorage.getItem(guestKey);
  }

  let entries: HistoryEntry[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        entries = parsed;
      }
    } catch {
      entries = [];
    }
  }

  // If no entries exist in storage, initialize with realistic seeded past activity
  if (entries.length === 0) {
    entries = [...DEFAULT_SEED_HISTORY];
    // Also include any topics marked done in learnerCompleted if not already present
    if (learnerCompleted && learnerCompleted.length > 0) {
      learnerCompleted.forEach((topicId) => {
        if (!entries.some((entry) => entry.details?.topicId === topicId)) {
          entries.push({
            id: `hist-lesson-${topicId}`,
            resourceType: 'lesson',
            title: `Lesson: ${topicId.replace(/-/g, ' ')}`,
            href: `/learn/${topicId}`,
            firstVisitedAt: new Date().toISOString(),
            lastVisitedAt: new Date().toISOString(),
            visits: 1,
            status: 'completed',
            actionType: 'COMPLETED',
            description: `Completed quantum fundamentals lesson on ${topicId.replace(/-/g, ' ')}.`,
            details: { topicId },
          });
        }
      });
    }
    saveHistoryEntries(scope, entries);
  }

  return entries;
}

export function saveHistoryEntries(scope: string, entries: HistoryEntry[]): void {
  if (typeof localStorage === 'undefined') return;
  const key = getHistoryStorageKey(scope);
  const data = JSON.stringify(entries);
  try {
    localStorage.setItem(key, data);
    // Also mirror to guest key for seamless fallback across tabs/auth states
    if (key !== 'ql-history:guest') {
      localStorage.setItem('ql-history:guest', data);
    }
  } catch (err) {
    console.error('Failed to save activity history:', err);
  }
}

export function addHistoryEntry(scope: string, input: NewActivityInput): HistoryEntry[] {
  const current = getStoredHistory(scope);
  const now = new Date().toISOString();

  // Check if an entry with the exact same resource id or matching viewed link already exists
  const existingIndex = current.findIndex(
    (item) => (input.id && item.id === input.id) || (input.actionType === 'VIEWED' && item.href === input.href)
  );

  let updated: HistoryEntry[];
  if (existingIndex >= 0 && input.actionType === 'VIEWED') {
    const existing = current[existingIndex];
    const merged: HistoryEntry = {
      ...existing,
      ...input,
      id: existing.id,
      firstVisitedAt: existing.firstVisitedAt || now,
      lastVisitedAt: now,
      visits: (existing.visits || 1) + 1,
      details: { ...existing.details, ...input.details },
    };
    updated = [merged, ...current.filter((_, idx) => idx !== existingIndex)];
  } else {
    const newEntry: HistoryEntry = {
      id: input.id || `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      resourceType: input.resourceType,
      title: input.title,
      href: input.href,
      firstVisitedAt: now,
      lastVisitedAt: now,
      visits: 1,
      status: input.status,
      actionType: input.actionType,
      description: input.description,
      details: input.details,
    };
    updated = [newEntry, ...current];
  }

  saveHistoryEntries(scope, updated);
  return updated;
}

export function recordActivity(input: NewActivityInput): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<NewActivityInput>('ql-activity-logged', { detail: input }));
  }
}

export function deleteHistoryEntry(scope: string, id: string): HistoryEntry[] {
  const current = getStoredHistory(scope);
  const filtered = current.filter((item) => item.id !== id);
  saveHistoryEntries(scope, filtered);
  return filtered;
}

export function clearHistoryEntries(scope: string): void {
  saveHistoryEntries(scope, []);
}

export function resetHistoryToSeed(scope: string): HistoryEntry[] {
  const seeded = [...DEFAULT_SEED_HISTORY];
  saveHistoryEntries(scope, seeded);
  return seeded;
}

export function exportHistoryAsJson(entries: HistoryEntry[]): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      platform: 'QuantumLearn AI - Quantum Computing Platform',
      version: '1.0.0',
      totalEntries: entries.length,
      activityLog: entries,
    },
    null,
    2
  );
}
