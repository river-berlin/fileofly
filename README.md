<p align="center">
  <img src="/readme-files/logo.png" alt="Fileofy Logo" width="100" height="100">
</p>

# Fileofy

A TypeScript library that uses Google's Gemini AI to interpret text instructions and perform file modifications. The library can create, update, or delete files based on natural language input.

## Features

- 🤖 Powered by Google's Gemini AI
- 📝 Create, update, or delete files using natural language
- 🎯 Precise line-based modifications
- 🔒 Type-safe with TypeScript
- 🌟 Simple, promise-based API

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
import { applyFileModification } from 'fileofy';

// Example: Create a new file
await applyFileModification('Create a new file called hello.txt with the content "Hello, World!"');

// Example: Update existing file
await applyFileModification('In main.ts, replace lines 5-10 with a console.log statement');

// Example: Delete file
await applyFileModification('Delete the temporary.txt file');
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

### Special Line Numbers
- For create operations: `startLine` must be 1
- For update operations: Use `-1` to reference the last line of the file
- Line numbers are 1-based (first line is 1, not 0)

## API Reference

### `applyFileModification(text: string, customGenAI?: GoogleGenerativeAI): Promise<void>`

Applies file modifications based on text input using Google's Generative AI.

#### Parameters
- `text`: The text input containing file modification instructions
- `customGenAI` (optional): Custom GoogleGenerativeAI instance for testing

#### Throws
- Error if GEMINI_API_KEY is not set when no custom GenAI is provided
- Error if file modification execution fails

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
