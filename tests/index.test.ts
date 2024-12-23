// Import mock-fs instead of custom mock
import mock from 'mock-fs';
import fs from 'fs';
import { createMockGenerativeAI } from './mocks/setupMocks.ts';
import { jest }  from '@jest/globals';

// Declare variables that will hold the imported modules
let applyFileModification: any;
let dotenv: any;

// Load environment variables and imports before tests run
beforeAll(async () => {
  ({ applyFileModification } = await import('../src/index.ts'));
  dotenv = await import('dotenv');

  // Load environment variables
  dotenv.config();

  // Verify API key is loaded
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in .env file');
  }
});

describe('File Modification Tests', () => {
  let mockGenAI: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mock({
      'test.txt': ''
    });
  });

  afterEach(() => {
    // Restore real filesystem after each test
    mock.restore();
  });

  test('should create a new file', async () => {
    const mockResponse = JSON.stringify({
      filePath: 'test.txt',
      operation: 'create',
      content: 'Hello World',
      startLine: 1,
      endLine: 1
    });
    
    mockGenAI = createMockGenerativeAI(mockResponse);
    const mockGenerateContent = mockGenAI.getGenerativeModel().generateContent;
    
    await applyFileModification(
      'Create a new file test.txt with content "Hello World"',
      mockGenAI
    );
    
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    
    const content = await fs.promises.readFile('test.txt', 'utf8');
    expect(content).toBe('Hello World');
  });

  test('should update specific lines in a file', async () => {
    // Setup initial file content
    mock({
      'test.txt': 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5'
    });

    const mockResponse = JSON.stringify({
      filePath: 'test.txt',
      operation: 'update',
      content: 'New Content',
      startLine: 2,
      endLine: 4
    });

    mockGenAI = createMockGenerativeAI(mockResponse);

    await applyFileModification('Update lines 2-4 in test.txt with "New Content"', mockGenAI);

    const content = await fs.promises.readFile('test.txt', 'utf8');
    expect(content).toBe('Line 1\nNew Content\nLine 5');
  });

  test('should update the last line using -1', async () => {
    // Setup initial file content
    mock({
      'test.txt': 'Line 1\nLine 2\nLine 3'
    });

    const mockResponse = JSON.stringify({
      filePath: 'test.txt',
      operation: 'update',
      content: 'Final Line',
      startLine: -1,
      endLine: -1
    });

    mockGenAI = createMockGenerativeAI(mockResponse);

    await applyFileModification('Update the last line in test.txt with "Final Line"', mockGenAI);

    const content = await fs.promises.readFile('test.txt', 'utf8');
    expect(content).toBe('Line 1\nLine 2\nFinal Line');
  });

  test('should delete a file', async () => {
    const mockResponse = JSON.stringify({
      filePath: 'test.txt',
      operation: 'delete',
      content: '',
      startLine: 1,
      endLine: 1
    });

    mockGenAI = createMockGenerativeAI(mockResponse);

    await applyFileModification('Delete the file test.txt', mockGenAI);

    expect(fs.existsSync('test.txt')).toBe(false);
  });

  test('should throw error for create operation not starting at line 1', async () => {
    const mockResponse = JSON.stringify({
      filePath: 'test.txt',
      operation: 'create',
      content: 'Hello World',
      startLine: 2,
      endLine: 2
    });

    mockGenAI = createMockGenerativeAI(mockResponse);

    await expect(
      applyFileModification('Create a file starting at line 2', mockGenAI)
    ).rejects.toThrow('Create operation must start at line 1');
  });
}); 