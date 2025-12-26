const db = require("../db");

// =========================
// 📦 GET SEMUA PAKET
// =========================
exports.getPackages = (req, res) => {
  db.all("SELECT * FROM packages", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const parsedRows = rows.map((pkg) => ({
      ...pkg,
      hotels: pkg.hotels ? JSON.parse(pkg.hotels) : [],
      accommodations: pkg.accommodations ? JSON.parse(pkg.accommodations) : [],
      costLogistics: pkg.costLogistics ? JSON.parse(pkg.costLogistics) : [],
    }));

    res.json(parsedRows);
  });
};

// =========================
// 📦 GET PAKET BERDASARKAN ID
// =========================
exports.getPackageById = (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM packages WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Paket tidak ditemukan" });

    const parsedRow = {
      ...row,
      hotels: row.hotels ? JSON.parse(row.hotels) : [],
      accommodations: row.accommodations ? JSON.parse(row.accommodations) : [],
      costLogistics: row.costLogistics ? JSON.parse(row.costLogistics) : [],
    };

    res.json(parsedRow);
  });
};

// =========================
// 📦 TAMBAH / SIMPAN PAKET
// =========================
exports.addPackage = (req, res) => {
  const {
    id,
    namaPaket,
    tanggalBerangkat,
    jumlahJamaah,
    program,
    hotels,
    accommodations,
    costLogistics,
    currencyUsed,
  } = req.body;

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO packages (
      id, namaPaket, tanggalBerangkat, jumlahJamaah, program,
      hotels, accommodations, costLogistics, currencyUsed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    namaPaket,
    tanggalBerangkat,
    jumlahJamaah,
    program,
    JSON.stringify(hotels || []),
    JSON.stringify(accommodations || []),
    JSON.stringify(costLogistics || []),
    currencyUsed,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Paket berhasil disimpan" });
    }
  );
};

// =========================
// ✏️ UPDATE PAKET (EDIT)
// =========================
exports.updatePackage = (req, res) => {
  const { id } = req.params;
  const {
    namaPaket,
    tanggalBerangkat,
    jumlahJamaah,
    program,
    hotels,
    accommodations,
    costLogistics,
    currencyUsed,
  } = req.body;

  const query = `
    UPDATE packages
    SET namaPaket = ?, tanggalBerangkat = ?, jumlahJamaah = ?, program = ?,
        hotels = ?, accommodations = ?, costLogistics = ?, currencyUsed = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [
      namaPaket,
      tanggalBerangkat,
      jumlahJamaah,
      program,
      JSON.stringify(hotels || []),
      JSON.stringify(accommodations || []),
      JSON.stringify(costLogistics || []),
      currencyUsed,
      id,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Paket tidak ditemukan" });

      res.json({ message: "Paket berhasil diperbarui" });
    }
  );
};

// =========================
// 🗑️ HAPUS PAKET BERDASARKAN ID
// =========================
exports.deletePackage = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM packages WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Paket berhasil dihapus" });
  });
};

// =========================
// 🗑️ HAPUS SEMUA PAKET
// =========================
exports.deleteAllPackages = (req, res) => {
  db.run("DELETE FROM packages", function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Semua paket berhasil dihapus" });
  });
};