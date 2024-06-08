const container = document.getElementById("container");
const btnCarrito = document.getElementById("btn-carrito");
const divCarrito = document.getElementById("carrito");
const carritoContainer = document.getElementById("carrito-container");
const totalDiv = document.getElementById("total");

let mostrar = false;

btnCarrito.addEventListener("click", () => mostrarOcultar(mostrar));

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function AlertAdd(id) {
    Swal.fire({
        title: 'Ingrese la cantidad de unidades que desea comprar',
        input: 'number',
        inputAttributes: {
            min: 1,
            step: 1
        },
        inputValue: 1,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Agregar al carrito',
        cancelButtonText: 'Cancelar',
        preConfirm: (cantidad) => {
            return new Promise((resolve) => {
                if (!cantidad || cantidad <= 0) {
                    Swal.showValidationMessage('Ingrese una cantidad válida');
                } else {
                    resolve(cantidad);
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            agregarAlCarrito(id, parseInt(result.value));
            Swal.fire({
                title: "Producto agregado con éxito",
                icon: "success",
                showConfirmButton: false,
                timer: 1000
            });
        } else {
            Swal.fire({
                title: "Producto no agregado",
                icon: "error",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

function AlertRemove(id) {
    const producto = carrito.find(el => el.id === id);
    Swal.fire({
        title: 'Ingrese la cantidad de unidades que desea quitar',
        input: 'number',
        inputAttributes: {
            min: 1,
            max: producto.cantidad,
            step: 1
        },
        inputValue: 1,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Quitar del carrito',
        cancelButtonText: 'Cancelar',
        preConfirm: (cantidad) => {
            return new Promise((resolve) => {
                if (!cantidad || cantidad <= 0 || cantidad > producto.cantidad) {
                    Swal.showValidationMessage('Ingrese una cantidad válida');
                } else {
                    resolve(cantidad);
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            quitarDelCarrito(id, parseInt(result.value));
            Swal.fire({
                title: "Producto quitado con éxito",
                icon: "success",
                showConfirmButton: false,
                timer: 1000
            });
        } else {
            Swal.fire({
                title: "Producto no quitado",
                icon: "error",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

function agregarAlCarrito(id, cantidad) {
    const vinoAAgregar = productos.find(el => el.id === id);
    const index = carrito.findIndex(el => el.id === id);
    if (index !== -1) {
        carrito[index].cantidad += cantidad;
    } else {
        vinoAAgregar.cantidad = cantidad;
        carrito.push(vinoAAgregar);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

function quitarDelCarrito(id, cantidad) {
    const index = carrito.findIndex(el => el.id === id);
    if (index !== -1) {
        if (carrito[index].cantidad > cantidad) {
            carrito[index].cantidad -= cantidad;
        } else {
            carrito.splice(index, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    divCarrito.innerHTML = "";
    let total = 0;
    carrito.forEach(el => {
        const carritoItem = document.createElement("div");
        carritoItem.className = "carrito-item m-3";

        const imagen = document.createElement("img");
        imagen.src = el.imagen;
        imagen.alt = el.nombre;

        const nombre = document.createElement("span");
        nombre.innerText = el.nombre;

        const cantidad = document.createElement("span");
        cantidad.innerText = `Cantidad: ${el.cantidad}`;

        const precio = document.createElement("span");
        precio.innerText = `Precio: $${el.precio * el.cantidad}`;

        const botonQuitar = document.createElement("button");
        botonQuitar.innerText = "Quitar";
        botonQuitar.className = "btn btn-danger btn-sm";
        botonQuitar.onclick = () => AlertRemove(el.id);

        carritoItem.appendChild(imagen);
        carritoItem.appendChild(nombre);
        carritoItem.appendChild(cantidad);
        carritoItem.appendChild(precio);
        carritoItem.appendChild(botonQuitar);

        divCarrito.appendChild(carritoItem);

        total += el.precio * el.cantidad;
    });
    totalDiv.innerText = `Total: $${total}`;
}

function crearCard(vino, contenedor) {
    const card = document.createElement("div");
    card.className = vino.stock ? "col-md-4 mb-4 card" : "col-md-4 mb-4 no-card";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body m-3";

    const titulo = document.createElement("h5");
    titulo.innerText = vino.nombre;
    titulo.className = "card-title titulo";

    const imagen = document.createElement("img");
    imagen.src = vino.imagen;
    imagen.alt = vino.nombre;
    imagen.className = "img card-img-top";

    const descripcion = document.createElement("p");
    descripcion.innerText = vino.descripcion;
    descripcion.className = "card-text mx-3";

    const precio = document.createElement("p");
    precio.innerText = `$${vino.precio}`;
    precio.className = "card-text mt-2";

    const botonAgregar = document.createElement("button");
    botonAgregar.innerText = contenedor === "container" ? "Agregar al Carrito" : "Quitar del Carrito";
    botonAgregar.className = "button m-3";
    botonAgregar.onclick = contenedor === "container" ? () => AlertAdd(vino.id) : () => AlertRemove(vino.id);

    cardBody.appendChild(titulo);
    cardBody.appendChild(imagen);
    cardBody.appendChild(descripcion);
    cardBody.appendChild(precio);
    cardBody.appendChild(botonAgregar);

    card.appendChild(cardBody);

    const nuevoContenedor = contenedor === "container" ? container : divCarrito;
    nuevoContenedor.appendChild(card);
}

function mostrarOcultar(estadoActual) {
    if (estadoActual) {
        mostrar = false;
        carritoContainer.classList.remove("show");
    } else {
        mostrar = true;
        carritoContainer.classList.add("show");
    }
}

fetch("../js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        productos.forEach(el => crearCard(el, "container"));
        carrito.forEach(el => crearCard(el, "carrito"));
        actualizarCarrito();
    })
    .catch(error => console.error('Error al cargar los productos:', error));
