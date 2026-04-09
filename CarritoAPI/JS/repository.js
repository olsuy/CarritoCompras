//Este archivo esta solamente encargado de guardar todo, como una bodega que guarda todo.

const fs = require("fs");

function obtenerTodos() {
    //Obtiene los archivos en string de la base de datos del json
    const data = JSON.parse(fs.readFileSync("db.json"));
    return data.products;
}

// Guarda el producto
function guardar(producto) {
    const data = JSON.parse(fs.readFileSync("db.json"));

    data.products.push(producto);

    fs.writeFileSync("db.json", JSON.stringify(data, null, 2));

    return producto;
}

// Esta parte tiene el proposito de remplazar todo para la parte de Update o Delete
function guardarTodos(nuevosProductos) {
    const data = JSON.parse(fs.readFileSync("db.json"));

    data.products = nuevosProductos;

    fs.writeFileSync("db.json", JSON.stringify(data, null, 2));

    return nuevosProductos;
}

//Se exportan los modulos para su uso
module.exports = {
    obtenerTodos,
    guardar,
    guardarTodos
};