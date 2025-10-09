'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { MemeResult } from '@/types'
import MemeCard from './MemeCard'

interface MemeWithId extends MemeResult {
  id: string
  createdAt: string
}

export default function MemeFeed() {
  const [memes, setMemes] = useState<MemeWithId[]>([])
  const [nextCursor, setNextCursor] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoaded, setInitialLoaded] = useState(false)

  const observerRef = useRef<IntersectionObserver>()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const loadMemes = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const url = nextCursor
        ? `/api/memes?cursor=${nextCursor}&limit=10`
        : '/api/memes?limit=10'

      const response = await fetch(url)
      const data = await response.json()

      if (data.memes.length === 0) {
        setHasMore(false)
        return
      }

      // Prevent duplicates by filtering out memes that already exist
      setMemes((prev) => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMemes = data.memes.filter((m: MemeWithId) => !existingIds.has(m.id))
        return [...prev, ...newMemes]
      })
      setNextCursor(data.nextCursor)
      setHasMore(!!data.nextCursor)
    } catch (error) {
      console.error('Failed to load memes:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, nextCursor])

  useEffect(() => {
    if (!initialLoaded) {
      loadMemes()
      setInitialLoaded(true)
    }
  }, [])

  useEffect(() => {
    // Only set up IntersectionObserver after initial load
    if (!initialLoaded) return

    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMemes()
      }
    })

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, loadMemes, initialLoaded])

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-8 min-h-screen">
      {memes.length === 0 && !loading && (
        <div className="space-y-4 md:space-y-8">
          {/* Empty state with skeleton cards */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-4 md:p-8 animate-pulse">
              <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4 mb-3 md:mb-4"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2 mb-4 md:mb-6"></div>
              <div className="aspect-video bg-gray-200 rounded-xl mb-4 md:mb-6"></div>
              <div className="space-y-2">
                <div className="h-3 md:h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 md:h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 md:h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          ))}
          <div className="text-center py-8 md:py-12">
            <p className="text-lg md:text-2xl text-gray-500 mb-3 md:mb-4">아직 밈이 없습니다</p>
            <p className="text-sm md:text-base text-gray-400">위의 '뉴스 크롤링' 버튼을 눌러 뉴스를 크롤링하거나<br/>'밈 만들기' 버튼으로 직접 만들어보세요!</p>
          </div>
        </div>
      )}

      {memes.map((meme) => (
        <MemeCard key={meme.id} result={meme} />
      ))}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">로딩 중...</p>
        </div>
      )}

      <div ref={loadMoreRef} className="h-10" />

      {!hasMore && memes.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">더 이상 밈이 없습니다</p>
        </div>
      )}
    </div>
  )
}
