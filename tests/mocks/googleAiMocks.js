import { jest } from '@jest/globals';

export let mockGenerateContent;
jest.unstable_mockModule('@google/generative-ai', () => {
  mockGenerateContent = jest.fn().mockImplementation((...args) => {
    return Promise.resolve({ response: { text: () => '{}' } });
  });
  
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockImplementation(() => ({
        generateContent: mockGenerateContent
      }))
    })),
    SchemaType: {
      OBJECT: 'object',
      STRING: 'string',
      NUMBER: 'number',
      ARRAY: 'array',
    }
  };
}); 