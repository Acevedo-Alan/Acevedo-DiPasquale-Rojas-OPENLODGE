document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".nav-btn");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const destino = boton.dataset.target;

      // Crear overlay verde
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "green";
      overlay.style.zIndex = "9999"; // por encima de todo
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.innerHTML = `<h1 style="color: white; font-size: 2rem;">Cargando...</h1>`;

      // Agregar overlay al body
      document.body.appendChild(overlay);

      // Dar un pequeño delay para que se vea el overlay antes de redirigir
      setTimeout(() => {
        window.location.href = destino;
      }, 200); // 200ms, ajustá si querés que dure más
    });
  });
});
