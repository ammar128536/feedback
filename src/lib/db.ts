import prisma from './prisma'

export interface Feedback {
  id: string
  name: string
  message: string
  createdAt: Date
}

export async function getFeedbacks(): Promise<Feedback[]> {
  try {
    return await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching feedbacks:', error)
    return []
  }
}

export async function createFeedback({ name, message }: { name: string; message: string }): Promise<Feedback> {
  try {
    return await prisma.feedback.create({
      data: { name, message },
    })
  } catch (error) {
    console.error('Error creating feedback:', error)
    throw error
  }
}
