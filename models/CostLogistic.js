export function createCostLogistic(db, packageId, item) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT INTO cost_logistics (package_id, unit, price, checked)
                             VALUES (?, ?, ?, ?)`);
    stmt.run(
      packageId,
      item.unit,
      parseFloat(item.price || 0),
      item.checked ? 1 : 0,
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

export function getCostLogisticsByPackage(db, packageId) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM cost_logistics WHERE package_id = ?`, [packageId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function deleteCostLogisticsByPackage(db, packageId) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM cost_logistics WHERE package_id = ?`, [packageId], function (err) {
      if (err) return reject(err);
      resolve({ deleted: this.changes });
    });
  });
}