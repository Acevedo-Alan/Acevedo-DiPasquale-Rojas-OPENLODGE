
const header = document.querySelector(".header");

const userRole = localStorage.getItem("role");

if (userRole === "ANFITRION") {
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
            <li class="item"><a href="#">agregar propiedad</a></li>
            <li class="item"><a href="#">contacto</a></li>
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


