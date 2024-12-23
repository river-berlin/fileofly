import { GoogleGenerativeAI } from "@google/generative-ai";
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
export declare function applyFileModification(text: string, customGenAI?: GoogleGenerativeAI): Promise<void>;
//# sourceMappingURL=index.d.ts.map