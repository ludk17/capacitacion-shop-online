import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear / abrir la base de datos (archivo en backend/src/db/)
const db = new Database(join(__dirname, "shop.db"));

// Habilitar WAL para mejor rendimiento
db.pragma("journal_mode = WAL");

// Crear tabla de productos si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    descripcion TEXT,
    precio      REAL    NOT NULL CHECK(precio >= 0),
    imagen      TEXT
  )
`);

// ─── Tabla venta ──────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS venta (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha       TEXT    NOT NULL,
    usuario_id  INTEGER,                       -- se llenará cuando agreguemos auth
    total       REAL    NOT NULL CHECK(total >= 0)
  )
`);

// ─── Tabla venta_detalle ───────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS venta_detalle (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_id        INTEGER NOT NULL REFERENCES venta(id) ON DELETE CASCADE,
    producto_id     INTEGER NOT NULL REFERENCES productos(id),
    nombre_producto TEXT    NOT NULL,     -- snapshot del nombre al momento de la compra
    precio_unitario REAL    NOT NULL,     -- snapshot del precio al momento de la compra
    cantidad        INTEGER NOT NULL CHECK(cantidad > 0),
    subtotal        REAL    NOT NULL      -- precio_unitario * cantidad
  )
`);

// ─── Índices ───────────────────────────────────────────────────────────────
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_venta_detalle_venta_id ON venta_detalle(venta_id);
  CREATE INDEX IF NOT EXISTS idx_venta_detalle_producto_id ON venta_detalle(producto_id);
`);

// Migración: agregar columna imagen si no existe (para DBs creadas antes)
const columns = db.prepare("PRAGMA table_info(productos)").all();
const tieneImagen = columns.some((col) => col.name === "imagen");
if (!tieneImagen) {
  db.exec("ALTER TABLE productos ADD COLUMN imagen TEXT");
  console.log("✅ Columna imagen agregada a la tabla productos");
}

// Precargar datos desde mocks/productos.json solo si la tabla está vacía
const count = db.prepare("SELECT COUNT(*) AS total FROM productos").get();
if (count.total === 0) {
  const mockPath = join(__dirname, "../mocks/productos.json");
  const productos = JSON.parse(readFileSync(mockPath, "utf-8"));

  const insert = db.prepare(
    "INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (@nombre, @descripcion, @precio, @imagen)"
  );

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(item);
  });

  insertMany(productos);
  console.log(`✅ ${productos.length} productos precargados desde mocks`);
}

export default db;
