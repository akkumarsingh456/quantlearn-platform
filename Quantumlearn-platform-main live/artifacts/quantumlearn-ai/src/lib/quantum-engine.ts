export type Complex = { re: number; im: number };

export type QuantumGateName = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CX' | 'CZ' | 'DIFF';

export type QuantumGate = {
  id?: number;
  name: QuantumGateName;
  qubit: number;
  control?: number;
  target?: number;
};

export type CircuitResult = {
  qubitCount: number;
  state: Complex[];
  probabilities: number[];
};

type Matrix = [[Complex, Complex], [Complex, Complex]];

const complex = (re: number, im = 0): Complex => ({ re, im });
const add = (left: Complex, right: Complex): Complex => complex(left.re + right.re, left.im + right.im);
const multiply = (left: Complex, right: Complex): Complex => complex(
  left.re * right.re - left.im * right.im,
  left.re * right.im + left.im * right.re,
);
const magnitudeSquared = (value: Complex) => value.re * value.re + value.im * value.im;

const matrices: Partial<Record<QuantumGateName, Matrix>> = {
  H: [[complex(Math.SQRT1_2), complex(Math.SQRT1_2)], [complex(Math.SQRT1_2), complex(-Math.SQRT1_2)]],
  X: [[complex(0), complex(1)], [complex(1), complex(0)]],
  Y: [[complex(0), complex(0, -1)], [complex(0, 1), complex(0)]],
  Z: [[complex(1), complex(0)], [complex(0), complex(-1)]],
  S: [[complex(1), complex(0)], [complex(0), complex(0, 1)]],
  T: [[complex(1), complex(0)], [complex(0), complex(Math.SQRT1_2, Math.SQRT1_2)]],
};

function applySingleQubitGate(state: Complex[], gate: QuantumGate, matrix: Matrix) {
  const next = state.map((value) => ({ ...value }));
  const bit = 1 << gate.qubit;
  for (let index = 0; index < state.length; index += 1) {
    if ((index & bit) !== 0) continue;
    const paired = index | bit;
    next[index] = add(multiply(matrix[0][0], state[index]), multiply(matrix[0][1], state[paired]));
    next[paired] = add(multiply(matrix[1][0], state[index]), multiply(matrix[1][1], state[paired]));
  }
  return next;
}

function applyControlledGate(state: Complex[], gate: QuantumGate, targetName: 'X' | 'Z') {
  const control = gate.control ?? gate.qubit;
  const target = gate.target ?? (gate.qubit + 1);
  if (control === target) throw new Error('A controlled gate needs different control and target qubits.');
  if (!Number.isInteger(control) || !Number.isInteger(target) || control < 0 || target < 0 || control >= Math.log2(state.length) || target >= Math.log2(state.length)) {
    throw new Error(`Gate ${gate.name} uses an invalid control or target qubit.`);
  }
  const controlBit = 1 << control;
  const targetBit = 1 << target;
  const next = state.map((value) => ({ ...value }));
  for (let index = 0; index < state.length; index += 1) {
    if ((index & controlBit) === 0 || (index & targetBit) !== 0) continue;
    const paired = index | targetBit;
    if (targetName === 'X') {
      next[index] = state[paired];
      next[paired] = state[index];
    } else {
      next[paired] = complex(-state[paired].re, -state[paired].im);
    }
  }
  return next;
}

export function simulateCircuit(gates: QuantumGate[], qubitCount = 3): CircuitResult {
  if (!Number.isInteger(qubitCount) || qubitCount < 1 || qubitCount > 10) {
    throw new Error('qubitCount must be an integer between 1 and 10.');
  }
  const state = Array.from({ length: 2 ** qubitCount }, () => complex(0));
  state[0] = complex(1);
  let current = state;
  for (const gate of gates) {
    if (!Number.isInteger(gate.qubit) || gate.qubit < 0 || gate.qubit >= qubitCount) {
      throw new Error(`Gate ${gate.name} targets an invalid qubit.`);
    }
    if (gate.name === 'CX') {
      current = applyControlledGate(current, gate, 'X');
    } else if (gate.name === 'CZ') {
      current = applyControlledGate(current, gate, 'Z');
    } else if (gate.name === 'DIFF') {
      const mean = current.reduce((total, amplitude) => add(total, amplitude), complex(0));
      const average = complex(mean.re / current.length, mean.im / current.length);
      current = current.map((amplitude) => complex(2 * average.re - amplitude.re, 2 * average.im - amplitude.im));
    } else {
      const matrix = matrices[gate.name];
      if (!matrix) throw new Error(`Unsupported gate: ${gate.name}`);
      current = applySingleQubitGate(current, gate, matrix);
    }
  }
  const rawProbabilities = current.map(magnitudeSquared);
  const total = rawProbabilities.reduce((sum, probability) => sum + probability, 0);
  const probabilities = total === 0 ? rawProbabilities : rawProbabilities.map((probability) => probability / total);
  return { qubitCount, state: current, probabilities };
}

export function measurementCounts(probabilities: number[], shots: number): number[] {
  if (!Number.isInteger(shots) || shots < 1) throw new Error('shots must be a positive integer.');
  if (!probabilities.length || probabilities.some((probability) => !Number.isFinite(probability) || probability < 0)) {
    throw new Error('probabilities must be a non-empty list of non-negative numbers.');
  }
  const total = probabilities.reduce((sum, probability) => sum + probability, 0);
  if (Math.abs(total - 1) > 1e-9) throw new Error('probabilities must sum to 1.');
  const counts = probabilities.map(() => 0);
  for (let shot = 0; shot < shots; shot += 1) {
    const sample = Math.random();
    let cumulative = 0;
    for (let index = 0; index < probabilities.length; index += 1) {
      cumulative += probabilities[index];
      if (sample < cumulative || index === probabilities.length - 1) {
        counts[index] += 1;
        break;
      }
    }
  }
  return counts;
}
