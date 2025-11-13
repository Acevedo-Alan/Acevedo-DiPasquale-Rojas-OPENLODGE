const API_URL_PROPIEDADES_ANFITRION =
  "http://localhost:8080/alojamientos/getAlojamiento/anfitrion";

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario")); // ✅ localStorage

  if (!usuario) {
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  document.querySelector(".username").textContent = usuario.username;

  if (usuario.rol === "ANFITRION") {
    document.getElementById("vista-anfitrion").style.display = "block";
    await cargarPropiedadesAnfitrion(usuario.id); // ✅ Usar 'id', no 'userId'
  }

  // Botón cerrar sesión
  document.querySelector(".logout").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "/pages/autenticacion/login/login.html";
  });
});

async function cargarPropiedadesAnfitrion(anfitrionId) {
  const lista = document.querySelector(".propiedades-lista");
  if (!lista) return;

  try {
    const response = await fetch(
      `${API_URL_PROPIEDADES_ANFITRION}/${anfitrionId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error al cargar propiedades");

    const propiedades = await response.json();

    lista.innerHTML = "";

    if (!propiedades.length) {
      lista.innerHTML = "<p>No tienes propiedades registradas</p>";
      return;
    }

    propiedades.forEach((p) => {
      const div = document.createElement("div");
      div.className = "propiedad-card";
      div.innerHTML = `
        <img src="${p.imagen || "/img/placeholder.jpg"}" alt="${p.nombre}">
        <h4>${p.nombre}</h4>
        <p>$${p.precioNoche} / noche</p>
      `;
      div.style.cursor = "pointer";
      div.onclick = () => {
        window.location.href = `/pages/alojamiento/alojamiento.html?id=${p.id}`;
      };
      lista.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar propiedades:", error);
    lista.innerHTML = "<p>Error al cargar propiedades</p>";
  }
}
