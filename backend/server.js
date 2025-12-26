import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== KONEKSI DATABASE =====
let db;
(async () => {
  db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  // ====== BUAT TABEL JIKA BELUM ADA ======
  await db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      departure_date TEXT,
      jamaah_count INTEGER,
      program_days INTEGER,
      currency_used TEXT
    );
  `);

  await db.exec(`
  CREATE TABLE IF NOT EXISTS hotels (
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

    unit_double INTEGER DEFAULT 0,
    unit_triple INTEGER DEFAULT 0,
    unit_quad INTEGER DEFAULT 0
  );
`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS accommodations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER,
      name TEXT,
      price REAL,
      qty INTEGER,
      pax INTEGER,
      checked INTEGER
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cost_logistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER,
      name TEXT,
      price REAL,
      qty INTEGER,
      pax INTEGER,
      checked INTEGER
    );
  `);
})();

// =============== ROUTES ===============
app.get("/", (req, res) => res.send("✅ Backend aktif"));

// ===== POST: Tambah data =====
app.post("/api/packages", async (req, res) => {
  const { name, departure_date, jamaah_count, program_days, currency_used } =
    req.body;
  const result = await db.run(
    `INSERT INTO packages (name, departure_date, jamaah_count, program_days, currency_used)
     VALUES (?, ?, ?, ?, ?)`,
    [name, departure_date, jamaah_count, program_days, currency_used]
  );
  res.json({ id: result.lastID });
});

app.post("/api/hotels", async (req, res) => {
  const {
    package_id,
    country,
    name,
    checkin,
    checkout,
    nights,
    price_double,
    price_triple,
    price_quad,
    unit_double,
    unit_triple,
    unit_quad,
  } = req.body;

  const result = await db.run(
    `INSERT INTO hotels (
      package_id, country, name, checkin, checkout, nights,
      price_double, price_triple, price_quad,
      unit_double, unit_triple, unit_quad
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      package_id,
      country,
      name,
      checkin,
      checkout,
      nights,
      price_double,
      price_triple,
      price_quad,
      unit_double,
      unit_triple,
      unit_quad,
    ]
  );

  res.json({ id: result.lastID });
});

app.post("/api/accommodations", async (req, res) => {
  const { package_id, name, price, qty, pax, checked } = req.body;
  const result = await db.run(
    `INSERT INTO accommodations (package_id, name, price, qty, pax, checked)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [package_id, name, price, qty, pax, checked]
  );
  res.json({ id: result.lastID });
});

