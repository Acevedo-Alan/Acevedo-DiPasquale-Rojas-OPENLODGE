const userRole = localStorage.getItem("role");
const vistaHuesped = document.querySelector(".huesped");
const vistaAnfitrion = document.querySelector(".anfitrion");

if (userRole === "ANFITRION") {
    vistaAnfitrion.innerHTML = ``
} else if(userRole === "HUESPED") {
   
}
