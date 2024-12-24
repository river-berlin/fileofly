import { SchemaType } from '@google/generative-ai';
export declare const fileModificationSchema: {
    description: string;
    type: SchemaType;
    properties: {
        filePath: {
            type: SchemaType;
            description: string;
            nullable: boolean;
        };
        operation: {
            type: SchemaType;
            description: string;
            enum: string[];
            nullable: boolean;
        };
        content: {
            type: SchemaType;
            description: string;
            nullable: boolean;
        };
        startLine: {
            type: SchemaType;
            description: string;
            nullable: boolean;
        };
        endLine: {
            type: SchemaType;
            description: string;
            nullable: boolean;
        };
    };
    required: string[];
};
//# sourceMappingURL=fileModification.d.ts.map
