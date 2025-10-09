'use client'

import { useState } from 'react'
import { MemeResult } from '@/types'
import MemeCard from './MemeCard'

export default function NewsInput() {
  const [inputMethod, setInputMethod] = useState<'url' | 'text'>('url')
  const [newsUrl, setNewsUrl] = useState('')
  const [newsText, setNewsText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MemeResult | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
      <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
        <button
          onClick={() => setInputMethod('url')}
          className={`flex-1 py-2 md:py-3 px-3 md:px-6 rounded-lg text-sm md:text-base font-semibold transition-all ${
            inputMethod === 'url'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          URL
        </button>
        <button
          onClick={() => setInputMethod('text')}
          className={`flex-1 py-2 md:py-3 px-3 md:px-6 rounded-lg text-sm md:text-base font-semibold transition-all ${
            inputMethod === 'text'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          텍스트
        </button>
      </div>

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
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg font-semibold text-base md:text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? '밈 생성 중...' : '🎨 밈 만들기'}
        </button>
      </form>

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
