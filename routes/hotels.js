// routes/hotels.js
import express from "express";

const hotelsRoute = (db) => {
  const router = express.Router();

  // ====== GET semua hotel ======
  router.get("/", (req, res) => {
    const sql = "SELECT * FROM hotels ORDER BY id DESC";
    db.all(sql, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // ====== GET hotel berdasarkan package_id ======
  router.get("/package/:package_id", (req, res) => {
    const { package_id } = req.params;
    const sql = "SELECT * FROM hotels WHERE package_id = ?";
    db.all(sql, [package_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // ====== POST satu hotel ======
  router.post("/", (req, res) => {
    console.log("🏨 Data hotel diterima:", req.body);

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
      unit_room,
      currency,
    } = req.body;

    if (!package_id || !name || !checkin || !checkout) {
      return res.status(400).json({ error: "Field wajib belum lengkap." });
    }

    const sql = `
      INSERT INTO hotels 
      (package_id, country, name, checkin, checkout, nights, 
       price_double, price_triple, price_quad, unit_room, currency)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
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
        unit_room,
        currency,
      ],
      function (err) {
        if (err) {
          console.error("❌ Gagal menyimpan hotel:", err.message);
          return res.status(500).json({ error: err.message });
        }

        console.log("✅ Hotel berhasil disimpan dengan ID:", this.lastID);
        res.json({
          id: this.lastID,
          package_id,
          country,
          name,
          checkin,
          checkout,
          nights,
          price_double,
          price_triple,
          price_quad,
          unit_room,
          currency,
        });
      }
    );
  });

  // ====== POST banyak hotel sekaligus (untuk AddPackage) ======
  router.post("/bulk", (req, res) => {
    const hotels = req.body.hotels || [];
    console.log("📦 Bulk hotel diterima:", hotels.length, "item");

    if (!Array.isArray(hotels) || hotels.length === 0) {
      return res.status(400).json({ error: "Data hotel kosong." });
    }

    const sql = `
      INSERT INTO hotels (
        package_id, country, name, checkin, checkout, nights, 
        price_double, price_triple, price_quad, unit_room, currency
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const stmt = db.prepare(sql);

    hotels.forEach((h) => {
      stmt.run([
        h.package_id,
        h.country,
        h.name,
        h.checkin,
        h.checkout,
        h.nights,
        h.price_double,
        h.price_triple,
        h.price_quad,
        h.unit_room,
        h.currency,
      ]);
    });

    stmt.finalize((err) => {
      if (err) return res.status(500).json({ error: err.message });
      console.log("✅ Semua hotel berhasil disimpan (bulk).");
      res.json({ message: "✅ Semua hotel berhasil disimpan." });
    });
  });

  // ====== PUT update hotel ======
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const {
      country,
      name,
      checkin,
      checkout,
      nights,
      price_double,
      price_triple,
      price_quad,
      unit_room,
      currency,
    } = req.body;

    const sql = `
      UPDATE hotels
      SET country = ?, name = ?, checkin = ?, checkout = ?, nights = ?,
          price_double = ?, price_triple = ?, price_quad = ?, unit_room = ?, currency = ?
      WHERE id = ?
    `;

    db.run(
      sql,
      [
        country,
        name,
        checkin,
        checkout,
        nights,
        price_double,
        price_triple,
        price_quad,
        unit_room,
        currency,
        id,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ Hotel berhasil diperbarui." });
      }
    );
  });
  // ====== DELETE hotel berdasarkan package_id (UNTUK EDIT PACKAGE) ======
  router.delete("/by-package/:package_id", (req, res) => {
    const { package_id } = req.params;

    const sql = "DELETE FROM hotels WHERE package_id = ?";
    db.run(sql, [package_id], function (err) {
      if (err) {
        console.error("❌ Gagal hapus hotel by package:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "✅ Semua hotel package berhasil dihapus",
        affectedRows: this.changes,
      });
    });
  });

  // ====== DELETE hotel ======
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM hotels WHERE id = ?", [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Hotel berhasil dihapus." });
    });
  });

  // ====== DELETE semua hotel (reset data) ======
  router.delete("/", (req, res) => {
    db.run("DELETE FROM hotels", [], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Semua hotel berhasil dihapus." });
    });
  });

  return router;
};

export default hotelsRoute;
