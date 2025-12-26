const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ===============================================
// GET ALL PACKAGES → untuk Dashboard
// ===============================================
router.get("/", (req, res) => {
  const sql = "SELECT * FROM packages ORDER BY id DESC";

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = rows.map((p) => ({
      id: p.id,
      name: p.name,
      departure_date: p.departure_date,
      jamaah_count: p.jamaah_count,
      program_days: p.program_days,
      currency_used: p.currency_used || "-",
    }));

    res.json(formatted);
  });
});

// ===============================================
// GET FULL ALL PACKAGES
// ===============================================
router.get("/full/all", (req, res) => {
  const sql = "SELECT * FROM packages ORDER BY id DESC";

  db.all(sql, [], (err, packages) => {
    if (err) return res.status(500).json({ error: err.message });

    if (packages.length === 0) return res.json([]);

    let done = 0;
    const result = [];

    packages.forEach((pkg) => {
      db.all(
        "SELECT * FROM hotels WHERE packageId = ?",
        [pkg.id],
        (err, hotels) => {
          if (err) hotels = [];

          db.all(
            "SELECT * FROM accommodations WHERE packageId = ?",
            [pkg.id],
            (err, acc) => {
              if (err) acc = [];

              db.all(
                "SELECT * FROM cost_logistics WHERE packageId = ?",
                [pkg.id],
                (err, log) => {
                  if (err) log = [];

                  result.push({
                    packageData: {
                      id: pkg.id,
                      name: pkg.name,
                      departure_date: pkg.departure_date,
                      jamaah_count: pkg.jamaah_count,
                      program_days: pkg.program_days,
                      currency_used: pkg.currency_used,
                    },
                    hotels,
                    accommodations: acc,
                    logistics: log,
                  });

                  done++;
                  if (done === packages.length) res.json(result);
                }
              );
            }
          );
        }
      );
    });
  });
});

// ===============================================
// GET ONE FULL PACKAGE (EDIT)
// ===============================================
router.get("/:id/full", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM packages WHERE id = ?", [id], (err, pkg) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!pkg) return res.status(404).json({ error: "Package tidak ditemukan" });

    db.all("SELECT * FROM hotels WHERE packageId = ?", [id], (err, hotels) => {
      if (err) hotels = [];

      db.all(
        "SELECT * FROM accommodations WHERE packageId = ?",
        [id],
        (err, acc) => {
          if (err) acc = [];

          db.all(
            "SELECT * FROM cost_logistics WHERE packageId = ?",
            [id],
            (err, log) => {
              if (err) log = [];

              res.json({
                packageData: {
                  id: pkg.id,
                  name: pkg.name,
                  departure_date: pkg.departure_date,
                  jamaah_count: pkg.jamaah_count,
                  program_days: pkg.program_days,
                  currency_used: pkg.currency_used,
                },
                hotels,
                accommodations: acc,
                logistics: log,
              });
            }
          );
        }
      );
    });
  });
});

// ===============================================
// GET BASIC PACKAGE BY ID
// ===============================================
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM packages WHERE id = ?", [id], (err, p) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!p) return res.status(404).json({ error: "Package tidak ditemukan" });

    res.json({
      id: p.id,
      name: p.name,
      departure_date: p.departure_date,
      jamaah_count: p.jamaah_count,
      program_days: p.program_days,
      currency_used: p.currency_used,
    });
  });
});

// ====== GET package lengkap (UNTUK EDIT) ======
router.get("/:id/full", (req, res) => {
  const { id } = req.params;

  const packageSql = "SELECT * FROM packages WHERE id = ?";
  const hotelsSql = "SELECT * FROM hotels WHERE package_id = ?";
  const accommodationsSql = "SELECT * FROM accommodations WHERE package_id = ?";
  const logisticsSql = "SELECT * FROM cost_logistics WHERE package_id = ?";

  db.get(packageSql, [id], (err, packageData) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!packageData)
      return res.status(404).json({ error: "Paket tidak ditemukan" });

    db.all(hotelsSql, [id], (err, hotels) => {
      if (err) return res.status(500).json({ error: err.message });

      db.all(accommodationsSql, [id], (err, accommodations) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(logisticsSql, [id], (err, logistics) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            packageData,
            hotels,
            accommodations,
            logistics,
          });
        });
      });
    });
  });
});

// ===============================================
// INSERT PACKAGE
// ===============================================
router.post("/", (req, res) => {
  const { name, departure_date, jamaah_count, program_days, currency_used } =
    req.body;

  const sql = `
    INSERT INTO packages (name, departure_date, jamaah_count, program_days, currency_used)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, departure_date, jamaah_count, program_days, currency_used],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ id: this.lastID, message: "Package berhasil dibuat" });
    }
  );
});

// ===============================================
// UPDATE PACKAGE
// ===============================================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, departure_date, jamaah_count, program_days, currency_used } =
    req.body;

  const sql = `
    UPDATE packages
    SET name = ?, departure_date = ?, jamaah_count = ?, program_days = ?, currency_used = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [name, departure_date, jamaah_count, program_days, currency_used, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Package berhasil diupdate" });
    }
  );
});

// ===============================================
// DELETE ONE
// ===============================================
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM packages WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Package terhapus" });
  });
});

// ===============================================
module.exports = router;
