import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateFileModification } from '../src/utils/jsonGeneration';
import { createMockGenerativeAI } from './mocks/setupMocks';
import { jest } from '@jest/globals';
import dotenv from 'dotenv';

beforeAll(() => {
    dotenv.config();
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in .env file');
    }
});

describe('JSON Generation Tests', () => {
    let mockGenAI: GoogleGenerativeAI;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should generate create operation JSON', async () => {
        const expectedResponse = {
            filePath: 'test.txt',
            operation: 'create',
            content: 'Hello World',
            startLine: 1,
            endLine: 1,
        };

        mockGenAI = createMockGenerativeAI(JSON.stringify(expectedResponse));

        const result = await generateFileModification(
            'Create a new file test.txt with content "Hello World"',
            mockGenAI,
        );

        expect(result).toEqual(expectedResponse);
    });

    test('should generate update operation JSON', async () => {
        const expectedResponse = {
            filePath: 'test.txt',
            operation: 'update',
            content: 'New Content',
            startLine: 2,
            endLine: 4,
        };

        const mockGenAI = createMockGenerativeAI(JSON.stringify(expectedResponse));

        const result = await generateFileModification(
            'Update lines 2-4 in test.txt with "New Content"',
            mockGenAI,
        );

        expect(result).toEqual(expectedResponse);
    });

    test('should generate delete operation JSON', async () => {
        const expectedResponse = {
            filePath: 'test.txt',
            operation: 'delete',
            content: '',
            startLine: 1,
            endLine: 1,
        };

        mockGenAI = createMockGenerativeAI(JSON.stringify(expectedResponse));

        const result = await generateFileModification('Delete the file test.txt', mockGenAI);

        expect(result).toEqual(expectedResponse);
    });

    test('should throw error when API key is missing', async () => {
        const originalEnv = process.env.GEMINI_API_KEY;
        delete process.env.GEMINI_API_KEY;

        await expect(generateFileModification('Create a file')).rejects.toThrow(
            'GEMINI_API_KEY environment variable is not set',
        );

        process.env.GEMINI_API_KEY = originalEnv;
    });

    test('should use custom GenAI instance when provided', async () => {
        const expectedResponse = {
            filePath: 'test.txt',
            operation: 'create',
            content: 'Hello',
            startLine: 1,
            endLine: 1,
        };

        mockGenAI = createMockGenerativeAI(JSON.stringify(expectedResponse));

        const result = await generateFileModification('Create test.txt', mockGenAI);
        expect(result).toEqual(expectedResponse);
    });

    test('should handle AI response parsing error', async () => {
        mockGenAI = createMockGenerativeAI('invalid json');

        await expect(generateFileModification('Create a file', mockGenAI)).rejects.toThrow(
            SyntaxError,
        );
    });

    test('should skip API key check when custom GenAI is provided', async () => {
        const expectedResponse = {
            filePath: 'test.txt',
            operation: 'create',
            content: 'Hello',
            startLine: 1,
            endLine: 1,
        };

        // Remove API key temporarily
        const originalEnv = process.env.GEMINI_API_KEY;
        delete process.env.GEMINI_API_KEY;

        try {
            mockGenAI = createMockGenerativeAI(JSON.stringify(expectedResponse));

            // This should work even without API key because we're using custom GenAI
            const result = await generateFileModification('Create test.txt', mockGenAI);
            expect(result).toEqual(expectedResponse);
        } finally {
            // Restore API key
            process.env.GEMINI_API_KEY = originalEnv;
        }
    });

    test('should handle null customGenAI', async () => {
        // Ensure API key exists
        expect(process.env.GEMINI_API_KEY).toBeTruthy();

        const expectedResponse = {
            filePath: 'test.txt',
            operation: 'create',
            content: 'Hello',
            startLine: 1,
            endLine: 1,
        };

        // Create a mock response
        const mockGenAI = createMockGenerativeAI(JSON.stringify(expectedResponse));
        const mockGenerateContent = mockGenAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                responseMimeType: 'application/json',
            },
        }).generateContent;

        // Pass null as the GenAI instance
        const result = await generateFileModification(
            'Create test.txt with content "Hello"',
            null as unknown as GoogleGenerativeAI,
        );

        expect(result).toEqual(expectedResponse);
        expect(mockGenerateContent).not.toHaveBeenCalled();
    });
});
