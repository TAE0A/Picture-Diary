import { getDb } from "./database";

// TypeScript 인터페이스
export interface Diary {
  id: number;
  title: string;
  content: string;
  image_path: string | null;
  image_prompt: string | null;
  mood: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDiaryInput {
  title: string;
  content: string;
  mood?: string;
}

// 최신순으로 모든 일기 조회
export function getAllDiaries(): Diary[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM diaries ORDER BY created_at DESC"
  );
  return stmt.all() as Diary[];
}

// 단건 조회
export function getDiaryById(id: number): Diary | null {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM diaries WHERE id = ?");
  return (stmt.get(id) as Diary) || null;
}

// 새 일기 생성
export function createDiary(input: CreateDiaryInput): Diary {
  const db = getDb();
  const now = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  const stmt = db.prepare(
    "INSERT INTO diaries (title, content, mood, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
  );

  const result = stmt.run(input.title, input.content, input.mood || null, now, now);
  const newId = result.lastInsertRowid as number;

  return getDiaryById(newId)!;
}

// 이미지 정보 업데이트
export function updateDiaryImage(
  id: number,
  imagePath: string,
  imagePrompt: string
): Diary {
  const db = getDb();
  const now = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  const stmt = db.prepare(
    "UPDATE diaries SET image_path = ?, image_prompt = ?, updated_at = ? WHERE id = ?"
  );

  stmt.run(imagePath, imagePrompt, now, id);

  return getDiaryById(id)!;
}

// 일기 삭제
export function deleteDiary(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare("DELETE FROM diaries WHERE id = ?");
  const result = stmt.run(id);
  return (result.changes as number) > 0;
}
