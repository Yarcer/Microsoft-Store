import { Router } from "express";

const Router = Router();

let productos = [
    {id: 1, nombre: "carlosduty 82", descripcion:"Prueba este emocionante juego de disparos orientado en 2099", precio: 89},
    {id: 2, nombre: "redincion verde viva", descripcion: "vive la vida de un vaquero con Sida", precio:92}
];

router.get("/", (req, res) => {
    res.render("index", {productos})    
});

router.get("/productos/:id", (req, res) => {
    const producto = productos.find(p => p.id == req.params.id);
    res.render("detalle", {producto});
});

router.get("/productos/add", (req, res) => {
    res.render("form", {accion: "/productos", metodo: "POST", titulo: "agregar producto"});
});

