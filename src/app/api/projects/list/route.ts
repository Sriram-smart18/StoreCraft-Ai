import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectToDatabase();
    
    const projects = await Project.find({ userId: payload.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ projects });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
  }
}
