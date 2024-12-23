import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { fileModificationSchema } from './schemas/fileModification.js';
import { executeFileModification } from './utils/fileOperations.js';
// Load environment variables before using them
dotenv.config();
export async function applyFileModification(text) {
    // Check for required environment variable
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    // Initialize Gemini API inside the function
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: fileModificationSchema,
        },
    });
    const result = await model.generateContent(`Extract the file modification needed from this text: "${text}"`);
    const modification = JSON.parse(result.response.text());
    try {
        await executeFileModification(modification);
    }
    catch (error) {
        console.error(`Error modifying ${modification?.filePath || ''}:`, error);
    }
}
