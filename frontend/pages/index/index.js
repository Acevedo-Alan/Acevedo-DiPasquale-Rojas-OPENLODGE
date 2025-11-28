// index.js - Página Principal
const API_BASE_URL = "http://localhost:8080";

// Cargar alojamientos al iniciar la página
document.addEventListener("DOMContentLoaded", async () => {
  await cargarAlojamientos();
  configurarBuscador();
  configurarFechas();
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

function crearTarjetaAlojamiento(alojamiento) {
  const div = document.createElement("div");
  div.className = "destination-card";
  div.style.cursor = "pointer";

  const direccion = alojamiento.direccion || {};
  const ciudadObj = direccion.ciudad || {};
  const paisObj = ciudadObj.pais || {};

  const ciudad = ciudadObj.nombre || "Ciudad no especificada";
  const pais = paisObj.nombre || "";

  div.innerHTML = `
    <img src="${alojamiento.imagen || "https://via.placeholder.com/400x300"}" 
         alt="${alojamiento.nombre}"
         onerror="this.src='https://via.placeholder.com/400x300'">
    <div class="destination-info">
      <h3>${alojamiento.nombre}</h3>

      <p class="localidad">${ciudad}${pais ? ", " + pais : ""}</p>

      <p class="description">${alojamiento.descripcion}</p>

      <div class="destination-details">
        <span class="capacity">Hasta ${alojamiento.capacidadHuespedes} huéspedes</span>
        <span class="price">$${alojamiento.precioNoche}/noche</span>
      </div>
    </div>
  `;

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
  
  // También permitir buscar con Enter en los inputs
  const inputs = document.querySelectorAll(".search-input");
  inputs.forEach(input => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        buscarAlojamientos();
      }
    });
  });
}

// Configurar validación de fechas
function configurarFechas() {
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  
  if (!checkinInput || !checkoutInput) return;
  
  // Establecer fecha mínima como hoy
  const hoy = new Date().toISOString().split("T")[0];
  checkinInput.min = hoy;
  checkoutInput.min = hoy;
  
  // Cuando se selecciona check-in, actualizar mínimo de check-out
  checkinInput.addEventListener("change", () => {
    const checkinDate = checkinInput.value;
    if (checkinDate) {
      checkoutInput.min = checkinDate;
      
      // Si checkout es anterior a checkin, limpiar checkout
      if (checkoutInput.value && checkoutInput.value <= checkinDate) {
        checkoutInput.value = "";
      }
    }
  });
}

// Buscar alojamientos con filtros
async function buscarAlojamientos() {
  const checkin = document.getElementById("checkin")?.value;
  const checkout = document.getElementById("checkout")?.value;
  const guests = document.getElementById("guests")?.value;
  const destination = document.getElementById("destination")?.value;
  const precioMax = document.getElementById("precioMax")?.value;

  // Validar fechas solo si ambas están presentes
  if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
    alert("La fecha de salida debe ser posterior a la fecha de entrada");
    return;
  }

  // Validar que al menos haya un filtro
  if (!checkin && !checkout && !guests && !destination && !precioMax) {
    // Si no hay filtros, mostrar todos
    await cargarAlojamientos();
    return;
  }

  // Construir URL con parámetros de búsqueda
  const params = new URLSearchParams();
  if (checkin) params.append("checkin", checkin);
  if (checkout) params.append("checkout", checkout);
  if (guests) params.append("capacidadMin", guests);
  if (precioMax) params.append("precioMax", precioMax);

  console.log("Buscando con parámetros:", {
    checkin,
    checkout,
    capacidadMin: guests,
    precioMax,
    destination
  });

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
    
    console.log("URL de búsqueda:", url);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del servidor:", errorText);
      throw new Error("Error en la búsqueda");
    }

    const alojamientos = await response.json();
    console.log("Alojamientos encontrados:", alojamientos.length);
    
    // Si hay destino, filtrar localmente por nombre de ciudad o país
    let resultados = alojamientos;
    if (destination && destination.trim()) {
      const destLower = destination.toLowerCase().trim();
      resultados = alojamientos.filter(a => {
        const direccion = a.direccion || {};
        const ciudadObj = direccion.ciudad || {};
        const paisObj = ciudadObj.pais || {};
        
        const ciudad = (ciudadObj.nombre || "").toLowerCase();
        const pais = (paisObj.nombre || "").toLowerCase();
        const nombre = (a.nombre || "").toLowerCase();
        
        return ciudad.includes(destLower) || 
               pais.includes(destLower) || 
               nombre.includes(destLower);
      });
      console.log("Después del filtro de destino:", resultados.length);
    }
    
    mostrarAlojamientos(resultados);
  } catch (error) {
    console.error("Error:", error);
    mostrarError("Error al buscar alojamientos. Por favor, intenta de nuevo.");
  }
}
// Mostrar mensaje de error
function mostrarError(mensaje) {
  const grid = document.querySelector(".destinations-grid");
  grid.innerHTML = `<p class="error-message">${mensaje}</p>`;
}