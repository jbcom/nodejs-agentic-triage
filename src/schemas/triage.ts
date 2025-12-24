import { z } from 'zod';
import { issueAnalysisSchema } from './issue';
import { codeReviewSchema } from './review';

export const triageAnalysisSchema = z.object({
  issueAnalysis: issueAnalysisSchema.optional().describe('Analysis of the issue.'),
  codeReview: codeReviewSchema.optional().describe('Code review of the pull request.'),
  triage: z.string().describe('The overall triage assessment.'),
});
