// db.js
import sqlite3 from "sqlite3";
sqlite3.verbose();

export function initDb() {
  const db = new sqlite3.Database("./umroh.db", (err) => {
    if (err) {
      console.error("❌ Gagal konek DB:", err.message);
    } else {
      console.log("✅ Connected to SQLite database.");
    }
  });

  db.serialize(() => {
    // =============================
    // 1️⃣ TABLE PACKAGES
    // =============================
    db.run(`
      CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        departure_date TEXT,
        jamaah_count INTEGER,
        program_days INTEGER,
        currency_used TEXT DEFAULT 'SAR',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // =============================
    // 2️⃣ TABLE HOTELS
    // =============================
    db.run(`
      CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_id INTEGER NOT NULL,
        country TEXT,
        name TEXT NOT NULL,
        checkin TEXT,
        checkout TEXT,
        nights INTEGER DEFAULT 0,
        price_double REAL DEFAULT 0,
        price_triple REAL DEFAULT 0,
        price_quad REAL DEFAULT 0,
        unit_room INTEGER DEFAULT 0,
        currency TEXT DEFAULT 'SAR',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(package_id) REFERENCES packages(id) ON DELETE CASCADE
      )
    `);

    // =============================
    // 3️⃣ TABLE ACCOMMODATIONS
    // =============================
    db.run(`
      CREATE TABLE IF NOT EXISTS accommodations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price REAL DEFAULT 0,
        qty INTEGER DEFAULT 0,
        pax INTEGER DEFAULT 0,
        subtotal REAL DEFAULT 0,
        checked INTEGER DEFAULT 0,
        currency TEXT DEFAULT 'SAR',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(package_id) REFERENCES packages(id) ON DELETE CASCADE
      )
    `);

    // =============================
    // 4️⃣ TABLE COST LOGISTICS
    // =============================
    db.run(`
      CREATE TABLE IF NOT EXISTS cost_logistics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_id INTEGER NOT NULL,
        unit TEXT NOT NULL,
        price REAL DEFAULT 0,
        checked INTEGER DEFAULT 0,
        currency TEXT DEFAULT 'SAR',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(package_id) REFERENCES packages(id) ON DELETE CASCADE
      )
    `);

    // =============================
    // 5️⃣ TRIGGERS: Auto Update Timestamp
    // =============================
    const tables = ["packages", "hotels", "accommodations", "cost_logistics"];
    tables.forEach((table) => {
      db.run(`
        CREATE TRIGGER IF NOT EXISTS update_${table}_updated_at
        AFTER UPDATE ON ${table}
        BEGIN
          UPDATE ${table} SET updated_at = datetime('now') WHERE id = NEW.id;
        END;
      `);
    });

    console.log("📦 Semua tabel dan trigger siap digunakan.");
  });

  return db;
}
