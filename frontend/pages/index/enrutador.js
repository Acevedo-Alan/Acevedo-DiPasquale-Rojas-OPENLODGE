document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".nav-btn");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const destino = boton.dataset.target;
      window.location.href = destino;
    });
  });
});
