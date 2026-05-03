# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

사용자가 일기를 작성하면 Google Gemini AI가 자동으로 삽화를 생성해주는 그림일기 웹 애플리케이션.

**기술 스택:**
- Next.js 14+ (App Router), TypeScript
- Tailwind CSS
- Google Gemini API — `@google/genai` 패키지 (`@google/generative-ai` 구 SDK 사용 금지)
  - 텍스트→프롬프트 변환: `gemini-2.0-flash`
  - 이미지 생성: `imagen-4.0-generate-001`
- SQLite — `better-sqlite3` (동기 API)

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성 (`feat: `, `fix: `, `refactor: ` 접두사 사용)
- **문서화**: 한국어로 작성
- **변수명/함수명/파일명**: 영어 (코드 표준 준수)

## 개발 명령어

```bash
npm run dev          # 개발 서버 실행 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 타입 검사 (tsc --noEmit)
```

## 필수 환경 변수

`.env.local` 파일에 설정:
```
GEMINI_API_KEY=Google_AI_Studio_API_키
```

## 아키텍처

### 디렉터리 역할
- `app/` — Next.js App Router 페이지 및 API Routes
- `components/` — 재사용 가능한 React 컴포넌트
- `db/` — SQLite 연결(`database.ts`) 및 CRUD 쿼리 함수(`diaries.ts`)
- `lib/` — 외부 API 클라이언트 (`gemini.ts`)
- `public/images/diaries/` — AI 생성 이미지 파일 저장 (gitignore됨)
- `diary.db` — SQLite DB 파일, 프로젝트 루트 (gitignore됨)

### 데이터 흐름 (일기 작성 → 이미지 생성)
1. `app/new/page.tsx` 폼 제출 → `POST /api/diaries`
2. DB에 일기 텍스트 삽입 (image_path = null)
3. `lib/gemini.ts`의 `buildImagePrompt()` — 일기 내용을 영어 삽화 프롬프트로 변환
4. `generateDiaryImage()` — Imagen으로 이미지 생성, base64 반환
5. `public/images/diaries/{id}.png` 파일 저장
6. DB의 `image_path`, `image_prompt` 업데이트
7. 완성된 Diary 객체 반환 → `/diary/{id}` 리다이렉트

### 핵심 설계 결정
- **서버 컴포넌트 직접 DB 호출**: `app/page.tsx`, `app/diary/[id]/page.tsx`는 `db/diaries.ts` 함수를 직접 import (API Route 경유 없음)
- **DB 싱글턴**: `globalThis._db`에 캐시 — Next.js dev Hot Reload 시 중복 연결 방지
- **이미지 생성 실패 허용**: 이미지 생성 실패 시 텍스트 일기는 반드시 저장됨 (`image_path = null` 상태)
- **이미지 파일 시스템 저장**: DB BLOB 대신 `public/` 폴더 파일로 저장해 Next.js 정적 서빙 활용
