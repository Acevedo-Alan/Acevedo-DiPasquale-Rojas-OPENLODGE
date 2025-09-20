const propiedadesFeed = document.querySelectorAll(".propiedad-info");

propiedadesFeed.forEach((feed) => {
  feed.innerHTML = `
        <img src="#" alt="imagen de la prop">
        <div class="info">
            <p class="propiedad-info-nombre">Nombre</p>
            <p class="propiedad-info-direccion">Dirección</p>
            <p class="propiedad-info-descripcion">Descripción</p>
            <p class="propiedad-info-precio">Precio</p>
            <div class="calificacion">------</div>
            <button class="boton-ver nav-btn" data-target="/pages/alojamiento/alojamiento.html">ver propiedad</button>
        </div>
    `;
});
