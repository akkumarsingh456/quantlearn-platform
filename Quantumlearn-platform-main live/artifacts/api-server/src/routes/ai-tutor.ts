import { Router, type IRouter, type Request } from 'express';
import { generateObject, gateway } from 'ai';
import { tutorRequestSchema, tutorResponseSchema } from '@workspace/api-zod';

const router: IRouter = Router();
type ClerkRequest = Request & { auth?: () => { userId?: string | null } };

const tutorModel = gateway('openai/gpt-5-mini');

function systemPrompt() {
  return [
    'You are QuantumLearn AI, a careful quantum-computing tutor.',
    'The simulator is the source of truth. Never invent, alter, or infer state-vector, probability, or measurement values not present in the context.',
    'Use the learner level and requested mode. Prefer hints before solutions for give-hint, debug-circuit, and quiz-me.',
    'Return only valid JSON matching: { answer: string, hint?: string, nextStep?: string, qiskitCode?: string, quizQuestion?: string, sources: string[] }.',
    'State clearly when the provided context is insufficient. Do not claim real hardware execution.',
  ].join(' ');
}

router.post('/tutor', async (req, res) => {
  const parsed = tutorRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid tutor request.', issues: parsed.error.flatten() });
    return;
  }
  const userId = (req as ClerkRequest).auth?.().userId || null;
  if (!userId) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  try {
    const result = await generateObject({
      model: tutorModel,
      schema: tutorResponseSchema,
      system: systemPrompt(),
      prompt: JSON.stringify(parsed.data),
      temperature: 0.2,
    });
    res.json(result.object);
  } catch {
    res.status(502).json({ error: 'AI Tutor is temporarily unavailable. Retry the request.' });
  }
});

export default router;
