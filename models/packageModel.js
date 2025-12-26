const db = require('../database/db');

const getAllPackages = (callback) => {
  db.all("SELECT * FROM packages", [], callback);
};

const getPackageById = (id, callback) => {
  db.get("SELECT * FROM packages WHERE id = ?", [id], callback);
};

const createPackage = (data, callback) => {
  const {
    namaPaket, tanggalBerangkat, jumlahJamaah, program,
    currencyUsed, hotels, accommodations, logistics
  } = data;
  db.run(
    `INSERT INTO packages (namaPaket, tanggalBerangkat, jumlahJamaah, program, currencyUsed, hotels, accommodations, logistics)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      namaPaket, tanggalBerangkat, jumlahJamaah, program,
      currencyUsed, JSON.stringify(hotels), JSON.stringify(accommodations), JSON.stringify(logistics)
    ],
    function (err) {
      callback(err, { id: this.lastID });
    }
  );
};

const updatePackage = (id, data, callback) => {
  const {
    namaPaket, tanggalBerangkat, jumlahJamaah, program,
    currencyUsed, hotels, accommodations, logistics
  } = data;
  db.run(
    `UPDATE packages SET namaPaket=?, tanggalBerangkat=?, jumlahJamaah=?, program=?, currencyUsed=?, hotels=?, accommodations=?, logistics=?
     WHERE id=?`,
    [
      namaPaket, tanggalBerangkat, jumlahJamaah, program,
      currencyUsed, JSON.stringify(hotels), JSON.stringify(accommodations), JSON.stringify(logistics),
      id
    ],
    callback
  );
};

const deletePackage = (id, callback) => {
  db.run(`DELETE FROM packages WHERE id=?`, [id], callback);
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};
