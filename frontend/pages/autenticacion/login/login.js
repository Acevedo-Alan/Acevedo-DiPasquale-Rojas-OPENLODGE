// login.js - Corregido con debugging
const API_URL = "http://localhost:8080/autenticacion/login";

async function login(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const button = event.target.querySelector(".btn-primary");
  const originalText = button.textContent;

  button.textContent = "Iniciando sesión...";
  button.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();

    const usuario = {
      id: data.userId || data.id || null,
      username: data.username || username,
      rol: data.rol || "HUESPED",
      nombre: data.nombre || username,
      apellido: data.apellido || "",
      email: data.email || "",
    };

    if (!usuario.id) {
      console.error("El servidor no devolvió un ID:", data);
      throw new Error(
        "Error: El servidor no devolvió datos completos del usuario"
      );
    }

    localStorage.setItem("usuario", JSON.stringify(usuario));

    showSuccess("Sesión iniciada correctamente");

    setTimeout(() => {
      window.location.href = "/pages/index/index.html";
    }, 1000);
  } catch (error) {
    console.error("Error en autenticar:", error);
    alert(
      "Error de autenticación: " + (error.message || "Credenciales incorrectas")
    );
    button.textContent = originalText;
    button.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupEntranceAnimation();

  // Verificar si ya está logueado
  if (localStorage.getItem("usuario")) {
    window.location.href = "/pages/index/index.html";
  }
});

function setupEntranceAnimation() {
  const container = document.querySelector(".login-container");
  if (!container) return;
  container.style.opacity = "0";
  container.style.transform = "scale(0.9)";
  setTimeout(() => {
    container.style.transition = "all 0.4s ease-out";
    container.style.opacity = "1";
    container.style.transform = "scale(1)";
  }, 100);
}

function showSuccess(message) {
  const success = document.createElement("div");
  success.className = "success-message";
  success.textContent = message;
  success.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: #10b981; color: white;
    padding: 15px 25px; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(16,185,129,0.3);
    z-index: 10000;
  `;
  document.body.appendChild(success);
  setTimeout(() => success.remove(), 3000);
}
