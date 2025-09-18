import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    const dataDir = path.join(process.cwd(), 'data');
    
    // If no file specified, list all JSON files
    if (!fileName) {
      const files = fs.readdirSync(dataDir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(dataDir, file);
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          
          return {
            name: file,
            size: stats.size,
            modified: stats.mtime,
            recordCount: Array.isArray(data) ? data.length : Object.keys(data).length
          };
        });
        
      return NextResponse.json({ files });
    }
    
    // Read specific file
    const filePath = path.join(dataDir, fileName);
    
    // Security: ensure file is in data directory
    if (!filePath.startsWith(dataDir) || !fileName.endsWith('.json')) {
      return NextResponse.json(
        { error: 'Invalid file name' },
        { status: 400 }
      );
    }
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    return NextResponse.json({ 
      fileName,
      data,
      isArray: Array.isArray(data),
      recordCount: Array.isArray(data) ? data.length : Object.keys(data).length
    });
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json(
      { error: 'Failed to read data' },
      { status: 500 }
    );
  }
}