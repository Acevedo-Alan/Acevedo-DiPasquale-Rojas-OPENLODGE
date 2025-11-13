// alojamiento.js - Carga dinámica de detalles del alojamiento
// Actualizado para los campos correctos del backend
document.addEventListener("DOMContentLoaded", async () => {
  const alojamientoId = sessionStorage.getItem("alojamientoId");

  if (!alojamientoId) {
    alert("No se especificó un alojamiento");
    window.location.href = "/pages/index/index.html";
    return;
  }

  await cargarDetallesAlojamiento(alojamientoId);
  setupEliminarPropiedad(alojamientoId);
});

async function cargarDetallesAlojamiento(id) {
  try {
    const alojamiento = await apiService.getAlojamientoById(id);
    const userId = localStorage.getItem("userId");
    const rol = localStorage.getItem("rol")?.trim().toUpperCase();

    // Determinar si el usuario es el anfitrión de esta propiedad
    const esAnfitrion =
      rol === "ANFITRION" && alojamiento.anfitrion?.id == userId;

    // Verificar si el usuario tiene una reserva activa para este alojamiento
    let tieneReservaActiva = false;
    if (userId && !esAnfitrion) {
      try {
        const reservas = await apiService.obtenerHistorialUsuario(userId);
        tieneReservaActiva = reservas.some(
          (r) =>
            r.alojamiento?.id == id && new Date(r.checkout) >= new Date()
        );
      } catch (error) {
        console.error("Error al verificar reservas:", error);
      }
    }

    // Mostrar la vista apropiada
    if (esAnfitrion) {
      document.getElementById("vista-anfitrion").style.display = "block";
      document.getElementById("vista-huesped").style.display = "none";
    } else {
      document.getElementById("vista-huesped").style.display = "block";
      document.getElementById("vista-anfitrion").style.display = "none";
    }

    // Renderizar detalles en ambas vistas
    renderizarDetalles(alojamiento, tieneReservaActiva);
  } catch (error) {
    console.error("Error al cargar alojamiento:", error);
    alert("Error al cargar los detalles del alojamiento");
    window.location.href = "/pages/index/index.html";
  }
}

function renderizarDetalles(alojamiento, tieneReservaActiva = false) {
  // Actualizar título en ambas vistas
  document.querySelectorAll("#nombre-propiedad").forEach((el) => {
    el.textContent = alojamiento.nombre || "Propiedad";
  });

  // Actualizar localidad - usando direccion.ciudad
  document.querySelectorAll("#localidad").forEach((el) => {
    if (alojamiento.direccion?.ciudad) {
      el.textContent = `${alojamiento.direccion.ciudad.nombre || ""}, ${
        alojamiento.direccion.ciudad.pais || ""
      }`;
    } else {
      el.textContent = "Ubicación no disponible";
    }
  });

  // Actualizar dirección completa
  document.querySelectorAll("#direccion").forEach((el) => {
    if (alojamiento.direccion) {
      const dir = alojamiento.direccion;
      el.textContent = `${dir.calle || ""} ${dir.numero || ""}, ${
        dir.barrio || ""
      }`;
    } else {
      el.textContent = "Dirección no disponible";
    }
  });

  // Actualizar anfitrión
  document.querySelectorAll("#nombre-anfitrion").forEach((el) => {
    el.textContent = `Anfitrión: ${
      alojamiento.anfitrion?.nombre || "No disponible"
    } ${alojamiento.anfitrion?.apellido || ""}`;
  });

  // Actualizar precio - usando precioNoche
  document.querySelectorAll("#precio-propiedad").forEach((el) => {
    el.textContent = `$${alojamiento.precioNoche || "0"} / noche`;
  });

  // Actualizar disponibilidad
  document.querySelectorAll("#disponibilidad").forEach((el) => {
    el.textContent = `Disponible: ${alojamiento.disponible ? "Sí" : "No"}`;
  });

  // Renderizar servicios
  renderizarServicios(alojamiento.servicios);

  // Actualizar carrusel de imágenes - usando campo imagen (URL única)
  if (alojamiento.imagen) {
    actualizarCarrusel([alojamiento.imagen]);
  }

  // Actualizar capacidad - usando capacidadHuespedes
  if (alojamiento.capacidadHuespedes) {
    const capacidadEl = document.createElement("h3");
    capacidadEl.textContent = `Capacidad máxima: ${alojamiento.capacidadHuespedes} huéspedes`;
    document.querySelectorAll(".carrusel-alojamiento").forEach((el) => {
      el.appendChild(capacidadEl.cloneNode(true));
    });
  }

  // Mostrar descripción si existe
  if (alojamiento.descripcion) {
    const descripcionEl = document.createElement("p");
    descripcionEl.textContent = alojamiento.descripcion;
    descripcionEl.style.cssText = "margin-top: 10px; color: #666;";
    document.querySelectorAll(".carrusel-alojamiento").forEach((el) => {
      el.appendChild(descripcionEl.cloneNode(true));
    });
  }

  // Ocultar botón "Modificar reserva" si no hay reserva activa
  const botonesModificar = document.querySelectorAll(
    'button[data-target*="modificarReserva"]'
  );
  botonesModificar.forEach((boton) => {
    if (!tieneReservaActiva) {
      boton.style.display = "none";
    } else {
      boton.style.display = "";
    }
  });

  // Configurar botón de calendario para ambas vistas
  setupCalendarioDisponibilidad(alojamiento.id);
  setupCalendarioDisponibilidadAnfitrion(alojamiento.id);
}

