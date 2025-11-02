let header;

// Función para decodificar el JWT y extraer el rol
function getrolFromToken(token) {
  try {
    // El JWT tiene 3 partes separadas por puntos: header.payload.signature
    const payload = token.split(".")[1];
    // Decodificar base64
    const decodedPayload = JSON.parse(atob(payload));
    console.log("Payload decodificado:", decodedPayload);
    // El rol está en la propiedad "rol" del payload
    return decodedPayload.rol || "";
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  header = document.querySelector(".header");

  console.log("Header element:", header);

  const token = localStorage.getItem("token") || "";

  // Obtener el rol del token o del localStorage
  let rol = localStorage.getItem("rol") || "";

  // Si no hay rol en localStorage pero hay token, extraerlo del token
  if (!rol && token) {
    rol = getrolFromToken(token);
    console.log("Rol extraído del token:", rol);
    // Opcional: guardar en localStorage para próximas veces
    if (rol) {
      localStorage.setItem("rol", rol);
    }
  }

  console.log("Token:", token);
  console.log("rol original:", localStorage.getItem("rol"));
  console.log("rol procesado:", rol.trim().toUpperCase());

  rol = rol.trim().toUpperCase();

  if (token) {
    console.log("Tiene token, rol es:", rol);
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

                <button class="mobile-menu-toggle" id="mobileToggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        `;
    } else {
      console.log("rol no reconocido, mostrando header genérico con token");
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

                <button class="mobile-menu-toggle" id="mobileToggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        `;
    }
  } else {
    console.log("No hay token, mostrando header sin autenticar");
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
  }

  console.log("Header HTML actualizado");

  // Mobile menu toggle
  document.addEventListener("click", function (e) {
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

// Header scroll effect
window.addEventListener("scroll", () => {
  if (!header) return;

  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
