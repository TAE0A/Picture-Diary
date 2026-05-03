import { NextRequest, NextResponse } from "next/server";
import { createDiary, getAllDiaries } from "@/db/diaries";
import { generateDiaryImage } from "@/lib/gemini";
import fs from "fs";
import path from "path";

// GET: 모든 일기 조회
export async function GET() {
  try {
    const diaries = getAllDiaries();
    return NextResponse.json({ diaries });
  } catch (error) {
    console.error("일기 조회 중 오류:", error);
    return NextResponse.json(
      { error: "일기를 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}

// POST: 새 일기 생성 및 AI 이미지 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, mood } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용은 필수입니다" },
        { status: 400 }
      );
    }

    // 1. DB에 일기 저장 (이미지 경로는 null로 시작)
    const diary = createDiary({ title, content, mood });

    // 2. AI 이미지 생성 시도
    let imagePath: string | null = null;
    let imagePrompt: string | null = null;

    const imageResult = await generateDiaryImage(title, content);

    if (imageResult) {
      // 3. 이미지 파일 저장
      const imageDir = path.join(
        process.cwd(),
        "public",
        "images",
        "diaries"
      );

      // 디렉터리 생성 (없으면)
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }

      const fileName = `${diary.id}.png`;
      const filePath = path.join(imageDir, fileName);
      const buffer = Buffer.from(imageResult.imageBytes, "base64");

      fs.writeFileSync(filePath, buffer);
      imagePath = `/images/diaries/${fileName}`;
      imagePrompt = imageResult.prompt;

      // 4. DB 업데이트
      const { updateDiaryImage } = await import("@/db/diaries");
      updateDiaryImage(diary.id, imagePath, imagePrompt);
    }

    // 최신 데이터 반환
    const { getDiaryById } = await import("@/db/diaries");
    const updatedDiary = getDiaryById(diary.id);

    return NextResponse.json({ diary: updatedDiary }, { status: 201 });
  } catch (error) {
    console.error("일기 생성 중 오류:", error);
    return NextResponse.json(
      { error: "일기 저장에 실패했습니다" },
      { status: 500 }
    );
  }
}
