document.addEventListener("DOMContentLoaded", () => {
  // const role = localStorage.getItem("role");
  const role = "HUESPED";
  
  if (role === "ANFITRION") {
    const vistaAnfitrion = document.getElementById("vista-anfitrion");
    alert("hasta aca funca");
    if (anfitrion) anfitrion.style.display = "block";
  }

  if (role === "HUESPED") {
    const vistaHuesped = document.getElementById("vista-huesped");
    if (vistaHuesped) vistaHuesped.style.display = "block";
  }
});
