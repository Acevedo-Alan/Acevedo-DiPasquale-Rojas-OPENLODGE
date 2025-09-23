const header = document.querySelector(".header");

const userRole = "ANFITRION";

if (userRole === "ANFITRION") {
    header.innerHTML = `
    <nav class="nav">
        <div class="logo-container">
            <div class="logo"></div>
            <p>OpenLodge</p>
        </div>
        <ul class="menu">
            <li class="item"><a href="/pages/index/index.html">inicio</a></li>
            <li class="item"><a href="/pages/perfil/perfil.html">perfil</a></li>
            <li class="item"><a href="#">sobre nosotros</a></li>
            <li class="item"><a href="/pages/agregarPropiedad/formulario-registro-propiedad.html">agregar propiedad</a></li>
        </ul>
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
            <li class="item"><a href="/pages/index/index.html">inicio</a></li>
            <li class="item"><a href="#">perfil</a></li>
            <li class="item"><a href="#">sobre nosotros</a></li>
        </ul>
    </nav>
    `;
} else {
  header.innerHTML = `
    <nav class="nav">
        <div class="logo-container">
            <div class="logo"></div>
            <p>OpenLodge</p>
        </div>
        <ul class="menu">
            <li class="item"><a href="/pages/index/index.html">inicio</a></li>
            <li class="item"><a href="/pages/autenticacion/login/login.html">inicia sesión</a></li>
            <li class="item"><a href="/pages/autenticacion/registro/registro.html">registrate</a></li>
        </ul>
    </nav>
`;
}


