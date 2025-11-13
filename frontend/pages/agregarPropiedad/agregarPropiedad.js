const API_BASE_URL = "http://localhost:8080";

let modoEdicion = false;
let alojamientoId = null;
let usuarioActual = null;

document.addEventListener("DOMContentLoaded", async () => {
  cargarUsuarioActual();

  if (usuarioActual.rol !== "ANFITRION") {
    alert("No puedes crear alojamientos");
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

  configurarFormulario();
});

function cargarUsuarioActual() {
  const userData = localStorage.getItem("usuario");
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
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error al cargar alojamiento");

    const alojamiento = await response.json();
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
  return {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    imagen: document.getElementById("imagen").value,
    precioNoche: parseFloat(document.getElementById("precioNoche").value),
    capacidadHuespedes: parseInt(
      document.getElementById("capacidadHuespedes").value
    ),
    direccion: {
      calle: document.getElementById("calle").value,
      numero: parseInt(document.getElementById("numero").value),
      depto: document.getElementById("depto")?.value || null,
      piso: document.getElementById("piso")?.value
        ? parseInt(document.getElementById("piso").value)
        : null,
      ciudad: {
        nombre: document.getElementById("ciudad").value,
        pais: {
          nombre: document.getElementById("pais").value,
        },
      },
    },
    servicios: [],
  };
}
