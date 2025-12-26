// backend/database/db.js
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function initDb() {
  // Simpan database di folder backend/database
  const dbPath = path.join(__dirname, "../umroh.db");
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("❌ Gagal konek DB:", err.message);
    } else {
      console.log("✅ Connected to SQLite database.");
    }
  });

  // Tabel Packages
  db.run(`CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    namaPaket TEXT,
    tanggalBerangkat TEXT,
    jumlahJamaah INTEGER,
    program TEXT,
    currencyUsed TEXT
  )`);

  // Tabel Hotels
  db.run(`CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER,
    country TEXT,
    hotelName TEXT,
    checkIn TEXT,
    checkOut TEXT,
    nights INTEGER,
    double TEXT,
    triple TEXT,
    quad TEXT,
    FOREIGN KEY(package_id) REFERENCES packages(id) ON DELETE CASCADE
  )`);

  // Tabel Accommodations
  db.run(`CREATE TABLE IF NOT EXISTS accommodations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER,
    name TEXT,
    price REAL,
    qty INTEGER,
    pax INTEGER,
    selected INTEGER,
    FOREIGN KEY(package_id) REFERENCES packages(id) ON DELETE CASCADE
  )`);

  // Tabel Cost Logistics
  db.run(`CREATE TABLE IF NOT EXISTS cost_logistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER,
    unit TEXT,
    price REAL,
    checked INTEGER,
    FOREIGN KEY(package_id) REFERENCES packages(id) ON DELETE CASCADE
  )`);

  return db;
}
