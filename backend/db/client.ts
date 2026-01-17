import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import fs from "fs";

let db: Database.Database | null = null;

export function initDatabase(): Database.Database {
  const userDataPath = app.getPath("userData");
  const dbPath = path.join(userDataPath, "saga.db");

  // Ensure directory exists
  fs.mkdirSync(userDataPath, { recursive: true });

  db = new Database(dbPath, { verbose: console.log });
  db.pragma("journal_mode = WAL");

  return db;
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
