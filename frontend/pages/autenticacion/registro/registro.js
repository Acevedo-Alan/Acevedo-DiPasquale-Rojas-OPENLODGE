// Función para manejar el envío del formulario de registro
function handleRegister(event) {
  event.preventDefault();

  // Recopilar datos del formulario
  const formData = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    dni: document.getElementById("dni").value,
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
    password: document.getElementById("password").value,
  };

  // Validar que todos los campos estén completos
  if (!validateForm(formData)) {
    return;
  }

  console.log("Intentando registrar usuario:", formData);

  // Simulación de proceso de registro
  const button = event.target.querySelector(".btn-primary");
  const originalText = button.textContent;

  button.textContent = "Creando cuenta...";
  button.disabled = true;

  // Simulación de llamada a API (reemplazar con tu lógica real)
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;

    // Aquí deberías manejar la respuesta real del servidor
    alert(
      "Cuenta creada exitosamente! (Funcionalidad pendiente de implementar)"
    );

    // Ejemplo de redirección exitosa:
    window.location.href = "/pages/autenticacion/login/login.html";
  }, 2000);
}

// Validación completa del formulario
function validateForm(data) {
  let isValid = true;

  // Validar nombre y apellido
  if (data.nombre.length < 2) {
    showError(
      document.getElementById("nombre"),
      "El nombre debe tener al menos 2 caracteres"
    );
    isValid = false;
  }

  if (data.apellido.length < 2) {
    showError(
      document.getElementById("apellido"),
      "El apellido debe tener al menos 2 caracteres"
    );
    isValid = false;
  }

  // Validar DNI/CUIL
  if (!validateDNI(data.dni)) {
    showError(
      document.getElementById("dni"),
      "DNI/CUIL inválido (7-11 dígitos)"
    );
    isValid = false;
  }

  // Validar email
  if (!validateEmail(data.email)) {
    showError(document.getElementById("email"), "Correo electrónico inválido");
    isValid = false;
  }

  // Validar teléfono
  if (!validatePhone(data.telefono)) {
    showError(
      document.getElementById("telefono"),
      "Número telefónico inválido"
    );
    isValid = false;
  }

  // Validar dirección
  if (data.direccion.length < 5) {
    showError(
      document.getElementById("direccion"),
      "La dirección debe ser más específica"
    );
    isValid = false;
  }

  // Validar contraseña
  if (!validatePassword(data.password)) {
    showError(
      document.getElementById("password"),
      "La contraseña debe tener al menos 6 caracteres"
    );
    isValid = false;
  }

  return isValid;
}

// Validaciones específicas
function validateDNI(dni) {
  const cleanDNI = dni.replace(/\D/g, "");
  return cleanDNI.length >= 7 && cleanDNI.length <= 11;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const cleanPhone = phone.replace(/\D/g, "");
  return cleanPhone.length >= 10;
}

function validatePassword(password) {
  return password.length >= 6;
}

// Configurar validación en tiempo real para DNI
function setupDNIValidation() {
  const dniInput = document.getElementById("dni");

  if (!dniInput) return;

  dniInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    e.target.value = value;

    // Validación visual en tiempo real
    if (value.length >= 7 && value.length <= 11) {
      e.target.classList.remove("error");
      e.target.classList.add("valid");
    } else if (value.length > 0) {
      e.target.classList.remove("valid");
      e.target.classList.add("error");
    } else {
      e.target.classList.remove("error", "valid");
    }
  });
}

// Configurar validación de teléfono
function setupPhoneValidation() {
  const phoneInput = document.getElementById("telefono");

  if (!phoneInput) return;

  phoneInput.addEventListener("input", function (e) {
    // Permitir números, espacios, guiones y el símbolo +
    let value = e.target.value.replace(/[^\d\s\-+]/g, "");
    e.target.value = value;
  });
}

// Configurar validación de email
function setupEmailValidation() {
  const emailInput = document.getElementById("email");

  if (!emailInput) return;

  emailInput.addEventListener("blur", function (e) {
    if (validateEmail(e.target.value)) {
      e.target.classList.remove("error");
      e.target.classList.add("valid");
    } else if (e.target.value.length > 0) {
      e.target.classList.remove("valid");
      e.target.classList.add("error");
    }
  });
}


// Función para mostrar mensajes de error
function showError(field, message) {
  // Remover errores previos
  clearError(field);

  // Crear elemento de error
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;

  // Insertar después del campo
  field.parentElement.appendChild(errorElement);

  // Agregar clase de error al campo
  field.classList.add("error");
  field.classList.remove("valid");

  // Remover error después de unos segundos
  setTimeout(() => {
    if (errorElement.parentElement) {
      clearError(field);
    }
  }, 4000);
}

// Función para limpiar un error específico
function clearError(field) {
  const errorMessage = field.parentElement.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
  field.classList.remove("error");
}

// Función para limpiar todos los errores
function clearAllErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => error.remove());

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.classList.remove("error");
  });
}

// Animación de entrada suave del contenedor
function setupEntranceAnimation() {
  const container = document.querySelector(".register-container");

  if (!container) return;

  container.style.opacity = "0";
  container.style.transform = "scale(0.95)";

  setTimeout(() => {
    container.style.transition = "all 0.4s ease-out";
    container.style.opacity = "1";
    container.style.transform = "scale(1)";
  }, 100);
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function () {
  // Configurar validaciones
  setupDNIValidation();
  setupPhoneValidation();
  setupEmailValidation();
  setupCustomSelect();

  // Configurar animación de entrada
  setupEntranceAnimation();

  // Limpiar errores cuando el usuario empiece a escribir
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="tel"], input[type="password"]'
  );
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      clearError(this);
    });
  });

  // Validación en tiempo real del botón de submit
  const form = document.querySelector(".register-form");

  if (form) {
    form.addEventListener("input", function () {
      const submitButton = form.querySelector(".btn-primary");
      const allInputs = form.querySelectorAll('input:not([type="hidden"])');

      let allFilled = true;
      allInputs.forEach((input) => {
        if (!input.value) {
          allFilled = false;
        }
      });

      // Solo verificar dropdown si existe
      const hiddenInput = document.getElementById("tipo-usuario");
      if (hiddenInput && !hiddenInput.value) {
        allFilled = false;
      }

      if (submitButton) {
        submitButton.style.opacity = allFilled ? "1" : "0.7";
      }
    });
  }
});
