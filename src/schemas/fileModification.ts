import { SchemaType } from '@google/generative-ai';

// Add the TypeScript interface
export interface FileModification {
    filePath: string;
    operation: 'create' | 'update' | 'delete';
    content: string;
    startLine: number;
    endLine: number;
}

export const fileModificationSchema = {
    description: 'Single file modification operation (Create, Update, Delete)',
    type: SchemaType.OBJECT,
    properties: {
        filePath: {
            type: SchemaType.STRING,
            description: 'Path to the file that needs to be modified',
            nullable: false,
        },
        operation: {
            type: SchemaType.STRING,
            description: 'Type of operation (create, update, delete)',
            enum: ['create', 'update', 'delete'],
            nullable: false,
        },
        content: {
            type: SchemaType.STRING,
            description: 'Content for create/update operations',
            nullable: false,
        },
        startLine: {
            type: SchemaType.NUMBER,
            description:
                'Starting line number (1-based, always 1 for create, -1 for last line in update)',
            nullable: false,
        },
        endLine: {
            type: SchemaType.NUMBER,
            description: 'Ending line number (1-based, -1 for last line in update)',
            nullable: false,
        },
    },
    required: ['filePath', 'operation', 'content', 'startLine', 'endLine'],
};
