import NewsInput from '@/components/NewsInput'
import Link from 'next/link'

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 md:mb-8">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 font-semibold text-sm md:text-base"
          >
            ← 피드로 돌아가기
          </Link>
        </div>

        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            🎭 밈 만들기
          </h1>
          <p className="text-base md:text-xl text-gray-600">
            뉴스를 재미있는 밈으로 변환해보세요
          </p>
        </header>

        <NewsInput />
      </div>
    </main>
  )
}
