import axios from 'axios'
import * as cheerio from 'cheerio'
import { NewsData } from '@/types'

export interface NewsListItem {
  title: string
  url: string
  thumbnail?: string
  press?: string
}

export async function crawlNaverNewsList(category: string = 'politics'): Promise<NewsListItem[]> {
  try {
    // Naver news main page by category
    const categoryMap: { [key: string]: string } = {
      politics: '100',
      economy: '101',
      society: '102',
      culture: '103',
      world: '104',
      it: '105',
    }

    const categoryCode = categoryMap[category] || '100'
    const url = `https://news.naver.com/section/${categoryCode}`

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    const $ = cheerio.load(response.data)
    const newsList: NewsListItem[] = []

    // Naver news list selectors
    $('.sa_text').each((_, element) => {
      const titleEl = $(element).find('.sa_text_title')
      const title = titleEl.text().trim()
      const url = titleEl.attr('href')
      const press = $(element).find('.sa_text_press').text().trim()

      if (title && url) {
        newsList.push({
          title,
          url: url.startsWith('http') ? url : `https://news.naver.com${url}`,
          press,
        })
      }
    })

    return newsList.slice(0, 20) // Return top 20 news
  } catch (error) {
    console.error('News list crawling error:', error)
    throw new Error('Failed to crawl news list')
  }
}

export async function crawlNaverNews(url: string): Promise<NewsData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    const $ = cheerio.load(response.data)

    // Naver news specific selectors
    const title = $('#title_area').text().trim() ||
                  $('h2.media_end_head_headline').text().trim() ||
                  $('h3#articleTitle').text().trim()

    const content = $('#dic_area').text().trim() ||
                    $('#articeBody').text().trim() ||
                    $('.article_body').text().trim()

    if (!title || !content) {
      throw new Error('Failed to extract news content')
    }

    return {
      title,
      content,
      url,
    }
  } catch (error) {
    console.error('Crawling error:', error)
    throw new Error('Failed to crawl news article')
  }
}