function setupCalendarioDisponibilidad(alojamientoId) {
  const btnCalendario = document.getElementById("btn-ver-calendario");
  const containerCalendario = document.getElementById("calendario-container");

  if (!btnCalendario || !containerCalendario) return;

  let calendario = null;
  let visible = false;

  btnCalendario.addEventListener("click", async () => {
    if (!visible) {
      // Mostrar calendario
      containerCalendario.style.display = "block";
      btnCalendario.textContent = "Ocultar calendario";

      if (!calendario) {
        calendario = new ReservationCalendar("calendario-container", alojamientoId);
        await calendario.init();
      } else {
        calendario.render();
      }

      visible = true;
    } else {
      // Ocultar calendario
      containerCalendario.style.display = "none";
      btnCalendario.textContent = "Ver calendario de disponibilidad";
      visible = false;
    }
  });
}

function setupCalendarioDisponibilidadAnfitrion(alojamientoId) {
  const btnCalendario = document.getElementById("btn-ver-calendario-anfitrion");
  const containerCalendario = document.getElementById("calendario-container-anfitrion");

  if (!btnCalendario || !containerCalendario) return;

  let calendario = null;
  let visible = false;

  btnCalendario.addEventListener("click", async () => {
    if (!visible) {
      // Mostrar calendario
      containerCalendario.style.display = "block";
      btnCalendario.textContent = "Ocultar calendario";

      if (!calendario) {
        calendario = new ReservationCalendar("calendario-container-anfitrion", alojamientoId);
        await calendario.init();
      } else {
        calendario.render();
      }

      visible = true;
    } else {
      // Ocultar calendario
      containerCalendario.style.display = "none";
      btnCalendario.textContent = "Ver calendario de disponibilidad";
      visible = false;
    }
  });
}

function renderizarServicios(servicios) {
  const contenedores = document.querySelectorAll("#servicios-alojamiento");

  contenedores.forEach((contenedor) => {
    contenedor.innerHTML = "";

    if (!servicios || servicios.length === 0) {
      contenedor.innerHTML = "<p>No hay servicios disponibles</p>";
      return;
    }

    servicios.forEach((servicio) => {
      const servicioDiv = document.createElement("div");
      servicioDiv.className = "carrusel-servicios";
      servicioDiv.textContent = servicio.nombre || servicio;
      contenedor.appendChild(servicioDiv);
    });
  });
}

function actualizarCarrusel(imagenes) {
  const carruseles = document.querySelectorAll(".carrusel");

  carruseles.forEach((carrusel) => {
    carrusel.innerHTML = "";

    imagenes.forEach((imagen, index) => {
      const img = document.createElement("img");
      img.src = imagen;
      img.alt = `Imagen ${index + 1}`;
      img.style.width = "100%";
      img.style.height = "400px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "8px";

      if (index === 0) {
        carrusel.appendChild(img);
      }
    });
  });
}

function setupEliminarPropiedad(alojamientoId) {
  const btnEliminar = document.querySelector(".eliminar-popup");

  if (!btnEliminar) return;

  btnEliminar.addEventListener("click", async (e) => {
    e.preventDefault();

    const confirmacion = confirm(
      "¿Estás seguro de que deseas eliminar esta propiedad?"
    );

    if (!confirmacion) return;

    try {
      await apiService.eliminarAlojamiento(alojamientoId);
      alert("Propiedad eliminada exitosamente");
      window.location.href = "/pages/perfil/perfil.html";
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      alert("Error al eliminar la propiedad: " + error.message);
    }
  });
}

// Setup botones de reserva
document.addEventListener("DOMContentLoaded", () => {
  const botonesReservar = document.querySelectorAll(
    'button[data-target*="formularioReserva"]'
  );

  botonesReservar.forEach((boton) => {
    boton.addEventListener("click", () => {
      // El alojamientoId ya está en sessionStorage
      // Solo navegar a la página de reserva
      window.location.href =
        "/pages/alojamiento/formularioReserva/formularioReserva.html";
    });
  });
});
