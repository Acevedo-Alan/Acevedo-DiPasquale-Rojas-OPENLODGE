const header = document.querySelector(".header");

const userRole = "ANFITRION";

if (userRole === "ANFITRION") {
    header.innerHTML = `
    <nav class="nav" id="nav">
        <div class="logo-container">
            <div class="logo">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5 L35 15 L35 35 L5 35 L5 15 Z" fill="url(#logoGradient)" opacity="0.9"/>
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#00F260;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#0575E6;stop-opacity:1" />
                        </linearGradient>
                    </defs>
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
            <a href="#" class="btn-login">Iniciar sesión</a>
            <a href="#" class="btn-register">Registrarse</a>
        </div>

        <button class="mobile-menu-toggle" id="mobileToggle">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>
    `;
} else if (userRole === "HUESPED") {
    header.innerHTML = `
    <nav class="nav" id="nav">
        <div class="logo-container">
            <div class="logo">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5 L35 15 L35 35 L5 35 L5 15 Z" fill="url(#logoGradient)" opacity="0.9"/>
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#00F260;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#0575E6;stop-opacity:1" />
                        </linearGradient>
                    </defs>
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
            <a href="#" class="btn-login">Iniciar sesión</a>
            <a href="#" class="btn-register">Registrarse</a>
        </div>

        <button class="mobile-menu-toggle" id="mobileToggle">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>
    `;
} else {
    header.innerHTML = `
    <nav class="nav" id="nav">
        <div class="logo-container">
            <div class="logo">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5 L35 15 L35 35 L5 35 L5 15 Z" fill="url(#logoGradient)" opacity="0.9"/>
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#00F260;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#0575E6;stop-opacity:1" />
                        </linearGradient>
                    </defs>
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
            <a href="#" class="btn-register">Registrarse</a>
        </div>
        
        <button class="mobile-menu-toggle" id="mobileToggle">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>
    `;
}

// Mobile menu toggle
document.addEventListener('click', function(e) {
    if (e.target.closest('.mobile-menu-toggle')) {
        const nav = document.getElementById('nav');
        nav.classList.toggle('mobile-active');
        
        const toggle = e.target.closest('.mobile-menu-toggle');
        toggle.classList.toggle('active');
    }
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});