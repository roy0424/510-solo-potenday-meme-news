import MemeFeed from '@/components/MemeFeed'
import CrawlButton from '@/components/CrawlButton'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto min-h-screen">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                🎭 Meme News
              </h1>
              <p className="text-gray-600 mt-1">
                뉴스를 재미있는 밈으로
              </p>
            </div>
            <div className="flex gap-3">
              <CrawlButton />
              <Link
                href="/create"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                + 밈 만들기
              </Link>
            </div>
          </div>
        </header>

        <MemeFeed />
      </div>
    </main>
  )
}
