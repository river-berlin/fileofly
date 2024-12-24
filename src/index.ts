import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { executeFileModification } from './utils/fileOperations';
import { generateFileModification } from './utils/jsonGeneration';
import { fileModificationSchema } from './schemas/fileModification';


// Load environment variables before using them
dotenv.config();

/**
 * Applies file modifications based on text input using Google's Generative AI.
 * 
 * @param text - The text input containing file modification instructions
 * @param customGenAI - Optional custom GoogleGenerativeAI instance, passed through to generation
 * @returns {Promise<void>}
 */
export async function applyFileModification(
  text: string,
  customGenAI?: GoogleGenerativeAI
): Promise<void> {
  const modification = await generateFileModification(text, customGenAI);
  await executeFileModification(modification);
}

export { generateFileModification, executeFileModification, fileModificationSchema };
