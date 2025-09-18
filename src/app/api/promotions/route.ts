import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    const filePath = path.join(process.cwd(), 'data', 'promotions.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let promotions = JSON.parse(fileContent);

    // Apply filters
    if (status) {
      promotions = promotions.filter((p: any) => p.status === status);
    }
    
    if (type) {
      promotions = promotions.filter((p: any) => p.type === type);
    }

    return NextResponse.json({ promotions });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}