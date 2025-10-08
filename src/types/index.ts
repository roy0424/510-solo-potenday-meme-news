export interface NewsData {
  title: string
  content: string
  url: string
}

export interface MemeResult {
  summary: string
  memeText: string
  emojis: string[]
  imageUrl?: string
  gifUrls?: string[]
}

export interface GenerateMemeRequest {
  type: 'url' | 'text'
  url?: string
  text?: string
}
