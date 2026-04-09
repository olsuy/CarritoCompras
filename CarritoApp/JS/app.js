const URL_PRODUCTOS = "http://localhost:3000/productos";
const URL_CARRITO = "http://localhost:3000/carrito";

const contenedor = document.getElementById("contenedor-productos");
const formProducto = document.getElementById("form-producto");
const mensaje = document.getElementById("mensaje");
const btnToggleForm = document.getElementById("btn-toggle-form");
const panelFormulario = document.getElementById("panel-formulario");

function crearCard(producto) {
  return `
    <article class="producto-card">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
      <div class="producto-info">
        <p class="producto-categoria">${producto.categoria}</p>
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <p class="producto-descripcion">${producto.descripcion}</p>
        <p class="producto-stock">Stock: ${producto.stock}</p>
        <p class="producto-precio">$${producto.precio}</p>
        <button class="btn btn-primary btn-agregar" type="button" data-id="${producto.id}">Agregar al carrito</button>
      </div>
    </article>
  `;
}

async function agregarAlCarrito(id, productos) {
  const producto = productos.find(p => String(p.id) === String(id));
  if (!producto) return;

  try {
    const resCarrito = await fetch(URL_CARRITO);
    const carrito = await resCarrito.json();
    const existente = carrito.find(p => String(p.id) === String(id));

    if (existente) {
      await fetch(`${URL_CARRITO}/${existente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existente, cantidad: existente.cantidad + 1 })
      });
    } else {
      await fetch(URL_CARRITO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...producto, cantidad: 1 })
      });
    }

    alert(`"${producto.nombre}" agregado al carrito`);
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    alert("No se pudo agregar el producto");
  }
}

async function obtenerProductos() {
  try {
    const respuesta = await fetch(URL_PRODUCTOS);
    if (!respuesta.ok) throw new Error("No se pudieron cargar los productos");

    const productos = await respuesta.json();
    contenedor.innerHTML = "";
    productos.forEach(producto => {
      contenedor.innerHTML += crearCard(producto);
    });

    document.querySelectorAll(".btn-agregar").forEach(boton => {
      boton.addEventListener("click", () => agregarAlCarrito(boton.dataset.id, productos));
    });

  } catch (error) {
    console.error("Error al obtener productos:", error);
    contenedor.innerHTML = "<p>Ocurrió un error al cargar los productos.</p>";
  }
}

btnToggleForm.addEventListener("click", () => {
  panelFormulario.classList.toggle("oculto");
  btnToggleForm.classList.toggle("active");
});

formProducto.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoProducto = {
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    precio: document.getElementById("precio").value,
    imagen: document.getElementById("imagen").value.trim(),
    stock: document.getElementById("stock").value,
    categoria: document.getElementById("categoria").value.trim()
  };

  try {
    const respuesta = await fetch(URL_PRODUCTOS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoProducto)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data.error || "Error al agregar producto");
    }

    mensaje.textContent = "Producto agregado correctamente";
    mensaje.style.color = "#16a34a";
    formProducto.reset();
    panelFormulario.classList.add("oculto");
    btnToggleForm.classList.remove("active");
    obtenerProductos();
  } catch (error) {
    mensaje.textContent = error.message;
    mensaje.style.color = "#dc2626";
    console.error(error);
  }
});

obtenerProductos();