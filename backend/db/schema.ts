import { Database } from "better-sqlite3";

export function createTables(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      "order" INTEGER NOT NULL,
      color TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      mode TEXT NOT NULL,
      archive TEXT NOT NULL,
      ead_id TEXT NOT NULL,
      title TEXT NOT NULL,
      path_json TEXT NOT NULL,
      ead3_level TEXT NOT NULL,
      ead3_local_type TEXT,
      ead3_dsc_head TEXT,
      ead3_digital_object_count INTEGER NOT NULL DEFAULT 0,
      category_id TEXT NOT NULL,
      custom_name TEXT NOT NULL,
      note TEXT,
      url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS bookmark_tags (
      bookmark_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (bookmark_id, tag_id),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookmark_id TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      downloaded_at TEXT NOT NULL,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rate_limits (
      api_key TEXT PRIMARY KEY,
      count INTEGER DEFAULT 0,
      reset_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_bookmarks_category ON bookmarks(category_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_ead ON bookmarks(ead_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_archive ON bookmarks(archive);
    CREATE INDEX IF NOT EXISTS idx_bookmark_tags_bookmark ON bookmark_tags(bookmark_id);
    CREATE INDEX IF NOT EXISTS idx_bookmark_tags_tag ON bookmark_tags(tag_id);
  `);
}
