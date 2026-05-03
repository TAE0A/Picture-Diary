import Database from "better-sqlite3";
import path from "path";

// Hot Reload 대응을 위해 globalThis에 캐시
declare global {
  var _db: Database.Database | undefined;
}

const DB_PATH = path.join(process.cwd(), "diary.db");

function initializeSchema(db: Database.Database): void {
  // 일기 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS diaries (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      content     TEXT    NOT NULL,
      image_path  TEXT,
      image_prompt TEXT,
      mood        TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);
}

export function getDb(): Database.Database {
  if (!globalThis._db) {
    globalThis._db = new Database(DB_PATH);
    // WAL 모드: 동시 접근 성능 향상
    globalThis._db.pragma("journal_mode = WAL");
    initializeSchema(globalThis._db);
  }
  return globalThis._db;
}

export default getDb;
