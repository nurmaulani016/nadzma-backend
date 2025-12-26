// testPackages.js
const BASE = "http://localhost:5000/api/packages";

async function run() {
  // === 1. Tambah Paket (POST) ===
  let res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Umroh September",
      departure_date: "2025-09-15",
      jamaah_count: 40,
      program_days: 12,
      currency_used: "SAR",
    }),
  });
  let data = await res.json();
  console.log("POST =>", data);
  const id = data.id;

  // === 2. Ambil Semua Paket (GET) ===
  res = await fetch(BASE);
  data = await res.json();
  console.log("GET all =>", data);

  // === 3. Update Paket (PUT) ===
  res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Umroh September Update",
      departure_date: "2025-09-20",
      jamaah_count: 45,
      program_days: 14,
      currency_used: "IDR",
    }),
  });
  data = await res.json();
  console.log("PUT =>", data);

  // === 4. Hapus Paket (DELETE) ===
  res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  data = await res.json();
  console.log("DELETE =>", data);

  // === 5. GET setelah delete ===
  res = await fetch(BASE);
  data = await res.json();
  console.log("GET after delete =>", data);
}

run().catch((err) => console.error("Error testing API:", err));
