import { NextRequest, NextResponse } from 'next/server'
import { crawlNaverNews } from '@/lib/crawler'
import { summarizeNews, generateMemeText, generateImagePrompt, getImageKeywords } from '@/lib/openai'
import { generateMemeImage } from '@/lib/image-generator'
import { searchGifs } from '@/lib/giphy'
import { GenerateMemeRequest, MemeResult, NewsData } from '@/types'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body: GenerateMemeRequest = await request.json()

    let content = ''
    let newsData: NewsData | undefined

    // Step 1: Get news content
    if (body.type === 'url') {
      if (!body.url) {
        return NextResponse.json(
          { error: 'URL is required' },
          { status: 400 }
        )
      }
      newsData = await crawlNaverNews(body.url)
      content = `${newsData.title}\n\n${newsData.content}`
    } else {
      if (!body.text) {
        return NextResponse.json(
          { error: 'Text is required' },
          { status: 400 }
        )
      }
      content = body.text
    }

    // Step 2: Summarize news
    const summary = await summarizeNews(content)

    // Step 3: Generate meme text and emojis
    const { text: memeText, emojis } = await generateMemeText(summary)

    // Step 4: Generate image prompt from full content
    const imagePrompt = await generateImagePrompt(content)

    // Step 5: Generate base image using the detailed prompt
    const baseImageUrl = await generateMemeImage(imagePrompt)

    // Step 6: Search for multiple GIFs (optional)
    const keywords = await getImageKeywords(summary)
    const gifUrls = await searchGifs(keywords, 3)

    // Save to database (optional, skip if database is not available)
    let savedMemeId: string | undefined
    try {
      const savedMeme = await prisma.meme.create({
        data: {
          newsUrl: body.type === 'url' ? body.url : undefined,
          newsTitle: body.type === 'url' ? newsData?.title : undefined,
          newsContent: content.substring(0, 5000), // Limit content size
          summary,
          memeText,
          emojis: JSON.stringify(emojis),
          imageUrl: baseImageUrl,
          imageData: baseImageUrl.startsWith('data:') ? baseImageUrl : undefined,
          gifUrls: gifUrls.length > 0 ? JSON.stringify(gifUrls) : undefined,
        },
      })
      savedMemeId = savedMeme.id
    } catch (dbError) {
      console.warn('Database save failed (continuing without saving):', dbError)
    }

    const result: MemeResult = {
      summary,
      memeText,
      emojis,
      imageUrl: baseImageUrl,
      gifUrls: gifUrls.length > 0 ? gifUrls : undefined,
    }

    return NextResponse.json({ ...result, id: savedMemeId })
  } catch (error: any) {
    console.error('Error generating meme:', error)

    let errorMessage = '밈 생성에 실패했습니다'

    if (error.code === 'content_policy_violation') {
      errorMessage = '해당 뉴스 내용으로는 이미지를 생성할 수 없습니다. 다른 뉴스를 시도해주세요.'
    } else if (error.status === 400) {
      errorMessage = '잘못된 요청입니다. 뉴스 URL이나 텍스트를 확인해주세요.'
    } else if (error.message?.includes('Failed to extract')) {
      errorMessage = '뉴스 크롤링에 실패했습니다. URL을 확인하거나 텍스트를 직접 입력해주세요.'
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 }
    )
  }
}
