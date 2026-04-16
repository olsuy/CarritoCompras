const URL_CARRITO = "http://localhost:3000/carrito";
const contenedorCarrito = document.getElementById("contenedor-carrito");

function crearCardCarrito(producto) {
  const subtotal = producto.precio * producto.cantidad;

  return `
    <article class="carrito-card">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-img">
      <div class="carrito-info">
        <h3 class="carrito-nombre">${producto.nombre}</h3>
        <p class="carrito-cantidad">Cantidad: ${producto.cantidad}</p>
        <p class="carrito-precio">Precio: $${producto.precio}</p>
        <p class="carrito-subtotal">Subtotal: $${subtotal}</p>
        <div class="acciones-item">
          <button class="btn btn-primary btn-sumar" data-id="${producto.id}">+</button>
          <button class="btn btn-restar" data-id="${producto.id}">-</button>
          <button class="btn btn-danger btn-eliminar" data-id="${producto.id}">Eliminar</button>
        </div>
      </div>
    </article>
  `;
}

function crearResumen(carrito, total) {
  const detalle = carrito.map(producto => `
    <li>${producto.nombre} x ${producto.cantidad} = $${producto.precio * producto.cantidad}</li>
  `).join("");

  return `
    <section class="resumen-carrito">
      <h3>Resumen de compra</h3>
      <ul class="lista-resumen">${detalle}</ul>
      <p class="carrito-total">Total: $${total}</p>
      <div class="acciones-carrito">
        <a href="index.html" class="btn">Seguir comprando</a>
        <button class="btn btn-success" id="btn-finalizar-compra">Finalizar compra</button>
      </div>
    </section>
  `;
}

async function actualizarCantidad(idProducto, cambio) {
  try {
    const respuesta = await fetch(`${URL_CARRITO}/${idProducto}`);
    const producto = await respuesta.json();

    const cantidadActual = Number(producto.cantidad);
    const nuevaCantidad = cantidadActual + Number(cambio);

    if (nuevaCantidad <= 0) {
      await eliminarDelCarrito(idProducto);
      return;
    }

    const productoActualizado = {
      ...producto,
      cantidad: nuevaCantidad
    };

    const respuestaPut = await fetch(`${URL_CARRITO}/${idProducto}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productoActualizado)
    });

    if (!respuestaPut.ok) {
      throw new Error("Error al actualizar la cantidad");
    }

    await obtenerCarrito();
  } catch (error) {
    console.error(error);
    alert("No se pudo actualizar la cantidad");
  }
}

async function eliminarDelCarrito(idProducto) {
  try {
    await fetch(`${URL_CARRITO}/${idProducto}`, {
      method: "DELETE"
    });

    obtenerCarrito();
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el producto");
  }
}

async function finalizarCompra(carrito, total) {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const resumen = carrito
    .map(producto => `${producto.nombre} x ${producto.cantidad} = $${producto.precio * producto.cantidad}`)
    .join("\n");

  const confirmar = confirm(`Resumen de compra:\n\n${resumen}\n\nTotal: $${total}\n\n¿Deseas finalizar la compra?`);

  if (!confirmar) return;

  try {
    await Promise.all(
      carrito.map(producto =>
        fetch(`${URL_CARRITO}/${producto.id}`, {
          method: "DELETE"
        })
      )
    );

    alert("Compra realizada con éxito");
    obtenerCarrito();
  } catch (error) {
    console.error(error);
    alert("No se pudo finalizar la compra");
  }
}

async function obtenerCarrito() {
  try {
    const respuesta = await fetch(URL_CARRITO);
    if (!respuesta.ok) throw new Error("No se pudo obtener el carrito");

    const carrito = await respuesta.json();
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
      contenedorCarrito.innerHTML = `
        <section class="resumen-carrito">
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos para continuar con tu compra.</p>
          <div class="acciones-carrito">
            <a href="index.html" class="btn">Ir a productos</a>
          </div>
        </section>
      `;
      return;
    }

    let total = 0;

    carrito.forEach(producto => {
      total += producto.precio * producto.cantidad;
      contenedorCarrito.innerHTML += crearCardCarrito(producto);
    });

    contenedorCarrito.innerHTML += crearResumen(carrito, total);

    document.querySelectorAll(".btn-eliminar").forEach(boton => {
      boton.addEventListener("click", () => eliminarDelCarrito(boton.dataset.id));
    });

    document.querySelectorAll(".btn-sumar").forEach(boton => {
      boton.addEventListener("click", () => actualizarCantidad(boton.dataset.id, 1));
    });

    document.querySelectorAll(".btn-restar").forEach(boton => {
      boton.addEventListener("click", () => actualizarCantidad(boton.dataset.id, -1));
    });

    const btnFinalizar = document.getElementById("btn-finalizar-compra");
    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", () => finalizarCompra(carrito, total));
    }
  } catch (error) {
    contenedorCarrito.innerHTML = `<p>No se pudo cargar el carrito.</p>`;
    console.error(error);
  }
}

obtenerCarrito();