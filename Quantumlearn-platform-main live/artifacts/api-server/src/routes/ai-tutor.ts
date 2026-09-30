import { Router, type IRouter } from 'express';
import { tutorRequestSchema, tutorResponseSchema } from '@workspace/api-zod';

const router: IRouter = Router();

const providerUrl = process.env.AI_PROVIDER_URL;
const providerKey = process.env.AI_PROVIDER_API_KEY;
const providerModel = process.env.AI_PROVIDER_MODEL || 'gpt-4o-mini';

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
  if (!providerUrl || !providerKey) {
    res.status(503).json({ error: 'AI Tutor is not configured. Set AI_PROVIDER_URL and AI_PROVIDER_API_KEY on the API server.' });
    return;
  }

  try {
    const providerResponse = await fetch(providerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${providerKey}` },
      body: JSON.stringify({
        model: providerModel,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt() },
          { role: 'user', content: JSON.stringify(parsed.data) },
        ],
      }),
    });
    if (!providerResponse.ok) {
      const providerBody = await providerResponse.text();
      let providerMessage = `AI provider returned HTTP ${providerResponse.status}.`;
      try {
        const parsedProviderBody = JSON.parse(providerBody) as { error?: { message?: string } };
        if (parsedProviderBody.error?.message) providerMessage = parsedProviderBody.error.message;
      } catch {
        // Keep the status-only message when the provider does not return JSON.
      }
      res.status(502).json({ error: `AI provider request failed: ${providerMessage}` });
      return;
    }
    const payload = await providerResponse.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      res.status(502).json({ error: 'AI provider returned no tutor response.' });
      return;
    }
    const response = tutorResponseSchema.safeParse(JSON.parse(content));
    if (!response.success) {
      res.status(502).json({ error: 'AI provider returned an invalid tutor response.' });
      return;
    }
    res.json(response.data);
  } catch {
    res.status(502).json({ error: 'AI Tutor is temporarily unavailable. Retry the request.' });
  }
});

export default router;