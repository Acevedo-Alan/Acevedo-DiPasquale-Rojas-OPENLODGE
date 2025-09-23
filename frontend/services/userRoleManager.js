document.addEventListener("DOMContentLoaded", () => {
  // const role = localStorage.getItem("role");
  const role = "ANFITRION";

   if (role != "ANFITRION" && role != "HUESPED") {
     window.location.href = "/pages/autenticacion/login/login.html";
   }
  
  if (role === "ANFITRION") {
    const vistaAnfitrion = document.getElementById("vista-anfitrion");
    if (vistaAnfitrion) vistaAnfitrion.style.display = "block";
  }

  if (role === "HUESPED") {
    const vistaHuesped = document.getElementById("vista-huesped");
    if (vistaHuesped) vistaHuesped.style.display = "block";
  }
});
