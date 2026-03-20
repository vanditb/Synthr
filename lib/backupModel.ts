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

const countMatches = (value: string, pattern: RegExp) => (value.match(pattern) || []).length;

const hasLowDesignSignal = (html: string): boolean => {
  const normalized = html.trim();
  const classCount = countMatches(normalized, /\bclass=/gi);
  const sectionCount = countMatches(normalized, /<section\b/gi);
  const imageCount = countMatches(normalized, /<img\b/gi);
  const buttonLikeCount = countMatches(normalized, /(Order Now|Reserve Now|Book Now|View Menu|Plan your visit)/gi);
  const utilitySignalCount = countMatches(
    normalized,
    /\b(max-w-|grid|flex|px-\d|py-\d|rounded-|shadow|bg-|text-|md:|lg:|xl:)/g
  );
  const duplicateNavLabels = countMatches(
    normalized,
    /\b(Home|About|Menu|Reserve|Hours|Order|Contact)\b/g
  );

  return (
    classCount < 18 ||
    sectionCount < 4 ||
    utilitySignalCount < 28 ||
    buttonLikeCount < 2 ||
    (imageCount === 0 && duplicateNavLabels > 10)
  );
};

const buildGeminiPremiumPrompt = (systemPrompt: string, userPrompt: string) => `Act as a world-class senior frontend engineer and premium restaurant website designer.

Create one complete restaurant website in raw HTML that feels custom, polished, visual, and high-end.

Design goals:
- Make it look like a real premium restaurant website, not a plain HTML document.
- Use a strong hero, clear typography hierarchy, large image moments, and cleaner spacing.
- Prefer elegant split layouts, layered sections, and stronger composition over repetitive card grids.
- Make the navigation, menu section, CTA areas, and footer feel intentional and designed.
- Use Tailwind CSS CDN, premium Google Fonts, and tasteful iconography where helpful.
- Use the provided image assets intentionally.
- Keep the site mobile responsive and visually strong on desktop.

Hard rules:
- Follow all business facts and technical rules from the source instructions exactly.
- Do not invent menu items or business facts.
- Use only valid in-page anchor navigation.
- Keep contrast readable.
- Return only one complete raw HTML document with no markdown.

Source instructions:
${systemPrompt}

Website brief:
${userPrompt}

Return only the final raw HTML document.`;

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

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
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

  if (hasLowDesignSignal(text)) {
    throw new Error('Gemini backup returned low-design HTML');
  }

  return text;
};
