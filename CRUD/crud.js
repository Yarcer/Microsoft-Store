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
 * POST /producto     -> Crear un nuevo producto
 * PUT /producto/:id  -> Actualizar un producto 
 * DELETE /producto/:id -> Eliminar un producto 
 */
app.get('/producto/:id', (req, res) => {
    const id = req.params.id;
    const item = test_data.find(item => item.id == id);

    if (!item) return res.status(404).send('No existe');

    res.render('producto', { item });
});
/* POST /producto     -> Crear un nuevo producto/*/
//productos 
app.post('/producto', (req, res) => {
    const nuevoProducto = [{
        id: test_data.length + 1, // ID automático
        nombre: "Falchion europea",
        precio: "U$13000",
        descripcion: "El Falchion es una espada de una sola mano y un solo filo de origen europeo. Su diseño recuerda a la cimitarra persa o a la china dadao y combina el peso y la potencia de un hacha con la versatilidad de una espada.",
        Image: "https://medievalbritain.com/wp-content/uploads/2019/11/Medieval-Weapons_Falchion_Sabre.jpg"
    },{
        id: test_data.length + 1, // ID automático
        nombre: "Espada larga",
        precio: "U$10000",
        descripcion:"La Espada larga Es un tipo de espada europea utilizada durante el período medieval tardío. Estas espadas tienen largas empuñaduras cruciformes con empuñaduras de más de 10 a 15 pulgadas de largo, que brindan espacio para dos manos.",
        Image:"https://medievalbritain.com/wp-content/uploads/2019/11/The-Writhen-Hilt_Sword.jpg"
        
    },{id: test_data.length + 1, // ID automático
        nombre: "Cimitarra",
        precio: "U$10000",
        descripcion: "La palabra Cimitarra se utilizó para todos oriental espadas curvas en comparación con las espadas europeas más rectas y de doble filo de la época. Es una espada de un solo filo, curvada hacia atrás, con un borde posterior engrosado y sin afilar.",
        Image:"https://medievalbritain.com/wp-content/uploads/2020/01/Mediaval-Weapons_Scimitar.jpg",

    }];

    test_data.push(nuevoProducto); // Lo agrega a la lista temporal

    res.status(201).send('Producto agregado correctamente');
});

////// PUT /producto/:id  -> Actualizar un producto
app.put('/producto/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = test_data.findIndex(p => p.id === id);

    if (index === -1) return res.status(404).send('Producto no encontrado');

    test_data[index] = { ...test_data[index], ...req.body };
    res.send('Producto actualizado');
});

///// DELETE /producto/:id -> Eliminar un producto
app.delete('/producto/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = test_data.findIndex(p => p.id === id);

    if (index === -1) return res.status(404).send('Producto no encontrado');

    test_data.splice(index, 1);
    res.send('Producto eliminado');
});



export { app };
