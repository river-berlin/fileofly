<img src="/readme-files/logo.png" alt="Fileofy Logo" width="100" height="100">

# Fileofy

[![npm version](https://img.shields.io/npm/v/fileofy.svg)](https://www.npmjs.com/package/fileofy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Build Status](https://github.com/river-berlin/fileofy/actions/workflows/test.yml/badge.svg)](https://github.com/river-berlin/fileofy/actions/workflows/test.yml)
<!-- coverage-start -->
![Statements](coverage/badges/badge-statements-failing.svg)
![Branches](coverage/badges/badge-branches-failing.svg)
![Functions](coverage/badges/badge-functions-failing.svg)
![Lines](coverage/badges/badge-lines-failing.svg)
<!-- coverage-end -->

A TypeScript library that uses Google's Gemini AI to interpret text instructions and perform file modifications. The library can create, update, or delete files based on natural language input.

## Installation

```bash
npm install fileofy
```

## Setup

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in your project root:
```env
GEMINI_API_KEY=your_api_key_here
```

## Usage

```typescript
import { applyFileModification, generateFileModification, executeFileModification } from 'fileofy';

// Example: Create a new file
await applyFileModification('Create a new file called config.json with the content {"version": "1.0"}');

// Example: Update existing file
await applyFileModification('In main.ts, replace line 5 with a console.log statement');

// Example: Delete file
await applyFileModification('Delete the temporary.txt file');

// Advanced example: Generate and review modification before applying
const modification = await generateFileModification('Add a console.log("Hello") at line 5 in index.ts');
console.log('Planned modification:', modification);
// Output: {
//   filePath: 'index.ts',
//   operation: 'update',
//   content: 'console.log("Hello")',
//   startLine: 5,
//   endLine: 5
// }

// Apply the modification if it looks correct
await executeFileModification(modification);
```

## File Modification Schema

The library uses a structured schema for file modifications:

```typescript
{
  filePath: string;    // Path to the file to modify
  operation: "create" | "update" | "delete";  // Type of operation
  content: string;     // Content for create/update operations
  startLine: number;   // Starting line (1-based, always 1 for create, -1 for last line)
  endLine: number;     // Ending line (1-based, -1 for last line)
}
```

The schema is exposed and can be imported directly for validation or type inference:

```typescript
import { fileModificationSchema } from 'fileofy';
```

### Special Line Numbers
- For create operations: `startLine` must be 1
- For update operations: Use `-1` to reference the last line of the file
- Line numbers are 1-based (first line is 1, not 0)

## API Reference

### `fileModificationSchema: z.ZodObject`

The Zod schema used for validating file modifications. Can be imported and used directly for type checking or validation.

#### Example
```typescript
import { fileModificationSchema } from 'fileofy';

// Validate a modification object
const isValid = fileModificationSchema.safeParse({
  filePath: 'test.txt',
  operation: 'create',
  content: 'Hello World',
  startLine: 1,
  endLine: 1
});

// Get TypeScript type from schema
type FileModification = z.infer<typeof fileModificationSchema>;
```

### `applyFileModification(text: string, customGenAI?: GoogleGenerativeAI): Promise<void>`

The main function that combines AI interpretation and file modification execution.

#### Parameters
- `text`: The text input containing file modification instructions
- `customGenAI` (optional): Custom GoogleGenerativeAI instance for testing

#### Example
```typescript
// Using environment variable
await applyFileModification('Create a new file called hello.txt with the content "Hello, World!"');

// Using custom Gemini instance
const genAI = new GoogleGenerativeAI('your-api-key');
await applyFileModification('Delete temporary.txt', genAI);
```

### `generateFileModification(text: string, customGenAI?: GoogleGenerativeAI): Promise<FileModification>`

Interprets natural language instructions and generates a structured file modification plan.

#### Parameters
- `text`: The text input containing file modification instructions
- `customGenAI` (optional): Custom GoogleGenerativeAI instance

#### Returns
A promise that resolves to a `FileModification` object.

#### Example
```typescript
const modification = await generateFileModification('Replace lines 5-10 in main.ts with a console.log');
console.log(modification);
// {
//   operation: 'update',
//   filePath: 'main.ts',
//   startLine: 5,
//   endLine: 10,
//   content: 'console.log();'
// }
```

### `executeFileModification(modification: FileModification): Promise<void>`

Executes a file modification based on a structured modification plan.

#### Parameters
- `modification`: A `FileModification` object describing the changes to make

#### Example
```typescript
await executeFileModification({
  operation: 'create',
  filePath: './newfile.txt',
  startLine: 1,
  endLine: 1,
  content: 'Hello, World!'
});
```

## Authentication

The library supports two methods of authentication:

1. **Environment Variable** (Recommended)
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

2. **Custom Gemini Instance**
   ```typescript
   import { GoogleGenerativeAI } from "@google/generative-ai";
   
   const genAI = new GoogleGenerativeAI('your-api-key');
   await applyFileModification('your instruction', genAI);
   ```

## Future Enhancements

- [ ] Support for additional LLM providers (OpenAI, Anthropic, etc.)
- [ ] Batch file modifications
- [ ] Dry-run mode for previewing changes
- [ ] File backup/restore functionality
- [ ] Support for regex-based modifications
- [ ] Custom prompt templates

## Requirements

- Node.js 16+
- TypeScript 4.5+
- Valid Gemini API key

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

**Note**: This library currently only supports Google's Gemini AI. Support for other LLM providers is planned for future releases.
