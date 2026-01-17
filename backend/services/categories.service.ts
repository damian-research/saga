import { Database } from "better-sqlite3";
import { BookmarkCategory } from "../../src/api/models/bookmarks.types";

interface CategoryRow {
  id: string;
  name: string;
  order: number;
  color: string | null;
  created_at: string;
}

export class CategoriesService {
  constructor(private db: Database) {}

  getAll(): BookmarkCategory[] {
    const rows = this.db
      .prepare('SELECT * FROM categories ORDER BY "order" ASC')
      .all() as CategoryRow[];
    return rows.map(this.rowToCategory);
  }

  getById(id: string): BookmarkCategory | null {
    const row = this.db
      .prepare("SELECT * FROM categories WHERE id = ?")
      .get(id) as CategoryRow | undefined;
    return row ? this.rowToCategory(row) : null;
  }

  create(category: BookmarkCategory): BookmarkCategory {
    const now = new Date().toISOString();

    this.db
      .prepare(
        `
      INSERT INTO categories (id, name, "order", color, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
      )
      .run(
        category.id,
        category.name,
        category.order,
        category.color || null,
        now,
      );

    return { ...category, createdAt: now };
  }

  update(id: string, updates: Partial<BookmarkCategory>): void {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.order !== undefined) {
      fields.push('"order" = ?');
      values.push(updates.order);
    }
    if (updates.color !== undefined) {
      fields.push("color = ?");
      values.push(updates.color);
    }

    if (fields.length > 0) {
      this.db
        .prepare(`UPDATE categories SET ${fields.join(", ")} WHERE id = ?`)
        .run(...values, id);
    }
  }

  delete(id: string): void {
    this.db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  }

  reorder(categoryIds: string[]): void {
    const stmt = this.db.prepare(
      'UPDATE categories SET "order" = ? WHERE id = ?',
    );
    categoryIds.forEach((id, index) => {
      stmt.run(index, id);
    });
  }

  private rowToCategory(row: CategoryRow): BookmarkCategory {
    return {
      id: row.id,
      name: row.name,
      order: row.order,
      color: row.color || undefined,
      createdAt: row.created_at,
    };
  }
}
