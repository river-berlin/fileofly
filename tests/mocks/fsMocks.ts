import { jest } from '@jest/globals';

export const mockWriteFile: jest.Mock = jest.fn<() => Promise<void>>();
export const mockReadFile: jest.Mock = jest.fn<() => Promise<Buffer>>();
export const mockUnlink: jest.Mock = jest.fn<() => Promise<void>>();

export const mockFs = {
  promises: {
    readFile: mockReadFile,
    writeFile: mockWriteFile,
    unlink: mockUnlink
  }
} as const;

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