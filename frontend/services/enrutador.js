document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".nav-btn");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const destino = boton.dataset.target;

      // Crear overlay estilizado
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "linear-gradient(135deg, #6b9b7a, #5a8a68)";
      overlay.style.backdropFilter = "blur(10px)";
      overlay.style.zIndex = "9999";
      overlay.style.display = "flex";
      overlay.style.flexDirection = "column";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.3s ease";

      const content = document.createElement("div");
      content.style.textAlign = "center";
      content.style.animation = "fadeInScale 0.5s ease forwards";

      const spinner = document.createElement("div");
      spinner.style.width = "50px";
      spinner.style.height = "50px";
      spinner.style.border = "4px solid rgba(255, 255, 255, 0.3)";
      spinner.style.borderTop = "4px solid #ffffff";
      spinner.style.borderRadius = "50%";
      spinner.style.animation = "spin 1s linear infinite";
      spinner.style.marginBottom = "1.5rem";

      const loadingText = document.createElement("h1");
      loadingText.textContent = "Cargando...";
      loadingText.style.color = "#ffffff";
      loadingText.style.fontSize = "1.5rem";
      loadingText.style.fontWeight = "600";
      loadingText.style.margin = "0";
      loadingText.style.fontFamily = "inherit";

      // Crear logo pequeño (opcional)
      const logo = document.createElement("div");
      logo.style.width = "30px";
      logo.style.height = "30px";
      logo.style.background = "rgba(255, 255, 255, 0.2)";
      logo.style.borderRadius = "8px";
      logo.style.display = "flex";
      logo.style.alignItems = "center";
      logo.style.justifyContent = "center";
      logo.style.marginBottom = "1rem";
      logo.style.fontSize = "12px";
      logo.style.fontWeight = "bold";
      logo.style.color = "#ffffff";
      logo.textContent = "OL";

      // Agregar estilos de animación al head si no existen
      if (!document.querySelector("#overlay-animations")) {
        const style = document.createElement("style");
        style.id = "overlay-animations";
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `;
        document.head.appendChild(style);
      }

      content.appendChild(logo);
      content.appendChild(spinner);
      content.appendChild(loadingText);
      overlay.appendChild(content);
      document.body.appendChild(overlay);

      // Animar entrada del overlay
      setTimeout(() => {
        overlay.style.opacity = "1";
      }, 10);

      // Agregar efecto de pulso al texto después de un momento
      setTimeout(() => {
        loadingText.style.animation = "pulse 1.5s ease-in-out infinite";
      }, 500);

      // Redirigir después del delay
      setTimeout(() => {
        window.location.href = destino;
      }, 800); // Aumentado a 800ms para mejor experiencia visual
    });
  });
});
