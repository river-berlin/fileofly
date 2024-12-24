import mock from 'mock-fs';
import fs from 'fs';
import { executeFileModification, FileModification } from '../src/utils/fileOperations';

describe('File Operations Tests', () => {
  beforeEach(() => {
    mock({
      'test.txt': 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5'
    });
  });

  afterEach(() => {
    mock.restore();
  });

  test('should create a new file', async () => {
    const modification: FileModification = {
      filePath: 'new.txt',
      operation: 'create',
      content: 'Hello World',
      startLine: 1,
      endLine: 1
    };

    await executeFileModification(modification);
    
    const content = await fs.promises.readFile('new.txt', 'utf8');
    expect(content).toBe('Hello World');
  });

  test('should update specific lines in a file', async () => {
    const modification: FileModification = {
      filePath: 'test.txt',
      operation: 'update',
      content: 'New Content\nNew Content\nNew Content',
      startLine: 2,
      endLine: 4
    };

    await executeFileModification(modification);
    
    const content = await fs.promises.readFile('test.txt', 'utf8');
    expect(content).toBe('Line 1\nNew Content\nNew Content\nNew Content\nLine 5');
  });

  test('should handle invalid line numbers', async () => {
    const modification: FileModification = {
      filePath: 'test.txt',
      operation: 'update',
      content: 'New Content',
      startLine: 10, // Greater than file length
      endLine: 12
    };

    await expect(executeFileModification(modification))
      .rejects.toThrow('Invalid line numbers');
  });

  test('should handle start line greater than end line', async () => {
    const modification: FileModification = {
      filePath: 'test.txt',
      operation: 'update',
      content: 'New Content',
      startLine: 4,
      endLine: 2
    };

    await expect(executeFileModification(modification))
      .rejects.toThrow('Start line (4) must be <= end line (2)');
  });

  test('should handle negative start line', async () => {
    const modification: FileModification = {
      filePath: 'test.txt',
      operation: 'update',
      content: 'New Content',
      startLine: -2, // Invalid negative (only -1 is allowed)
      endLine: 3
    };

    await expect(executeFileModification(modification))
      .rejects.toThrow('Start line must be >= 1');
  });

  test('should handle create operation with invalid start line', async () => {
    const modification: FileModification = {
      filePath: 'new.txt',
      operation: 'create',
      content: 'Hello World',
      startLine: 2, // Must be 1 for create
      endLine: 2
    };

    await expect(executeFileModification(modification))
      .rejects.toThrow('Create operation must start at line 1');
  });
}); 