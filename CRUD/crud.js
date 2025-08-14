import { Router } from 'express';
import { test_data } from '../configuracion/data.js';

const app = Router();

/**
 * Punto de entrada de la aplicación
 */
app.get('/', (_, res) => {
    res.render('home', { datos: test_data });
});

/**
 * API REST para CRUD de productos
 * 
 * GET /producto/:id -> Obtener un producto por ID
 * POST /producto     -> Crear un nuevo producto (pendiente)
 * PUT /producto/:id  -> Actualizar un producto (pendiente)
 * DELETE /producto/:id -> Eliminar un producto (pendiente)
 */
app.get('/producto/:id', (req, res) => {
    const id = req.params.id;
    const item = test_data.find(item => item.id == id);

    if (!item) return res.status(404).send('No existe');

    res.render('producto', { item });
});

export { app };
