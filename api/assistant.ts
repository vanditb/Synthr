import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { getPreferredGroqApiKey, getPreferredGroqModel } from '../lib/backupModel';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

const groq = new Groq({
  apiKey: getPreferredGroqApiKey(),
});
const groqModel = getPreferredGroqModel() || 'llama-3.3-70b-versatile';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, details, imageData } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid payload', details: 'messages must be an array' });
    }

    const sanitizedMessages: ChatCompletionMessageParam[] = messages
      .filter((msg: any) => msg && typeof msg.content === 'string')
      .slice(-12)
      .map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content.trim(),
      }))
      .filter((msg: any) => msg.content.length > 0) as ChatCompletionMessageParam[];

    const context = details
      ? `Business context:\nName: ${details.name || 'Unknown'}\nType: ${details.type || 'Unknown'}\nCuisine: ${details.cuisineType || 'Not specified'}\nStyle: ${details.style || 'Not specified'}\nTone: ${details.tone || 'Not specified'}\nCity: ${details.location?.city || 'Not specified'}\nBrand summary: ${details.brand?.summary || 'Not specified'}\nPrimary CTA: ${details.primaryCta || 'Not specified'}`
      : 'Business context: Not provided.';

    const systemPrompt = `You are an AI website editor inside a live preview environment.\nFor every user request, execute the change immediately and then respond with a short confirmation.\nDo not ask follow-up questions unless absolutely necessary.\nDo not provide suggestions or options unless the user explicitly asks.\nKeep replies under 1-2 sentences, direct, and action-based.\nIf an image is attached and the user references it, assume it should be applied to the requested section with a dark overlay and full-width cover.\nDo not claim to have performed actions you did not do.`;

    const imageNote = imageData ? 'An image was attached to the latest message.' : '';

    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'system', content: context },
        ...(imageNote ? [{ role: 'system', content: imageNote }] : []),
        ...sanitizedMessages,
      ] as ChatCompletionMessageParam[],
      model: groqModel,
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply = response.choices[0]?.message?.content?.trim() || '';
    res.status(200).json({ reply });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Failed to generate assistant reply', details: errorMessage });
  }
}
