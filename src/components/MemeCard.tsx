'use client'

import { MemeResult } from '@/types'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface MemeCardProps {
  result: MemeResult
}

interface GifPosition {
  url: string
  top: number
  left: number
  size: number
  delay: number
}

export default function MemeCard({ result }: MemeCardProps) {
  const [gifPositions, setGifPositions] = useState<GifPosition[]>([])

  const generateRandomPositions = () => {
    if (result.gifUrls && result.gifUrls.length > 0) {
      // Check if mobile or desktop
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const minSize = isMobile ? 50 : 84
      const maxSize = isMobile ? 90 : 140

      const positions = result.gifUrls.map((url, index) => ({
        url,
        top: Math.random() * 60 + 10, // 10-70%
        left: Math.random() * 60 + 10, // 10-70%
        size: Math.random() * (maxSize - minSize) + minSize,
        delay: index * 2, // Stagger animations
      }))
      setGifPositions(positions)
    }
  }

  useEffect(() => {
    generateRandomPositions()

    // Change positions every 6 seconds (matching animation duration)
    const interval = setInterval(() => {
      generateRandomPositions()
    }, 6000)

    // Regenerate on window resize
    const handleResize = () => {
      generateRandomPositions()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [result.gifUrls])
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meme News',
          text: result.memeText,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${result.memeText}\n\n${result.summary}`)
      alert('클립보드에 복사되었습니다!')
    }
  }

  const handleDownload = () => {
    if (result.imageUrl) {
      const link = document.createElement('a')
      link.href = result.imageUrl
      link.download = 'meme-news.png'
      link.click()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 mt-6 md:mt-10 animate-fade-in">
      {/* Summary - 상단에 크게 표시 */}
      <div className="mb-6 md:mb-10 p-5 md:p-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-orange-400">
        <h3 className="text-sm md:text-base font-semibold text-orange-600 mb-3 md:mb-4 uppercase tracking-wide">📰 뉴스 요약</h3>
        <p className="text-lg md:text-3xl font-bold text-gray-900 leading-relaxed">{result.summary}</p>
      </div>

      {/* AI Generated Image with GIF Overlays */}
      {result.imageUrl && (
        <div className="mb-6 md:mb-8 relative">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={result.imageUrl}
              alt="Generated meme image"
              width={1080}
              height={1350}
              className="w-full h-auto"
              unoptimized
            />

            {/* Multiple GIFs with random positions and fade animation */}
            {gifPositions.map((gif, index) => (
              <div
                key={index}
                className="absolute rounded-xl overflow-hidden border-3 border-white shadow-2xl gif-float"
                style={{
                  top: `${gif.top}%`,
                  left: `${gif.left}%`,
                  width: `${gif.size}px`,
                  height: `${gif.size}px`,
                  animationDelay: `${gif.delay}s`,
                }}
              >
                <Image
                  src={gif.url}
                  alt={`GIF ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 md:gap-5">
        <button
          onClick={handleShare}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 md:py-4 px-5 md:px-8 rounded-lg text-base md:text-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
        >
          📤 공유하기
        </button>
        {result.imageUrl && (
          <button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 md:py-4 px-5 md:px-8 rounded-lg text-base md:text-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all"
          >
            💾 다운로드
          </button>
        )}
      </div>
    </div>
  )
}
