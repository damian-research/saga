import { Database } from "better-sqlite3";
import { Bookmark } from "../../src/api/models/bookmarks.types";

interface BookmarkRow {
  id: string;
  mode: string;
  archive: string;
  ead_id: string;
  title: string;
  path_json: string;
  ead3_level: string;
  ead3_local_type: string | null;
  ead3_dsc_head: string | null;
  ead3_digital_object_count: number;
  category_id: string;
  custom_name: string;
  note: string | null;
  url: string;
  created_at: string;
  tag_ids: string | null;
}

export class BookmarksService {
  constructor(private db: Database) {}

  getAll(): Bookmark[] {
    const stmt = this.db.prepare(`
      SELECT b.*, GROUP_CONCAT(bt.tag_id) as tag_ids
      FROM bookmarks b
      LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `);

    const rows = stmt.all() as BookmarkRow[];
    return rows.map(this.rowToBookmark);
  }

  getById(id: string): Bookmark | null {
    const stmt = this.db.prepare(`
      SELECT b.*, GROUP_CONCAT(bt.tag_id) as tag_ids
      FROM bookmarks b
      LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
      WHERE b.id = ?
      GROUP BY b.id
    `);

    const row = stmt.get(id) as BookmarkRow | undefined;
    return row ? this.rowToBookmark(row) : null;
  }

  create(bookmark: Bookmark): Bookmark {
    const now = new Date().toISOString();
    const { tags, ...data } = bookmark;

    this.db
      .prepare(
        `
      INSERT INTO bookmarks (
        id, mode, archive, ead_id, title, path_json,
        ead3_level, ead3_local_type, ead3_dsc_head, ead3_digital_object_count,
        category_id, custom_name, note, url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        data.id,
        data.mode,
        data.archive,
        data.eadId,
        data.title,
        JSON.stringify(data.path),
        data.ead3.level,
        data.ead3.localType || null,
        data.ead3.dscHead || null,
        data.ead3.digitalObjectCount,
        data.categoryId,
        data.customName,
        data.note || null,
        data.url,
        now,
      );

    if (tags && tags.length > 0) {
      this.setTags(data.id, tags);
    }

    return { ...bookmark, createdAt: now };
  }

  update(id: string, updates: Partial<Bookmark>): void {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push("title = ?");
      values.push(updates.title);
    }
    if (updates.customName !== undefined) {
      fields.push("custom_name = ?");
      values.push(updates.customName);
    }
    if (updates.note !== undefined) {
      fields.push("note = ?");
      values.push(updates.note);
    }
    if (updates.categoryId !== undefined) {
      fields.push("category_id = ?");
      values.push(updates.categoryId);
    }

    if (fields.length > 0) {
      this.db
        .prepare(`UPDATE bookmarks SET ${fields.join(", ")} WHERE id = ?`)
        .run(...values, id);
    }

    if (updates.tags !== undefined) {
      this.setTags(id, updates.tags);
    }
  }

  delete(id: string): void {
    this.db.prepare("DELETE FROM bookmarks WHERE id = ?").run(id);
  }

  private setTags(bookmarkId: string, tagIds: string[]): void {
    this.db
      .prepare("DELETE FROM bookmark_tags WHERE bookmark_id = ?")
      .run(bookmarkId);

    if (tagIds.length > 0) {
      const stmt = this.db.prepare(
        "INSERT INTO bookmark_tags (bookmark_id, tag_id) VALUES (?, ?)",
      );
      for (const tagId of tagIds) {
        stmt.run(bookmarkId, tagId);
      }
    }
  }

  private rowToBookmark(row: BookmarkRow): Bookmark {
    return {
      id: row.id,
      mode: row.mode as any,
      archive: row.archive as any,
      eadId: row.ead_id,
      title: row.title,
      path: JSON.parse(row.path_json),
      ead3: {
        level: row.ead3_level,
        localType: row.ead3_local_type || undefined,
        dscHead: row.ead3_dsc_head || undefined,
        digitalObjectCount: row.ead3_digital_object_count,
      },
      categoryId: row.category_id,
      tags: row.tag_ids ? row.tag_ids.split(",") : [],
      customName: row.custom_name,
      note: row.note || undefined,
      url: row.url,
      createdAt: row.created_at,
    };
  }
}
