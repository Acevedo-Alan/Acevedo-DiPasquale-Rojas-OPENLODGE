document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    window.history.back();
    return;
  }

  await cargarHistorialReservas(userId);
});

async function cargarHistorialReservas(userId) {
  const mainHistorial = document.querySelector(".main-historial");

  if (!mainHistorial) return;

  try {
    const reservas = await apiService.obtenerHistorialUsuario(userId);

    mainHistorial.innerHTML = "";

    if (!reservas || reservas.length === 0) {
      mainHistorial.innerHTML = `
        <div class="historial-container">
          <p>No tienes reservas en tu historial</p>
          <button class="nav-btn" data-target="/pages/index/index.html" 
                  style="margin-top: 1rem;">Explorar propiedades</button>
        </div>
      `;
      return;
    }

    reservas.forEach((reserva) => {
      const container = document.createElement("div");
      container.className = "historial-container";
      container.style.cursor = "pointer";

      const profilePic = document.createElement("div");
      profilePic.className = "profile-pic";
      profilePic.textContent = "-";

      const info = document.createElement("p");

      // Usar checkin y checkout
      const fechaInicio = new Date(reserva.checkin).toLocaleDateString();
      const fechaFin = new Date(reserva.checkout).toLocaleDateString();

      // Calcular noches
      const noches = Math.ceil(
        (new Date(reserva.checkout) - new Date(reserva.checkin)) /
          (1000 * 60 * 60 * 24)
      );

      // Calcular precio total si está disponible
      let precioTotal = "N/A";
      if (reserva.alojamiento?.precioNoche) {
        precioTotal = `$${(reserva.alojamiento.precioNoche * noches).toFixed(
          2
        )}`;
      }

      info.innerHTML = `
        <strong>${reserva.alojamiento?.nombre || "Propiedad"}</strong><br>
        Del ${fechaInicio} al ${fechaFin} (${noches} noche${
        noches > 1 ? "s" : ""
      })<br>
        ${reserva.huespedes} huésped${reserva.huespedes > 1 ? "es" : ""}<br>
        Total: ${precioTotal}
      `;

      // Agregar indicador de estado
      const ahora = new Date();
      const checkout = new Date(reserva.checkout);
      const estado = document.createElement("span");

      if (checkout < ahora) {
        estado.textContent = "Completada";
        estado.style.color = "#6b7280";
      } else {
        estado.textContent = " 🔵 Activa";
        estado.style.color = "#059669";
      }

      info.appendChild(estado);

      container.appendChild(profilePic);
      container.appendChild(info);

      container.addEventListener("click", () => {
        if (reserva.alojamiento?.id) {
          sessionStorage.setItem("alojamientoId", reserva.alojamiento.id);

          // Si la reserva está activa, ir a modificar reserva
          if (checkout >= ahora) {
            window.location.href =
              "/pages/alojamiento/modificarReserva/modificarReserva.html";
          } else {
            // Si está completada, ir a ver detalles del alojamiento
            window.location.href = "/pages/alojamiento/alojamiento.html";
          }
        }
      });

      mainHistorial.appendChild(container);
    });
  } catch (error) {
    console.error("Error al cargar historial:", error);
    mainHistorial.innerHTML = `
      <div class="historial-container">
        <p>Error al cargar el historial de reservas</p>
      </div>
    `;
  }
}