import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memeText = searchParams.get('text') || ''
    const imageUrl = searchParams.get('image') || ''

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px',
          }}
        >
          {/* AI Generated Image */}
          {imageUrl && (
            <div
              style={{
                width: '1000px',
                height: '1000px',
                display: 'flex',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={imageUrl}
                alt="AI Generated"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          {/* Meme Text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '40px 60px',
              maxWidth: '900px',
              marginTop: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1F2937',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              {memeText}
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350,
      }
    )
  } catch (error) {
    console.error('Image composition error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
