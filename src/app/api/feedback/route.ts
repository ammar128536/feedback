import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(feedbacks)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, message } = body

    if (!name || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const newFeedback = await prisma.feedback.create({
      data: { name, message },
    })

    return NextResponse.json(newFeedback, { status: 201 })
  } catch (error) {
    console.error('API POST /feedback error:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  try {
    const deleted = await prisma.feedback.delete({
      where: { id },
    })
    return NextResponse.json(deleted)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, message } = body;
    if (!id || !name || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const updated = await prisma.feedback.update({
      where: { id },
      data: { name, message },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}
