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
  const combinedPrompt = `${systemPrompt}

Follow the rules above exactly.

${userPrompt}

Return only the final raw HTML document.`;

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
