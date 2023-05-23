// Obtener los productos del carrito desde el almacenamiento local
const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

// Obtener los elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciarCarrito = document.querySelector(".carrito-acciones-vaciar");
const mensajeCarritoVacio = document.querySelector("#mensaje-carrito-vacio");
const totalElement = document.getElementById('total');
const botonComprar = document.querySelector(".carrito-acciones-comprar");

// Función para mostrar los productos en el carrito
function mostrarProductosEnCarrito() {
    // Limpiar el contenedor de productos antes de mostrar los nuevos
    contenedorProductos.innerHTML = "";

    // Mostrar los productos en el carrito
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        // Hay productos en el carrito, mostrarlos en la interfaz
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        mensajeCarritoVacio.classList.add("hidden");

        // Recorrer los productos y generar el HTML correspondiente para cada uno
        productosEnCarrito.forEach((producto, indice) => {
            // Generar el HTML del producto
            const productoHTML = `
        <div class="carrito-producto">
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="">
            <div class="carrito-producto-titulo">
            <small>Titulo</small>
            <h3>${producto.titulo}</h3>
        </div>

        <div class="carrito-producto-cantidad">
            <small>Cantidad</small>
            <p>${producto.cantidad}</p>
        </div>

        <div class="carrito-producto-precio">
            <small>Precio</small>
            <p>$${producto.precio}</p>
        </div>

        <div class="carrito-producto-subtotal">
            <small>Subtotal</small>
            <p>$${producto.cantidad * producto.precio}</p>
        </div>
            <button class="carrito-producto-eliminar" data-indice="${indice}"><i class="bi bi-trash-fill"></i></button>
        </div>
        `;

            // Agregar el HTML del producto al contenedor de productos
            contenedorProductos.insertAdjacentHTML("beforeend", productoHTML);
        });

        // Agregar eventos de escucha a los botones de eliminar producto
        const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
        botonesEliminar.forEach((boton, indice) => {
            boton.addEventListener("click", () => {
                eliminarProducto(indice);
            });
        });
    } else {
        // No hay productos en el carrito, mostrar mensaje de carrito vacío
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        mensajeCarritoVacio.classList.remove("hidden");
    }
}

function eliminarProducto(indice) {
    // Verificar si el índice es válido
    if (indice >= 0 && indice < productosEnCarrito.length) {
      // Obtener el producto a eliminar
      const producto = productosEnCarrito[indice];
  
      // Obtener la cantidad a eliminar mediante una ventana de diálogo
      const cantidadAEliminar = prompt(`Ingresa la cantidad de ${producto.titulo} que deseas eliminar:`);
  
      // Verificar si se ingresó una cantidad válida
      if (cantidadAEliminar !== null && !isNaN(cantidadAEliminar) && cantidadAEliminar > 0) {
        // Convertir la cantidad ingresada a un número entero
        const cantidad = parseInt(cantidadAEliminar, 10);
  
        // Verificar si la cantidad ingresada es menor o igual a la cantidad actual del producto
        if (cantidad <= producto.cantidad) {
          // Restar la cantidad ingresada del producto
          producto.cantidad -= cantidad;
  
          // Verificar si la cantidad llega a 0 para eliminar el producto del carrito
          if (producto.cantidad === 0) {
            productosEnCarrito.splice(indice, 1);
          }
  
          // Actualizar el almacenamiento local con el nuevo arreglo de productosEnCarrito
          localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
  
          // Volver a mostrar los productos en el carrito actualizados
          mostrarProductosEnCarrito();
  
          // Calcular el total actualizado
          calcularTotal();
        } else {
          alert("La cantidad ingresada es mayor a la cantidad actual del producto en el carrito.");
        }
      } else {
        alert("La cantidad ingresada no es válida.");
      }
    }
  }

// Función para calcular el total
function calcularTotal() {
    // Obtén todos los elementos HTML que contienen los subtotales de los productos
    const subtotalesElements = document.getElementsByClassName('carrito-producto-subtotal');

    // Inicializa el total como 0
    let total = 0;

    // Recorre todos los elementos de los subtotales y suma sus valores al total
    for (let i = 0; i < subtotalesElements.length; i++) {
        const subtotal = parseFloat(subtotalesElements[i].getElementsByTagName('p')[0].textContent.replace('$', ''));
        total += subtotal;
    }

    // Actualiza el elemento HTML con el total
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Llama a la función calcularTotal para calcular el total inicial al cargar la página
window.addEventListener('load', () => {
    mostrarProductosEnCarrito();
    calcularTotal();
});

// Vaciar el carrito al hacer clic en el botón "Vaciar carrito"
botonVaciarCarrito.addEventListener("click", () => {
    // Limpiar los productos en el carrito del almacenamiento local
    localStorage.removeItem("productos-en-carrito");

    // Mostrar el mensaje de carrito vacío
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    mensajeCarritoVacio.classList.remove("hidden");

    // Limpiar el contenedor de productos
    contenedorProductos.innerHTML = "";

    // Actualizar el total a 0
    totalElement.textContent = "$0.00";
});

// Evento de clic del botón "Comprar ahora"
botonComprar.addEventListener("click", () => {
    // Obtener la cantidad de productos comprados
    const cantidadProductos = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);

    // Obtener el total de la compra
    let totalCompra = 0;
    productosEnCarrito.forEach(producto => {
        totalCompra += producto.cantidad * producto.precio;
    });

    // Vaciar los productos en el carrito del almacenamiento local
    localStorage.removeItem("productos-en-carrito");

    // Mostrar un mensaje de compra exitosa con la información
    const mensaje = `¡Tu compra se realizó con éxito! Has comprado ${cantidadProductos} producto(s) por un total de $${totalCompra.toFixed(2)}.`;
    alert(mensaje);

    // Redirigir al usuario a otra página después de mostrar el mensaje
    window.location.href = "compra.html";
});
