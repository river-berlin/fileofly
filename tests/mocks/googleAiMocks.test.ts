import { createMockGenerativeAI } from './googleAiMocks';
import { SchemaType } from "@google/generative-ai";

describe('Google AI Mocks', () => {
  test('should create mock with default empty response', async () => {
    const mockAI = createMockGenerativeAI();
    const model = mockAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            test: { type: SchemaType.STRING }
          }
        },
      },
    });
    const result = await model.generateContent('test');
    
    expect(result.response.text()).toBe('{}');
  });

  test('should create mock with custom response', async () => {
    const customResponse = '{"test": "value"}';
    const mockAI = createMockGenerativeAI(customResponse);
    const model = mockAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            test: { type: SchemaType.STRING }
          }
        },
      },
    });
    const result = await model.generateContent('test');
    
    expect(result.response.text()).toBe(customResponse);
  });

  test('should allow multiple calls to generateContent', async () => {
    const mockAI = createMockGenerativeAI('test');
    const model = mockAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
    
    await model.generateContent('first');
    await model.generateContent('second');
    
    expect(model.generateContent).toHaveBeenCalledTimes(2);
  });
}); 