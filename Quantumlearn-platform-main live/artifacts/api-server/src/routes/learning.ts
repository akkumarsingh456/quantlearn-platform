import { Router, type IRouter, type Request } from 'express';
import { experimentSchema, quizAttemptSchema } from '@workspace/api-zod';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();

type ClerkRequest = Request & { auth?: () => { userId?: string | null } };

function userIdFromRequest(req: ClerkRequest) {
  return req.auth?.().userId || null;
}

async function database() {
  if (!process.env.DATABASE_URL) return null;
  const module = await import('@workspace/db');
  return module;
}

router.get('/learning', async (req, res) => {
  const userId = userIdFromRequest(req as ClerkRequest);
  if (!userId) { res.status(401).json({ error: 'Authentication required.' }); return; }
  const loaded = await database();
  if (!loaded) { res.status(503).json({ error: 'Learning persistence is not configured.' }); return; }
  const experiments = await loaded.db.select().from(loaded.experiments).where(eq(loaded.experiments.userId, userId));
  const mastery = await loaded.db.select().from(loaded.topicMastery).where(eq(loaded.topicMastery.userId, userId));
  res.json({ experiments, mastery });
});

router.post('/experiments', async (req, res) => {
  const userId = userIdFromRequest(req as ClerkRequest);
  if (!userId) { res.status(401).json({ error: 'Authentication required.' }); return; }
  const parsed = experimentSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid experiment.', issues: parsed.error.flatten() }); return; }
  const loaded = await database();
  if (!loaded) { res.status(503).json({ error: 'Learning persistence is not configured.' }); return; }
  const [experiment] = await loaded.db.insert(loaded.experiments).values({ ...parsed.data, userId }).returning();
  res.status(201).json(experiment);
});

router.post('/quiz-attempts', async (req, res) => {
  const userId = userIdFromRequest(req as ClerkRequest);
  if (!userId) { res.status(401).json({ error: 'Authentication required.' }); return; }
  const parsed = quizAttemptSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid quiz attempt.', issues: parsed.error.flatten() }); return; }
  const loaded = await database();
  if (!loaded) { res.status(503).json({ error: 'Learning persistence is not configured.' }); return; }
  const [attempt] = await loaded.db.insert(loaded.quizAttempts).values({ ...parsed.data, userId }).returning();
  res.status(201).json(attempt);
});

export default router;
