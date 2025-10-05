function handleRegister(event) {
  event.preventDefault();

  const formData = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    dni: document.getElementById("dni").value,
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
    password: document.getElementById("password").value,
    tipoUsuario: document.getElementById("tipo-usuario").value,
  };

  if (!validateForm(formData)) {
    return;
  }

  console.log("Intentando registrar usuario:", formData);

  // Simulación de proceso de registro
  const button = event.target.querySelector(".btn-primary");
  const originalText = button.textContent;

  button.textContent = "Creando cuenta...";
  button.disabled = true;

  // Simulación de llamada a API
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;

    alert(
      "Cuenta creada exitosamente! (Funcionalidad pendiente de implementar)"
    );

    window.location.href = '/pages/autenticacion/login/login.html';
  }, 2000);
}

// Validación completa del formulario
function validateForm(data) {
 
}


// Configurar desplegacion de opciones
function setupCustomSelect() {
  const selectTrigger = document.getElementById("select-trigger");
  const selectOptions = document.getElementById("select-options");
  const hiddenInput = document.getElementById("tipo-usuario");
  const selectedOption = document.getElementById("selected-option");
  const options = document.querySelectorAll(".select-option");

  // Toggle desplegacion
  selectTrigger.addEventListener("click", function (e) {
    e.stopPropagation();
    selectTrigger.classList.toggle("active");
    selectOptions.classList.toggle("active");
  });

  // Seleccionar opción
  options.forEach((option) => {
    option.addEventListener("click", function () {
      const value = this.getAttribute("data-value");
      const text = this.querySelector("span").textContent;

      // Actualizar valores
      hiddenInput.value = value;
      selectedOption.textContent = text;
      selectTrigger.classList.add("has-value");

      // Remover clase selected de todas las opciones
      options.forEach((opt) => opt.classList.remove("selected"));

      // Agregar clase selected a la opción actual
      this.classList.add("selected");

      // Cerrar desplegacion
      selectTrigger.classList.remove("active");
      selectOptions.classList.remove("active");

      // Remover error si existía
      clearError(selectTrigger);
    });
  });

  // Cerrar desplegacion al hacer click fuera
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".custom-select")) {
      selectTrigger.classList.remove("active");
      selectOptions.classList.remove("active");
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
  form.addEventListener("input", function () {
    const submitButton = form.querySelector(".btn-primary");
    const allInputs = form.querySelectorAll('input:not([type="hidden"])');
    const hiddenInput = document.getElementById("tipo-usuario");

    let allFilled = true;
    allInputs.forEach((input) => {
      if (!input.value) {
        allFilled = false;
      }
    });

    if (!hiddenInput.value) {
      allFilled = false;
    }

    submitButton.style.opacity = allFilled ? "1" : "0.7";
  });
});
