import { Router } from 'express';
import { test_data } from '../configuracion/data.js';
//
const app = Router();

app.get('/', (_, res) => {
    res.render('home', { datos: test_data });
});

app.get("/producto/:id", (req, res) => {

    const id = req.params.id;
    const item = test_data.find(item => item.id == id);

    if (!item) res.send("No existe")

    res.render("producto", { item })
})

export { app };
