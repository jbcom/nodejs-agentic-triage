import { LanguageModel, streamText } from 'ai';
import { issueAnalysisSchema } from '../schemas';

export async function analyzeIssue(issueBody: string, model: LanguageModel) {
  const result = await streamText({
    model,
    prompt: `Analyze the following issue and provide a summary, impact, and suggestions:\n\n${issueBody}`,
    tools: {
      analyze: {
        description: 'Analyze the issue.',
        schema: issueAnalysisSchema,
      },
    },
  });

  return result;
}
