const API_BASE_URL_EDIT = "http://localhost:8080";

let alojamientoIdEdit = null;
let usuarioActualEdit = null;
let alojamientoOriginal = null;
let serviciosDisponibles = [];

document.addEventListener("DOMContentLoaded", async () => {
  const userData = localStorage.getItem("usuario");
  if (userData) {
    usuarioActualEdit = JSON.parse(userData);
  }

  if (!usuarioActualEdit || usuarioActualEdit.rol !== "ANFITRION") {
    alert("Solo los anfitriones pueden modificar alojamientos");
    window.location.href = "/pages/index/index.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  alojamientoIdEdit = urlParams.get("id");

  if (!alojamientoIdEdit) {
    alert("No se especificó un alojamiento para editar");
    window.location.href = "/pages/index/index.html";
    return;
  }

  // Mostrar indicador de carga
  const form = document.getElementById("form-editar-propiedad");
  if (form) {
    form.style.opacity = "0.5";
    form.style.pointerEvents = "none";
  }

  try {
    // 1. Primero cargar servicios
    await cargarServicios();
    console.log("✓ Servicios cargados");
    
    // 2. Luego cargar datos del alojamiento (esto llenará el formulario)
    await cargarDatosAlojamientoEdit(alojamientoIdEdit);
    console.log("✓ Datos del alojamiento cargados");
    
    // 3. Finalmente configurar el formulario
    configurarFormularioEdit();
    console.log("✓ Formulario configurado");
    
    // Restaurar el formulario
    if (form) {
      form.style.opacity = "1";
      form.style.pointerEvents = "auto";
    }
  } catch (error) {
    console.error("Error durante la inicialización:", error);
    alert("Error al cargar el formulario");
    window.location.href = "/pages/index/index.html";
  }
});

async function cargarServicios() {
  try {
    const response = await fetch(`${API_BASE_URL_EDIT}/servicios/getAll`, {
      method: "GET",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${usuarioActualEdit.token}`
      },
    });

    if (response.ok) {
      serviciosDisponibles = await response.json();
      mostrarServiciosEnFormulario();
    }
  } catch (error) {
    console.error("Error al cargar servicios:", error);
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
  const form = document.getElementById("form-editar-propiedad");
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

async function cargarDatosAlojamientoEdit(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL_EDIT}/alojamientos/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActualEdit.token}`
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al cargar alojamiento:", errorText);
      throw new Error("Error al cargar alojamiento");
    }

    alojamientoOriginal = await response.json();
    console.log("Alojamiento cargado:", alojamientoOriginal);

    // Verificar que el anfitrión sea el dueño
    if (alojamientoOriginal.anfitrionId !== usuarioActualEdit.id) {
      alert(
        "No tienes permiso para modificar este alojamiento. Solo el propietario puede editarlo."
      );
      window.location.href = `/pages/alojamiento/alojamiento.html?id=${id}`;
      return;
    }

    // Llenar el formulario con los datos cargados
    llenarFormularioEdit(alojamientoOriginal);
  } catch (error) {
    console.error("Error completo:", error);
    alert("Error al cargar los datos del alojamiento: " + error.message);
    window.location.href = "/pages/index/index.html";
  }
}

function llenarFormularioEdit(alojamiento) {
  console.log("Llenando formulario con:", alojamiento);
  
  // Datos principales del alojamiento
  document.getElementById("nombre").value = alojamiento.nombre || "";
  document.getElementById("descripcion").value = alojamiento.descripcion || "";
  document.getElementById("imagen").value = alojamiento.imagen || "";
  document.getElementById("precioNoche").value = alojamiento.precioNoche || "";
  document.getElementById("capacidadHuespedes").value =
    alojamiento.capacidadHuespedes || "";

  // Dirección - Acceder a la estructura anidada correctamente
  if (alojamiento.direccion) {
    const direccion = alojamiento.direccion;
    const ciudadObj = direccion.ciudad || {};
    const paisObj = ciudadObj.pais || {};
    
    document.getElementById("calle").value = direccion.calle || "";
    document.getElementById("numero").value = direccion.numero || "";
    document.getElementById("ciudad").value = ciudadObj.nombre || "";
    document.getElementById("pais").value = paisObj.nombre || "";
    
    console.log("Dirección cargada:", {
      calle: direccion.calle,
      numero: direccion.numero,
      ciudad: ciudadObj.nombre,
      pais: paisObj.nombre
    });
  }

  // Marcar servicios (los servicios ya están cargados en este punto)
  marcarServiciosSeleccionados(alojamiento.servicios);
}

function marcarServiciosSeleccionados(servicios) {
  if (!servicios || servicios.length === 0) {
    console.log("No hay servicios para marcar");
    return;
  }

  const serviciosIds = servicios.map((s) => s.id);
  console.log("Servicios a marcar:", serviciosIds);
  
  const checkboxes = document.querySelectorAll('input[name="servicios"]');
  console.log("Checkboxes encontrados:", checkboxes.length);
  
  if (checkboxes.length === 0) {
    console.error("⚠️ No se encontraron checkboxes de servicios. Asegúrate de que mostrarServiciosEnFormulario() se ejecutó primero.");
    return;
  }
  
  checkboxes.forEach((checkbox) => {
    const checkboxId = parseInt(checkbox.value);
    if (serviciosIds.includes(checkboxId)) {
      checkbox.checked = true;
      checkbox.parentElement.style.background = "#ebf8ff";
      checkbox.parentElement.style.borderColor = "#4299e1";
      console.log(`✓ Servicio ${checkboxId} marcado`);
    }
  });
}

function configurarFormularioEdit() {
  const form = document.getElementById("form-editar-propiedad");
  form.addEventListener("submit", handleSubmitEdit);
}

async function handleSubmitEdit(e) {
  e.preventDefault();

  if (!confirm("¿Estás seguro de guardar los cambios?")) return;

  const formData = obtenerDatosFormularioEdit();

  try {
    const response = await fetch(
      `${API_BASE_URL_EDIT}/alojamientos/actualizar/${alojamientoIdEdit}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActualEdit.token}`
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      if (error.includes("permiso") || error.includes("autorizado")) {
        alert("No tienes permiso para modificar este alojamiento");
        window.location.href = `/pages/alojamiento/alojamiento.html?id=${alojamientoIdEdit}`;
        return;
      }
      throw new Error(error);
    }

    const resultado = await response.json();
    alert("Alojamiento actualizado exitosamente");
    window.location.href = `/pages/alojamiento/alojamiento.html?id=${resultado.id}`;
  } catch (error) {
    console.error("Error:", error);
    alert("Error al actualizar: " + error.message);
  }
}

function obtenerDatosFormularioEdit() {
  // Obtener servicios seleccionados como array de IDs
  const serviciosIds = Array.from(
    document.querySelectorAll('input[name="servicios"]:checked')
  ).map((checkbox) => parseInt(checkbox.value));

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
    depto: null,
    piso: null,
    ciudad: document.getElementById("ciudad").value.trim(),
    pais: document.getElementById("pais").value.trim(),
    serviciosId: serviciosIds,
  };
}