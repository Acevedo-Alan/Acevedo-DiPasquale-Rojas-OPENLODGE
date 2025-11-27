const API_BASE_URL = "http://localhost:8080";

let usuarioActual = null;
let serviciosDisponibles = [];

document.addEventListener("DOMContentLoaded", async () => {
  const userData = localStorage.getItem("usuario");
  if (userData) {
    usuarioActual = JSON.parse(userData);
  }

  if (!usuarioActual || usuarioActual.rol !== "ANFITRION") {
    alert("Solo los anfitriones pueden crear alojamientos");
    window.location.href = "/pages/index/index.html";
    return;
  }

  await cargarServicios();
  configurarFormulario();
});

async function cargarServicios() {
  try {
    const response = await fetch(`${API_BASE_URL}/servicios/getAll`, {
      method: "GET",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${usuarioActual.token}`
      },
    });

    if (response.ok) {
      serviciosDisponibles = await response.json();
      mostrarServiciosEnFormulario();
    }
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    // Servicios predefinidos como fallback
    serviciosDisponibles = [
      { id: 1, nombre: "WiFi" },
      { id: 2, nombre: "Aire acondicionado" },
      { id: 3, nombre: "Calefacción" },
      { id: 4, nombre: "Cocina" },
      { id: 5, nombre: "Estacionamiento" },
      { id: 6, nombre: "Piscina" },
      { id: 7, nombre: "Gimnasio" },
      { id: 8, nombre: "Lavandería" },
    ];
    mostrarServiciosEnFormulario();
  }
}

function mostrarServiciosEnFormulario() {
  const form = document.getElementById("form-registrar-propiedad");
  let serviciosSection = document.getElementById("servicios-section");

  if (!serviciosSection) {
    serviciosSection = document.createElement("div");
    serviciosSection.id = "servicios-section";
    serviciosSection.innerHTML = "<h3>Servicios disponibles</h3>";

    const serviciosContainer = document.createElement("div");
    serviciosContainer.id = "servicios-container";
    serviciosContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
      margin: 1rem 0;
    `;

    serviciosDisponibles.forEach((servicio) => {
      const label = document.createElement("label");
      label.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      `;

      label.innerHTML = `
        <input type="checkbox" 
               name="servicios" 
               value="${servicio.id}" 
               data-nombre="${servicio.nombre}"
               style="width: 18px; height: 18px; cursor: pointer;">
        <span>${servicio.nombre}</span>
      `;

      const checkbox = label.querySelector("input");
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          label.style.background = "#ebf8ff";
          label.style.borderColor = "#4299e1";
        } else {
          label.style.background = "";
          label.style.borderColor = "#e2e8f0";
        }
      });

      serviciosContainer.appendChild(label);
    });

    serviciosSection.appendChild(serviciosContainer);
    const submitBtn = form.querySelector('button[type="submit"]');
    form.insertBefore(serviciosSection, submitBtn);
  }
}

function configurarFormulario() {
  const form = document.getElementById("form-registrar-propiedad");
  form.addEventListener("submit", handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();

  const formData = obtenerDatosFormulario();

  try {
    const response = await fetch(
      `${API_BASE_URL}/alojamientos/crearAlojamiento`,
      {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActual.token}`
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const resultado = await response.json();
    alert("Alojamiento registrado exitosamente");
    window.location.href = `/pages/alojamiento/alojamiento.html?id=${resultado.id}`;
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar el alojamiento: " + error.message);
  }
}

function obtenerDatosFormulario() {
  // Obtener servicios seleccionados como array de IDs (según AlojamientoDTO)
  const serviciosIds = Array.from(
    document.querySelectorAll('input[name="servicios"]:checked')
  ).map((checkbox) => parseInt(checkbox.value));

  // Estructura plana según AlojamientoDTO
  return {
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    imagen: document.getElementById("imagen").value.trim() || null,
    precioNoche: parseFloat(document.getElementById("precioNoche").value),
    capacidadHuespedes: parseInt(
      document.getElementById("capacidadHuespedes").value
    ),
    calle: document.getElementById("calle").value.trim(),
    numero: parseInt(document.getElementById("numero").value),
    depto: document.getElementById("depto")?.value.trim() || null,
    piso: document.getElementById("piso")?.value
      ? parseInt(document.getElementById("piso").value)
      : null,
    ciudad: document.getElementById("ciudad").value.trim(),
    pais: document.getElementById("pais").value.trim(),
    serviciosId: serviciosIds,
  };
}