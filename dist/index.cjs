"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  applyFileModification: () => applyFileModification
});
module.exports = __toCommonJS(index_exports);
var import_generative_ai2 = require("@google/generative-ai");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/schemas/fileModification.ts
var import_generative_ai = require("@google/generative-ai");
var fileModificationSchema = {
  description: "Single file modification operation (Create, Update, Delete)",
  type: import_generative_ai.SchemaType.OBJECT,
  properties: {
    filePath: {
      type: import_generative_ai.SchemaType.STRING,
      description: "Path to the file that needs to be modified",
      nullable: false
    },
    operation: {
      type: import_generative_ai.SchemaType.STRING,
      description: "Type of operation (create, update, delete)",
      enum: ["create", "update", "delete"],
      nullable: false
    },
    content: {
      type: import_generative_ai.SchemaType.STRING,
      description: "Content for create/update operations",
      nullable: false
    },
    startLine: {
      type: import_generative_ai.SchemaType.NUMBER,
      description: "Starting line number (1-based, always 1 for create, -1 for last line in update)",
      nullable: false
    },
    endLine: {
      type: import_generative_ai.SchemaType.NUMBER,
      description: "Ending line number (1-based, -1 for last line in update)",
      nullable: false
    }
  },
  required: ["filePath", "operation", "content", "startLine", "endLine"]
};

// src/utils/fileOperations.ts
var import_fs = __toESM(require("fs"), 1);
async function executeFileModification(modification) {
  switch (modification.operation) {
    case "create":
      if (modification.startLine !== 1) {
        throw new Error(`Create operation must start at line 1 (received: ${modification.startLine})`);
      }
      await import_fs.default.promises.writeFile(modification.filePath, modification.content);
      break;
    case "update":
      const content = await import_fs.default.promises.readFile(modification.filePath, "utf8");
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
      await import_fs.default.promises.writeFile(modification.filePath, newContent);
      break;
    case "delete":
      await import_fs.default.promises.unlink(modification.filePath);
      break;
  }
}

// src/index.ts
import_dotenv.default.config();
async function applyFileModification(text, customGenAI) {
  if (!customGenAI && !process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  const genAI = customGenAI || new import_generative_ai2.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  applyFileModification
});
