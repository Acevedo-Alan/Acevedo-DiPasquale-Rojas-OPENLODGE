document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (header) {
    header.innerHTML = `
      <nav class="nav">
        <div class="logo-container">
          <div class="logo"></div>
          <p>OpenLodge</p>
        </div>
        <ul class="menu">
          <li class="item"><a href="#">Inicio</a></li>
          <li class="item"><a href="#">Perfil</a></li>
          <li class="item"><a href="#">Sobre nosotros</a></li>
          <li class="item"><a href="#">Agregar propiedad</a></li>
          <li class="item"><a href="#">Contacto</a></li>
          <li class="item"><a href="#">Login</a></li>
        </ul>
      </nav>
    `;
  }
});
