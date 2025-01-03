// src/index.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// src/schemas/fileModification.ts
import { SchemaType } from "@google/generative-ai";
var fileModificationSchema = {
  description: "Single file modification operation (Create, Update, Delete)",
  type: SchemaType.OBJECT,
  properties: {
    filePath: {
      type: SchemaType.STRING,
      description: "Path to the file that needs to be modified",
      nullable: false
    },
    operation: {
      type: SchemaType.STRING,
      description: "Type of operation (create, update, delete)",
      enum: ["create", "update", "delete"],
      nullable: false
    },
    content: {
      type: SchemaType.STRING,
      description: "Content for create/update operations",
      nullable: false
    },
    startLine: {
      type: SchemaType.NUMBER,
      description: "Starting line number (1-based, always 1 for create, -1 for last line in update)",
      nullable: false
    },
    endLine: {
      type: SchemaType.NUMBER,
      description: "Ending line number (1-based, -1 for last line in update)",
      nullable: false
    }
  },
  required: ["filePath", "operation", "content", "startLine", "endLine"]
};

// src/utils/fileOperations.ts
import fs from "fs";
async function executeFileModification(modification) {
  switch (modification.operation) {
    case "create":
      if (modification.startLine !== 1) {
        throw new Error(`Create operation must start at line 1 (received: ${modification.startLine})`);
      }
      await fs.promises.writeFile(modification.filePath, modification.content);
      break;
    case "update":
      const content = await fs.promises.readFile(modification.filePath, "utf8");
      const lines = content.split("\n");
      const startLine = modification.startLine === -1 ? lines.length : modification.startLine;
      const endLine = modification.endLine === -1 ? lines.length : modification.endLine;
      const isStartLineValid = startLine >= 1;
      const isEndLineValid = endLine <= lines.length;
      const isLineOrderValid = startLine <= endLine;
      if (!isStartLineValid || !isEndLineValid || !isLineOrderValid) {
        const errors = [];
        if (!isStartLineValid) {
          errors.push(`Start line must be >= 1 (got ${startLine})`);
        }
        if (!isEndLineValid) {
          errors.push(`End line must be <= ${lines.length} (got ${endLine})`);
        }
        if (!isLineOrderValid) {
          errors.push(`Start line (${startLine}) must be <= end line (${endLine})`);
        }
        throw new Error(
          "Invalid line numbers:\n" + errors.join("\n")
        );
      }
      const beforeSection = lines.slice(0, startLine - 1);
      const afterSection = lines.slice(endLine);
      const newContent = [
        ...beforeSection,
        modification.content,
        ...afterSection
      ].join("\n");
      await fs.promises.writeFile(modification.filePath, newContent);
      break;
    case "delete":
      await fs.promises.unlink(modification.filePath);
      break;
  }
}

// src/index.ts
dotenv.config();
async function applyFileModification(text, customGenAI) {
  if (!customGenAI && !process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  const genAI = customGenAI || new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: fileModificationSchema
    }
  });
  const result = await model.generateContent(
    `Extract the file modification needed from this text: "${text}"`
  );
  const modification = JSON.parse(result.response.text());
  await executeFileModification(modification);
}
export {
  applyFileModification
};
