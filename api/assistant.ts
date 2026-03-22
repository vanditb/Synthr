import Groq from 'groq-sdk';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY in environment' });
  }

  try {
    const { messages, details, imageData } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid payload', details: 'messages must be an array' });
    }

    const sanitizedMessages = sanitizeAssistantMessages(messages);
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

    return res.status(200).json({ reply: response.choices[0]?.message?.content?.trim() || '' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: 'Failed to generate assistant reply', details: errorMessage });
  }
}
