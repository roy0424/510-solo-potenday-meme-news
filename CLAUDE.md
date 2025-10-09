# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meme News is a service that converts news articles into humorous meme-style content. It crawls Naver news articles or accepts direct text input, then uses AI to generate summaries, meme text, emojis, images, and matching GIFs.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linter
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm test:watch
```

## Environment Setup

Create a `.env.local` file with:
```
OPENAI_API_KEY=your_openai_api_key_here
GIPHY_API_KEY=your_giphy_api_key_here
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

All API keys are required for full functionality:
- **GOOGLE_GEMINI_API_KEY**: For text generation (summarization, meme text, prompts)
- **OPENAI_API_KEY**: For image generation (DALL-E 3)
- **GIPHY_API_KEY**: For GIF search

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **AI Services**:
  - Google Gemini API (Gemini 1.5 Flash for text generation)
  - OpenAI API (DALL-E 3 for images)
- **Crawling**: Cheerio + Axios
- **GIF Search**: Giphy API
- **Image Processing**: html2canvas, Sharp

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── generate-meme/ # Main meme generation endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── NewsInput.tsx      # Main input form component
├── lib/                   # Core business logic
│   ├── crawler.ts         # Naver news crawling logic
│   ├── openai.ts          # OpenAI API integrations
│   └── giphy.ts           # Giphy API integration
├── types/                 # TypeScript type definitions
│   └── index.ts
└── styles/               # Global styles
    └── globals.css
```

### Data Flow

1. **Input**: User provides either a Naver news URL or raw text via `NewsInput` component
2. **Crawling** (`lib/crawler.ts`): If URL provided, crawls article using Cheerio with Naver-specific selectors
3. **Summarization** (`lib/openai.ts`): GPT-4 creates a one-sentence summary in Korean
4. **Meme Generation** (`lib/openai.ts`): GPT-4 converts summary into meme-style text with emojis (JSON response format)
5. **Image Generation** (`lib/openai.ts`): DALL-E 3 creates a meme-style image based on summary
6. **GIF Search** (`lib/giphy.ts`): Optional GIF matching using keywords extracted by GPT-4
7. **Result**: API returns `MemeResult` object containing summary, meme text, emojis, image URL, and optional GIF URL

### Key Modules

**`/api/generate-meme`** (src/app/api/generate-meme/route.ts)
- Main API endpoint that orchestrates the entire meme generation pipeline
- Accepts `GenerateMemeRequest` and returns `MemeResult`
- Error handling for crawling failures, API errors

**Crawler** (src/lib/crawler.ts)
- Naver news specific selectors: `#title_area`, `.media_end_head_headline`, `#dic_area`
- Falls back to multiple selector patterns for compatibility
- Includes User-Agent header to avoid blocking

**AI Integration** (src/lib/openai.ts)
- `summarizeNews()`: One-sentence Korean summary (Gemini 1.5 Flash)
- `generateMemeText()`: Meme-style text + emoji recommendations (Gemini 1.5 Flash, JSON response)
- `generateImagePrompt()`: Generate DALL-E prompts (Gemini 1.5 Flash)
- `getImageKeywords()`: Keyword extraction for GIF search (Gemini 1.5 Flash)
- Text generation uses Google Gemini with Korean language prompts optimized for meme culture
- Image generation uses DALL-E 3 (src/lib/image-generator.ts)

**NewsInput Component** (src/components/NewsInput.tsx)
- Dual-mode input: URL or text
- Client-side component with loading states
- Calls `/api/generate-meme` endpoint

### Type Definitions

See `src/types/index.ts` for all interfaces:
- `NewsData`: Crawled article structure
- `MemeResult`: Generated meme content
- `GenerateMemeRequest`: API request format

## Adding Features

### Adding New News Sources
1. Add source-specific selectors in `src/lib/crawler.ts`
2. Update `crawlNaverNews()` or create new crawler function
3. Add URL pattern detection in API route

### Modifying Meme Style
- Adjust GPT-4 system prompts in `src/lib/openai.ts`
- Temperature settings control creativity (0.7-0.9 recommended for memes)

### Image Customization
- Modify DALL-E prompts in `generateMemeImage()`
- Image size can be changed in API call (1024x1024, 1792x1024, etc.)

## Common Issues

**Crawling Failures**: Naver may update HTML structure; check selectors in `crawler.ts`

**API Rate Limits**: OpenAI DALL-E 3 has rate limits; implement caching if needed

**CORS Issues**: API routes are server-side; avoid calling OpenAI from client components
