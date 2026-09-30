import { Router, type IRouter, type Request } from 'express';
import { tutorRequestSchema, tutorResponseSchema } from '@workspace/api-zod';

const router: IRouter = Router();
type ClerkRequest = Request & { auth?: () => { userId?: string | null } };

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
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: 'AI Tutor is not configured.' });
      return;
    }

    const providerResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt() },
          { role: 'user', content: JSON.stringify(parsed.data) },
        ],
      }),
    });
    if (!providerResponse.ok) {
      res.status(502).json({ error: 'AI Tutor provider request failed.' });
      return;
    }
    const payload = await providerResponse.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      res.status(502).json({ error: 'AI Tutor provider returned no response.' });
      return;
    }
    const response = tutorResponseSchema.safeParse(JSON.parse(content));
    if (!response.success) {
      res.status(502).json({ error: 'AI Tutor provider returned an invalid response.' });
      return;
    }
    res.json(response.data);
  } catch {
    res.status(502).json({ error: 'AI Tutor is temporarily unavailable. Retry the request.' });
  }
});

export default router;
