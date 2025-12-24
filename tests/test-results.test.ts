import { describe, expect, it } from 'vitest';
import {
    formatForAI,
    getFailedTests,
    getLowCoverageFiles,
    getTestsByFile,
    getUncoveredFunctions,
    parseTestReport,
    type TestReport,
} from '../src/test-results.js';

const mockReport: TestReport = {
    version: '1.0',
    timestamp: '2025-12-24T05:00:00Z',
    runner: 'vitest',
    type: 'unit',
    summary: {
        total: 2,
        passed: 1,
        failed: 1,
        skipped: 0,
        duration: 500,
    },
    files: [
        {
            path: 'src/file1.ts',
            duration: 200,
            tests: [
                {
                    id: 'test1',
                    name: 'test 1',
                    fullName: 'suite test 1',
                    file: 'src/file1.ts',
                    status: 'passed',
                    duration: 100,
                },
                {
                    id: 'test2',
                    name: 'test 2',
                    fullName: 'suite test 2',
                    file: 'src/file1.ts',
                    status: 'failed',
                    duration: 100,
                    error: {
                        message: 'Error message',
                        stack: 'Error stack',
                        codeFrame: 'Code frame',
                        diff: 'Diff content',
                    },
                },
            ],
        },
    ],
    coverage: {
        lines: { total: 100, covered: 50, percentage: 50 },
        functions: { total: 10, covered: 5, percentage: 50 },
        branches: { total: 20, covered: 10, percentage: 50 },
        statements: { total: 100, covered: 50, percentage: 50 },
        files: [
            {
                path: 'src/file1.ts',
                lines: { total: 100, covered: 50, percentage: 50 },
                uncoveredLines: [1, 2, 3],
                functions: { total: 10, covered: 5, percentage: 50 },
                uncoveredFunctions: ['func1', 'func2'],
            },
        ],
    },
    git: {
        branch: 'main',
        commit: 'abcdef',
        message: 'Initial commit',
    },
};

describe('Test Results', () => {
    describe('parseTestReport', () => {
        it('should parse valid report', () => {
            const json = JSON.stringify(mockReport);
            const report = parseTestReport(json);
            expect(report.version).toBe('1.0');
        });

        it('should throw error for unsupported version', () => {
            const invalidReport = { ...mockReport, version: '2.0' };
            const json = JSON.stringify(invalidReport);
            expect(() => parseTestReport(json)).toThrow('Unsupported report version: 2.0');
        });
    });

    describe('getFailedTests', () => {
        it('should return failed tests', () => {
            const failed = getFailedTests(mockReport);
            expect(failed).toHaveLength(1);
            expect(failed[0].id).toBe('test2');
        });
    });

    describe('getTestsByFile', () => {
        it('should return tests for a specific file', () => {
            const tests = getTestsByFile(mockReport, 'src/file1.ts');
            expect(tests).toHaveLength(2);
        });

        it('should return empty array for non-existent file', () => {
            const tests = getTestsByFile(mockReport, 'non-existent.ts');
            expect(tests).toHaveLength(0);
        });
    });

    describe('getLowCoverageFiles', () => {
        it('should return files with coverage below threshold', () => {
            const lowCoverage = getLowCoverageFiles(mockReport, 80);
            expect(lowCoverage).toHaveLength(1);
            expect(lowCoverage[0].path).toBe('src/file1.ts');
        });

        it('should return empty if no coverage data', () => {
            const reportNoCoverage = { ...mockReport };
            delete reportNoCoverage.coverage;
            expect(getLowCoverageFiles(reportNoCoverage)).toHaveLength(0);
        });
    });

    describe('getUncoveredFunctions', () => {
        it('should return uncovered functions', () => {
            const uncovered = getUncoveredFunctions(mockReport);
            expect(uncovered).toHaveLength(1);
            expect(uncovered[0].functions).toContain('func1');
        });

        it('should return empty if no coverage data', () => {
            const reportNoCoverage = { ...mockReport };
            delete reportNoCoverage.coverage;
            expect(getUncoveredFunctions(reportNoCoverage)).toHaveLength(0);
        });
    });

    describe('formatForAI', () => {
        it('should format report correctly', () => {
            const formatted = formatForAI(mockReport);
            expect(formatted).toContain('# Test Report');
            expect(formatted).toContain('## Summary');
            expect(formatted).toContain('## Failed Tests');
            expect(formatted).toContain('## Coverage');
            expect(formatted).toContain('## Git Context');
            expect(formatted).toContain('Error message');
            expect(formatted).toContain('Code frame');
            expect(formatted).toContain('Diff content');
        });

        it('should format correctly without git or coverage', () => {
            const minimalReport = { ...mockReport };
            delete minimalReport.git;
            delete minimalReport.coverage;
            const formatted = formatForAI(minimalReport);
            expect(formatted).not.toContain('## Git Context');
            expect(formatted).not.toContain('## Coverage');
        });
    });
});
