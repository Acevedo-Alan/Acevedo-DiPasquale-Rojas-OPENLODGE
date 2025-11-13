const API_BASE_URL = "http://localhost:8080";

let modoEdicion = false;
let alojamientoId = null;
let usuarioActual = null;
let serviciosDisponibles = [];

document.addEventListener("DOMContentLoaded", async () => {
  const userData = localStorage.getItem("usuario");
  if (userData) {
    usuarioActual = JSON.parse(userData);
  }

  // userRoleManager.js ya maneja la verificación de rol
  if (!usuarioActual || usuarioActual.rol !== "ANFITRION") {
    alert("No puedes crear un alojamiento");
    window.location.href = "/pages/index/index.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  alojamientoId = urlParams.get("id");

  if (alojamientoId) {
    modoEdicion = true;
    document.querySelector("h2").textContent = "Modificar Alojamiento";
    await cargarDatosAlojamiento(alojamientoId);
  }

  await cargarServicios();
  configurarFormulario();
});

async function cargarServicios() {
  try {
    const response = await fetch(`${API_BASE_URL}/servicios/getAll`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      serviciosDisponibles = await response.json();
      mostrarServiciosEnFormulario();
    }
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    // Si no hay endpoint de servicios, usar servicios predefinidos
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

  // Buscar si ya existe la sección de servicios
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

    // Insertar antes del botón de submit
    const submitBtn = form.querySelector('button[type="submit"]');
    form.insertBefore(serviciosSection, submitBtn);
  }
}

async function cargarDatosAlojamiento(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/alojamientos/getAlojamiento/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error al cargar alojamiento");

    const alojamiento = await response.json();

    // Verificar permisos
    if (alojamiento.anfitrionId !== usuarioActual.id) {
      alert("No tienes permiso para editar este alojamiento");
      window.location.href = `/pages/alojamiento/alojamiento.html?id=${id}`;
      return;
    }

    llenarFormulario(alojamiento);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar los datos del alojamiento");
  }
}

function llenarFormulario(alojamiento) {
  document.getElementById("nombre").value = alojamiento.nombre || "";
  document.getElementById("descripcion").value = alojamiento.descripcion || "";
  document.getElementById("imagen").value = alojamiento.imagen || "";
  document.getElementById("precioNoche").value = alojamiento.precioNoche || "";
  document.getElementById("capacidadHuespedes").value =
    alojamiento.capacidadHuespedes || "";

  if (alojamiento.direccion) {
    document.getElementById("calle").value = alojamiento.direccion.calle || "";
    document.getElementById("numero").value =
      alojamiento.direccion.numero || "";

    const deptoInput = document.getElementById("depto");
    const pisoInput = document.getElementById("piso");
    if (deptoInput) deptoInput.value = alojamiento.direccion.depto || "";
    if (pisoInput) pisoInput.value = alojamiento.direccion.piso || "";

    if (alojamiento.direccion.ciudad) {
      document.getElementById("ciudad").value =
        alojamiento.direccion.ciudad.nombre || "";

      if (alojamiento.direccion.ciudad.pais) {
        document.getElementById("pais").value =
          alojamiento.direccion.ciudad.pais.nombre || "";
      }
    }
  }

  // Marcar servicios seleccionados
  if (alojamiento.servicios && alojamiento.servicios.length > 0) {
    const serviciosIds = alojamiento.servicios.map((s) => s.id);
    document.querySelectorAll('input[name="servicios"]').forEach((checkbox) => {
      if (serviciosIds.includes(parseInt(checkbox.value))) {
        checkbox.checked = true;
        checkbox.parentElement.style.background = "#ebf8ff";
        checkbox.parentElement.style.borderColor = "#4299e1";
      }
    });
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
    let response;

    if (modoEdicion) {
      response = await fetch(
        `${API_BASE_URL}/alojamientos/actualizarAlojamiento/${alojamientoId}/?anfitrionId=${usuarioActual.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
    } else {
      response = await fetch(
        `${API_BASE_URL}/alojamientos/crearAlojamiento?anfitrionId=${usuarioActual.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const resultado = await response.json();
    alert(
      modoEdicion
        ? "Alojamiento actualizado exitosamente"
        : "Alojamiento registrado exitosamente"
    );
    window.location.href = `/pages/alojamiento/alojamiento.html?id=${resultado.id}`;
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar el alojamiento: " + error.message);
  }
}

function obtenerDatosFormulario() {
  // Obtener servicios seleccionados
  const serviciosSeleccionados = Array.from(
    document.querySelectorAll('input[name="servicios"]:checked')
  ).map((checkbox) => ({
    id: parseInt(checkbox.value),
    nombre: checkbox.dataset.nombre,
  }));

  return {
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    imagen: document.getElementById("imagen").value.trim() || null,
    precioNoche: parseFloat(document.getElementById("precioNoche").value),
    capacidadHuespedes: parseInt(
      document.getElementById("capacidadHuespedes").value
    ),
    direccion: {
      calle: document.getElementById("calle").value.trim(),
      numero: parseInt(document.getElementById("numero").value),
      depto: document.getElementById("depto")?.value.trim() || null,
      piso: document.getElementById("piso")?.value
        ? parseInt(document.getElementById("piso").value)
        : null,
      ciudad: {
        nombre: document.getElementById("ciudad").value.trim(),
        pais: {
          nombre: document.getElementById("pais").value.trim(),
        },
      },
    },
    servicios: serviciosSeleccionados,
  };
}
