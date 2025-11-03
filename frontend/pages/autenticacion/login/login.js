const api = "http://localhost:8080";

async function login(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const button = event.target.querySelector(".btn-primary");
  const originalText = button.textContent;

  button.textContent = "Iniciando sesión...";
  button.disabled = true;

  try {
    const loginData = {
      username: username,
      password: password,
    };

    const data = await apiService.login(loginData);

    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);
    localStorage.setItem("rol", data.rol);

    showSuccess("Sesión iniciada correctamente");

    setTimeout(() => {
      window.location.href = "/pages/index/index.html";
    }, 2000);
  } catch (error) {
    console.error("Erro en login: ", error);

    let errorMessage = "Error en autenticacion";

    if (error.message.includes("Credenciales")) {
      errorMessage = "username o contraseña incorrectos";
    } else if (error.message.includes("Usuario no encontrado")) {
      errorMessage = "Usuario no encontrado";
    } else if (error.message) {
      errorMessage = error.message;
    }

    button.textContent = originalText;
    button.disabled = false;
  }
}


function validatePassword(password) {
  return password.length >= 6;
}

function showError(field, message) {
  clearError(field);

  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  errorElement.style.color = "#e53e3e";
  errorElement.style.fontSize = "12px";
  errorElement.style.marginTop = "4px";

  field.parentElement.appendChild(errorElement);
  field.style.borderColor = "#e53e3e";

  setTimeout(() => {
    if (errorElement.parentElement) {
      clearError(field);
    }
  }, 4000);
}

function showSuccess(message) {
  const existingSuccess = document.querySelector(".success-message");
  if (existingSuccess) {
    existingSuccess.remove();
  }

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

  setTimeout(() => {
    successElement.remove();
  }, 3000);
}

function clearError(field) {
  const errorMessage = field.parentElement.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
  field.style.borderColor = "#e5e7eb";
  field.classList.remove("error");
}

function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => error.remove());

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.style.borderColor = "#e5e7eb";
    input.classList.remove("error");
  });
}

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

document.addEventListener("DOMContentLoaded", function () {
  setupEntranceAnimation();

  const form = document.querySelector(".login-form");
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("password");

  if (usernameField) usernameField.addEventListener("input", clearErrors);
  if (passwordField) passwordField.addEventListener("input", clearErrors);

  if (form) {
    form.addEventListener("input", function () {
      const username = usernameField?.value || "";
      const password = passwordField?.value || "";
      const submitButton = form.querySelector(".btn-primary");

      if (submitButton) {
        if (validatePassword(password)) {
          submitButton.style.opacity = "1";
        } else {
          submitButton.style.opacity = "0.7";
        }
      }
    });
  }

  // Verificar si ya está autenticado
  if (localStorage.getItem("userId")) {
    window.location.href = "/pages/index/index.html";
  }
});

if (!document.querySelector("#login-animations")) {
  const style = document.createElement("style");
  style.id = "login-animations";
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
