import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get memes for feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '10')

    const memes = await prisma.meme.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
    })

    let nextCursor: string | undefined = undefined
    if (memes.length > limit) {
      const nextItem = memes.pop()
      nextCursor = nextItem!.id
    }

    return NextResponse.json({
      memes: memes.map((meme) => ({
        ...meme,
        emojis: JSON.parse(meme.emojis),
        gifUrls: meme.gifUrls ? JSON.parse(meme.gifUrls) : undefined,
      })),
      nextCursor,
    })
  } catch (error) {
    console.error('Error fetching memes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memes' },
      { status: 500 }
    )
  }
}
