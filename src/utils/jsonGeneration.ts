import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import { fileModificationSchema } from '../schemas/fileModification';

/**
 * Gets an instance of GoogleGenerativeAI, either using the provided instance or creating a new one
 * 
 * @param customGenAI - Optional custom GoogleGenerativeAI instance
 * @returns {GoogleGenerativeAI} The GoogleGenerativeAI instance to use
 * @throws {Error} If GEMINI_API_KEY is not set when no custom GenAI is provided
 */
function getOrCreateGenAI(customGenAI?: GoogleGenerativeAI): GoogleGenerativeAI {
  if (!customGenAI && !process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return customGenAI || new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

/**
 * Generates a file modification suggestion using Google's Generative AI
 * 
 * @param text - The input text containing the file modification request
 * @param customGenAI - Optional custom GoogleGenerativeAI instance
 * @returns {Promise<any>} A promise that resolves to the parsed JSON response
 * @throws {Error} If the AI generation fails or the response cannot be parsed
 */
export async function generateFileModification(
  text: string,
  customGenAI?: GoogleGenerativeAI
): Promise<any> {
  const genAI = getOrCreateGenAI(customGenAI);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: fileModificationSchema,
    },
  });

  const result: GenerateContentResult = await model.generateContent(
    `Extract the file modification needed from this text: "${text}"`
  );
  
  return JSON.parse(result.response.text());
} 