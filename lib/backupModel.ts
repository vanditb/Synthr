import Groq from 'groq-sdk';

type BackupGenerationInput = {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
};

export const useBackupGroqOnly = () => process.env.GROQ_DISABLE_PRIMARY === 'true';
export const disableHtmlFallback = () => process.env.GROQ_DISABLE_HTML_FALLBACK === 'true' || useBackupGroqOnly();
export const canUseBackupGroq = () => Boolean(process.env.GROQ_API_KEY_BACKUP);
export const getPreferredGroqApiKey = () =>
  useBackupGroqOnly() && process.env.GROQ_API_KEY_BACKUP ? process.env.GROQ_API_KEY_BACKUP : process.env.GROQ_API_KEY;
export const getPreferredGroqModel = () =>
  useBackupGroqOnly() && process.env.GROQ_MODEL_BACKUP ? process.env.GROQ_MODEL_BACKUP : process.env.GROQ_MODEL;

export const generateWithBackupGroq = async ({
  systemPrompt,
  userPrompt,
  temperature,
  maxTokens,
}: BackupGenerationInput): Promise<string> => {
  const apiKey = process.env.GROQ_API_KEY_BACKUP;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY_BACKUP is not configured');
  }

  const groq = new Groq({ apiKey });
  const model = process.env.GROQ_MODEL_BACKUP || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    model,
    temperature,
    max_tokens: maxTokens,
  });

  const text = response.choices[0]?.message?.content?.trim() || '';
  if (!text) {
    throw new Error('Backup Groq returned no content');
  }

  return text;
};
