// index.js - Página Principal
const API_BASE_URL = "http://localhost:8080";

// Cargar alojamientos al iniciar la página
document.addEventListener("DOMContentLoaded", async () => {
  await cargarAlojamientos();
  configurarBuscador();
});

// Cargar todos los alojamientos
async function cargarAlojamientos() {
  try {
    // Obtener el token si el usuario está autenticado
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (usuario.token) {
      headers["Authorization"] = `Bearer ${usuario.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/alojamientos/getAlojamientos`, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Error al cargar alojamientos");
    }

    const alojamientos = await response.json();
    mostrarAlojamientos(alojamientos);
  } catch (error) {
    console.error("Error:", error);
    mostrarError("No se pudieron cargar los alojamientos");
  }
}

// Mostrar alojamientos en el grid
function mostrarAlojamientos(alojamientos) {
  const grid = document.querySelector(".destinations-grid");
  grid.innerHTML = "";

  if (alojamientos.length === 0) {
    grid.innerHTML = "<p>No se encontraron alojamientos disponibles</p>";
    return;
  }

  alojamientos.forEach((alojamiento) => {
    const card = crearTarjetaAlojamiento(alojamiento);
    grid.appendChild(card);
  });
}

// Crear tarjeta de alojamiento
function crearTarjetaAlojamiento(alojamiento) {
  const div = document.createElement("div");
  div.className = "destination-card";
  div.style.cursor = "pointer";

  const ciudad = alojamiento.direccion?.ciudad || "Ciudad no especificada";
  const pais = alojamiento.direccion?.pais || "";

  div.innerHTML = `
    <img src="${alojamiento.imagen || "https://via.placeholder.com/400x300"}" 
         alt="${alojamiento.nombre}"
         onerror="this.src='https://via.placeholder.com/400x300'">
    <div class="destination-info">
      <h3>${alojamiento.nombre}</h3>
      <p class="location">${ciudad}${pais ? ", " + pais : ""}</p>
      <p class="description">${alojamiento.descripcion}</p>
      <div class="destination-details">
        <span class="capacity">Hasta ${alojamiento.capacidadHuespedes} huéspedes</span>
        <span class="price">$${alojamiento.precioNoche}/noche</span>
      </div>
    </div>
  `;

  // Navegar al detalle del alojamiento
  div.addEventListener("click", () => {
    window.location.href = `/pages/alojamiento/alojamiento.html?id=${alojamiento.id}`;
  });

  return div;
}

// Configurar el buscador
function configurarBuscador() {
  const searchBtn = document.querySelector(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", buscarAlojamientos);
  }
}

// Buscar alojamientos con filtros
async function buscarAlojamientos() {
  const checkin = document.getElementById("checkin")?.value;
  const checkout = document.getElementById("checkout")?.value;
  const guests = document.getElementById("guests")?.value;

  // Construir URL con parámetros de búsqueda
  const params = new URLSearchParams();
  if (checkin) params.append("checkin", checkin);
  if (checkout) params.append("checkout", checkout);
  if (guests) params.append("capacidadMin", guests);

  try {
    // Obtener el token si el usuario está autenticado
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (usuario.token) {
      headers["Authorization"] = `Bearer ${usuario.token}`;
    }

    const url = `${API_BASE_URL}/alojamientos/buscar${
      params.toString() ? "?" + params.toString() : ""
    }`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Error en la búsqueda");
    }

    const alojamientos = await response.json();
    mostrarAlojamientos(alojamientos);
  } catch (error) {
    console.error("Error:", error);
    mostrarError("Error al buscar alojamientos");
  }
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
  const grid = document.querySelector(".destinations-grid");
  grid.innerHTML = `<p class="error-message">${mensaje}</p>`;
}