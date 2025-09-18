import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const fileName = pathSegments.join('/');
    const filePath = path.join(process.cwd(), 'data', fileName);

    // Security check to prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    const dataDir = path.join(process.cwd(), 'data');
    if (!normalizedPath.startsWith(dataDir)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 403 }
      );
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse JSON if it's a JSON file
    if (fileName.endsWith('.json')) {
      try {
        const jsonData = JSON.parse(fileContent);
        return NextResponse.json(jsonData);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid JSON file' },
          { status: 500 }
        );
      }
    }

    // Return raw content for other files
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error serving data file:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}