import NewsInput from '@/components/NewsInput'
import Link from 'next/link'

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← 피드로 돌아가기
          </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎭 밈 만들기
          </h1>
          <p className="text-xl text-gray-600">
            뉴스를 재미있는 밈으로 변환해보세요
          </p>
        </header>

        <NewsInput />
      </div>
    </main>
  )
}
