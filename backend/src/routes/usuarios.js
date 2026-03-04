import { Router } from "express";
import db from "../db/database.js";

const router = Router();

// ─── GET /api/usuarios ─────────────────────────────────────────────────────
// Retorna todos los usuarios (sin contraseña)
router.get("/", (req, res) => {
  try {
    const usuarios = db
      .prepare("SELECT id, nombre, email, rol, created_at FROM usuarios")
      .all();
    res.json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener usuarios", detalle: error.message });
  }
});

// ─── GET /api/usuarios/:id ─────────────────────────────────────────────────
// Retorna un usuario por ID (sin contraseña)
router.get("/:id", (req, res) => {
  try {
    const usuario = db
      .prepare(
        "SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?",
      )
      .get(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el usuario", detalle: error.message });
  }
});

// ─── POST /api/usuarios ────────────────────────────────────────────────────
// Crea un nuevo usuario
router.post("/", (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ error: "Los campos nombre, email y password son obligatorios" });
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "El formato del email no es válido" });
  }

  const rolValido = ["admin", "cliente"].includes(rol) ? rol : "cliente";

  try {
    // Verificar email único
    const existente = db
      .prepare("SELECT id FROM usuarios WHERE email = ?")
      .get(email);

    if (existente) {
      return res
        .status(409)
        .json({ error: "Ya existe un usuario con ese email" });
    }

    const stmt = db.prepare(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
    );
    const result = stmt.run(nombre, email, password, rolValido);

    const nuevo = db
      .prepare(
        "SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?",
      )
      .get(result.lastInsertRowid);

    res.status(201).json(nuevo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el usuario", detalle: error.message });
  }
});

// ─── PUT /api/usuarios/:id ─────────────────────────────────────────────────
// Actualiza un usuario existente
router.put("/:id", (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email) {
    return res
      .status(400)
      .json({ error: "Los campos nombre y email son obligatorios" });
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "El formato del email no es válido" });
  }

  const rolValido = ["admin", "cliente"].includes(rol) ? rol : "cliente";

  try {
    const existe = db
      .prepare("SELECT id FROM usuarios WHERE id = ?")
      .get(req.params.id);

    if (!existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar email único (ignorando el usuario actual)
    const emailDuplicado = db
      .prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?")
      .get(email, req.params.id);

    if (emailDuplicado) {
      return res
        .status(409)
        .json({ error: "Ya existe otro usuario con ese email" });
    }

    if (password) {
      // Actualizar incluyendo password
      db.prepare(
        "UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?",
      ).run(nombre, email, password, rolValido, req.params.id);
    } else {
      // Actualizar sin tocar la contraseña
      db.prepare(
        "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?",
      ).run(nombre, email, rolValido, req.params.id);
    }

    const actualizado = db
      .prepare(
        "SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?",
      )
      .get(req.params.id);

    res.json(actualizado);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al actualizar el usuario",
        detalle: error.message,
      });
  }
});

// ─── DELETE /api/usuarios/:id ──────────────────────────────────────────────
// Elimina un usuario
router.delete("/:id", (req, res) => {
  try {
    const existe = db
      .prepare("SELECT id FROM usuarios WHERE id = ?")
      .get(req.params.id);

    if (!existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    db.prepare("DELETE FROM usuarios WHERE id = ?").run(req.params.id);

    res.json({
      mensaje: "Usuario eliminado correctamente",
      id: Number(req.params.id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el usuario", detalle: error.message });
  }
});

export default router;
