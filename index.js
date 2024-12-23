import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { fileModificationSchema } from './src/schemas/fileModification.ts';
import { executeFileModification } from './src/utils/fileOperations.ts';

// Load environment variables before using them
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: fileModificationSchema,
  },
});

export async function applyFileModification(text) {
  const result = await model.generateContent(
    `Extract the file modification needed from this text: "${text}"`
  );
  
  const modification = JSON.parse(result.response.text());
  
  try {
    await executeFileModification(modification);
  } catch (error) {
    console.error(`Error modifying ${modification?.filePath || ''}:`, error);
  }
}