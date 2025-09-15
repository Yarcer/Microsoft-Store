import { Router } from 'express';

const router = Router();

// usuario
const users = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Admin User' },
  { id: 2, username: 'user', password: 'user123', name: 'Cliente' }
];

//login de usuario
router.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  next();
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.render('login', { error: 'Usuario o contraseña incorrectos', username });
  }
  req.session.user = { id: user.id, username: user.username, name: user.name };
  if (!req.session.cart) req.session.cart = [];
  res.redirect('/');
});
//cerrar session
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
});

//carrito
router.post('/cart/add', (req, res) => {
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


router.post('/cart/remove', (req, res) => {
  const { id } = req.body;
  if (!req.session.cart) return res.json({ ok: true, cart: [] });
  req.session.cart = req.session.cart.filter(p => p.id != id);
  res.json({ ok: true, cart: req.session.cart });
});


router.get('/cart', (req, res) => {
  res.render('cart', { cart: req.session.cart || [] });
});

export { router as authRouter };
