import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import {
  GeminiServiceError,
  askFollowUpQuestion,
  findSchemesForProfile,
} from './server/geminiService.ts';
import { SchemeSchema, UserProfileSchema } from './src/types/yojana.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FindRequestSchema = z.object({
  profile: UserProfileSchema,
  language: z.enum(['en', 'ta', 'hi']).default('en'),
});

const FollowUpRequestSchema = z.object({
  question: z.string().min(1).max(1000),
  profile: UserProfileSchema.nullable().optional().default(null),
  schemes: z.array(SchemeSchema).optional().default([]),
  history: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(['user', 'assistant']),
        text: z.string(),
        timestamp: z.number(),
      })
    )
    .optional()
    .default([]),
  language: z.enum(['en', 'ta', 'hi']).default('en'),
  isDocumentGuide: z.boolean().optional().default(false),
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/schemes/find', async (req, res) => {
    try {
      const parsed = FindRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Invalid profile data submitted.',
          code: 'VALIDATION_ERROR',
          details: parsed.error.flatten(),
        });
        return;
      }

      const result = await findSchemesForProfile(parsed.data.profile, parsed.data.language);
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof GeminiServiceError) {
        console.error('[YojanaFinder /api/schemes/find]', error.code, error.message);
        res.status(error.status).json({ error: error.message, code: error.code });
        return;
      }
      const message = error instanceof Error ? error.message : 'Unexpected server error.';
      console.error('[YojanaFinder /api/schemes/find]', message);
      res.status(502).json({ error: message, code: 'UPSTREAM_ERROR' });
    }
  });

  app.post('/api/schemes/followup', async (req, res) => {
    try {
      const parsed = FollowUpRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Invalid follow-up question request.',
          code: 'VALIDATION_ERROR',
          details: parsed.error.flatten(),
        });
        return;
      }

      const result = await askFollowUpQuestion(parsed.data);
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof GeminiServiceError) {
        console.error('[YojanaFinder /api/schemes/followup]', error.code, error.message);
        res.status(error.status).json({ error: error.message, code: error.code });
        return;
      }
      const message = error instanceof Error ? error.message : 'Unexpected server error.';
      console.error('[YojanaFinder /api/schemes/followup]', message);
      res.status(502).json({ error: message, code: 'UPSTREAM_ERROR' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`YojanaFinder server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start YojanaFinder server:', err);
  process.exit(1);
});
