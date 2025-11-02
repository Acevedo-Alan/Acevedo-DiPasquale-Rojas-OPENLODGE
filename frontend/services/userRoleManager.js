document.addEventListener("DOMContentLoaded", () => {
  let rol = localStorage.getItem("rol");

  if (!rol) {
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  rol = rol.trim().toUpperCase();

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

// Funcionalidad de logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll(".logout");

  logoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      window.location.href = "/pages/autenticacion/login/login.html";
    });
  });
});
