// server.js atau index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const packageRoutes = require('./routes/packageRoutes');
const db = require('./db'); // koneksi SQLite
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ======== ROUTE PACKAGES ========
app.use('/api/packages', packageRoutes);

// ======== ROUTE HOTELS ========

// GET semua hotel
app.get('/api/hotels', (req, res) => {
  const sql = 'SELECT * FROM hotels ORDER BY id DESC';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST tambah hotel
app.post('/api/hotels', (req, res) => {
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
  } = req.body;

  // Validasi input minimal
  if (!package_id || !name || !checkin || !checkout) {
    return res.status(400).json({ error: 'Field wajib belum lengkap.' });
  }

  const sql = `
    INSERT INTO hotels 
    (package_id, country, name, checkin, checkout, nights, price_double, price_triple, price_quad, unit_room)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

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
      });
    }
  );
});

// PUT update hotel
app.put('/api/hotels/:id', (req, res) => {
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
  } = req.body;

  const sql = `
    UPDATE hotels
    SET country=?, name=?, checkin=?, checkout=?, nights=?, 
        price_double=?, price_triple=?, price_quad=?, unit_room=?
    WHERE id=?
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
      id,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: '✅ Hotel berhasil diperbarui.' });
    }
  );
});

// DELETE hotel
app.delete('/api/hotels/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM hotels WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Hotel berhasil dihapus.' });
  });
});

// ======== RUN SERVER ========
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
