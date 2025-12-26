export function createAccommodation(db, packageId, item) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT INTO accommodations (package_id, name, price, qty, pax, checked)
                             VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(
      packageId,
      item.name,
      parseFloat(item.price || 0),
      parseInt(item.qty || 0),
      parseInt(item.pax || 0),
      item.checked ? 1 : 0,
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

export function getAccommodationsByPackage(db, packageId) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM accommodations WHERE package_id = ?`, [packageId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function deleteAccommodationsByPackage(db, packageId) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM accommodations WHERE package_id = ?`, [packageId], function (err) {
      if (err) return reject(err);
      resolve({ deleted: this.changes });
    });
  });
}