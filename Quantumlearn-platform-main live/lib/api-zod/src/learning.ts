import { z } from 'zod';

export const experimentSchema = z.object({
  circuit: z.array(z.record(z.string(), z.unknown())).max(200),
  algorithm: z.string().max(100).optional(),
  qubitCount: z.number().int().min(1).max(10),
  prediction: z.record(z.string(), z.number().min(0).max(1)).optional(),
  actualResult: z.object({ probabilities: z.array(z.number().min(0).max(1)), counts: z.record(z.string(), z.number().int().nonnegative()).optional() }),
  accuracy: z.number().min(0).max(1).optional(),
  shots: z.number().int().min(1).max(100000),
});

export const quizAttemptSchema = z.object({
  topic: z.string().min(1).max(100),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  answers: z.record(z.string(), z.number().int()),
});