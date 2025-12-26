import express from "express";
import cors from "cors";
import { initDb } from "./db.js";

// Import routes
import packagesRoute from "./routes/packages.js";
import hotelsRoute from "./routes/hotels.js";
import accommodationsRoute from "./routes/accommodations.js";
import logisticsRoute from "./routes/costLogistics.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Inisialisasi database
const db = initDb();

// CORS dengan origin frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// ===== ROUTES =====
app.use("/api/packages", packagesRoute(db));
app.use("/api/hotels", hotelsRoute(db));
app.use("/api/accommodations", accommodationsRoute(db));
app.use("/api/cost-logistics", logisticsRoute(db));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
