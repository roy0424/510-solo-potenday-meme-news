import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function summarizeNews(content: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
    }
  })

  const prompt = `당신은 뉴스를 간결하게 요약하는 전문가입니다. 핵심 내용을 한 문장으로 요약해주세요.

다음 뉴스를 한 문장으로 요약해주세요:

${content}`

  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text() || ''
}

export async function generateMemeText(summary: string): Promise<{ text: string; emojis: string[] }> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.9,
      responseMimeType: 'application/json',
    }
  })

  const prompt = `당신은 뉴스를 재미있는 밈 스타일 문구로 변환하는 전문가입니다. 풍자적이고 위트있게, 그리고 한국 밈 문화에 맞게 작성해주세요. 반드시 JSON 형식으로 응답하세요.

다음 요약을 밈 스타일 문구로 만들고, 어울리는 이모지 3-5개를 추천해주세요.

요약: ${summary}

JSON 형식으로 응답해주세요: { "text": "밈 문구", "emojis": ["😂", "🔥"] }`

  const result = await model.generateContent(prompt)
  const response = result.response
  const jsonResult = JSON.parse(response.text() || '{}')

  return {
    text: jsonResult.text || '',
    emojis: jsonResult.emojis || [],
  }
}

export async function generateImagePrompt(newsContent: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
    }
  })

  const prompt = `당신은 뉴스를 사실적인 이미지로 표현하기 위한 영문 프롬프트를 작성하는 전문가입니다. 이미지만 보고도 무슨 뉴스인지 알 수 있도록 구체적이고 명확하게 작성하세요.

다음 뉴스를 사실적인(photorealistic) 이미지로 표현하기 위한 영문 프롬프트를 작성해주세요.

중요 지침:
1. 뉴스에 등장하는 실제 인물이 있다면, 그 사람의 실명과 구체적인 외형 특징을 명확히 포함하세요 (예: "Elon Musk with characteristic appearance", "Donald Trump in his signature red tie")
2. 유명인이나 공인의 경우 AI 모델이 학습한 그들의 외형을 재현할 수 있도록 이름을 반드시 포함하세요
3. 주요 인물의 특징적인 헤어스타일, 복장, 표정 등을 구체적으로 묘사하세요
4. 뉴스의 핵심 상황과 배경을 명확히 표현하세요
5. 약간의 유머러스하거나 과장된 표현을 추가하세요
6. 텍스트나 글자는 절대 포함하지 마세요

뉴스: ${newsContent}

영문 프롬프트만 출력하세요.`

  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text() || ''
}

export async function getImageKeywords(summary: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.5,
      responseMimeType: 'application/json',
    }
  })

  const prompt = `Extract 3-5 keywords suitable for searching GIFs/memes. Respond in JSON format.

Extract keywords from: ${summary}

Return as JSON: { "keywords": ["keyword1", "keyword2"] }`

  const result = await model.generateContent(prompt)
  const response = result.response
  const jsonResult = JSON.parse(response.text() || '{}')
  return jsonResult.keywords || []
}
