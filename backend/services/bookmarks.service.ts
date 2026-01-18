// backend/services/bookmarks.service.ts

import { Database } from "better-sqlite3";
import { Bookmark } from "../../src/api/models/bookmarks.types";
import { TagsService } from "./tags.service";

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
  constructor(
    private db: Database,
    private tagsService?: TagsService,
  ) {}

  async getAll(): Promise<Bookmark[]> {
    const stmt = this.db.prepare(`
      SELECT b.*, GROUP_CONCAT(bt.tag_id) as tag_ids
      FROM bookmarks b
      LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `);

    const rows = stmt.all() as BookmarkRow[];

    // Load tags once for all bookmarks
    const allTags = this.tagsService ? await this.tagsService.getAll() : [];
    const tagMap = new Map(allTags.map((t) => [t.id, t.name]));

    return rows.map((row) => this.rowToBookmark(row, tagMap));
  }

  async getById(id: string): Promise<Bookmark | null> {
    const stmt = this.db.prepare(`
      SELECT b.*, GROUP_CONCAT(bt.tag_id) as tag_ids
      FROM bookmarks b
      LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
      WHERE b.id = ?
      GROUP BY b.id
    `);

    const row = stmt.get(id) as BookmarkRow | undefined;
    if (!row) return null;

    const allTags = this.tagsService ? await this.tagsService.getAll() : [];
    const tagMap = new Map(allTags.map((t) => [t.id, t.name]));

    return this.rowToBookmark(row, tagMap);
  }

  async create(bookmark: Bookmark): Promise<Bookmark> {
    const now = new Date().toISOString();
    let { tags, ...data } = bookmark;

    if (tags && tags.length > 0 && this.tagsService) {
      tags = await this.resolveTagIds(tags, this.tagsService);
    }

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

    return { ...bookmark, tags, createdAt: now };
  }

  async update(id: string, updates: Partial<Bookmark>): Promise<void> {
    let { tags, ...data } = updates;

    if (tags !== undefined && this.tagsService) {
      tags = await this.resolveTagIds(tags, this.tagsService);
      this.setTags(id, tags);
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      fields.push("title = ?");
      values.push(data.title);
    }
    if (data.customName !== undefined) {
      fields.push("custom_name = ?");
      values.push(data.customName);
    }
    if (data.note !== undefined) {
      fields.push("note = ?");
      values.push(data.note);
    }
    if (data.categoryId !== undefined) {
      fields.push("category_id = ?");
      values.push(data.categoryId);
    }

    if (fields.length > 0) {
      this.db
        .prepare(`UPDATE bookmarks SET ${fields.join(", ")} WHERE id = ?`)
        .run(...values, id);
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

  private rowToBookmark(
    row: BookmarkRow,
    tagMap: Map<string, string>,
  ): Bookmark {
    const tagIds = row.tag_ids ? row.tag_ids.split(",") : [];
    const tagNames = tagIds
      .map((id) => tagMap.get(id))
      .filter((name): name is string => name !== undefined);

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
      tags: tagNames,
      customName: row.custom_name,
      note: row.note || undefined,
      url: row.url,
      createdAt: row.created_at,
    };
  }

  private async resolveTagIds(
    tagNamesOrIds: string[],
    tagsService: TagsService,
  ): Promise<string[]> {
    const tagIds: string[] = [];
    const allTags = await tagsService.getAll();

    for (const value of tagNamesOrIds) {
      if (value.includes("-")) {
        const exists = allTags.find((t) => t.id === value);
        if (exists) {
          tagIds.push(value);
        }
        continue;
      }

      const normalized = value.toLowerCase();
      let tag = allTags.find((t) => t.name === normalized);

      if (!tag) {
        tag = await tagsService.create({
          id: crypto.randomUUID(),
          name: normalized,
          label: value,
          createdAt: new Date().toISOString(),
        });
      }

      tagIds.push(tag.id);
    }

    return tagIds;
  }
}
