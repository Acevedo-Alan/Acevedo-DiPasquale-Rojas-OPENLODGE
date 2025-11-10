const API_URL_ALOJAMIENTOS = "<URL_GET_ALOJAMIENTOS>"; // Ej: http://localhost:8080/api/alojamientos
const API_URL_BUSQUEDA = "<URL_BUSQUEDA>"; // Ej: http://localhost:8080/api/alojamientos/buscar

document.addEventListener("DOMContentLoaded", async () => {
  await cargarPropiedades();
  setupBusqueda();
});

async function cargarPropiedades() {
  const grid = document.querySelector(".destinations-grid");
  if (!grid) return;

  grid.innerHTML = "<p>Cargando propiedades...</p>";

  try {
    const response = await fetch(API_URL_ALOJAMIENTOS);
    const alojamientos = await response.json();

    grid.innerHTML = "";

    if (!alojamientos.length) {
      grid.innerHTML = "<p>No hay propiedades disponibles</p>";
      return;
    }

    alojamientos.slice(0, 6).forEach((a, i) => {
      const card = crearTarjetaPropiedad(a, i);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar propiedades:", error);
    grid.innerHTML = "<p>Error al cargar propiedades</p>";
  }
}

function crearTarjetaPropiedad(a, index) {
  const card = document.createElement("div");
  card.className = "destination-card";
  const imagen = a.imagen || "img/hotel5.jpg";
  const ubicacion = a.direccion?.ciudad?.nombre || "Ciudad desconocida";

  card.innerHTML = `
    <div class="destination-image" style="background-image:url(${imagen});">
      <span class="destination-badge">Destacado</span>
    </div>
    <div class="destination-content">
      <h3>${a.nombre}</h3>
      <p>${ubicacion}</p>
      <p>$${a.precioNoche} / noche</p>
      <button class="btn btn-primary" onclick="irAPropiedad(${a.id})">Ver detalles</button>
    </div>`;
  return card;
}

function setupBusqueda() {
  const btn = document.querySelector(".search-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const huespedes = document.getElementById("guests").value;

    const params = new URLSearchParams({ checkin, checkout, huespedes });

    try {
      btn.textContent = "Buscando...";
      btn.disabled = true;

      const response = await fetch(`${API_URL_BUSQUEDA}?${params}`);
      const resultados = await response.json();
      mostrarResultadosBusqueda(resultados);
    } catch (error) {
      alert("Error en la búsqueda");
    } finally {
      btn.textContent = "Buscar";
      btn.disabled = false;
    }
  });
}

function mostrarResultadosBusqueda(resultados) {
  const grid = document.querySelector(".destinations-grid");
  grid.innerHTML = "";
  if (!resultados.length) {
    grid.innerHTML = "<p>No se encontraron resultados</p>";
    return;
  }
  resultados.forEach((a, i) => grid.appendChild(crearTarjetaPropiedad(a, i)));
}

window.irAPropiedad = function (id) {
  sessionStorage.setItem("alojamientoId", id);
  window.location.href = "/pages/alojamiento/alojamiento.html";
};
