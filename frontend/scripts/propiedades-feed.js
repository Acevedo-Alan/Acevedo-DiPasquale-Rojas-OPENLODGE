const propiedadesFeed = document.querySelector(".propiedad-info");

propiedadesFeed.innerHTML = `
    <img src="#" alt="imagen de la prop">
    <div class="info">
        <p class="info-propiedad-nombre">Nombre</p>
        <p class="info-propiedad-direccion">Dirección</p>
        <p class="info-propiedad-descripcion">Descripción</p>
        <p class="info-propiedad-precio">Precio</p>
        <div class="calificacion">------</div>
        <button class="boton-reservar">reservar</button>
    </div>
`;

