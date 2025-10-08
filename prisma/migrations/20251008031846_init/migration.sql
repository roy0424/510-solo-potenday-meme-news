-- CreateTable
CREATE TABLE "Meme" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "newsUrl" TEXT,
    "newsTitle" TEXT,
    "newsContent" TEXT,
    "summary" TEXT NOT NULL,
    "memeText" TEXT NOT NULL,
    "emojis" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageData" TEXT,
    "gifUrls" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Meme_pkey" PRIMARY KEY ("id")
);
