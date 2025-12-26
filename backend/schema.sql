-- ==========================================================
-- DROP TABLES (bersihkan sebelum membuat ulang)
-- ==========================================================
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS accommodations;
DROP TABLE IF EXISTS cost_logistics;

-- ==========================================================
-- TABEL PACKAGES (BASIC INFO)
-- Sesuai backend:
-- name, departure_date, jamaah_count, program_days, currency_used
-- ==========================================================
CREATE TABLE packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  departure_date TEXT,
  jamaah_count INTEGER,
  program_days INTEGER,
  currency_used TEXT
);

-- ==========================================================
-- TABEL HOTELS
-- Digunakan untuk Section Tambah Hotel
-- packageId adalah foreign key manual (SQLite tidak wajib strict)
-- ==========================================================
CREATE TABLE hotels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  packageId INTEGER,

  hotelName TEXT,
  country TEXT,
  checkIn TEXT,
  checkOut TEXT,
  nights INTEGER,

  -- kamar
  double_price REAL,
  double_unit INTEGER,
  double_total REAL,

  triple_price REAL,
  triple_unit INTEGER,
  triple_total REAL,

  quad_price REAL,
  quad_unit INTEGER,
  quad_total REAL,

  currency TEXT
);

-- ==========================================================
-- TABEL ACCOMMODATIONS
-- Digunakan untuk Section 3 Akomodasi
-- ==========================================================
CREATE TABLE accommodations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  packageId INTEGER,

  name TEXT,
  price REAL,
  qty INTEGER,
  pax INTEGER,
  subtotal REAL,
  currency TEXT
);

-- ==========================================================
-- TABEL COST LOGISTICS
-- Section biaya lainnya
-- ==========================================================
CREATE TABLE cost_logistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  packageId INTEGER,

  name TEXT,
  price REAL,
  qty INTEGER,
  subtotal REAL,
  currency TEXT
);
