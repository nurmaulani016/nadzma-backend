export function createPackage(db, pkg) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT INTO packages (name, departure_date, jamaah_count, program_days, currency_used)
                             VALUES (?, ?, ?, ?, ?)`);
    stmt.run(
      pkg.name,
      pkg.departure_date || null,
      pkg.jamaah_count || 0,
      pkg.program_days || 0,
      pkg.currency_used || "SAR",
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

export function updatePackage(db, id, pkg) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`UPDATE packages SET name=?, departure_date=?, jamaah_count=?, program_days=?, currency_used=? WHERE id=?`);
    stmt.run(
      pkg.name,
      pkg.departure_date || null,
      pkg.jamaah_count || 0,
      pkg.program_days || 0,
      pkg.currency_used || "SAR",
      id,
      function (err) {
        if (err) return reject(err);
        resolve(id);
      }
    );
  });
}

export function getAllPackages(db) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM packages ORDER BY id DESC`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function getPackageById(db, id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM packages WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function deletePackage(db, id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM packages WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve({ deleted: this.changes });
    });
  });
}