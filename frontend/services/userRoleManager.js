document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || !usuario.rol) {
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  const rol = usuario.rol.trim().toUpperCase();
  console.log("Rol en userrolManager:", rol);

  if (rol !== "ANFITRION" && rol !== "HUESPED") {
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  if (rol === "ANFITRION") {
    const vistaAnfitrion = document.getElementById("vista-anfitrion");
    if (vistaAnfitrion) {
      vistaAnfitrion.style.display = "block";
      console.log("Vista anfitrión mostrada");
    }
  }

  if (rol === "HUESPED") {
    const vistaHuesped = document.getElementById("vista-huesped");
    if (vistaHuesped) {
      vistaHuesped.style.display = "block";
      console.log("Vista huésped mostrada");
    }
  }
});

// Logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll(".logout");

  logoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "/pages/autenticacion/login/login.html";
    });
  });
});
