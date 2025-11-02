const api = "http://localhost:8080";

// Función principal de registro
async function register(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const password = document.getElementById("password").value;

  if (!validatePassword(password)) {
    showError(
      document.getElementById("password"),
      "La contraseña debe tener al menos 6 caracteres"
    );
    return;
  }

  const button = event.target.querySelector(".btn-primary");
  const originalText = button.textContent;

  button.textContent = "Registrando...";
  button.disabled = true;

  try {
    const registroData = {
      nombre,
      apellido,
      username,
      email,
      fechaNacimiento,
      password,
    };

    const response = await fetch(`${api}/autenticacion/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registroData),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || data.mensaje || "Error al registrar");

    showSuccess("Registrado correctamente");

    setTimeout(() => {
      window.location.href = "/pages/perfil/perfil.html";
    }, 2000);
  } catch (error) {
    console.error("Error en registro:", error);
    showError(
      document.getElementById("username"),
      error.message || "Error en autenticación"
    );
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Validación mínima de contraseña
function validatePassword(password) {
  return password.length >= 6;
}

// Mostrar error en un input
function showError(field, message) {
  clearError(field);

  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  errorElement.style.cssText = "color:#e53e3e;font-size:12px;margin-top:4px;";
  field.parentElement.appendChild(errorElement);
  field.style.borderColor = "#e53e3e";

  setTimeout(() => clearError(field), 4000);
}

// Limpiar error de un input
function clearError(field) {
  const errorMessage = field.parentElement.querySelector(".error-message");
  if (errorMessage) errorMessage.remove();
  field.style.borderColor = "#e5e7eb";
}

// Mostrar mensaje de éxito
function showSuccess(message) {
  const existing = document.querySelector(".success-message");
  if (existing) existing.remove();

  const successElement = document.createElement("div");
  successElement.className = "success-message";
  successElement.textContent = message;
  successElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
  document.body.appendChild(successElement);

  setTimeout(() => successElement.remove(), 3000);
}

// Animación de entrada
function setupEntranceAnimation() {
  const container = document.querySelector(".register-container");
  if (!container) return;

  container.style.opacity = "0";
  container.style.transform = "scale(0.9)";

  setTimeout(() => {
    container.style.transition = "all 0.4s ease-out";
    container.style.opacity = "1";
    container.style.transform = "scale(1)";
  }, 100);
}

document.addEventListener("DOMContentLoaded", function () {
  setupEntranceAnimation();
  const form = document.querySelector(".register-form");
  if (form) form.addEventListener("submit", register);
});

// Animación CSS
if (!document.querySelector("#login-animations")) {
  const style = document.createElement("style");
  style.id = "login-animations";
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
  document.head.appendChild(style);
}
