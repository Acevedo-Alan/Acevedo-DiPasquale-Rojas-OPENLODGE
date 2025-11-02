// index.js - Actualizado para campos correctos del backend
document.addEventListener("DOMContentLoaded", async () => {
  await cargarPropiedades();
  setupBusqueda();
});

async function cargarPropiedades() {
  const destinationsGrid = document.querySelector(".destinations-grid");

  if (!destinationsGrid) return;

  try {
    // Mostrar loading
    destinationsGrid.innerHTML =
      '<p style="text-align:center;grid-column:1/-1;">Cargando propiedades...</p>';

    const alojamientos = await apiService.getAlojamientos();

    if (!alojamientos || alojamientos.length === 0) {
      destinationsGrid.innerHTML =
        '<p style="text-align:center;grid-column:1/-1;">No hay propiedades disponibles</p>';
      return;
    }

    // Limpiar y renderizar propiedades
    destinationsGrid.innerHTML = "";

    // Tomar las primeras 6 propiedades para mostrar
    const propiedadesDestacadas = alojamientos.slice(0, 6);

    propiedadesDestacadas.forEach((alojamiento, index) => {
      const card = crearTarjetaPropiedad(alojamiento, index);
      destinationsGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar propiedades:", error);
    destinationsGrid.innerHTML =
      '<p style="text-align:center;grid-column:1/-1;color:red;">Error al cargar propiedades</p>';
  }
}

function crearTarjetaPropiedad(alojamiento, index) {
  const card = document.createElement("div");
  card.className = "destination-card";

  // Definir badges según el índice
  const badges = [
    "Más Popular",
    "Oferta Especial",
    "Lujo",
    "Nuevo",
    "Destacado",
    "Recomendado",
  ];
  const badge = badges[index % badges.length];

  // Usar el campo imagen (URL única)
  const imagenUrl = alojamiento.imagen || "img/hotel5.jpg";

  // Extraer ubicación de direccion.ciudad
  let ubicacion = "Ciudad";
  if (alojamiento.direccion?.ciudad) {
    ubicacion = `${alojamiento.direccion.ciudad.nombre || "Ciudad"}, ${
      alojamiento.direccion.ciudad.pais || "País"
    }`;
  }

  card.innerHTML = `
    <div class="destination-image" style="background-image: url(${imagenUrl});">
      <span class="destination-badge">${badge}</span>
    </div>
    <div class="destination-content">
      <div class="destination-header">
        <h3 class="destination-title">${alojamiento.nombre || "Propiedad"}</h3>
        <div class="rating">
          <span class="stars">★★★★★</span>
          <span>${alojamiento.calificacion || "4.8"}</span>
        </div>
      </div>
      <p style="color: var(--gray-medium);">${ubicacion}</p>
      <div class="destination-price">
        $${alojamiento.precioNoche || "0"} <span>/ noche</span>
      </div>
      <button class="btn btn-primary" style="width: 100%;" onclick="irAPropiedad(${
        alojamiento.id
      })">Ver detalles</button>
    </div>
  `;

  return card;
}

function setupBusqueda() {
  const searchBtn = document.querySelector(".search-btn");

  if (!searchBtn) return;

  searchBtn.addEventListener("click", async () => {
    const destino = document.getElementById("destination").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const huespedes = document.getElementById("guests").value;

    const params = {};
    if (checkin) params.checkin = checkin;
    if (checkout) params.checkout = checkout;
    if (huespedes) params.capacidadMin = parseInt(huespedes);

    try {
      searchBtn.textContent = "Buscando...";
      searchBtn.disabled = true;

      const resultados = await apiService.buscarAlojamientos(params);

      // Guardar resultados en sessionStorage
      sessionStorage.setItem("busquedaResultados", JSON.stringify(resultados));
      sessionStorage.setItem("busquedaParams", JSON.stringify(params));

      // Actualizar la vista con los resultados
      mostrarResultadosBusqueda(resultados);

      searchBtn.textContent = "Buscar";
      searchBtn.disabled = false;
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      alert("Error al buscar propiedades");
      searchBtn.textContent = "Buscar";
      searchBtn.disabled = false;
    }
  });
}

function mostrarResultadosBusqueda(resultados) {
  const destinationsGrid = document.querySelector(".destinations-grid");

  if (!destinationsGrid) return;

  if (!resultados || resultados.length === 0) {
    destinationsGrid.innerHTML = `
      <p style="text-align:center;grid-column:1/-1;">
        No se encontraron propiedades con esos criterios.
        <button onclick="location.reload()" class="btn btn-primary" style="margin-top:1rem;">Ver todas las propiedades</button>
      </p>
    `;
    return;
  }

  destinationsGrid.innerHTML = "";

  resultados.forEach((alojamiento, index) => {
    const card = crearTarjetaPropiedad(alojamiento, index);
    destinationsGrid.appendChild(card);
  });

  // Scroll a los resultados
  destinationsGrid.scrollIntoView({ behavior: "smooth" });
}

// Función global para navegar a una propiedad
window.irAPropiedad = function (id) {
  // Guardar el ID en sessionStorage
  sessionStorage.setItem("alojamientoId", id);
  window.location.href = "/pages/alojamiento/alojamiento.html";
};
