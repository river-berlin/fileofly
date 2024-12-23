import { jest } from '@jest/globals';

export const mockWriteFile = jest.fn();
export const mockReadFile = jest.fn();
export const mockUnlink = jest.fn();

export const mockFs = {
  promises: {
    readFile: mockReadFile,
    writeFile: mockWriteFile,
    unlink: mockUnlink
  }
};

jest.unstable_mockModule('fs', () => ({
  ...mockFs,
  default: {
    promises: {
      readFile: mockReadFile,
      writeFile: mockWriteFile,
      unlink: mockUnlink
    }
  }
})); 