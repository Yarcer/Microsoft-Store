import { Router } from 'express';
import { prisma } from "../configuracion/config.js"
import bcrypt from 'bcrypt';

const router = Router();

router.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  res.locals.cart.length = res.locals.cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  next();
});

// ====== LOGIN ======
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    return res.render('login', { error: 'login deshabilitada' });
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error interno.' });
  }
});

// ====== LOGOUT ======
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

// ====== REGISTRO ======
router.get('/register', (req, res) => {
  if (req.session.usuario) {
    return res.redirect("/")
  }
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render('register', { error: 'Todos los campos son obligatorios.' });
  }

  if (password.length < 6) {
    return res.render('register', { error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render('register', { error: 'Email no válido.' });
  }

  try {
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (usuarioExistente) {
      let errorMsg = '';
      if (usuarioExistente.email === email) {
        errorMsg = 'El email ya está registrado.';
      } else if (usuarioExistente.username === username) {
        errorMsg = 'El nombre de usuario ya está registrado.';
      }
      return res.render('register', { error: errorMsg });
    }

    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: { username, email, password: hash }
    });

    req.session.usuario = { id: nuevoUsuario.id, username: nuevoUsuario.username };

    res.render('register', { success: 'Usuario registrado correctamente.', check: "1" });

  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Error en el registro, inténtalo de nuevo.' });
  }
});


// ====== CARRITO ======
router.post('/cart/add', (req, res) => {
  const { id, titulo, img } = req.body;
  if (!req.session.cart) req.session.cart = [];
  const existing = req.session.cart.find((p) => p.id == id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    req.session.cart.push({ id, titulo, img, qty: 1 });
  }
  res.json({ ok: true, cart: req.session.cart });
});

router.post('/cart/remove', (req, res) => {
  const { id } = req.body;
  if (!req.session.cart) return res.json({ ok: true, cart: [] });
  req.session.cart = req.session.cart.filter((p) => p.id != id);
  res.json({ ok: true, cart: req.session.cart });
});

router.get('/cart', (req, res) => {
  res.render('cart', { cart: req.session.cart || [] });
});

export { router as authRouter };
