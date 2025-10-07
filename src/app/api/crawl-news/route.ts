import { NextRequest, NextResponse } from 'next/server'
import { crawlNaverNewsList } from '@/lib/crawler'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'politics'

    const newsList = await crawlNaverNewsList(category)

    return NextResponse.json({ newsList })
  } catch (error: any) {
    console.error('Error crawling news list:', error)
    return NextResponse.json(
      { error: '뉴스 목록 크롤링에 실패했습니다' },
      { status: 500 }
    )
  }
}
