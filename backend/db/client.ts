import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import fs from "fs";

let db: Database.Database | null = null;

export function initDatabase(): Database.Database {
  const isDev = !app.isPackaged;
  const dbName = isDev ? "saga.dev.db" : "saga.db";
  const userDataPath = app.getPath("userData");
  const dbPath = path.join(userDataPath, dbName);

  fs.mkdirSync(userDataPath, { recursive: true });

  // Only verbose in dev
  const options = isDev ? { verbose: console.log } : {};
  db = new Database(dbPath, options);
  db.pragma("journal_mode = WAL");

  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
