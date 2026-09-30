declare const process: { env: Record<string, string | undefined> };

type RequestLike = {
  method?: string;
  body?: unknown;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
};

const tutorSchema = {
  answer: 'string',
  sources: 'array',
} as const;

function systemPrompt() {
  return 'You are QuantumLearn AI, a careful quantum-computing tutor. Explain concepts clearly for the learner level. Use only the simulator context supplied by the user and never invent state-vector or probability values. Return only JSON with answer (string), optional hint, nextStep, qiskitCode, quizQuestion, and sources (string array).';
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const body = req.body as { question?: unknown; mode?: unknown; context?: unknown } | undefined;
  if (!body || typeof body.question !== 'string' || typeof body.mode !== 'string') {
    res.status(400).json({ error: 'Invalid tutor request.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'AI Tutor is not configured.' });
    return;
  }

  try {
    const providerResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt() }] },
          contents: [{ role: 'user', parts: [{ text: JSON.stringify(body) }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                answer: { type: 'STRING' },
                hint: { type: 'STRING', nullable: true },
                nextStep: { type: 'STRING', nullable: true },
                qiskitCode: { type: 'STRING', nullable: true },
                quizQuestion: { type: 'STRING', nullable: true },
                sources: { type: 'ARRAY', items: { type: 'STRING' } },
              },
              required: [tutorSchema.answer, 'sources'],
            },
          },
        }),
      },
    );

    if (!providerResponse.ok) {
      res.status(502).json({ error: 'AI Tutor provider request failed.' });
      return;
    }

    const payload = await providerResponse.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const content = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (!content) {
      res.status(502).json({ error: 'AI Tutor provider returned no response.' });
      return;
    }

    const response = JSON.parse(content) as { answer?: unknown; sources?: unknown };
    if (typeof response.answer !== 'string' || !Array.isArray(response.sources)) {
      res.status(502).json({ error: 'AI Tutor provider returned an invalid response.' });
      return;
    }
    res.status(200).json(response);
  } catch {
    res.status(502).json({ error: 'AI Tutor is temporarily unavailable. Retry the request.' });
  }
}

export const config = { api: { bodyParser: true } };
