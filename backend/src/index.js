import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import productosRouter from "./routes/productos.js";
import ventasRouter from "./routes/ventas.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// ─── Archivos estáticos (imágenes) ─────────────────────────────────────────
// Accesible en: http://localhost:3000/img/<nombre-archivo>
app.use(express.static(join(__dirname, "../public")));

// ─── Rutas ─────────────────────────────────────────────────────────────────
app.use("/api/productos", productosRouter);
app.use("/api/ventas", ventasRouter);


// ─── Health check ──────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
