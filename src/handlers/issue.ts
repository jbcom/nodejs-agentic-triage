import type { ListIssuesOptions } from '../providers/types.js';
import type { IssueTriage } from '../schemas/issue.js';
import { TriageConnectors } from '../triage/connectors.js';

let _connectors: TriageConnectors | null = null;

function getConnectors(customConnectors?: TriageConnectors) {
    if (customConnectors) return customConnectors;
    if (!_connectors) {
        _connectors = new TriageConnectors();
    }
    return _connectors;
}

/**
 * Handler for triaging an issue
 */
export async function handleTriageIssue(id: string, analysis: IssueTriage, customConnectors?: TriageConnectors) {
    try {
        const connectors = getConnectors(customConnectors);

        // Update the issue with the analysis
        await connectors.issues.update(id, {
            title: analysis.title,
            priority: analysis.priority,
            type: analysis.type,
        });

        // Add labels
        if (analysis.labels.length > 0) {
            await connectors.issues.addLabels(id, analysis.labels);
        }

        return {
            success: true,
            message: `Issue ${id} triaged successfully`,
            analysis,
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to triage issue ${id}: ${error instanceof Error ? error.message : String(error)}`,
            error,
        };
    }
}

/**
 * Handler for listing issues
 */
export async function handleListIssues(filters: ListIssuesOptions, customConnectors?: TriageConnectors) {
    try {
        const connectors = getConnectors(customConnectors);
        return await connectors.issues.list(filters);
    } catch (error) {
        console.error('Failed to list issues:', error);
        throw error;
    }
}

/**
 * Handler for getting an issue
 */
export async function handleGetIssue(id: string, customConnectors?: TriageConnectors) {
    try {
        const connectors = getConnectors(customConnectors);
        return await connectors.issues.get(id);
    } catch (error) {
        console.error(`Failed to get issue ${id}:`, error);
        throw error;
    }
}
