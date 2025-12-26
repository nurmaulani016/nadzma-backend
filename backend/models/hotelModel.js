export const getAllHotels = (db) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM hotels", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getHotelById = (db, id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM hotels WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const createHotel = (db, data) => {
  return new Promise((resolve, reject) => {
    const {
      package_id,
      country,
      hotel_name,
      check_in,
      check_out,
      nights,
      room_type,
      price,
      currency,
      unit_room,
      price_per_person,
    } = data;

    db.run(
      `INSERT INTO hotels 
      (package_id, country, hotel_name, check_in, check_out, nights, room_type, price, currency, unit_room, price_per_person) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        package_id,
        country,
        hotel_name,
        check_in,
        check_out,
        nights,
        room_type,
        price,
        currency,
        unit_room,
        price_per_person,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      }
    );
  });
};

export const updateHotel = (db, id, data) => {
  return new Promise((resolve, reject) => {
    const {
      country,
      hotel_name,
      check_in,
      check_out,
      nights,
      room_type,
      price,
      currency,
      unit_room,
      price_per_person,
    } = data;

    db.run(
      `UPDATE hotels SET 
        country=?, hotel_name=?, check_in=?, check_out=?, nights=?, room_type=?, price=?, currency=?, unit_room=?, price_per_person=?
      WHERE id=?`,
      [
        country,
        hotel_name,
        check_in,
        check_out,
        nights,
        room_type,
        price,
        currency,
        unit_room,
        price_per_person,
        id,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      }
    );
  });
};

export const deleteHotel = (db, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM hotels WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve({ deletedID: id });
    });
  });
};
