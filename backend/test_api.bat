@echo off
echo ================================
echo 🚀 UJI COBA API UMROH BUDGETING
echo ================================

echo.
echo [1] Tambah Paket
curl -X POST http://localhost:5000/api/packages ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Paket Umroh Ramadhan\",\"departure_date\":\"2025-03-15\",\"jamaah_count\":45,\"program_days\":12,\"currency_used\":\"SAR\"}"
echo.

echo [2] Lihat Semua Paket
curl http://localhost:5000/api/packages
echo.

echo [3] Tambah Akomodasi (paket id = 1)
curl -X POST http://localhost:5000/api/accommodations ^
  -H "Content-Type: application/json" ^
  -d "{\"package_id\":1,\"name\":\"Hotel Mekkah Bintang 5\",\"price\":400,\"qty\":10,\"pax\":4,\"checked\":1}"
echo.

echo [4] Tambah Cost Logistic (paket id = 1)
curl -X POST http://localhost:5000/api/cost-logistics ^
  -H "Content-Type: application/json" ^
  -d "{\"package_id\":1,\"unit\":\"Bus AC\",\"price\":1500,\"checked\":1}"
echo.

echo [5] Tambah Data Hotel Master
curl -X POST http://localhost:5000/api/hotels ^
  -H "Content-Type: application/json" ^
  -d "{\"country\":\"Saudi Arabia\",\"name\":\"Hilton Makkah\",\"city\":\"Mekkah\"}"
echo.

echo ================================
echo ✅ Selesai Uji Coba API
echo ================================
pause
