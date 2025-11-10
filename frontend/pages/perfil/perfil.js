const API_URL_PROPIEDADES_ANFITRION =
  `http://localhost:8080/alojamientos/getAlojamiento/anfitrion/`;

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  document.querySelector(".informacion-usuario p:first-of-type").textContent =
    usuario.username;

  if (usuario.rol === "ANFITRION") {
    document.getElementById("vista-anfitrion").style.display = "block";
    await cargarPropiedadesAnfitrion(usuario.userId);
  }
});

async function cargarPropiedadesAnfitrion(anfitrionId) {
  const section = document.querySelector(".propiedades");
  if (!section) return;

  try {
    const response = await fetch(`${API_URL_PROPIEDADES_ANFITRION}/${anfitrionId}`);
    const propiedades = await response.json();

    section.innerHTML = "";

    if (!propiedades.length) {
      section.innerHTML = "<p>No tienes propiedades registradas</p>";
      return;
    }

    propiedades.forEach((p) => {
      const div = document.createElement("div");
      div.className = "propiedad-foto";
      div.innerHTML = `
        <img src="${p.imagen || "img/hotel5.jpg"}" alt="${p.nombre}">
        <h4>${p.nombre}</h4>
        <p>$${p.precioNoche} / noche</p>
      `;
      div.onclick = () => {
        sessionStorage.setItem("alojamientoId", p.id);
        window.location.href = "/pages/alojamiento/alojamiento.html";
      };
      section.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar propiedades:", error);
    section.innerHTML = "<p>Error al cargar propiedades</p>";
  }
}
