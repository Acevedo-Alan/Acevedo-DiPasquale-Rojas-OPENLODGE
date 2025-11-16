const API_URL_HISTORIAL = "http://localhost:8080/reservas/historial/usuario";

document.addEventListener("DOMContentLoaded", async () => {
  // userRoleManager.js ya verifica la sesión
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  await cargarHistorialReservas(usuario.id);
});

async function cargarHistorialReservas(usuarioId) {
  const main = document.querySelector(".main-historial");
  if (!main) return;

  try {
    const response = await fetch(`${API_URL_HISTORIAL}/${usuarioId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Error al cargar historial");

    const reservas = await response.json();

    main.innerHTML = "";

    if (!reservas.length) {
      main.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #718096;">
          <svg style="width: 64px; height: 64px; margin: 0 auto 1rem; opacity: 0.5;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h3>No tienes reservas en tu historial</h3>
          <p>Comienza a explorar alojamientos para hacer tu primera reserva</p>
          <button onclick="window.location.href='/pages/index/index.html'" 
                  style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Explorar alojamientos
          </button>
        </div>
      `;
      return;
    }

    // Cargar datos de alojamientos para cada reserva
    const reservasConAlojamiento = await Promise.all(
      reservas.map(async (reserva) => {
        try {
          const alojResponse = await fetch(
            `http://localhost:8080/alojamientos/getAlojamiento/${reserva.alojamientoId}`,
            {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (alojResponse.ok) {
            const alojamiento = await alojResponse.json();
            return { ...reserva, alojamiento };
          }
          return reserva;
        } catch (error) {
          console.error("Error al cargar alojamiento:", error);
          return reserva;
        }
      })
    );

    // Ordenar por fecha de check-in descendente
    reservasConAlojamiento.sort(
      (a, b) => new Date(b.checkin) - new Date(a.checkin)
    );

    reservasConAlojamiento.forEach((r) => {
      const div = document.createElement("div");
      div.className = "historial-container";

      const checkin = new Date(r.checkin);
      const checkout = new Date(r.checkout);
      const ahora = new Date();
      const noches = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
      const precioNoche = r.alojamiento?.precioNoche || 0;
      const total = r.importe || precioNoche * noches;

      // Determinar estado de la reserva
      let estadoBadge = "";
      let esReservaPasada = checkout < ahora;
      let esReservaActiva = checkin <= ahora && checkout >= ahora;
      let esReservaFutura = checkin > ahora;

      if (esReservaPasada) {
        estadoBadge =
          '<span style="background: #e2e8f0; color: #4a5568; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">Completada</span>';
      } else if (esReservaActiva) {
        estadoBadge =
          '<span style="background: #48bb78; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">En curso</span>';
      } else {
        estadoBadge =
          '<span style="background: #4299e1; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">Próxima</span>';
      }

      const nombreAlojamiento =
        r.alojamiento?.nombre || "Alojamiento no disponible";
      const imagenAlojamiento =
        r.alojamiento?.imagen || "https://via.placeholder.com/150";

      div.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: start;">
          <img src="${imagenAlojamiento}" 
               alt="${nombreAlojamiento}"
               style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px;"
               onerror="this.src='https://via.placeholder.com/150'">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
              <h4 style="margin: 0; font-size: 1.25rem;">${nombreAlojamiento}</h4>
              ${estadoBadge}
            </div>
            <p style="margin: 0.5rem 0; color: #4a5568;">
              <strong>Check-in:</strong> ${checkin.toLocaleDateString("es-ES", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}<br>
              <strong>Check-out:</strong> ${checkout.toLocaleDateString(
                "es-ES",
                {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}<br>
              <strong>Duración:</strong> ${noches} noche${
        noches > 1 ? "s" : ""
      }<br>
              <strong>Huéspedes:</strong> ${r.huespedes}<br>
              <strong>Total pagado:</strong> <span style="font-size: 1.1rem; color: #2d3748; font-weight: 600;">$${total.toFixed(
                2
              )}</span>
            </p>
          </div>
        </div>
      `;

      div.style.cursor = "pointer";
      div.style.transition = "transform 0.2s, box-shadow 0.2s";

      div.addEventListener("mouseenter", () => {
        div.style.transform = "translateY(-2px)";
        div.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      });

      div.addEventListener("mouseleave", () => {
        div.style.transform = "translateY(0)";
        div.style.boxShadow = "";
      });

      div.addEventListener("click", () => {
        if (r.alojamiento) {
          // Si es reserva futura, puede ir a modificarla
          if (esReservaFutura) {
            window.location.href = `/pages/alojamiento/modificarReserva/modificarReserva.html?alojamientoId=${r.alojamientoId}`;
          } else {
            // Si es pasada o en curso, solo ver detalles
            window.location.href = `/pages/alojamiento/alojamiento.html?id=${r.alojamientoId}`;
          }
        }
      });

      main.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar historial:", error);
    main.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #e53e3e;">
        <p>Error al cargar el historial de reservas</p>
        <p style="font-size: 0.9rem;">${error.message}</p>
      </div>
    `;
  }
}
