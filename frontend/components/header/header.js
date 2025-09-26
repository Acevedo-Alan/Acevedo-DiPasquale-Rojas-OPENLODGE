const header = document.querySelector(".header");

const userRole = "ANFITRION";

if (userRole === "ANFITRION") {
    header.innerHTML = `
    <nav class="nav" id="nav">
        <div class="logo-container">
            <div class="logo"></div>
            <p>OpenLodge</p>
        </div>
            
        <ul class="nav-center">
            <li><a href="/pages/index/index.html">Inicio</a></li>
            <li><a href="/pages/perfi/perfil.html">Perfil</a></li>
            <li><a href="/pages/agregarPropiedad/formulario-registro-propiedad.html">Agregar propiedad</a></li>
        </ul>

        <Button class="mobile-menu-toggle" id="mobileToggle">
            <span></span>
            <span></span>
            <span></span>
        </Button>
    </nav>
    
    `;
} else if (userRole === "HUESPED") {
    header.innerHTML = `
    <nav class="nav">
        <div class="logo-container">
            <div class="logo"></div>
            <p>OpenLodge</p>
        </div>
        <ul class="menu">
            <li class="item"><a href="#">inicio</a></li>
            <li class="item"><a href="#">perfil</a></li>
            <li class="item"><a href="#">sobre nosotros</a></li>
        </ul>
        <Button class="mobile-menu-toggle" id="mobileToggle">
            <span></span>
            <span></span>
            <span></span>
        </Button>
    </nav>
    `;
} else {
  header.innerHTML = `
    <nav class="nav" id="nav">
            <div class="logo-container">
                <div class="logo"></div>
                <p>OpenLodge</p>
            </div>
            
            <ul class="nav-center">
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#destinos">Destinos</a></li>
                <li><a href="#experiencias">Experiencias</a></li>
                <li><a href="#ofertas">Ofertas</a></li>
            </ul>
            
            <div class="nav-actions">
                <a href="/pages/autenticacion/login/login.html">Iniciar sesión</a>
                <button class="btn-cta">Reservar ahora</button>
            </div>
            
            <Button class="mobile-menu-toggle" id="mobileToggle">
                <span></span>
                <span></span>
                <span></span>
            </Button>
        </nav>
`;
}


