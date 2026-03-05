import { Router } from "express";

const router = Router();

const FAKE_USER = "admin";
const FAKE_PASS = "admin";
const FAKE_TOKEN = "fake-token-abc123xyz";

// ─── POST /api/fakeLogin ───────────────────────────────────────────────────
router.post("/", (req, res) => {
  const { usuario, password } = req.body;

  if (usuario === FAKE_USER && password === FAKE_PASS) {
    return res.status(200).json({ token: FAKE_TOKEN });
  }

  return res.status(200).json({ message: "usuario y contraseña incorrecta" });
});

export default router;
