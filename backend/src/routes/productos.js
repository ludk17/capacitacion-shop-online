import { Router } from "express";
import multer from "multer";
import { extname, join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import db from "../db/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Configuración de Multer ───────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, "../../public/img"));
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + extensión original
    const ext = extname(file.originalname);
    cb(null, `producto-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ext = extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpg, jpeg, png, webp, gif)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // máx 5MB
});

const router = Router();

// ─── GET /api/productos ────────────────────────────────────────────────────
// Retorna todos los productos
router.get("/", (req, res) => {
  try {
    const productos = db.prepare("SELECT * FROM productos").all();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos", detalle: error.message });
  }
});

// ─── GET /api/productos/:id ────────────────────────────────────────────────
// Retorna un producto por ID
router.get("/:id", (req, res) => {
  try {
    const producto = db
      .prepare("SELECT * FROM productos WHERE id = ?")
      .get(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto", detalle: error.message });
  }
});

// ─── POST /api/productos ───────────────────────────────────────────────────
// Crea un nuevo producto (multipart/form-data)
router.post("/", upload.single("imagen"), (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: "Los campos nombre y precio son obligatorios" });
  }

  const precioNum = parseFloat(precio);
  if (isNaN(precioNum) || precioNum < 0) {
    return res.status(400).json({ error: "El precio debe ser un número positivo" });
  }

  // Si se subió imagen, guardamos la ruta relativa
  const imagenRuta = req.file ? `/img/${req.file.filename}` : null;

  try {
    const stmt = db.prepare(
      "INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(nombre, descripcion ?? null, precioNum, imagenRuta);

    const nuevo = db
      .prepare("SELECT * FROM productos WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto", detalle: error.message });
  }
});

// ─── PUT /api/productos/:id ────────────────────────────────────────────────
// Actualiza un producto existente (multipart/form-data)
router.put("/:id", upload.single("imagen"), (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: "Los campos nombre y precio son obligatorios" });
  }

  const precioNum = parseFloat(precio);
  if (isNaN(precioNum) || precioNum < 0) {
    return res.status(400).json({ error: "El precio debe ser un número positivo" });
  }

  try {
    const existe = db
      .prepare("SELECT id, imagen FROM productos WHERE id = ?")
      .get(req.params.id);

    if (!existe) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Si se subió nueva imagen, usar la nueva; si no, mantener la existente
    const imagenRuta = req.file ? `/img/${req.file.filename}` : existe.imagen;

    db.prepare(
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?"
    ).run(nombre, descripcion ?? null, precioNum, imagenRuta, req.params.id);

    const actualizado = db
      .prepare("SELECT * FROM productos WHERE id = ?")
      .get(req.params.id);

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto", detalle: error.message });
  }
});

// ─── DELETE /api/productos/:id ─────────────────────────────────────────────
// Elimina un producto
router.delete("/:id", (req, res) => {
  try {
    const existe = db
      .prepare("SELECT id FROM productos WHERE id = ?")
      .get(req.params.id);

    if (!existe) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    db.prepare("DELETE FROM productos WHERE id = ?").run(req.params.id);

    res.json({ mensaje: "Producto eliminado correctamente", id: Number(req.params.id) });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto", detalle: error.message });
  }
});

export default router;
