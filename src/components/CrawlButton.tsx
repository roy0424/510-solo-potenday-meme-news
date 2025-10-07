'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CrawlResultModal from './CrawlResultModal'

interface NewsItem {
  url: string
  title: string
  press?: string
}

export default function CrawlButton() {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [crawlResults, setCrawlResults] = useState<NewsItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('politics')
  const router = useRouter()

  const categories = [
    { value: 'politics', label: '정치' },
    { value: 'economy', label: '경제' },
    { value: 'society', label: '사회' },
    { value: 'culture', label: '문화' },
    { value: 'world', label: '세계' },
    { value: 'it', label: 'IT' },
  ]

  const handleCrawl = async (category: string) => {
    if (loading) return

    setLoading(true)
    setShowCategoryMenu(false)

    try {
      const response = await fetch(`/api/crawl-news?category=${category}`)

      const data = await response.json()

      if (response.ok) {
        setCrawlResults(data.newsList)
        setShowModal(true)
      } else {
        alert(`❌ 크롤링에 실패했습니다.\n${data.error || ''}`)
      }
    } catch (error) {
      console.error('Crawl error:', error)
      alert('❌ 크롤링 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowCategoryMenu(!showCategoryMenu)}
        disabled={loading}
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            크롤링 중...
          </>
        ) : (
          <>
            🔄 뉴스 크롤링
          </>
        )}
      </button>

      {/* Category Dropdown */}
      {showCategoryMenu && !loading && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-20 min-w-[150px]">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCrawl(category.value)}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors text-gray-700 hover:text-purple-600 font-medium"
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Close menu when clicking outside */}
      {showCategoryMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowCategoryMenu(false)}
        />
      )}

      <CrawlResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        results={crawlResults}
      />
    </div>
  )
}
