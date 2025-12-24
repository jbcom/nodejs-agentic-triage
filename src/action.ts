import { ollama } from 'ai-sdk-ollama';
import { analyzeIssue } from './handlers';

async function run() {
  const issueBody = process.env.INPUT_ISSUE_BODY || '';
  if (!issueBody) {
    console.log('No issue body found.');
    return;
  }

  const result = await analyzeIssue(issueBody, ollama('llama3'));

  console.log('Analysis Result:', result);
}

run();
