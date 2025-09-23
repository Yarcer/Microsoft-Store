import express from "express";
import session from "express-session";
import { authRouter } from "./routes/auth.js";

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "secreto123",
  resave: false,
  saveUninitialized: true
}));

// Views
app.set("view engine", "hbs");
app.set("views", "./views");

// Rutas
app.use("/", authRouter);

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
