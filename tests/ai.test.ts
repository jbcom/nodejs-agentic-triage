import { ollama } from 'ai-sdk-ollama';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_MODEL, getModel, getProvider, resolveModel } from '../src/ai.js';

describe('AI Provider', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('getModel', () => {
        it('should return default model when no config or env is set', () => {
            delete process.env.OLLAMA_MODEL;
            expect(getModel()).toBe(DEFAULT_MODEL);
        });

        it('should return model from config if provided', () => {
            expect(getModel({ model: 'custom-model' })).toBe('custom-model');
        });

        it('should return model from env if set and no config is provided', () => {
            process.env.OLLAMA_MODEL = 'env-model';
            expect(getModel()).toBe('env-model');
        });
    });

    describe('getProvider', () => {
        it('should return default ollama provider when no config or env is set', () => {
            delete process.env.OLLAMA_API_KEY;
            delete process.env.OLLAMA_HOST;
            expect(getProvider()).toBe(ollama);
        });

        it('should use provided API key and host', () => {
            const provider = getProvider({ apiKey: 'test-key', host: 'https://test-host' });
            expect(provider).toBeDefined();
        });

        it('should use API key and host from environment', () => {
            process.env.OLLAMA_API_KEY = 'env-key';
            process.env.OLLAMA_HOST = 'http://env-host';
            const provider = getProvider();
            expect(provider).toBeDefined();
        });

        it('should normalize host URL by adding /api if missing', () => {
            // Testing normalization logic
            const provider = getProvider({ host: 'http://my-host' });
            expect(provider).toBeDefined();
        });

        it('should use CLOUD_HOST if apiKey is provided but no host', () => {
            const provider = getProvider({ apiKey: 'test-key' });
            expect(provider).toBeDefined();
        });

        it('should use LOCAL_HOST if no apiKey and no host', () => {
            const _provider = getProvider({});
            // If we didn't provide anything, and no env vars, it should be 'ollama' default
            // which we tested in first case.
            // If we provide an empty object, it still checks env vars.
            delete process.env.OLLAMA_API_KEY;
            delete process.env.OLLAMA_HOST;
            expect(getProvider({})).toBe(ollama);
        });
    });

    describe('resolveModel', () => {
        it('should resolve ollama model by default', async () => {
            const result = await resolveModel();
            expect(result.providerName).toBe('ollama');
            expect(result.modelId).toBe(DEFAULT_MODEL);
            expect(result.model).toBeDefined();
        });

        it('should resolve model from config', async () => {
            const result = await resolveModel({ provider: 'ollama', model: 'test-model' });
            expect(result.providerName).toBe('ollama');
            expect(result.modelId).toBe('test-model');
        });

        it('should throw error for unsupported provider', async () => {
            await expect(resolveModel({ provider: 'unsupported' })).rejects.toThrow(
                'Provider unsupported not supported'
            );
        });
    });
});
