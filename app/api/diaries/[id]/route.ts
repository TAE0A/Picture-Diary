import { NextRequest, NextResponse } from "next/server";
import { getDiaryById, deleteDiary } from "@/db/diaries";
import fs from "fs";
import path from "path";

// GET: 단건 일기 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diaryId = parseInt(id);

    if (isNaN(diaryId)) {
      return NextResponse.json(
        { error: "유효하지 않은 일기 ID입니다" },
        { status: 400 }
      );
    }

    const diary = getDiaryById(diaryId);

    if (!diary) {
      return NextResponse.json(
        { error: "일기를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ diary });
  } catch (error) {
    console.error("일기 조회 중 오류:", error);
    return NextResponse.json(
      { error: "일기를 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}

// DELETE: 일기 삭제
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diaryId = parseInt(id);

    if (isNaN(diaryId)) {
      return NextResponse.json(
        { error: "유효하지 않은 일기 ID입니다" },
        { status: 400 }
      );
    }

    // 일기 조회
    const diary = getDiaryById(diaryId);

    if (!diary) {
      return NextResponse.json(
        { error: "일기를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이미지 파일 삭제
    if (diary.image_path) {
      const imageFilePath = path.join(
        process.cwd(),
        "public",
        diary.image_path
      );

      if (fs.existsSync(imageFilePath)) {
        try {
          fs.unlinkSync(imageFilePath);
        } catch (err) {
          console.error("이미지 파일 삭제 실패:", err);
          // 이미지 삭제 실패해도 일기는 계속 삭제
        }
      }
    }

    // DB에서 일기 삭제
    const success = deleteDiary(diaryId);

    if (!success) {
      return NextResponse.json(
        { error: "일기 삭제에 실패했습니다" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("일기 삭제 중 오류:", error);
    return NextResponse.json(
      { error: "일기 삭제에 실패했습니다" },
      { status: 500 }
    );
  }
}
