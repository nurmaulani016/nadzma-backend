// routes/accommodations.js
import express from "express";

const accommodationsRoute = (db) => {
  const router = express.Router();

  // ====== GET semua akomodasi ======
  router.get("/", (req, res) => {
    const sql = "SELECT * FROM accommodations ORDER BY id DESC";
    db.all(sql, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // ====== GET akomodasi berdasarkan package_id ======
  router.get("/package/:package_id", (req, res) => {
    const { package_id } = req.params;
    const sql = "SELECT * FROM accommodations WHERE package_id = ?";
    db.all(sql, [package_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // ====== POST tambah akomodasi ======
  router.post("/", (req, res) => {
    const { package_id, name, price, qty, pax, checked } = req.body;

    if (!package_id || !name) {
      return res.status(400).json({ error: "Field wajib belum lengkap." });
    }

    const sql = `
      INSERT INTO accommodations (package_id, name, price, qty, pax, checked)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [package_id, name, price, qty, pax, checked ? 1 : 0],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          id: this.lastID,
          package_id,
          name,
          price,
          qty,
          pax,
          checked,
        });
      }
    );
  });

  // ====== PUT update akomodasi ======
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, qty, pax, checked } = req.body;

    const sql = `
      UPDATE accommodations
      SET name = ?, price = ?, qty = ?, pax = ?, checked = ?
      WHERE id = ?
    `;

    db.run(sql, [name, price, qty, pax, checked ? 1 : 0, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Akomodasi berhasil diperbarui." });
    });
  });

  // ====== DELETE akomodasi berdasarkan package_id (UNTUK EDIT PACKAGE) ======
  router.delete("/by-package/:package_id", (req, res) => {
    const { package_id } = req.params;

    const sql = "DELETE FROM accommodations WHERE package_id = ?";
    db.run(sql, [package_id], function (err) {
      if (err) {
        console.error("❌ Gagal hapus akomodasi by package:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "✅ Semua akomodasi package berhasil dihapus",
        affectedRows: this.changes,
      });
    });
  });

  // ====== DELETE akomodasi ======
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM accommodations WHERE id = ?", [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Akomodasi berhasil dihapus." });
    });
  });

  return router;
};

export default accommodationsRoute;
