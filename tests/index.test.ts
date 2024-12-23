// Import mocks
import {
  mockFs,
  mockGenerateContent
} from './mocks/setupMocks.js';

// Move imports after the mocks
import { applyFileModification } from '../src/index';
import { jest } from '@jest/globals';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure API_KEY exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in .env file');
}

describe('File Modification Tests', () => {
  // Add API key check before all tests
  beforeAll(() => {
    // Verify API key is loaded
    expect(process.env.GEMINI_API_KEY).toBeDefined();
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set up default resolved values
    mockFs.promises.readFile.mockResolvedValue('');
    mockFs.promises.writeFile.mockResolvedValue(undefined);
    mockFs.promises.unlink.mockResolvedValue(undefined);
    
    // Reset mockGenerateContent for each test
    mockGenerateContent.mockReset();
  });

  test('should create a new file', async () => {
    // Set up the mock response
    const mockResponse = {
      response: {
        text: () => JSON.stringify({
          filePath: 'test.txt',
          operation: 'create',
          content: 'Hello World',
          startLine: 1,
          endLine: 1
        })
      }
    };

    // Configure the mock to return our response
    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    // Add some debug logging
    console.log('Before operation - mockGenerateContent setup:', mockGenerateContent);
    
    await applyFileModification('Create a new file test.txt with content "Hello World"');
    
    // Verify the mock was called
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockGenerateContent).toHaveBeenCalledWith(
      'Extract the file modification needed from this text: "Create a new file test.txt with content "Hello World""'
    );

    // Verify the file operation
    expect(mockFs.promises.writeFile).toHaveBeenCalledWith('test.txt', 'Hello World');
  });

  test('should update specific lines in a file', async () => {
    const existingContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
    mockFs.promises.readFile.mockResolvedValue(existingContent);

    const mockResponse = {
      response: {
        text: () => JSON.stringify({
          filePath: 'test.txt',
          operation: 'update',
          content: 'New Content',
          startLine: 2,
          endLine: 4
        })
      }
    };

    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    await applyFileModification('Update lines 2-4 in test.txt with "New Content"');

    expect(mockFs.promises.readFile).toHaveBeenCalledWith('test.txt', 'utf8');
    expect(mockFs.promises.writeFile).toHaveBeenCalledWith(
      'test.txt',
      'Line 1\nNew Content\nLine 5'
    );
  });

  test('should update the last line using -1', async () => {
    const existingContent = 'Line 1\nLine 2\nLine 3';
    mockFs.promises.readFile.mockResolvedValue(existingContent);

    const mockResponse = {
      response: {
        text: () => JSON.stringify({
          filePath: 'test.txt',
          operation: 'update',
          content: 'Final Line',
          startLine: -1,
          endLine: -1
        })
      }
    };

    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    await applyFileModification('Update the last line in test.txt with "Final Line"');

    expect(mockFs.promises.readFile).toHaveBeenCalledWith('test.txt', 'utf8');
    expect(mockFs.promises.writeFile).toHaveBeenCalledWith(
      'test.txt',
      'Line 1\nLine 2\nFinal Line'
    );
  });

  test('should delete a file', async () => {
    const mockResponse = {
      response: {
        text: () => JSON.stringify({
          filePath: 'test.txt',
          operation: 'delete',
          content: '',
          startLine: 1,
          endLine: 1
        })
      }
    };

    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    await applyFileModification('Delete the file test.txt');

    expect(mockFs.promises.unlink).toHaveBeenCalledWith('test.txt');
  });

  test('should throw error for create operation not starting at line 1', async () => {
    const mockResponse = {
      response: {
        text: () => JSON.stringify({
          filePath: 'test.txt',
          operation: 'create',
          content: 'Hello World',
          startLine: 2,
          endLine: 2
        })
      }
    };

    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    const consoleSpy = jest.spyOn(console, 'error');
    await applyFileModification('Create a file starting at line 2');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error modifying test.txt:',
      expect.any(Error)
    );
  });
}); 