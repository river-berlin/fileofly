import fs from 'fs';

/**
 * Represents a modification operation to be performed on a file
 */
export type FileModification = {
  /** The type of operation to perform */
  operation: 'create' | 'update' | 'delete';
  /** The path to the file to modify */
  filePath: string;
  /** The starting line number for the modification (1-based indexing) */
  startLine: number;
  /** The ending line number for the modification (1-based indexing) */
  endLine: number;
  /** The content to write (for create/update operations) */
  content: string;
};

/**
 * Executes a file modification operation (create, update, or delete)
 * 
 * @param modification - The modification to perform
 * @throws {Error} If the line numbers are invalid or if file operations fail
 * 
 * @example
 * ```ts
 * await executeFileModification({
 *   operation: 'update',
 *   filePath: './myfile.txt',
 *   startLine: 5,
 *   endLine: 10,
 *   content: 'new content'
 * });
 * ```
 */
export async function executeFileModification(modification: FileModification) {
  switch (modification.operation) {
    case 'create':
      if (modification.startLine !== 1) {
        throw new Error(`Create operation must start at line 1 (received: ${modification.startLine})`);
      }
      await fs.promises.writeFile(modification.filePath, modification.content);
      break;
      
    case 'update':
      const content = await fs.promises.readFile(modification.filePath, 'utf8');
      const lines = content.split('\n');
      
      // Convert -1 to actual last line number
      const startLine = modification.startLine === -1 ? lines.length : modification.startLine;
      const endLine = modification.endLine === -1 ? lines.length : modification.endLine;
      
      // Validate line numbers
      const isStartLineValid = startLine >= 1;
      const isEndLineValid = endLine <= lines.length;
      const isLineOrderValid = startLine <= endLine;

      if (!isStartLineValid || !isEndLineValid || !isLineOrderValid) {
        const errors: string[] = [];
        
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
          'Invalid line numbers:\n' + 
          errors.join('\n')
        );
      }
      
      // Split the file into three parts: before, modified section, and after
      const beforeSection = lines.slice(0, startLine - 1);
      const afterSection = lines.slice(endLine);
      
      // Combine all sections with the new content
      const newContent = [
        ...beforeSection,
        modification.content,
        ...afterSection
      ].join('\n');
      
      await fs.promises.writeFile(modification.filePath, newContent);
      break;
      
    case 'delete':
      await fs.promises.unlink(modification.filePath);
      break;
  }
} 