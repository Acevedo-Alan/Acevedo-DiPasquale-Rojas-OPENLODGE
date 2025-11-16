const API_BASE_URL_EDIT = "http://localhost:8080";

let alojamientoIdEdit = null;
let usuarioActualEdit = null;
let alojamientoOriginal = null;

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

  await cargarDatosAlojamientoEdit(alojamientoIdEdit);
  configurarFormularioEdit();
});

async function cargarDatosAlojamientoEdit(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL_EDIT}/alojamientos/getAlojamiento/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error al cargar alojamiento");

    alojamientoOriginal = await response.json();

    //Verificar que el anfitrión sea el dueño
    if (alojamientoOriginal.anfitrionId !== usuarioActualEdit.id) {
      alert(
        "No tienes permiso para modificar este alojamiento. Solo el propietario puede editarlo."
      );
      window.location.href = `/pages/alojamiento/alojamiento.html?id=${id}`;
      return;
    }

    llenarFormularioEdit(alojamientoOriginal);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar los datos del alojamiento");
    window.location.href = "/pages/index/index.html";
  }
}

function llenarFormularioEdit(alojamiento) {
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
      `${API_BASE_URL_EDIT}/alojamientos/actualizarAlojamiento/${alojamientoIdEdit}/?anfitrionId=${usuarioActualEdit.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const error = await response.text();

      // Manejar error específico de permisos
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
  return {
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    imagen: document.getElementById("imagen").value.trim(),
    precioNoche: parseFloat(document.getElementById("precioNoche").value),
    capacidadHuespedes: parseInt(
      document.getElementById("capacidadHuespedes").value
    ),
    direccion: {
      id: alojamientoOriginal?.direccion?.id,
      calle: document.getElementById("calle").value.trim(),
      numero: parseInt(document.getElementById("numero").value),
      depto: null,
      piso: null,
      ciudad: {
        id: alojamientoOriginal?.direccion?.ciudad?.id,
        nombre: document.getElementById("ciudad").value.trim(),
        pais: {
          id: alojamientoOriginal?.direccion?.ciudad?.pais?.id,
          nombre: document.getElementById("pais").value.trim(),
        },
      },
    },
    servicios: alojamientoOriginal?.servicios || [],
  };
}
