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
export declare function executeFileModification(modification: FileModification): Promise<void>;
//# sourceMappingURL=fileOperations.d.ts.map
