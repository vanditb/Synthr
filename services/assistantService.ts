import { BusinessDetails } from '../types';

type AssistantMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type AssistantRequest = {
  messages: AssistantMessage[];
  details?: BusinessDetails | null;
  imageData?: string | null;
};

export const requestAssistantResponse = async ({
  messages,
  details,
  imageData,
}: AssistantRequest): Promise<string> => {
  const response = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      details,
      imageData,
    }),
  });

  const rawText = await response.text();
  let data: any = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch (_err) {
    const hint = rawText?.slice(0, 140) || '';
    throw new Error(`Assistant returned non-JSON (status ${response.status}). ${hint}`);
  }

  if (!response.ok) {
    const statusInfo = `${response.status} ${response.statusText || ''}`.trim();
    const details = data?.details || (rawText ? rawText.slice(0, 200) : '');
    throw new Error(`Assistant error (${statusInfo}): ${data?.error || 'Unknown error'}${details ? ` - ${details}` : ''}`);
  }

  return data?.reply || '';
};
