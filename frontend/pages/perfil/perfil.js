document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");
  const rol = localStorage.getItem("rol")?.trim().toUpperCase();
  const username = localStorage.getItem("username");

  if (!userId) {
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  // Mostrar información básica del usuario
  const nombreUsuario = document.querySelector(
    ".informacion-usuario p:first-of-type"
  );
  if (nombreUsuario) {
    nombreUsuario.textContent = username || "Usuario";
  }

  // Si es anfitrión, cargar sus propiedades
  if (rol === "ANFITRION") {
    document.getElementById("vista-anfitrion")?.style.removeProperty("display");
    await cargarPropiedadesAnfitrion(userId);
  }
});

async function cargarPropiedadesAnfitrion(anfitrionId) {
  const propiedadesSection = document.querySelector(".propiedades");

  if (!propiedadesSection) return;

  try {
    const propiedades = await apiService.getAlojamientosPorAnfitrion(
      anfitrionId
    );

    propiedadesSection.innerHTML = "";

    if (!propiedades || propiedades.length === 0) {
      propiedadesSection.innerHTML = `
        <p>No tienes propiedades registradas</p>
        <button class="nav-btn" data-target="/pages/alojamiento/agregarPropiedad/agregarPropiedad.html" 
                style="margin-top: 1rem;">Agregar nueva propiedad</button>
      `;
      return;
    }

    propiedades.forEach((propiedad) => {
      const propiedadDiv = document.createElement("div");
      propiedadDiv.className = "propiedad-foto";
      propiedadDiv.style.cursor = "pointer";

      // Usar campo imagen (URL única)
      const img = document.createElement("img");
      img.src = propiedad.imagen || "img/hotel5.jpg";
      img.alt = propiedad.nombre;
      img.style.width = "100%";
      img.style.height = "200px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "8px";

      const titulo = document.createElement("h4");
      titulo.textContent = propiedad.nombre;
      titulo.style.marginTop = "10px";

      // Mostrar precio usando precioNoche
      const precio = document.createElement("p");
      precio.textContent = `$${propiedad.precioNoche || "0"} / noche`;
      precio.style.color = "#059669";
      precio.style.fontWeight = "bold";

      propiedadDiv.appendChild(img);
      propiedadDiv.appendChild(titulo);
      propiedadDiv.appendChild(precio);

      propiedadDiv.addEventListener("click", () => {
        sessionStorage.setItem("alojamientoId", propiedad.id);
        window.location.href = "/pages/alojamiento/alojamiento.html";
      });

      propiedadesSection.appendChild(propiedadDiv);
    });
  } catch (error) {
    console.error("Error al cargar propiedades:", error);
    propiedadesSection.innerHTML = "<p>Error al cargar propiedades</p>";
  }
}