import OpenAI from 'openai'

// Provider interface
interface ImageProvider {
  generate(prompt: string): Promise<string>
}

// GPT-Image-1 Provider (OpenAI's latest, based on GPT-4o)
class DalleProvider implements ImageProvider {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generate(prompt: string): Promise<string> {
    try {
      const response = await this.openai.images.generate({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        // gpt-image-1 supports up to 4096x4096, but using 1024x1024 for consistency
      })

      const imageUrl = response.data?.[0]?.url
      if (!imageUrl) {
        throw new Error('No image URL returned from GPT-Image-1')
      }

      // Fetch and convert to base64
      const imageResponse = await fetch(imageUrl)
      const arrayBuffer = await imageResponse.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`

      return dataUrl
    } catch (error: any) {
      console.error('GPT-Image-1 generation error:', error)
      throw new Error(`GPT-Image-1 generation failed: ${error.message}`)
    }
  }
}

// Pollinations.ai Provider
class PollinationsProvider implements ImageProvider {
  async generate(prompt: string): Promise<string> {
    try {
      const encodedPrompt = encodeURIComponent(prompt)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`

      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`

      return dataUrl
    } catch (error: any) {
      console.error('Pollinations.ai image generation error:', error)
      throw new Error(`Pollinations generation failed: ${error.message}`)
    }
  }
}

// Factory function to get the configured provider
export function getImageGenerator(): ImageProvider {
  const provider = process.env.IMAGE_PROVIDER || 'pollinations'

  switch (provider.toLowerCase()) {
    case 'dalle3':
    case 'dalle-3':
    case 'gpt-image-1':
    case 'gptimage1':
      return new DalleProvider()
    case 'pollinations':
    default:
      return new PollinationsProvider()
  }
}

// Main export function
export async function generateMemeImage(imagePrompt: string): Promise<string> {
  const generator = getImageGenerator()
  return await generator.generate(imagePrompt)
}
