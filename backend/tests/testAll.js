const BASE = "http://localhost:5000/api";

async function testPackages() {
  console.log("\n=== TEST PACKAGES ===");
  let res = await fetch(`${BASE}/packages`, {
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
  const pkg = await res.json();
  console.log("POST /packages =>", pkg);

  const packageId = pkg.id;

  res = await fetch(`${BASE}/packages`);
  console.log("GET /packages =>", await res.json());

  return packageId;
}

async function testHotels(packageId) {
  console.log("\n=== TEST HOTELS ===");
  let res = await fetch(`${BASE}/hotels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: packageId,
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
  const hotel = await res.json();
  console.log("POST /hotels =>", hotel);

  res = await fetch(`${BASE}/hotels`);
  console.log("GET /hotels =>", await res.json());
}

async function testAccommodations(packageId) {
  console.log("\n=== TEST ACCOMMODATIONS ===");
  let res = await fetch(`${BASE}/accommodations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: packageId,
      name: "Transportasi Bus",
      price: 2000,
      qty: 2,
      pax: 40,
      selected: 1,
    }),
  });
  const acc = await res.json();
  console.log("POST /accommodations =>", acc);

  res = await fetch(`${BASE}/accommodations`);
  console.log("GET /accommodations =>", await res.json());
}

async function testCostLogistics(packageId) {
  console.log("\n=== TEST COST LOGISTICS ===");
  let res = await fetch(`${BASE}/cost-logistics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: packageId,
      unit: "Visa",
      price: 500,
      checked: 1,
    }),
  });
  const logistic = await res.json();
  console.log("POST /cost-logistics =>", logistic);

  res = await fetch(`${BASE}/cost-logistics`);
  console.log("GET /cost-logistics =>", await res.json());
}

async function cleanup(packageId) {
  console.log("\n=== CLEANUP ===");
  const res = await fetch(`${BASE}/packages/${packageId}`, {
    method: "DELETE",
  });
  console.log("DELETE /packages/:id =>", await res.json());
}

async function run() {
  try {
    const packageId = await testPackages();
    await testHotels(packageId);
    await testAccommodations(packageId);
    await testCostLogistics(packageId);
    await cleanup(packageId);
    console.log("\n✅ Semua test selesai & data dibersihkan.");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

run();
