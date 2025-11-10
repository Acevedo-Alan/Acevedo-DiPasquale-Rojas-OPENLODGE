const API_URL_HISTORIAL = "<URL_HISTORIAL>"; // Ej: http://localhost:8080/api/reservas/historial/

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }
  await cargarHistorialReservas(usuario.userId);
});

async function cargarHistorialReservas(userId) {
  const main = document.querySelector(".main-historial");
  if (!main) return;

  try {
    const response = await fetch(API_URL_HISTORIAL + userId);
    const reservas = await response.json();

    main.innerHTML = "";

    if (!reservas.length) {
      main.innerHTML = "<p>No tienes reservas en tu historial</p>";
      return;
    }

    reservas.forEach((r) => {
      const div = document.createElement("div");
      div.className = "historial-container";

      const checkin = new Date(r.checkin);
      const checkout = new Date(r.checkout);
      const noches = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

      div.innerHTML = `
        <p>
          <strong>${r.alojamiento?.nombre || "Propiedad"}</strong><br>
          Del ${checkin.toLocaleDateString()} al ${checkout.toLocaleDateString()} (${noches} noche${
        noches > 1 ? "s" : ""
      })<br>
          Total: $${(r.alojamiento?.precioNoche || 0) * noches}
        </p>
      `;

      div.onclick = () => {
        sessionStorage.setItem("alojamientoId", r.alojamiento.id);
        window.location.href =
          checkout < new Date()
            ? "/pages/alojamiento/alojamiento.html"
            : "/pages/alojamiento/modificarReserva/modificarReserva.html";
      };

      main.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar historial:", error);
    main.innerHTML = "<p>Error al cargar el historial</p>";
  }
}
