import { Router } from "express";
import db from "../db/database.js";

const router = Router();

// ─── POST /api/ventas ──────────────────────────────────────────────────────
// Registra una venta con su detalle
//
// Body esperado:
// {
//   "productos": [
//     { "id": 1, "cantidad": 2 },
//     { "id": 3, "cantidad": 1 }
//   ],
//   "usuario_id": null   // opcional, se usará cuando se implemente auth
// }
router.post("/", (req, res) => {
  const { productos, usuario_id = null } = req.body;

  // ── Validaciones ──────────────────────────────────────────────────────────
  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({
      error: "Se requiere un arreglo 'productos' con al menos un ítem",
    });
  }

  for (const item of productos) {
    if (!item.id || !Number.isInteger(item.id)) {
      return res.status(400).json({ error: "Cada producto debe tener un 'id' entero válido" });
    }
    if (!item.cantidad || !Number.isInteger(item.cantidad) || item.cantidad < 1) {
      return res.status(400).json({
        error: `La 'cantidad' del producto id=${item.id} debe ser un entero mayor a 0`,
      });
    }
  }

  // ── Transacción atómica ───────────────────────────────────────────────────
  const realizarVenta = db.transaction(() => {
    let total = 0;
    const detalles = [];

    // 1. Verificar que todos los productos existen y capturar precios actuales
    for (const item of productos) {
      const producto = db
        .prepare("SELECT id, nombre, precio FROM productos WHERE id = ?")
        .get(item.id);

      if (!producto) {
        throw new Error(`Producto con id=${item.id} no encontrado`);
      }

      const subtotal = Number((producto.precio * item.cantidad).toFixed(2));
      total += subtotal;

      detalles.push({
        producto_id: producto.id,
        nombre_producto: producto.nombre,
        precio_unitario: producto.precio,
        cantidad: item.cantidad,
        subtotal,
      });
    }

    total = Number(total.toFixed(2));

    // 2. Insertar cabecera de venta
    const fecha = new Date().toISOString();
    const ventaResult = db
      .prepare(
        "INSERT INTO venta (fecha, usuario_id, total) VALUES (?, ?, ?)"
      )
      .run(fecha, usuario_id, total);

    const ventaId = ventaResult.lastInsertRowid;

    // 3. Insertar líneas de detalle
    const insertDetalle = db.prepare(`
      INSERT INTO venta_detalle
        (venta_id, producto_id, nombre_producto, precio_unitario, cantidad, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const d of detalles) {
      insertDetalle.run(
        ventaId,
        d.producto_id,
        d.nombre_producto,
        d.precio_unitario,
        d.cantidad,
        d.subtotal
      );
    }

    // 4. Devolver la venta completa con su detalle
    return {
      id: ventaId,
      fecha,
      usuario_id,
      total,
      detalle: detalles.map((d) => ({ ...d, venta_id: ventaId })),
    };
  });

  try {
    const venta = realizarVenta();
    res.status(201).json(venta);
  } catch (error) {
    // Si el error es de negocio (producto no encontrado) devolvemos 422
    const esNegocio = error.message.includes("no encontrado");
    res.status(esNegocio ? 422 : 500).json({
      error: error.message,
    });
  }
});

// ─── GET /api/ventas ───────────────────────────────────────────────────────
// Lista todas las ventas (cabecera)
router.get("/", (req, res) => {
  try {
    const ventas = db.prepare("SELECT * FROM venta ORDER BY fecha DESC").all();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ventas", detalle: error.message });
  }
});

// ─── GET /api/ventas/:id ───────────────────────────────────────────────────
// Detalle de una venta específica
router.get("/:id", (req, res) => {
  try {
    const venta = db.prepare("SELECT * FROM venta WHERE id = ?").get(req.params.id);

    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const detalle = db
      .prepare("SELECT * FROM venta_detalle WHERE venta_id = ?")
      .all(req.params.id);

    res.json({ ...venta, detalle });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la venta", detalle: error.message });
  }
});

export default router;
