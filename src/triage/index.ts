/**
 * Triage Module - Unified API for Issue/Project Management
 *
 * Following the vendor-connectors pattern, this module provides:
 * 1. Direct TypeScript API - TriageConnectors class
 * 2. Vercel AI SDK Tools - for use with agentic-control agents
 *
 * @example Direct API
 * ```typescript
 * import { TriageConnectors } from '@strata/triage';
 *
 * const triage = new TriageConnectors();
 *
 * // Issue operations
 * const issues = await triage.issues.list({ status: 'open' });
 * const issue = await triage.issues.create({ title: 'Fix bug', type: 'bug' });
 * await triage.issues.close('123', 'Fixed in PR #456');
 *
 * // Project operations (coming soon)
 * const sprints = await triage.projects.getSprints();
 *
 * // Review operations
 * const feedback = await triage.reviews.getPRFeedback(144);
 * ```
 *
 * @example Vercel AI SDK Tools
 * ```typescript
 * import { getTriageTools } from '@strata/triage';
 * import { generateText } from 'ai';
 * import { anthropic } from '@ai-sdk/anthropic';
 *
 * const tools = getTriageTools();
 *
 * const result = await generateText({
 *   model: anthropic('claude-sonnet-4-20250514'),
 *   tools,
 *   prompt: 'List all open bugs and create a summary',
 * });
 * ```
 */

export { TriageConnectors, type TriageConnectorsConfig } from './connectors.js';
export {
    // Tool getter functions
    getTriageTools,
    getIssueTools,
    getProjectTools,
    getReviewTools,
    // Tool definitions for custom integrations
    ISSUE_TOOL_DEFINITIONS,
    PROJECT_TOOL_DEFINITIONS,
    REVIEW_TOOL_DEFINITIONS,
} from './tools.js';
