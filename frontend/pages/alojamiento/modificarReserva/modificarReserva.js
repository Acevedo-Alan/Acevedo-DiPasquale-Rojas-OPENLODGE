document.addEventListener("DOMContentLoaded", async () => {
  const alojamientoId = sessionStorage.getItem("alojamientoId");
  const userId = localStorage.getItem("userId");

  if (!alojamientoId || !userId) {
    alert("No se encontró información de la reserva");
    window.history.back();
    return;
  }

  await cargarDetallesReserva(alojamientoId, userId);
  setupBotones(alojamientoId, userId);
});

async function cargarDetallesReserva(alojamientoId, userId) {
  try {
    // Cargar detalles del alojamiento
    const alojamiento = await apiService.getAlojamientoById(alojamientoId);

    // Verificar si hay una reserva guardada en sessionStorage
    let reservaActual = null;
    const reservaGuardada = sessionStorage.getItem("reservaActual");
    
    if (reservaGuardada) {
      try {
        reservaActual = JSON.parse(reservaGuardada);
        // Verificar que la reserva guardada corresponde al alojamiento actual
        if (reservaActual.alojamiento?.id != alojamientoId) {
          reservaActual = null;
        }
      } catch (e) {
        console.error("Error al parsear reserva guardada:", e);
      }
    }

    // Si no hay reserva guardada, buscar en el historial
    if (!reservaActual) {
      // Cargar historial de reservas del usuario para encontrar la reserva actual
      const reservas = await apiService.obtenerHistorialUsuario(userId);

      // Buscar la reserva activa para este alojamiento
      reservaActual = reservas.find(
        (r) =>
          r.alojamiento?.id == alojamientoId && new Date(r.checkout) >= new Date()
      );
    }

    if (!reservaActual) {
      alert("No se encontró una reserva activa para este alojamiento");
      window.location.href = "/pages/perfil/historial/historial.html";
      return;
    }

    // Guardar la reserva en sessionStorage para uso posterior
    sessionStorage.setItem("reservaActual", JSON.stringify(reservaActual));
    sessionStorage.setItem("alojamientoId", alojamientoId);

    // Renderizar información
    renderizarInformacion(alojamiento, reservaActual);
  } catch (error) {
    console.error("Error al cargar detalles de la reserva:", error);
    alert("Error al cargar la información de la reserva: " + error.message);
    window.location.href = "/pages/perfil/historial/historial.html";
  }
}

function renderizarInformacion(alojamiento, reserva) {
  // Actualizar imagen - usando campo imagen
  const imagen = document.querySelector(".propiedad-imagen img");
  if (imagen && alojamiento.imagen) {
    imagen.src = alojamiento.imagen;
    imagen.alt = alojamiento.nombre;
  }

  // Actualizar nombre de la propiedad
  const nombre = document.querySelector(".propiedad-nombre");
  if (nombre) {
    nombre.textContent = alojamiento.nombre || "Propiedad";
  }

  // Actualizar dirección
  const direccion = document.querySelector(".propiedad-direccion");
  if (direccion && alojamiento.direccion) {
    const dir = alojamiento.direccion;
    direccion.textContent = `${dir.calle || ""} ${dir.numero || ""}, ${
      dir.barrio || ""
    }`;
  }

  // Actualizar precio - usando precioNoche
  const precio = document.querySelector(".propiedad-precio");
  if (precio) {
    precio.textContent = `$${alojamiento.precioNoche || "0"} / noche`;
  }

  // Actualizar dueño
  const dueno = document.querySelector(".propiedad-dueño");
  if (dueno) {
    dueno.textContent = `Anfitrión: ${alojamiento.anfitrion?.nombre || ""} ${
      alojamiento.anfitrion?.apellido || ""
    }`;
  }

  // Actualizar título con información de la reserva
  // Usando checkin y checkout
  const titulo = document.querySelector(".main-modificar-reserva h2");
  if (titulo && reserva) {
    const fechaInicio = new Date(reserva.checkin).toLocaleDateString();
    const fechaFin = new Date(reserva.checkout).toLocaleDateString();
    titulo.innerHTML = `
      Has reservado esta propiedad<br>
      <small style="font-size: 0.7em; color: #666;">
        Del ${fechaInicio} al ${fechaFin} - ${reserva.huespedes} huésped${
      reserva.huespedes > 1 ? "es" : ""
    }
      </small>
    `;
  }

  // Calcular tiempo restante para modificar (48 horas desde la creación de la reserva)
  if (reserva.fechaCreacion) {
    const fechaCreacion = new Date(reserva.fechaCreacion);
    const ahora = new Date();
    const horasTranscurridas = (ahora - fechaCreacion) / (1000 * 60 * 60);
    const horasRestantes = Math.max(0, 48 - horasTranscurridas);

    const mensajeTiempo = document.querySelector(".main-modificar-reserva > p");
    if (mensajeTiempo) {
      if (horasRestantes > 0) {
        mensajeTiempo.textContent = `Tienes ${Math.floor(
          horasRestantes
        )} horas para modificar la reserva`;
        mensajeTiempo.style.color = "#059669";
      } else {
        mensajeTiempo.textContent =
          "Ya no puedes modificar esta reserva (pasaron 48 horas)";
        mensajeTiempo.style.color = "#dc2626";

        // Deshabilitar botón de modificar
        const btnModificar = document.querySelector(
          '.buttons-container button[data-target*="formularioReserva"]'
        );
        if (btnModificar) {
          btnModificar.disabled = true;
          btnModificar.style.opacity = "0.5";
          btnModificar.style.cursor = "not-allowed";
        }
      }
    }
  }

  // Agregar información adicional de la reserva
  agregarDetallesReserva(reserva, alojamiento);
}

