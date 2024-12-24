import { GoogleGenerativeAI } from '@google/generative-ai';
import { jest } from '@jest/globals';

// Define the response type
interface MockResponse {
    response: {
        text(): string;
    };
}

// Create and export the mock
export const createMockGenerativeAI = (mockedResponse: string = '{}'): GoogleGenerativeAI => {
    const generateContent = jest.fn<() => Promise<MockResponse>>().mockImplementation(() => {
        return Promise.resolve({ response: { text: () => mockedResponse } });
    });

    return {
        getGenerativeModel: jest.fn().mockImplementation(() => ({
            generateContent,
        })),
    } as unknown as GoogleGenerativeAI;
};

// Export the SchemaType constants
export const SchemaType = {
    OBJECT: 'object',
    STRING: 'string',
    NUMBER: 'number',
    ARRAY: 'array',
};
