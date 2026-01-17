import { Database } from "better-sqlite3";
import { Tag } from "../../src/api/models/bookmarks.types";

interface TagRow {
  id: string;
  name: string;
  label: string;
  created_at: string;
}

export class TagsService {
  constructor(private db: Database) {}

  getAll(): Tag[] {
    const rows = this.db
      .prepare("SELECT * FROM tags ORDER BY name ASC")
      .all() as TagRow[];
    return rows.map(this.rowToTag);
  }

  getById(id: string): Tag | null {
    const row = this.db.prepare("SELECT * FROM tags WHERE id = ?").get(id) as
      | TagRow
      | undefined;
    return row ? this.rowToTag(row) : null;
  }

  create(tag: Tag): Tag {
    const now = new Date().toISOString();

    this.db
      .prepare(
        `
      INSERT INTO tags (id, name, label, created_at)
      VALUES (?, ?, ?, ?)
    `,
      )
      .run(tag.id, tag.name, tag.label, now);

    return { ...tag, createdAt: now };
  }

  update(id: string, label: string): void {
    this.db.prepare("UPDATE tags SET label = ? WHERE id = ?").run(label, id);
  }

  delete(id: string): void {
    this.db.prepare("DELETE FROM tags WHERE id = ?").run(id);
  }

  getByBookmark(bookmarkId: string): Tag[] {
    const rows = this.db
      .prepare(
        `
      SELECT t.* FROM tags t
      INNER JOIN bookmark_tags bt ON t.id = bt.tag_id
      WHERE bt.bookmark_id = ?
      ORDER BY t.name ASC
    `,
      )
      .all(bookmarkId) as TagRow[];
    return rows.map(this.rowToTag);
  }

  private rowToTag(row: TagRow): Tag {
    return {
      id: row.id,
      name: row.name,
      label: row.label,
      createdAt: row.created_at,
    };
  }
}
