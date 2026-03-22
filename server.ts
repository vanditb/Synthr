import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import Groq from 'groq-sdk';
import {
  buildGenerationContentPlanPrompt,
  buildGenerationPrompt as buildSharedGenerationPrompt,
  finalizeGeneratedHtml as finalizeSharedGeneratedHtml,
  GENERATION_CONTENT_PLAN_SYSTEM_PROMPT,
  GENERATION_SYSTEM_PROMPT,
  parseGenerationContentPlan,
  renderPremiumRestaurantHtml,
} from './lib/generation';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

type AssistantMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const assistantSystemPrompt = `You are an AI website editor inside a live preview environment.
For every user request, execute the change immediately and then respond with a short confirmation.
Do not ask follow-up questions unless absolutely necessary.
Do not provide suggestions or options unless the user explicitly asks.
Keep replies under 1-2 sentences, direct, and action-based.
If an image is attached and the user references it, assume it should be applied to the requested section with a dark overlay and full-width cover.
Do not claim to have performed actions you did not do.`;

const sanitizeAssistantMessages = (messages: unknown): AssistantMessage[] => {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message): message is { role?: unknown; content?: unknown } => Boolean(message) && typeof message === 'object')
    .slice(-12)
    .map((message) => ({
      role: message.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: typeof message.content === 'string' ? message.content.trim() : '',
    }))
    .filter((message) => message.content.length > 0);
};

const buildAssistantContext = (details: any) =>
  details
    ? `Business context:
Name: ${details.name || 'Unknown'}
Type: ${details.type || 'Unknown'}
Cuisine: ${details.cuisineType || 'Not specified'}
Style: ${details.style || 'Not specified'}
Tone: ${details.tone || 'Not specified'}
City: ${details.location?.city || 'Not specified'}
Brand summary: ${details.brand?.summary || 'Not specified'}
Primary CTA: ${details.primaryCta || 'Not specified'}`
    : 'Business context: Not provided.';

app.get('/', (_req, res) => {
  res.send('Server is alive');
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.post('/api/generate', async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    res.status(500).json({ error: 'Missing GROQ_API_KEY in environment' });
    return;
  }

  try {
    const body = req.body || {};
    const hasEditContext = Boolean(body.customInstruction && body.existingHtml);

    if (hasEditContext) {
      const prompt = buildSharedGenerationPrompt(body);
      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: GENERATION_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        model: groqModel,
        temperature: 0.3,
        max_tokens: 4096,
      });

      const rawHtml = response.choices[0]?.message?.content || '<html><body>Error generating preview.</body></html>';
      res.json(finalizeSharedGeneratedHtml(body, rawHtml));
      return;
    }

    const planPrompt = buildGenerationContentPlanPrompt(body);
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: GENERATION_CONTENT_PLAN_SYSTEM_PROMPT },
        { role: 'user', content: planPrompt },
      ],
      model: groqModel,
      temperature: 0.75,
      max_tokens: 1400,
    });

    const rawPlan = response.choices[0]?.message?.content || '{}';
    const contentPlan = parseGenerationContentPlan(rawPlan);
    const renderedHtml = renderPremiumRestaurantHtml({ ...body, contentPlan });
    res.json(finalizeSharedGeneratedHtml({ ...body, contentPlan }, renderedHtml));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    try {
      const fallback = finalizeSharedGeneratedHtml(req.body || {}, '');
      res.status(200).json({
        ...fallback,
        meta: {
          ...fallback.meta,
          source: 'fallback',
          validationIssues: [...fallback.meta.validationIssues, `upstream-error:${errorMessage}`],
        },
      });
    } catch (_fallbackError) {
      res.status(500).json({ error: 'Failed to generate website', details: errorMessage });
    }
  }
});

app.post('/api/assistant', async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    res.status(500).json({ error: 'Missing GROQ_API_KEY in environment' });
    return;
  }

  try {
    const { messages, details, imageData } = req.body || {};
    const sanitizedMessages = sanitizeAssistantMessages(messages);

    if (!Array.isArray(messages)) {
      res.status(400).json({ error: 'Invalid payload', details: 'messages must be an array' });
      return;
    }

    const groqMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: assistantSystemPrompt },
      { role: 'system', content: buildAssistantContext(details) },
      ...(imageData ? [{ role: 'system' as const, content: 'An image was attached to the latest message.' }] : []),
      ...sanitizedMessages,
    ];

    const response = await groq.chat.completions.create({
      messages: groqMessages,
      model: groqModel,
      temperature: 0.7,
      max_tokens: 512,
    });

    res.json({ reply: response.choices[0]?.message?.content?.trim() || '' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Failed to generate assistant reply', details: errorMessage });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
