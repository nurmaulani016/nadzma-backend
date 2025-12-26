const BASE = "http://localhost:5000/api/packages";

async function run() {
  // === Tambah Paket ===
  let res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Umroh Oktober",
      departure_date: "2025-10-01",
      jamaah_count: 30,
      program_days: 12,
      currency_used: "SAR",
    }),
  });
  let pkg = await res.json();
  console.log("POST /packages =>", pkg);

  const packageId = pkg.id;

  // === Ambil Semua Paket ===
  res = await fetch(BASE);
  console.log("GET /packages =>", await res.json());

  // === Update Paket ===
  res = await fetch(`${BASE}/${packageId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Umroh Oktober Update",
      departure_date: "2025-10-05",
      jamaah_count: 35,
      program_days: 14,
      currency_used: "IDR",
    }),
  });
  console.log("PUT /packages/:id =>", await res.json());

  // === Hapus Paket ===
  res = await fetch(`${BASE}/${packageId}`, { method: "DELETE" });
  console.log("DELETE /packages/:id =>", await res.json());
}

run().catch(console.error);
