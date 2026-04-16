// Nota para Erick del futuro:
// En esta parte se decidira que es lo que esta permitido y que no y el como los datos se van transformando.
// Osease las validaciones y la logica detrás del backend

const repo = require("./repository");

// Creamos una funcion que se encargara de hacer los productos de compra POST
function crearProducto(data) {
    // Validamos si es que el valor ingresado es diferente del nombre
    if (!data.nombre) {
        // Si es asi, en vez de crashear tirara este "input" donde pues, se indique que falta el nombre
        throw new Error("Nombre obligatorio");
    }

    // Se valida que lo que se ingrese deba ser un numero
    if (isNaN(data.precio)) {
        throw new Error("Precio inválido");
    }

    // REGLA (no duplicados)
    const existe = repo.obtenerTodos().find(p => p.nombre === data.nombre);
    if (existe) {
        throw new Error("Producto ya existe");
    }

    // Aqui se transforma la info
    const producto = {
        id: Date.now(),
        nombre: data.nombre,
        descripcion: data.descripcion || "",
        precio: Number(data.precio),
        imagen: data.imagen || "",
        stock: Number(data.stock) || 0,
        categoria: data.categoria || "General"
    };

    // Aqui guardamos
    return repo.guardar(producto);
}

// Se obtiene los productos GET
function obtenerProductos() {
    return repo.obtenerTodos();
}

// Se actualiza el producto PUT
function actualizarProducto(id, data) {
    const productos = repo.obtenerTodos();

    const index = productos.findIndex(p => p.id == id);
    // No se puede actualizar a -1 pedido
    if (index === -1) {
        throw new Error("Producto no encontrado");
    }

    // actualizar datos
    productos[index] = {
        ...productos[index],
        ...data
    };

    return repo.guardarTodos(productos);
}

// Se elimina el producto DELETE
function eliminarProducto(id) {
    // Se obtienen los productos
    const productos = repo.obtenerTodos();
    // Se filtran por el id
    const nuevos = productos.filter(p => p.id != id);

    if (productos.length === nuevos.length) {
        throw new Error("Producto no encontrado");
    }

    return repo.guardarTodos(nuevos);
}

module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};