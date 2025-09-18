import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    
    const filePath = path.join(process.cwd(), 'data', 'support-tickets.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let tickets = JSON.parse(fileContent);

    // Apply filters
    if (status) {
      tickets = tickets.filter((t: any) => t.status === status);
    }
    
    if (priority) {
      tickets = tickets.filter((t: any) => t.priority === priority);
    }
    
    if (category) {
      tickets = tickets.filter((t: any) => t.category === category);
    }

    // Sort by creation date (newest first)
    tickets.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}