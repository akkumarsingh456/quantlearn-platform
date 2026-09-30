import { z } from 'zod';

export const tutorModes = [
  'explain-concept',
  'explain-circuit',
  'explain-mathematically',
  'explain-visually',
  'give-hint',
  'debug-circuit',
  'explain-measurement',
  'generate-qiskit',
  'quiz-me',
  'why-did-this-happen',
] as const;

export const tutorContextSchema = z.object({
  learnerLevel: z.string().max(40).default('unknown'),
  currentLesson: z.string().max(200).optional(),
  currentTopic: z.string().max(200).optional(),
  currentAlgorithm: z.string().max(200).optional(),
  circuit: z.array(z.record(z.string(), z.unknown())).max(200).default([]),
  qubitCount: z.number().int().min(1).max(10).default(1),
  gates: z.array(z.string().max(20)).max(200).default([]),
  stateVector: z.array(z.object({ re: z.number(), im: z.number() })).max(1024).default([]),
  probabilities: z.array(z.number().min(0).max(1)).max(1024).default([]),
  measurementResults: z.record(z.string(), z.number().int().nonnegative()).optional(),
  prediction: z.string().max(500).optional(),
  learningProgress: z.record(z.string(), z.number().min(0).max(1)).optional(),
});

export const tutorRequestSchema = z.object({
  question: z.string().trim().min(1).max(4000),
  mode: z.enum(tutorModes),
  context: tutorContextSchema,
});

export const tutorResponseSchema = z.object({
  answer: z.string().min(1).max(12000),
  hint: z.string().max(4000).optional(),
  nextStep: z.string().max(2000).optional(),
  qiskitCode: z.string().max(12000).optional(),
  quizQuestion: z.string().max(4000).optional(),
  sources: z.array(z.string().max(200)).max(10).default([]),
});

export type TutorRequest = z.infer<typeof tutorRequestSchema>;
export type TutorResponse = z.infer<typeof tutorResponseSchema>;
