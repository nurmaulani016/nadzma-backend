const BASE = "http://localhost:5000/api/accommodations";

async function run() {
  // Tambah akomodasi
  let res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: 1,
      name: "Transportasi Bus",
      price: 2000,
      qty: 2,
      pax: 40,
      selected: 1,
    }),
  });
  let acc = await res.json();
  console.log("POST /accommodations =>", acc);

  // Ambil semua akomodasi
  res = await fetch(BASE);
  console.log("GET /accommodations =>", await res.json());
}

run().catch(console.error);
