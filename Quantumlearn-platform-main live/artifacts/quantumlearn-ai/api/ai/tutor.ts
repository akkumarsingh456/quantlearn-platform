declare const process: { env: Record<string, string | undefined> };

type RequestLike = { method?: string; body?: unknown };
type ResponseLike = { status: (code: number) => ResponseLike; json: (body: unknown) => void };

function tutorSystemPrompt() {
  return 'You are QuantumLearn AI, a careful quantum-computing tutor. Explain concepts clearly for the learner level. Use the supplied simulator context and never invent state-vector or probability values. Return only JSON with answer, optional hint, nextStep, qiskitCode, quizQuestion, and sources as a string array.';
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const body = req.body as { question?: unknown; mode?: unknown; context?: unknown } | undefined;
  if (!body || typeof body.question !== 'string' || typeof body.mode !== 'string') {
    return res.status(400).json({ error: 'Invalid tutor request.' });
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'AI Tutor is not configured.' });
  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: tutorSystemPrompt() }] },
        contents: [{ role: 'user', parts: [{ text: JSON.stringify(body) }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    });
    const payload = await upstream.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
    if (!upstream.ok) return res.status(502).json({ error: payload.error?.message || 'Gemini request failed.' });
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (!text) return res.status(502).json({ error: 'Gemini returned no tutor answer.' });
    const answer = JSON.parse(text) as { answer?: unknown; sources?: unknown };
    if (typeof answer.answer !== 'string') return res.status(502).json({ error: 'Gemini returned an invalid tutor answer.' });
    return res.status(200).json({ ...answer, sources: Array.isArray(answer.sources) ? answer.sources : [] });
  } catch {
    return res.status(502).json({ error: 'AI Tutor is temporarily unavailable. Retry the request.' });
  }
}

export const config = { api: { bodyParser: true } };
