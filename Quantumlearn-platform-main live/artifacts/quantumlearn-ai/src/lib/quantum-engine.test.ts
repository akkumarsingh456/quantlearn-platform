import { measurementCounts, simulateCircuit } from './quantum-engine.js';

const closeTo = (actual: number, expected: number, tolerance = 1e-9) => {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${actual} was not within ${tolerance} of ${expected}`);
  }
};

const totalProbability = (probabilities: number[]) => probabilities.reduce((sum, value) => sum + value, 0);

const zeroState = simulateCircuit([], 1);
closeTo(zeroState.probabilities[0], 1);
closeTo(zeroState.probabilities[1], 0);

const oneState = simulateCircuit([{ name: 'X', qubit: 0 }], 1);
closeTo(oneState.probabilities[0], 0);
closeTo(oneState.probabilities[1], 1);

const hadamardState = simulateCircuit([{ name: 'H', qubit: 0 }], 1);
closeTo(hadamardState.probabilities[0], 0.5);
closeTo(hadamardState.probabilities[1], 0.5);

const phaseState = simulateCircuit([
  { name: 'H', qubit: 0 },
  { name: 'S', qubit: 0 },
  { name: 'T', qubit: 0 },
], 1);
closeTo(phaseState.probabilities[0], 0.5);
closeTo(phaseState.probabilities[1], 0.5);

const yState = simulateCircuit([{ name: 'Y', qubit: 0 }], 1);
closeTo(yState.probabilities[0], 0);
closeTo(yState.probabilities[1], 1);

const zState = simulateCircuit([{ name: 'Z', qubit: 0 }], 1);
closeTo(zState.state[0].re, 1);
closeTo(zState.state[1].re, 0);

const bellState = simulateCircuit([
  { name: 'H', qubit: 0 },
  { name: 'CX', control: 0, target: 1, qubit: 0 },
], 2);
closeTo(bellState.probabilities[0], 0.5);
closeTo(bellState.probabilities[3], 0.5);
closeTo(bellState.probabilities[1], 0);
closeTo(bellState.probabilities[2], 0);

const czState = simulateCircuit([
  { name: 'H', qubit: 0 },
  { name: 'H', qubit: 1 },
  { name: 'CZ', control: 0, target: 1, qubit: 0 },
], 2);
closeTo(czState.probabilities[0], 0.25);
closeTo(czState.probabilities[1], 0.25);
closeTo(czState.probabilities[2], 0.25);
closeTo(czState.probabilities[3], 0.25);

const measured = measurementCounts([0, 1], 25);
if (measured[0] !== 0 || measured[1] !== 25) throw new Error('Deterministic measurement counts were incorrect.');

closeTo(totalProbability(zeroState.probabilities), 1);
closeTo(totalProbability(hadamardState.probabilities), 1);
closeTo(totalProbability(phaseState.probabilities), 1);
closeTo(totalProbability(bellState.probabilities), 1);
closeTo(totalProbability(czState.probabilities), 1);

console.log('quantum-engine tests passed');