document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-reserva");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    mostrarPopup("¡Reserva realizada con éxito!");
    
    setTimeout(() => window.location.href = "/pages/alojamiento/alojamiento.html", 2000);
  });

  function mostrarPopup(mensaje) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "1000";

    // Crear el contenedor del popup
    const popup = document.createElement("div");
    popup.style.background = "#fff";
    popup.style.padding = "25px 35px";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    popup.style.textAlign = "center";
    popup.style.fontFamily = "Arial, sans-serif";

    // Contenido del popup
    popup.innerHTML = `
      <h2 style="color:#059669; margin-bottom:10px;">${mensaje}</h2>
      <p>Gracias por tu reserva.</p>
      <button id="cerrar-popup" style="
        margin-top:15px;
        background-color:#059669;
        color:white;
        border:none;
        padding:10px 20px;
        border-radius:8px;
        cursor:pointer;
        font-size:16px;
      ">Aceptar</button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Botón para cerrar
    document.getElementById("cerrar-popup").addEventListener("click", () => {
      overlay.remove();
      form.reset(); 
    });
  }
});