type BackupGenerationInput = {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
};

type GeminiPart = {
  text?: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
  error?: {
    message?: string;
  };
};

export const canUseGeminiBackup = () => Boolean(process.env.GEMINI_API_KEY);

const buildGeminiPremiumPrompt = (systemPrompt: string, userPrompt: string) => `You are a world-class senior frontend engineer and premium UI/UX designer specializing in restaurant websites.

Your job is to create a website that feels bespoke, polished, visually intentional, and closer to a hand-designed restaurant site than a generic Tailwind landing page.

Creative direction:
- Build a premium, editorial, image-led restaurant website with strong hierarchy and visual contrast.
- Make the hero feel striking and high-end, with refined typography, stronger composition, and clearer calls to action.
- Use cleaner spacing, more intentional composition, and fewer repetitive card grids.
- Favor layered sections, split layouts, large image moments, and tasteful detail over generic stacked blocks.
- Make the navigation, menu presentation, and footer feel custom and brand-specific.
- The site should feel modern and expensive, not childish, sparse, or template-like.
- Use Tailwind CSS CDN, premium Google Fonts, and tasteful iconography where helpful.
- Use the image assets, branding cues, and structure already provided in the source prompt.

Hard constraints:
- Follow every business fact and technical rule from the source prompt exactly.
- Do not invent business facts, addresses, phone numbers, hours, reservation platforms, or menu items.
- Do not invent extra sections that contradict the business data.
- Keep internal navigation limited to valid in-page anchors only.
- Keep the site mobile responsive, semantic, and readable with safe contrast.
- Return only one complete raw HTML document with no markdown.

Source rules:
${systemPrompt}

Project brief:
${userPrompt}

Final reminder:
- Make it feel premium and custom.
- Keep it fact-safe.
- Return only the final raw HTML document.`;

export const generateWithGeminiBackup = async ({
  systemPrompt,
  userPrompt,
  temperature,
  maxTokens,
}: BackupGenerationInput): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
  const combinedPrompt = buildGeminiPremiumPrompt(systemPrompt, userPrompt);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: combinedPrompt }],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          responseMimeType: 'text/plain',
        },
      }),
    }
  );

  const data = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(data?.error?.message || `Gemini backup failed with status ${response.status}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() || '';
  if (!text) {
    throw new Error('Gemini backup returned no content');
  }

  return text;
};
