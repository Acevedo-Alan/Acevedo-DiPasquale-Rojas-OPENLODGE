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
            <li class="item"><a href=".">inicio</a></li>
            <li class="item"><a href="perfil.html">perfil</a></li>
            <li class="item"><a href="about.html">sobre nosotros</a></li>
            <li class="item"><a href="agregar-propiedad.html">agregar propiedad</a></li>
            <li class="item"><a href="contacto.html">contacto</a></li>
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
            <li class="item"><a href="#">inicio</a></li>
            <li class="item"><a href="#">perfil</a></li>
            <li class="item"><a href="#">sobre nosotros</a></li>
            <li class="item"><a href="#">contacto</a></li>
        </ul>
    </nav>
`;
}


