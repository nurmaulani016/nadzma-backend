const BASE = "http://localhost:5000/api/hotels";

async function run() {
  // Tambah hotel
  let res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: 1,
      country: "Saudi Arabia",
      hotelName: "Hilton Makkah",
      checkIn: "2025-10-01",
      checkOut: "2025-10-05",
      nights: 4,
      double: "500 SAR",
      triple: "450 SAR",
      quad: "400 SAR",
    }),
  });
  let hotel = await res.json();
  console.log("POST /hotels =>", hotel);

  // Ambil semua hotel
  res = await fetch(BASE);
  console.log("GET /hotels =>", await res.json());
}

run().catch(console.error);
