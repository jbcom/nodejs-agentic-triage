import { getTriageTools, setTriageConnectors, TriageConnectors } from '@agentic/triage';

/**
 * Example showing how to manually configure the triage connectors.
 *
 * By default, the tools use environment variables (like GH_TOKEN),
 * but you can also configure them programmatically.
 */
async function main() {
    // Configure before using tools
    const connectors = new TriageConnectors({
        provider: 'github',
        github: {
            owner: 'myorg',
            repo: 'myrepo',
        },
    });

    setTriageConnectors(connectors);

    // Now tools will use this configuration
    const _tools = getTriageTools();

    console.log('Tools configured for myorg/myrepo');
}

main().catch(console.error);
