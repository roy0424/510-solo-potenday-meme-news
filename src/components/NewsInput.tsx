'use client'

import { useState } from 'react'
import { MemeResult } from '@/types'
import MemeCard from './MemeCard'
import { NewsListItem } from '@/lib/crawler'

export default function NewsInput() {
  const [inputMethod, setInputMethod] = useState<'url' | 'text' | 'crawl'>('url')
  const [newsUrl, setNewsUrl] = useState('')
  const [newsText, setNewsText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MemeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [newsList, setNewsList] = useState<NewsListItem[]>([])
  const [crawling, setCrawling] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('politics')

  const handleCrawlNews = async () => {
    setCrawling(true)
    setError(null)
    setNewsList([])

    try {
      const response = await fetch(`/api/crawl-news?category=${selectedCategory}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to crawl news')
      }

      setNewsList(data.newsList)
    } catch (error) {
      console.error('Error crawling news:', error)
      setError(error instanceof Error ? error.message : '뉴스 크롤링에 실패했습니다')
    } finally {
      setCrawling(false)
    }
  }

  const handleGenerateMemeFromNews = async (newsItem: NewsListItem) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'url',
          url: newsItem.url,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meme')
      }

      setResult(data)
    } catch (error) {
      console.error('Error generating meme:', error)
      setError(error instanceof Error ? error.message : '밈 생성에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: inputMethod,
          url: inputMethod === 'url' ? newsUrl : undefined,
          text: inputMethod === 'text' ? newsText : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meme')
      }

      setResult(data)
    } catch (error) {
      console.error('Error generating meme:', error)
      setError(error instanceof Error ? error.message : '밈 생성에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setInputMethod('url')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            inputMethod === 'url'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          URL 입력
        </button>
        <button
          onClick={() => setInputMethod('text')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            inputMethod === 'text'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          텍스트 입력
        </button>
        <button
          onClick={() => setInputMethod('crawl')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            inputMethod === 'crawl'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          뉴스 크롤링
        </button>
      </div>

      {inputMethod === 'crawl' ? (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 선택
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="politics">정치</option>
              <option value="economy">경제</option>
              <option value="society">사회</option>
              <option value="culture">문화</option>
              <option value="world">세계</option>
              <option value="it">IT</option>
            </select>
          </div>

          <button
            onClick={handleCrawlNews}
            disabled={crawling}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mb-6"
          >
            {crawling ? '뉴스 크롤링 중...' : '📰 뉴스 가져오기'}
          </button>

          {/* News List */}
          {newsList.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {newsList.map((news, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleGenerateMemeFromNews(news)}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{news.title}</h3>
                  {news.press && (
                    <p className="text-sm text-gray-500">{news.press}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {inputMethod === 'url' ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                뉴스 기사 URL
              </label>
              <input
                type="url"
                value={newsUrl}
                onChange={(e) => setNewsUrl(e.target.value)}
                placeholder="https://news.naver.com/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                required
              />
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                뉴스 텍스트
              </label>
              <textarea
                value={newsText}
                onChange={(e) => setNewsText(e.target.value)}
                placeholder="뉴스 기사 내용을 붙여넣으세요..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? '밈 생성 중...' : '🎨 밈 만들기'}
          </button>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">❌ {error}</p>
        </div>
      )}

      {/* Result */}
      {result && <MemeCard result={result} />}
    </div>
  )
}
