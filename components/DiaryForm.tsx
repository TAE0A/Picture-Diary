"use client";

import { useState } from "react";
import { CreateDiaryInput } from "@/db/diaries";

interface DiaryFormProps {
  onSubmit: (data: CreateDiaryInput) => Promise<void>;
  isLoading?: boolean;
}

const MOODS = [
  { value: "행복", emoji: "😊" },
  { value: "슬픔", emoji: "😢" },
  { value: "설렘", emoji: "😍" },
  { value: "화남", emoji: "😠" },
  { value: "피곤", emoji: "😴" },
  { value: "보통", emoji: "😐" },
];

export default function DiaryForm({ onSubmit, isLoading = false }: DiaryFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요");
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        mood: mood || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 제목 입력 */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-diary-brown mb-2"
        >
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="오늘의 일기 제목을 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diary-accent focus:border-transparent outline-none transition"
          disabled={isLoading}
        />
      </div>

      {/* 내용 입력 */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-diary-brown mb-2"
        >
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘의 일기를 입력하세요. 입력한 내용을 바탕으로 AI가 아름다운 삽화를 만들어줍니다."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diary-accent focus:border-transparent outline-none transition resize-none h-40"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          상세할수록 더 좋은 삽화가 만들어집니다
        </p>
      </div>

      {/* 감정 선택 */}
      <div>
        <label className="block text-sm font-medium text-diary-brown mb-3">
          오늘의 감정 (선택사항)
        </label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(mood === m.value ? "" : m.value)}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg transition ${
                mood === m.value
                  ? "bg-diary-accent text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m.emoji} {m.value}
            </button>
          ))}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-diary-brown text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        {isLoading ? "AI 삽화 생성 중..." : "저장하고 삽화 생성하기"}
      </button>
    </form>
  );
}