app.post("/api/cost-logistics", async (req, res) => {
  const { package_id, name, price, qty, pax, checked } = req.body;
  const result = await db.run(
    `INSERT INTO cost_logistics (package_id, name, price, qty, pax, checked)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [package_id, name, price, qty, pax, checked]
  );
  res.json({ id: result.lastID });
});

// ===== GET: Ambil semua package =====
app.get("/api/packages", async (req, res) => {
  const packages = await db.all(`SELECT * FROM packages ORDER BY id DESC`);
  res.json(packages);
});

// ===== GET: FULL PACKAGE (UNTUK EDIT FORM) =====
app.get("/api/packages/:id/full", async (req, res) => {
  const id = req.params.id;

  try {
    const packageData = await db.get(`SELECT * FROM packages WHERE id = ?`, [
      id,
    ]);

    if (!packageData) {
      return res.status(404).json({ message: "Package tidak ditemukan" });
    }

    const hotels = await db.all(`SELECT * FROM hotels WHERE package_id = ?`, [
      id,
    ]);

    const accommodations = await db.all(
      `SELECT * FROM accommodations WHERE package_id = ?`,
      [id]
    );

    const logistics = await db.all(
      `SELECT * FROM cost_logistics WHERE package_id = ?`,
      [id]
    );

    res.json({
      packageData,
      hotels,
      accommodations,
      logistics,
    });
  } catch (err) {
    console.error("❌ Gagal ambil data full:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: Detail package (sederhana) =====
app.get("/api/packages/:id", async (req, res) => {
  const id = req.params.id;

  const pkg = await db.get(`SELECT * FROM packages WHERE id = ?`, [id]);
  if (!pkg) return res.status(404).json({ message: "Package not found" });

  const hotels = await db.all(`SELECT * FROM hotels WHERE package_id = ?`, [
    id,
  ]);
  const accommodations = await db.all(
    `SELECT * FROM accommodations WHERE package_id = ?`,
    [id]
  );
  const logistics = await db.all(
    `SELECT * FROM cost_logistics WHERE package_id = ?`,
    [id]
  );

  res.json({
    ...pkg,
    hotels,
    accommodations,
    logistics,
  });
});

// ===== DELETE: Hapus 1 package =====
app.delete("/api/packages/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await db.run(`DELETE FROM hotels WHERE package_id = ?`, [id]);
    await db.run(`DELETE FROM accommodations WHERE package_id = ?`, [id]);
    await db.run(`DELETE FROM cost_logistics WHERE package_id = ?`, [id]);

    const result = await db.run(`DELETE FROM packages WHERE id = ?`, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Package tidak ditemukan" });
    }

    res.json({ message: "✅ Package dan semua data terkait berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus package:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== DELETE: Hapus semua packages =====
app.delete("/api/packages/deleteAll", async (req, res) => {
  try {
    await db.run(`DELETE FROM hotels`);
    await db.run(`DELETE FROM accommodations`);
    await db.run(`DELETE FROM cost_logistics`);
    await db.run(`DELETE FROM packages`);
    res.json({ message: "✅ Semua packages & data terkait berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal hapus semua data:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: Semua hotel =====
app.get("/api/hotels", async (req, res) => {
  const data = await db.all(`SELECT * FROM hotels`);
  res.json(data);
});

// ===== GET: Semua akomodasi =====
app.get("/api/accommodations", async (req, res) => {
  const data = await db.all(`SELECT * FROM accommodations`);
  res.json(data);
});

// ===== GET: Semua cost logistics =====
app.get("/api/cost-logistics", async (req, res) => {
  const data = await db.all(`SELECT * FROM cost_logistics`);
  res.json(data);
});

// ===== PUT: Update full package (package + hotels + accommodations + logistics) =====
app.put("/api/packages/:id/full", async (req, res) => {
  console.log("REQ BODY:", req.body);

  const id = req.params.id;
  const { packageData, hotels, accommodations, logistics } = req.body;

  try {
    // Update package utama
    await db.run(
      `UPDATE packages
       SET name = ?, departure_date = ?, jamaah_count = ?, program_days = ?, currency_used = ?
       WHERE id = ?`,
      [
        packageData.name,
        packageData.departure_date,
        packageData.jamaah_count,
        packageData.program_days,
        packageData.currency_used,
        id,
      ]
    );

    // Hapus semua data lama relasi dulu
    await db.run(`DELETE FROM hotels WHERE package_id = ?`, [id]);
    await db.run(`DELETE FROM accommodations WHERE package_id = ?`, [id]);
    await db.run(`DELETE FROM cost_logistics WHERE package_id = ?`, [id]);

    // Insert ulang hotels
    for (const h of hotels || []) {
      await db.run(
        `INSERT INTO hotels (
    package_id, country, name, checkin, checkout, nights,
    price_double, price_triple, price_quad,
    unit_double, unit_triple, unit_quad
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          h.country,
          h.name,
          h.checkin,
          h.checkout,
          Number(h.nights) || 0,
          Number(h.price_double) || 0,
          Number(h.price_triple) || 0,
          Number(h.price_quad) || 0,
          Number(h.unit_double) || 0,
          Number(h.unit_triple) || 0,
          Number(h.unit_quad) || 0,
        ]
      );
    }

    // Insert ulang accommodations
    for (const a of accommodations || []) {
      await db.run(
        `INSERT INTO accommodations
     (package_id, name, price, qty, pax, checked)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          a.name,
          Number(a.price) || 0,
          Number(a.qty) || 1,
          Number(a.pax) || 0,
          a.checked ? 1 : 0,
        ]
      );
    }

    // Insert ulang logistics
    for (const l of logistics || []) {
      await db.run(
        `INSERT INTO cost_logistics
     (package_id, name, price, qty, pax, checked)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          l.name,
          Number(l.price) || 0,
          Number(l.qty) || 1,
          Number(l.pax) || 0,
          l.checked ? 1 : 0,
        ]
      );
    }

    res.json({ message: "✅ Paket dan data terkait berhasil diperbarui" });
  } catch (err) {
    console.error("❌ Gagal update paket:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// =============== START SERVER ===============
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
