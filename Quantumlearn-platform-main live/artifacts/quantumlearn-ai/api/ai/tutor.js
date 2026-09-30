function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    if (!question) return sendJson(response, 400, { error: 'A tutor question is required.' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return sendJson(response, 503, { error: 'AI Tutor is not configured.' });

    const providerResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'You are QuantumLearn Tutor. Answer quantum-computing questions accurately and clearly for the learner. Explain concepts step by step, connect answers to the supplied circuit context, and return only valid JSON with keys answer, hint, nextStep, qiskitCode, quizQuestion, sources.' }] },
        contents: [{ role: 'user', parts: [{ text: JSON.stringify({ question, mode: body?.mode, context: body?.context }) }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    });

    if (!providerResponse.ok) return sendJson(response, 502, { error: 'AI Tutor provider request failed.' });
    const payload = await providerResponse.json();
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (!text) return sendJson(response, 502, { error: 'AI Tutor provider returned no response.' });

    const result = JSON.parse(text);
    if (typeof result.answer !== 'string' || !result.answer.trim()) return sendJson(response, 502, { error: 'AI Tutor provider returned an invalid response.' });
    return sendJson(response, 200, { answer: result.answer, hint: result.hint, nextStep: result.nextStep, qiskitCode: result.qiskitCode, quizQuestion: result.quizQuestion, sources: Array.isArray(result.sources) ? result.sources : [] });
  } catch {
    return sendJson(response, 500, { error: 'AI Tutor could not process the request.' });
  }
}
