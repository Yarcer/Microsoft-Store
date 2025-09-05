import { Router } from 'express';
import { test_data } from '../configuracion/data.js';

const app = Router();

/**
 * Punto de entrada de la aplicación
 */
app.get('/', (_, res) => {
  res.render('home', { datos: test_data });
});

app.get('/producto/nuevo', (_, res) => {
  res.render('nuevo');
});

/**
 * API REST para CRUD de productos
 */
app.get('/producto/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = test_data.find((item) => item.id === id);

  if (!item) return res.status(404).send('No existe');

  res.render('producto', { item });
});

// POST /producto -> Crear un nuevo producto
app.post('/producto', (req, res) => {
  const { titulo, img } = req.body;

  if (!titulo || !img) return res.status(400).send('Faltan datos');

  const nuevoProducto = {
    id: test_data.length ? test_data[test_data.length - 1].id + 1 : 1,
    titulo,
    img,
  };

  test_data.push(nuevoProducto);
  res.redirect('/');
});

// PUT /producto/:id -> Actualizar un producto
app.post('/producto/actualizar/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = test_data[test_data.findIndex((p) => p.id === id)];

  // if (item) return res.status(404).send('Producto no encontrado');
  // test_data[index] = { ...test_data[index], ...req.body };
  const newItem = {
    id: item.id,
    titulo: req.body.titulo ? req.body.titulo : item.titulo,
    img: req.body.img ? req.body.img : item.img,
  };

  ((test_data[test_data.findIndex((p) => p.id === id)] = newItem), res.redirect('/'));
});

// DELETE /producto/:id -> Eliminar un producto
app.post('/producto/borrar/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = test_data.findIndex((p) => p.id === id);

  if (index === -1) return res.status(404).send('Producto no encontrado');

  test_data.splice(index, 1);
  res.redirect('/');
});

export { app };
