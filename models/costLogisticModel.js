export const getAllCostLogistics = (db) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM cost_logistics", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getCostLogisticById = (db, id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM cost_logistics WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const createCostLogistic = (db, data) => {
  const { unit, price, checked } = data;
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO cost_logistics (unit, price, checked) VALUES (?, ?, ?)",
      [unit, price, checked ? 1 : 0],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      }
    );
  });
};

export const updateCostLogistic = (db, id, data) => {
  const { unit, price, checked } = data;
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE cost_logistics SET unit = ?, price = ?, checked = ? WHERE id = ?",
      [unit, price, checked ? 1 : 0, id],
      function (err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      }
    );
  });
};

export const deleteCostLogistic = (db, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM cost_logistics WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve({ success: true });
    });
  });
};
