const BASE = "http://localhost:5000/api/cost-logistics";

async function run() {
  // Tambah cost logistic
  let res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: 1,
      unit: "Visa",
      price: 500,
      checked: 1,
    }),
  });
  let logistic = await res.json();
  console.log("POST /cost-logistics =>", logistic);

  // Ambil semua cost logistic
  res = await fetch(BASE);
  console.log("GET /cost-logistics =>", await res.json());
}

run().catch(console.error);
