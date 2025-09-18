import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'shipping.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const shippingData = JSON.parse(fileContent);

    return NextResponse.json(shippingData);
  } catch (error) {
    console.error('Error fetching shipping data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping data' },
      { status: 500 }
    );
  }
}