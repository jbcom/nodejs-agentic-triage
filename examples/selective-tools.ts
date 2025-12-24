import { createIssueTool, listIssuesTool, searchIssuesTool } from '@agentic/triage/tools';

/**
 * Example showing how to use only a subset of available tools.
 *
 * This is useful for minimizing the tool space and providing
 * only what the agent needs for a specific task.
 */
const minimalTools = {
    listIssues: listIssuesTool,
    createIssue: createIssueTool,
    searchIssues: searchIssuesTool,
};

console.log('Available minimal tools:', Object.keys(minimalTools));
