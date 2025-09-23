import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../db.js";

const router = Router();

// Middleware para pasar usuario y carrito a las vistas
router.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  next();
});


// ====== LOGIN ======
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE nombre_usuario = ?", [username]);
    if (rows.length === 0) {
      return res.render("login", { error: "Usuario o contraseña incorrectos", username });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.contraseña_usuarios);

    if (!isMatch) {
      return res.render("login", { error: "Usuario o contraseña incorrectos", username });
    }

    // Guardar en sesión
    req.session.user = { id: user.id_usuarios, username: user.nombre_usuario, name: user.nombre_usuario };
    if (!req.session.cart) req.session.cart = [];

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Error interno." });
  }
});


// ====== LOGOUT ======
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});


// ====== REGISTRO ======
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  console.log("req.body:", req.body);
  const { username, email, password } = req.body;

  try {
    // ¿Ya existe?
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE nombre_usuario = ? OR correo_usuario = ?",
      [username, email]
    );
    if (rows.length > 0) {
      return res.render("register", { error: "El usuario o correo ya está registrado", username, email });
    }

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar en DB
      await db.query(
        "INSERT INTO usuarios (nombre_usuario, contraseña_usuarios, correo_usuario) VALUES (?, ?, ?)",
        [username, hashedPassword, email]
      );

    return res.render("register", { success: "Usuario registrado con éxito. Ahora inicia sesión." });
  } catch (err) {
    console.error(err);
    res.render("register", { error: "Error en el registro." });
  }
});


// ====== CARRITO ======
router.post("/cart/add", (req, res) => {
  const { id, titulo, img } = req.body;
  if (!req.session.cart) req.session.cart = [];
  const existing = req.session.cart.find(p => p.id == id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    req.session.cart.push({ id, titulo, img, qty: 1 });
  }
  res.json({ ok: true, cart: req.session.cart });
});

router.post("/cart/remove", (req, res) => {
  const { id } = req.body;
  if (!req.session.cart) return res.json({ ok: true, cart: [] });
  req.session.cart = req.session.cart.filter(p => p.id != id);
  res.json({ ok: true, cart: req.session.cart });
});

router.get("/cart", (req, res) => {
  res.render("cart", { cart: req.session.cart || [] });
});

export { router as authRouter };
