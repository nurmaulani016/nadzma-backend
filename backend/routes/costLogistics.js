// routes/costLogistics.js
import express from "express";

const costLogisticsRoute = (db) => {
  const router = express.Router();

  // ==========================
  // ✅ GET semua data cost logistics
  // ==========================
  router.get("/", (req, res) => {
    db.all("SELECT * FROM cost_logistics", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // ==========================
  // ✅ GET data berdasarkan package_id
  // ==========================
  router.get("/package/:package_id", (req, res) => {
    const { package_id } = req.params;
    db.all(
      "SELECT * FROM cost_logistics WHERE package_id = ?",
      [package_id],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  // ==========================
  // ✅ GET data berdasarkan id
  // ==========================
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM cost_logistics WHERE id = ?", [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json(row);
    });
  });

  // ==========================
  // ✅ POST data baru
  // ==========================
  router.post("/", (req, res) => {
    const { package_id, unit, price, checked } = req.body;
    if (!package_id || !unit)
      return res.status(400).json({ error: "Field wajib belum lengkap." });

    const sql = `
        INSERT INTO cost_logistics (package_id, unit, price, checked)
        VALUES (?, ?, ?, ?)
      `;

    db.run(sql, [package_id, unit, price, checked ? 1 : 0], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        package_id,
        unit,
        price,
        checked,
      });
    });
  });

  // ==========================
  // ✅ PUT update data
  // ==========================
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { unit, price, checked } = req.body;

    const sql = `
        UPDATE cost_logistics
        SET unit = ?, price = ?, checked = ?
        WHERE id = ?
      `;

    db.run(sql, [unit, price, checked ? 1 : 0, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: "✅ Data berhasil diperbarui",
        changes: this.changes,
      });
    });
  });

  // ==========================
  // 🗑️ DELETE semua data cost logistics berdasarkan package_id (UNTUK EDIT PACKAGE)
  // ==========================
  router.delete("/by-package/:package_id", (req, res) => {
    const { package_id } = req.params;

    const sql = "DELETE FROM cost_logistics WHERE package_id = ?";
    db.run(sql, [package_id], function (err) {
      if (err) {
        console.error("❌ Gagal hapus cost logistics by package:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "✅ Semua cost logistics package berhasil dihapus",
        affectedRows: this.changes,
      });
    });
  });

  // ==========================
  // ✅ DELETE data
  // ==========================
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM cost_logistics WHERE id = ?", [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "🗑️ Data berhasil dihapus", deleted: this.changes });
    });
  });

  return router;
};

export default costLogisticsRoute;
