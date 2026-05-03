import { NextRequest, NextResponse } from "next/server";
import { getDiaryById, updateDiaryImage } from "@/db/diaries";
import { generateDiaryImage } from "@/lib/gemini";
import fs from "fs";
import path from "path";

// POST: 이미지 재생성 (기존 일기의 이미지를 다시 생성)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diaryId, title, content } = body;

    if (!diaryId || !title || !content) {
      return NextResponse.json(
        { error: "일기 ID, 제목, 내용은 필수입니다" },
        { status: 400 }
      );
    }

    // 일기 존재 확인
    const diary = getDiaryById(diaryId);
    if (!diary) {
      return NextResponse.json(
        { error: "일기를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // AI 이미지 생성
    const imageResult = await generateDiaryImage(title, content);

    if (!imageResult) {
      return NextResponse.json(
        { error: "이미지 생성에 실패했습니다" },
        { status: 500 }
      );
    }

    // 이미지 파일 저장
    const imageDir = path.join(process.cwd(), "public", "images", "diaries");
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    const fileName = `${diaryId}.png`;
    const filePath = path.join(imageDir, fileName);
    const buffer = Buffer.from(imageResult.imageBytes, "base64");
    fs.writeFileSync(filePath, buffer);

    const imagePath = `/images/diaries/${fileName}`;

    // DB 업데이트
    updateDiaryImage(diaryId, imagePath, imageResult.prompt);

    return NextResponse.json({
      success: true,
      imagePath,
      prompt: imageResult.prompt,
    });
  } catch (error) {
    console.error("이미지 생성 중 오류:", error);
    return NextResponse.json(
      { error: "이미지 생성에 실패했습니다" },
      { status: 500 }
    );
  }
}
