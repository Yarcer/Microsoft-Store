import { Router } from 'express';
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
  res.render('register');
});

router.post('/register', async (req, res) => {
  console.log('req.body:', req.body);
  const { username, email, password } = req.body;

  try {
    return res.render('register', { error: 'registro deshabilitada' });
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Error en el registro.' });
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
