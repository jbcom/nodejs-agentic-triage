import { tool } from 'ai';
import { z } from 'zod';
import { getTriageConnectors } from '../providers/index.js';
import { issueSchema } from '../schemas/issue.js';

export const createIssueTool = tool({
    description: 'Create a new issue.',
    parameters: issueSchema,
    execute: async (issue: any) => {
        const connectors = getTriageConnectors();
        const result = await connectors.createIssue({
            title: issue.title,
            body: issue.body,
            type: issue.type,
            priority: issue.priority,
            labels: issue.labels,
        });
        return result;
    },
} as any);

export const getIssueTool = tool({
    description: 'Get an issue by its ID.',
    parameters: z.object({
        id: z.union([z.number(), z.string()]).describe('The ID of the issue to retrieve.'),
    }),
    execute: async ({ id }: any) => {
        const connectors = getTriageConnectors();
        const issue = await connectors.getIssue(String(id));
        return issue;
    },
} as any);

export const updateIssueTool = tool({
    description: 'Update an existing issue.',
    parameters: z.object({
        id: z.union([z.number(), z.string()]).describe('The ID of the issue to update.'),
        updates: issueSchema.partial().describe('The fields to update.'),
    }),
    execute: async ({ id, updates }: any) => {
        const connectors = getTriageConnectors();
        const result = await connectors.updateIssue(String(id), updates);
        return result;
    },
} as any);
