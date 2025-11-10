let header;

document.addEventListener("DOMContentLoaded", () => {
  header = document.querySelector(".header");
  console.log("Header element:", header);

  // Obtenemos el objeto usuario completo
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || !usuario.rol) {
    console.log("Usuario no autenticado, mostrando header público");
    header.innerHTML = `
      <nav class="nav" id="nav">
          <div class="logo-container">
              <div class="logo">
                  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 5 L35 15 L35 35 L5 35 L5 15 Z" fill="white" opacity="0.9"/>
                  </svg>
              </div>
              <p>OpenLodge</p>
          </div>
          
          <ul class="nav-center">
              <li><a href="/pages/index/index.html">Inicio</a></li>
              <li><a href="#">Explorar</a></li>
              <li><a href="#">Experiencias</a></li>
          </ul>
          
          <div class="nav-actions">
              <a href="/pages/autenticacion/login/login.html" class="btn-login">Iniciar sesión</a>
              <a href="/pages/autenticacion/registro/registro.html" class="btn-register">Registrarse</a>
          </div>
          
          <button class="mobile-menu-toggle" id="mobileToggle">
              <span></span>
              <span></span>
              <span></span>
          </button>
      </nav>
    `;
    return;
  }

  const rol = usuario.rol.trim().toUpperCase();
  console.log("Usuario autenticado, rol:", rol);

  // Header según rol
  if (rol === "ANFITRION") {
    console.log("Renderizando header ANFITRION");
    header.innerHTML = `
      <nav class="nav" id="nav">
          <div class="logo-container">
              <div class="logo">
                  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 5 L35 15 L35 35 L5 35 L5 15 Z" fill="white" opacity="0.9"/>
                  </svg>
              </div>
              <p>OpenLodge</p>
          </div>
              
          <ul class="nav-center">
              <li><a href="/pages/index/index.html">Inicio</a></li>
              <li><a href="/pages/perfil/perfil.html">Perfil</a></li>
              <li><a href="/pages/agregarPropiedad/agregarPropiedad.html">Agregar propiedad</a></li>
          </ul>

          <div class="nav-actions">
              <button class="logout btn-logout">Cerrar sesión</button>
          </div>

          <button class="mobile-menu-toggle" id="mobileToggle">
              <span></span>
              <span></span>
              <span></span>
          </button>
      </nav>
    `;
  } else if (rol === "HUESPED") {
    console.log("Renderizando header HUESPED");
    header.innerHTML = `
      <nav class="nav" id="nav">
          <div class="logo-container">
              <div class="logo">
                  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 5 L35 15 L35 35 L5 35 L5 15 Z" fill="white" opacity="0.9"/>
                  </svg>
              </div>
              <p>OpenLodge</p>
          </div>
          
          <ul class="nav-center">
              <li><a href="/pages/index/index.html">Inicio</a></li>
              <li><a href="/pages/perfil/perfil.html">Perfil</a></li>
              <li><a href="#">Sobre nosotros</a></li>
          </ul>

          <div class="nav-actions">
              <button class="logout btn-logout">Cerrar sesión</button>
          </div>

          <button class="mobile-menu-toggle" id="mobileToggle">
              <span></span>
              <span></span>
              <span></span>
          </button>
      </nav>
    `;
  } else {
    console.log("Rol desconocido, renderizando header genérico autenticado");
    header.innerHTML = `
      <nav class="nav" id="nav">
          <div class="logo-container">
              <div class="logo">
                  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 5 L35 15 L35 35 L5 35 L5 15 Z" fill="white" opacity="0.9"/>
                  </svg>
              </div>
              <p>OpenLodge</p>
          </div>
          
          <ul class="nav-center">
              <li><a href="/pages/index/index.html">Inicio</a></li>
              <li><a href="/pages/perfil/perfil.html">Perfil</a></li>
          </ul>

          <div class="nav-actions">
              <button class="logout btn-logout">Cerrar sesión</button>
          </div>

          <button class="mobile-menu-toggle" id="mobileToggle">
              <span></span>
              <span></span>
              <span></span>
          </button>
      </nav>
    `;
  }

  // Logout
  const logoutButtons = document.querySelectorAll(".logout");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "/pages/autenticacion/login/login.html";
    });
  });

  // Toggle del menú móvil
  document.addEventListener("click", (e) => {
    if (e.target.closest(".mobile-menu-toggle")) {
      const nav = document.getElementById("nav");
      if (nav) {
        nav.classList.toggle("mobile-active");
        const toggle = e.target.closest(".mobile-menu-toggle");
        toggle.classList.toggle("active");
      }
    }
  });
});

// Efecto de scroll en el header
window.addEventListener("scroll", () => {
  if (!header) return;

  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
