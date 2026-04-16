// Ejemplos de como funciona cada cosa por que luego me pierdo xdxd:
// Controller = Cajero, Service = Gerente, repository = Almacen.
// Estas 3 cosas siguen un patron constante para que se pueda hacer el pedido del cliente

//Este archicvo es el encargado de "hablar" con el FrontEnd. rutas HTTP

// "./" == Misma carperta "../" == Sube una carpeta
const service = require("./services");

// GET
function obtenerProductos(req, res) {
    const data = service.obtenerProductos();
    res.json(data);
}

// POST
function crearProducto(req, res) {
    try {
        const producto = service.crearProducto(req.body);
        res.json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// DELETE
function eliminarProducto(req, res) {
    try {
        const resultado = service.eliminarProducto(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    obtenerProductos,
    crearProducto,
    eliminarProducto
};
