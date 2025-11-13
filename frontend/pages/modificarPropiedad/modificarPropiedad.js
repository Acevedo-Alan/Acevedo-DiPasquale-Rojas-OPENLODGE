// editarAlojamiento.js - Modificar alojamiento existente
const API_BASE_URL = "http://localhost:8080";

let alojamientoId = null;
let usuarioActual = null;
let alojamientoOriginal = null;

// Inicializar
document.addEventListener("DOMContentLoaded", async () => {
  cargarUsuarioActual();

  // Validación: usuario debe estar logueado
  if (!usuarioActual) {
    alert("Debes iniciar sesión para acceder a esta página");
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  // Validación: usuario debe ser anfitrión
  if (usuarioActual.rol !== "ANFITRION") {
    alert(
      "Solo los anfitriones pueden modificar alojamientos. Tu rol actual es: " +
        usuarioActual.rol
    );
    window.location.href = "/index.html";
    return;
  }

  // Obtener ID del alojamiento de la URL
  const urlParams = new URLSearchParams(window.location.search);
  alojamientoId = urlParams.get("id");

  if (!alojamientoId) {
    alert("No se especificó un alojamiento para editar");
    window.location.href = "/index.html";
    return;
  }

  await cargarDatosAlojamiento(alojamientoId);
  configurarFormulario();
});


function cargarUsuarioActual() {
  const userData = sessionStorage.getItem("usuario");
  if (userData) {
    usuarioActual = JSON.parse(userData);
  }
}

async function cargarDatosAlojamiento(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/alojamientos/getAlojamiento/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar alojamiento");
    }

    alojamientoOriginal = await response.json();
    if (alojamientoOriginal.anfitrionId !== usuarioActual.id) {
      alert(
        "No tienes permiso para modificar este alojamiento. Solo el propietario puede editarlo."
      );
      window.location.href = `/pages/alojamiento/alojamiento.html?id=${id}`;
      return;
    }

    llenarFormulario(alojamientoOriginal);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar los datos del alojamiento: " + error.message);
    window.location.href = "/index.html";
  }
}

// Llenar formulario con datos existentes
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

    if (alojamiento.direccion.ciudad) {
      document.getElementById("ciudad").value =
        alojamiento.direccion.ciudad.nombre || "";

      if (alojamiento.direccion.ciudad.pais) {
        document.getElementById("pais").value =
          alojamiento.direccion.ciudad.pais.nombre || "";
      }
    }
  }
}

// Configurar formulario
function configurarFormulario() {
  const form = document.getElementById("form-editar-propiedad");
  form.addEventListener("submit", handleSubmit);
}

// Manejar envío del formulario
async function handleSubmit(e) {
  e.preventDefault();

  // Confirmar cambios
  if (!confirm("¿Estás seguro de guardar los cambios en este alojamiento?")) {
    return;
  }

  const formData = obtenerDatosFormulario();

  try {
    const response = await fetch(
      `${API_BASE_URL}/alojamientos/actualizarAlojamiento/${alojamientoId}/?anfitrionId=${usuarioActual.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const resultado = await response.json();
    alert("Alojamiento actualizado exitosamente");
    window.location.href = `/pages/alojamiento/alojamiento.html?id=${resultado.id}`;
  } catch (error) {
    console.error("Error:", error);
    alert("Error al actualizar el alojamiento: " + error.message);
  }
}

// Obtener datos del formulario
function obtenerDatosFormulario() {
  // Preservar el ID de dirección si existe
  const direccionId = alojamientoOriginal?.direccion?.id || null;
  const ciudadId = alojamientoOriginal?.direccion?.ciudad?.id || null;
  const paisId = alojamientoOriginal?.direccion?.ciudad?.pais?.id || null;

  return {
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    imagen: document.getElementById("imagen").value.trim(),
    precioNoche: parseFloat(document.getElementById("precioNoche").value),
    capacidadHuespedes: parseInt(
      document.getElementById("capacidadHuespedes").value
    ),
    direccion: {
      id: direccionId, // Preservar ID para actualización
      calle: document.getElementById("calle").value.trim(),
      numero: parseInt(document.getElementById("numero").value),
      depto: null,
      piso: null,
      ciudad: {
        id: ciudadId, // Preservar ID si existe
        nombre: document.getElementById("ciudad").value.trim(),
        pais: {
          id: paisId, // Preservar ID si existe
          nombre: document.getElementById("pais").value.trim(),
        },
      },
    },
    servicios: alojamientoOriginal?.servicios || [], // Preservar servicios existentes
  };
}

// Validar que los datos hayan cambiado
function hayCambios() {
  const datosActuales = obtenerDatosFormulario();

  // Comparación básica
  return (
    JSON.stringify(datosActuales) !==
    JSON.stringify({
      nombre: alojamientoOriginal.nombre,
      descripcion: alojamientoOriginal.descripcion,
      imagen: alojamientoOriginal.imagen,
      precioNoche: alojamientoOriginal.precioNoche,
      capacidadHuespedes: alojamientoOriginal.capacidadHuespedes,
    })
  );
}
