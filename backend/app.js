
import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import path, { extname } from "path";
import { fileURLToPath } from "url";

// configuracion rutas
import productosRoutes from "./interno/productos.js";

//Necesario para Dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Configuracion Handlebars
app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname,),
    partialsDir: path.join(__dirname,)
}));

//Middlewares
app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//Rutas
app.use("/", productosinterno);

//Servidor
const PORT=3000;
app.listen(PORT, () => {
    console.log("servidor corriendo en http://localhost:${3000}");
});