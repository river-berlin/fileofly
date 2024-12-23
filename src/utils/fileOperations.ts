import fs from 'fs';

export async function executeFileModification(modification) {
  try {
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
        if (startLine < 1 || endLine > lines.length || startLine > endLine) {
          throw new Error('Invalid line numbers');
        }
        
        // Replace the specified lines with new content
        const newLines = [
          ...lines.slice(0, startLine - 1),
          modification.content,
          ...lines.slice(endLine)
        ];
        
        await fs.promises.writeFile(modification.filePath, newLines.join('\n'));
        break;
        
      case 'delete':
        await fs.promises.unlink(modification.filePath);
        break;
    }
  } catch (error) {
    console.error(`Error modifying ${modification?.filePath || ''}:`, error);
    throw error;
  }
} 