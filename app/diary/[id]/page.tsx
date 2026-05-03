"use client";

import { Diary } from "@/db/diaries";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageDisplay from "@/components/ImageDisplay";

export default function DiaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [diary, setDiary] = useState<Diary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [diaryId, setDiaryId] = useState<number | null>(null);

  useEffect(() => {
    // 클라이언트에서 DB에 직접 접근할 수 없으므로 API로 조회
    const fetchDiary = async () => {
      try {
        const { id } = await params;
        const parsedId = parseInt(id);
        setDiaryId(parsedId);

        const response = await fetch(`/api/diaries/${parsedId}`);
        if (!response.ok) throw new Error("일기를 찾을 수 없습니다");
        const data = await response.json();
        setDiary(data.diary);
      } catch (err) {
        setError(err instanceof Error ? err.message : "로드 실패");
      }
    };

    fetchDiary();
  }, [params]);

  const handleRegenerateImage = async () => {
    if (!diary) return;

    try {
      setError("");
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diaryId: diary.id,
          title: diary.title,
          content: diary.content,
        }),
      });

      if (!response.ok) throw new Error("이미지 생성 실패");

      const data = await response.json();
      setDiary({ ...diary, image_path: data.imagePath });
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지 생성 실패");
    }
  };

  const handleDelete = async () => {
    if (!diaryId || !confirm("이 일기를 정말 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/diaries/${diaryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("삭제 실패");

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 실패");
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!diary) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="animate-pulse-soft space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(diary.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <a
          href="/"
          className="text-diary-brown hover:text-diary-accent transition mb-4 inline-block"
        >
          ← 목록으로 돌아가기
        </a>

        <h1 className="text-4xl font-bold text-diary-brown mb-2">
          {diary.title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="text-gray-600">
            <p className="text-sm">{formattedDate}</p>
            {diary.mood && <p className="text-sm mt-1">감정: {diary.mood}</p>}
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 transition text-sm font-medium"
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>

      {/* 이미지 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-diary-brown">삽화</h2>
          {!diary.image_path && (
            <button
              onClick={handleRegenerateImage}
              className="px-4 py-2 bg-diary-accent text-white rounded-lg hover:bg-opacity-90 transition text-sm font-medium"
            >
              🎨 이미지 생성하기
            </button>
          )}
        </div>
        <ImageDisplay imagePath={diary.image_path} title={diary.title} />
      </div>

      {/* 내용 */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-lg font-semibold text-diary-brown mb-4">일기</h2>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
          {diary.content}
        </div>
      </div>
    </div>
  );
}
