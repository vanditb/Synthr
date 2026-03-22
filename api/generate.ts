import Groq from 'groq-sdk';
import {
  buildGenerationContentPlanPrompt,
  buildGenerationPrompt as buildSharedGenerationPrompt,
  finalizeGeneratedHtml as finalizeSharedGeneratedHtml,
  GENERATION_CONTENT_PLAN_SYSTEM_PROMPT,
  GENERATION_SYSTEM_PROMPT,
  parseGenerationContentPlan,
  renderPremiumRestaurantHtml,
} from '../lib/generation';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!process.env.GROQ_API_KEY) {
    res.status(500).json({ error: 'Missing GROQ_API_KEY in environment' });
    return;
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

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
      res.status(200).json(finalizeSharedGeneratedHtml(body, rawHtml));
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
    res.status(200).json(finalizeSharedGeneratedHtml({ ...body, contentPlan }, renderedHtml));
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
}
