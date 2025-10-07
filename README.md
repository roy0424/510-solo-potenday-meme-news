# 🎭 Meme News
SOLO 포텐데이 510을 위한 프로토타입

뉴스를 재미있는 밈으로 변환하는 AI 기반 서비스

뉴스 기사를 입력하면 GPT-4가 핵심을 요약하고, DALL-E 3가 밈 이미지를 생성하며, Giphy API가 관련 GIF를 찾아줍니다.

## ✨ 주요 기능

- 🔗 **Naver 뉴스 URL 크롤링** - URL만 입력하면 자동으로 기사 내용 추출
- 📝 **텍스트 직접 입력** - 크롤링 실패 시 텍스트 직접 입력 가능
- 🤖 **AI 뉴스 요약** - GPT-4가 핵심을 한 문장으로 요약
- 💬 **밈 스타일 문구 생성** - 재미있는 밈 텍스트 자동 생성
- 😄 **이모지 추천** - 상황에 맞는 이모지 추천
- 🎨 **AI 이미지 생성** - DALL-E 3로 밈 스타일 이미지 생성
- 🎬 **GIF 매칭** - Giphy API로 관련 GIF 검색

## 🚀 빠른 시작

### 1. 레포지토리 클론

```bash
git clone https://github.com/yourusername/meme-news.git
cd meme-news
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 API 키를 추가하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
GIPHY_API_KEY=your_giphy_api_key_here
```

**API 키 발급 방법:**
- OpenAI API 키: https://platform.openai.com/api-keys
- Giphy API 키: https://developers.giphy.com/

### 4. 데이터베이스 초기화

```bash
npx prisma migrate dev
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인하세요.

## 📖 사용 방법

### 웹 인터페이스

1. 홈페이지에서 "URL로 생성" 또는 "텍스트로 생성" 탭 선택
2. **URL 입력**: 네이버 뉴스 URL 입력
3. **텍스트 입력**: 뉴스 내용 직접 입력
4. "밈 생성하기" 버튼 클릭
5. AI가 생성한 밈 결과 확인 (요약, 밈 텍스트, 이미지, GIF)

### API 사용

```bash
curl -X POST http://localhost:3000/api/generate-meme \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://n.news.naver.com/article/..."
  }'
```

또는 텍스트로:

```bash
curl -X POST http://localhost:3000/api/generate-meme \
  -H "Content-Type: application/json" \
  -d '{
    "text": "뉴스 내용..."
  }'
```

## 🛠 기술 스택

- **프레임워크**: Next.js 14 (App Router), React 18, TypeScript
- **스타일링**: Tailwind CSS
- **AI/ML**: OpenAI API (GPT-4, DALL-E 3)
- **데이터**: Prisma ORM, SQLite
- **크롤링**: Cheerio, Axios
- **외부 API**: Giphy API

## 📂 프로젝트 구조

```
meme-news/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   └── generate-meme/  # 밈 생성 API 엔드포인트
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   └── page.tsx            # 홈페이지
│   ├── components/
│   │   └── NewsInput.tsx       # 입력 폼 컴포넌트
│   ├── lib/                    # 핵심 비즈니스 로직
│   │   ├── crawler.ts          # 뉴스 크롤링
│   │   ├── openai.ts           # OpenAI API 통합
│   │   └── giphy.ts            # Giphy API 통합
│   ├── types/
│   │   └── index.ts            # TypeScript 타입 정의
│   └── styles/
│       └── globals.css         # 전역 스타일
├── prisma/
│   └── schema.prisma           # 데이터베이스 스키마
├── CLAUDE.md                   # Claude Code 작업 가이드
└── README.md
```

## 🔧 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 린터 실행
npm run lint

# 테스트 실행
npm test

# Prisma Studio (DB GUI)
npx prisma studio
```

## ⚠️ 주의사항

- OpenAI API와 Giphy API 키가 필수입니다
- DALL-E 3는 유료 API이므로 사용량에 따라 비용이 발생합니다
- 크롤링은 네이버 뉴스에 최적화되어 있습니다
- `.env.local` 파일은 절대 Git에 커밋하지 마세요

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요

## 📧 문의

프로젝트 링크: [https://github.com/yourusername/meme-news](https://github.com/yourusername/meme-news)
