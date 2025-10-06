document.addEventListener("DOMContentLoaded", () => {
  const btnEliminar = document.querySelector(".eliminar-popup");

  if (btnEliminar) {
    btnEliminar.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarPopupConfirmacion("¿Deseas eliminar esta propiedad?");
    });
  }

  function mostrarPopupConfirmacion(mensaje) {
    // Fondo oscuro
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

    // Contenedor principal
    const popup = document.createElement("div");
    popup.style.background = "#fff";
    popup.style.padding = "25px 35px";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    popup.style.textAlign = "center";
    popup.style.fontFamily = "Arial, sans-serif";

    popup.innerHTML = `
      <h2 style="color:#059669; margin-bottom:10px;">${mensaje}</h2>
      <button id="confirmar-eliminar" style="
        margin:10px;
        background-color:#dc2626;
        color:white;
        border:none;
        padding:10px 20px;
        border-radius:8px;
        cursor:pointer;
        font-size:16px;
      ">Sí</button>
      <button id="cancelar-eliminar" style="
        margin:10px;
        background-color:#6b7280;
        color:white;
        border:none;
        padding:10px 20px;
        border-radius:8px;
        cursor:pointer;
        font-size:16px;
      ">Cancelar</button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Botón cancelar
    document.getElementById("cancelar-eliminar").addEventListener("click", () => {
      overlay.remove();
    });

    // Botón confirmar
    document.getElementById("confirmar-eliminar").addEventListener("click", () => {
      mostrarMensajeExito(overlay);
    });
  }

  function mostrarMensajeExito(overlay) {
    overlay.innerHTML = "";
    const popup = document.createElement("div");
    popup.style.background = "#fff";
    popup.style.padding = "25px 35px";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    popup.style.textAlign = "center";
    popup.style.fontFamily = "Arial, sans-serif";
    popup.innerHTML = `
      <h2 style="color:#059669; margin-bottom:10px;">¡Eliminada con éxito!</h2>
      <p>La propiedad fue eliminada correctamente.</p>
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

    document.getElementById("cerrar-popup").addEventListener("click", () => {
      overlay.remove();
    });
  }
});