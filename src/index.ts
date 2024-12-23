import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GenerateContentResult } from "@google/generative-ai";
import dotenv from 'dotenv';
import { fileModificationSchema } from './schemas/fileModification';
import { executeFileModification } from './utils/fileOperations';


// Load environment variables before using them
dotenv.config();

/**
 * Applies file modifications based on text input using Google's Generative AI.
 * 
 * @param text - The text input containing file modification instructions
 * @param customGenAI - Optional custom GoogleGenerativeAI instance. If not provided,
 *                      creates a new instance using the GEMINI_API_KEY environment variable,
 *                      mostly used for testing
 * 
 * @throws {Error} If GEMINI_API_KEY is not set when no custom GenAI is provided
 * @throws {Error} If file modification execution fails
 * @returns {Promise<void>}
 */
export async function applyFileModification(
  text: string,
  customGenAI?: GoogleGenerativeAI
): Promise<void> {
  // Check for required environment variable if no custom GenAI is provided
  if (!customGenAI && !process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  // Use provided GenAI instance or create a new one
  const genAI: GoogleGenerativeAI = customGenAI || new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
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
  
  const modification = JSON.parse(result.response.text());
  await executeFileModification(modification);
}