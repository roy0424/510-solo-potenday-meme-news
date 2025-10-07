'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface NewsItem {
  url: string
  title: string
  press?: string
}

interface CrawlResultModalProps {
  isOpen: boolean
  onClose: () => void
  results: NewsItem[]
}

export default function CrawlResultModal({ isOpen, onClose, results }: CrawlResultModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [converting, setConverting] = useState(false)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setSelectedItems(new Set())
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedItems(newSelected)
  }

  const handleConvertSelected = async () => {
    if (selectedItems.size === 0) {
      alert('변환할 뉴스를 선택해주세요.')
      return
    }

    setConverting(true)
    const selectedUrls = Array.from(selectedItems).map(index => results[index].url)

    try {
      let successCount = 0
      for (const url of selectedUrls) {
        const response = await fetch('/api/generate-meme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'url',
            url: url,
          }),
        })

        if (response.ok) {
          successCount++
        }
      }

      alert(`✅ ${successCount}개의 밈이 생성되었습니다!`)
      window.location.reload()
    } catch (error) {
      console.error('Meme conversion error:', error)
      alert('❌ 오류가 발생했습니다.')
    } finally {
      setConverting(false)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[70vh] my-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">크롤링 완료</h2>
              <p className="text-sm text-gray-600 mt-1">✅ {results.length}개의 뉴스를 성공적으로 크롤링했습니다</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {results.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(index)}
                    onChange={() => toggleSelection(index)}
                    className="w-5 h-5 mt-0.5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 font-medium leading-relaxed break-words">
                      {item.title}
                    </h3>
                    {item.press && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.press}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          {selectedItems.size > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                {selectedItems.size}개 선택됨
              </p>
              <button
                onClick={handleConvertSelected}
                disabled={converting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {converting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    변환 중...
                  </>
                ) : (
                  <>
                    🎭 선택한 뉴스 밈으로 변환하기
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null
}
