import axios from 'axios'

const GIPHY_API_KEY = process.env.GIPHY_API_KEY

export async function searchGifs(keywords: string[], count: number = 3): Promise<string[]> {
  if (!GIPHY_API_KEY) {
    console.warn('GIPHY_API_KEY not set')
    return []
  }

  try {
    const searchTerm = keywords.join(' ')
    const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
      params: {
        api_key: GIPHY_API_KEY,
        q: searchTerm,
        limit: count,
        rating: 'g',
      },
    })

    return response.data.data
      .map((gif: any) => gif?.images?.original?.url)
      .filter((url: string) => url)
  } catch (error) {
    console.error('Giphy API error:', error)
    return []
  }
}