function agregarDetallesReserva(reserva, alojamiento) {
  const propiedadInfo = document.querySelector(".propiedad-info");

  if (!propiedadInfo || !reserva) return;

  // Verificar si ya existe el contenedor de detalles
  let detallesReserva = document.getElementById("detalles-reserva");

  if (!detallesReserva) {
    detallesReserva = document.createElement("div");
    detallesReserva.id = "detalles-reserva";
    detallesReserva.style.cssText = `
      margin-top: 20px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    `;

    // Usando checkin y checkout
    const fechaInicio = new Date(reserva.checkin).toLocaleDateString();
    const fechaFin = new Date(reserva.checkout).toLocaleDateString();
    const noches = Math.ceil(
      (new Date(reserva.checkout) - new Date(reserva.checkin)) /
        (1000 * 60 * 60 * 24)
    );

    // Calcular precio total
    const precioTotal = alojamiento.precioNoche
      ? (alojamiento.precioNoche * noches).toFixed(2)
      : "N/A";

    detallesReserva.innerHTML = `
      <h3 style="margin-top: 0; color: #059669;">Detalles de tu Reserva</h3>
      <div style="display: grid; gap: 10px;">
        <p><strong>Check-in:</strong> ${fechaInicio}</p>
        <p><strong>Check-out:</strong> ${fechaFin}</p>
        <p><strong>Noches:</strong> ${noches}</p>
        <p><strong>Huéspedes:</strong> ${reserva.huespedes}</p>
        <p><strong>Total estimado:</strong> $${precioTotal}</p>
      </div>
    `;

    propiedadInfo.appendChild(detallesReserva);
  }
}

function setupBotones(alojamientoId, userId) {
  // Botón Confirmar
  const btnConfirmar = document.querySelector(
    '.buttons-container button[data-target*="alojamiento.html"]'
  );
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", (e) => {
      e.preventDefault();
      confirmarReserva();
    });
  }

  // Botón Modificar
  const btnModificar = document.querySelector(
    '.buttons-container button[data-target*="formularioReserva"]'
  );
  if (btnModificar && !btnModificar.disabled) {
    btnModificar.addEventListener("click", (e) => {
      e.preventDefault();
      modificarReserva();
    });
  }

  // Agregar botón de cancelar
  agregarBotonCancelar(alojamientoId, userId);
}

function confirmarReserva() {
  mostrarPopup(
    "Reserva confirmada",
    "Tu reserva está confirmada. Puedes ver los detalles en tu historial.",
    () => {
      window.location.href = "/pages/perfil/historial/historial.html";
    }
  );
}

function modificarReserva() {
  // Guardar flag para indicar que estamos modificando
  sessionStorage.setItem("modificandoReserva", "true");
  window.location.href =
    "/pages/alojamiento/formularioReserva/formularioReserva.html";
}

function agregarBotonCancelar(alojamientoId, userId) {
  const buttonsContainer = document.querySelector(".buttons-container");

  if (!buttonsContainer) return;

  const btnCancelar = document.createElement("button");
  btnCancelar.className = "btn-cancelar";
  btnCancelar.textContent = "Cancelar Reserva";
  btnCancelar.style.cssText = `
    background: #dc2626;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
  `;

  btnCancelar.addEventListener("click", async () => {
    const confirmacion = confirm(
      "¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer."
    );

    if (!confirmacion) return;

    try {
      btnCancelar.textContent = "Cancelando...";
      btnCancelar.disabled = true;

      await apiService.cancelarReserva(userId, alojamientoId);

      mostrarPopup(
        "Reserva cancelada",
        "Tu reserva ha sido cancelada exitosamente.",
        () => {
          sessionStorage.removeItem("alojamientoId");
          sessionStorage.removeItem("reservaActual");
          window.location.href = "/pages/perfil/historial/historial.html";
        }
      );
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      alert("Error al cancelar la reserva: " + error.message);
      btnCancelar.textContent = "Cancelar Reserva";
      btnCancelar.disabled = false;
    }
  });

  buttonsContainer.appendChild(btnCancelar);
}

function mostrarPopup(titulo, mensaje, callback) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const popup = document.createElement("div");
  popup.style.cssText = `
    background: #fff;
    padding: 30px 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    text-align: center;
    font-family: Arial, sans-serif;
    max-width: 400px;
  `;

  popup.innerHTML = `
    <h2 style="color:#059669; margin-bottom:15px;">${titulo}</h2>
    <p style="margin-bottom:20px; color:#666;">${mensaje}</p>
    <button id="cerrar-popup" style="
      background-color:#059669;
      color:white;
      border:none;
      padding:12px 30px;
      border-radius:8px;
      cursor:pointer;
      font-size:16px;
      font-weight: 600;
    ">Aceptar</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  document.getElementById("cerrar-popup").addEventListener("click", () => {
    overlay.remove();
    if (callback) callback();
  });
}
