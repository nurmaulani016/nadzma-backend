// initDB.js
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDb = async () => {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, "umroh.db");
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("❌ Gagal koneksi database:", err.message);
        reject(err);
      } else {
        console.log("✅ Terhubung ke SQLite database");

        // ====== TABEL PACKAGES ======
        db.run(
          `CREATE TABLE IF NOT EXISTS packages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            jamaah_count INTEGER NOT NULL,
            program_days INTEGER NOT NULL,
            departure_date TEXT NOT NULL,
            currency_used TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )`,
          (err) => {
            if (err)
              console.error("❌ Gagal membuat tabel packages:", err.message);
          }
        );

        // ====== TABEL HOTELS ======
        db.run(
            `CREATE TABLE IF NOT EXISTS hotels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            package_id INTEGER,
            country TEXT,
            name TEXT,
            checkin TEXT,
            checkout TEXT,
            nights INTEGER,
            price_double REAL,
            price_triple REAL,
            price_quad REAL,
            unit_room INTEGER
            total_price REAL,
            price_per_person REAL,
            FOREIGN KEY(package_id) REFERENCES packages(id) ON DELETE CASCADE
          )`,
          (err) => {
            if (err)
              console.error("❌ Gagal membuat tabel hotels:", err.message);
          }
        );

        // ====== TABEL ACCOMMODATIONS ======
        db.run(
          `CREATE TABLE IF NOT EXISTS accommodations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            package_id INTEGER,
            name TEXT,
            price REAL,
            qty INTEGER,
            pax INTEGER,
            subtotal REAL,
            currency TEXT,
            FOREIGN KEY(package_id) REFERENCES packages(id) ON DELETE CASCADE
          )`,
          (err) => {
            if (err)
              console.error(
                "❌ Gagal membuat tabel accommodations:",
                err.message
              );
          }
        );

        // ====== TABEL COST_LOGISTICS ======
        db.run(
          `CREATE TABLE IF NOT EXISTS cost_logistics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            package_id INTEGER,
            name TEXT,
            price REAL,
            qty INTEGER,
            subtotal REAL,
            currency TEXT,
            FOREIGN KEY(package_id) REFERENCES packages(id) ON DELETE CASCADE
          )`,
          (err) => {
            if (err)
              console.error(
                "❌ Gagal membuat tabel cost_logistics:",
                err.message
              );
          }
        );

        resolve(db);
      }
    });
  });
};
