const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const controller = require("./JS/controllers");
const dbPath = path.join(__dirname, "db.json");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.get("/productos", controller.obtenerProductos);
app.post("/productos", controller.crearProducto);
app.delete("/productos/:id", controller.eliminarProducto);



app.get("/carrito", (req, res) => {
  const data = fs.readFileSync(dbPath, "utf-8");
  const carrito = JSON.parse(data);
  res.json(carrito.cart);
});

app.post("/carrito", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  data.cart.push(req.body);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  res.json(req.body);
});

app.put("/carrito/:id", (req, res) => {
  const id = req.params.id;
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const index = data.cart.findIndex(p => String(p.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
  }

  data.cart[index] = req.body;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  res.json(data.cart[index]);
});

app.delete("/carrito/:id", (req, res) => {
  const id = req.params.id;
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const nuevoCarrito = data.cart.filter(p => String(p.id) !== String(id));

  if (nuevoCarrito.length === data.cart.length) {
    return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
  }

  data.cart = nuevoCarrito;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  res.json({ mensaje: "Producto eliminado del carrito" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});