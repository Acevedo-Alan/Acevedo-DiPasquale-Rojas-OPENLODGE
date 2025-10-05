function handleLogin(event) {
    event.preventDefault();
    
    const dni = document.getElementById('dni').value;
    const password = document.getElementById('password').value;
    
    // Simulación de proceso de login
    const button = event.target.querySelector('.btn-primary');
    const originalText = button.textContent;
    
    button.textContent = 'Iniciando sesión...';
    button.disabled = true;
    
    // Simulación de llamada a API
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        
        alert('Funcionalidad de login pendiente de implementar');

        window.history.back();
    }, 2000);
}

// Validación en tiempo real para DNI/CUIL
function setupDNIValidation() {
    const dniInput = document.getElementById('dni');
    
    dniInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Solo números
        
        // Limitar a 11 dígitos máximo (CUIL tiene 11 dígitos)
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        e.target.value = value;
    });
}

// Animación de entrada suave del contenedor
function setupEntranceAnimation() {
    const container = document.querySelector('.login-container');

    container.style.opacity = '0';
    container.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.4s ease-out';
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
    }, 100);
}

// Función para validar formato de DNI/CUIL
function validateDNI(dni) {
    const cleanDNI = dni.replace(/\D/g, '');
    return cleanDNI.length >= 7 && cleanDNI.length <= 11;
}

function validatePassword(password) {
    return password.length >= 6;
}

// Función para mostrar mensajes de error
function showError(field, message) {
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Crear elemento de error
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e53e3e';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '4px';
    
    // Insertar después del campo
    field.parentElement.appendChild(errorElement);
    
    // Agregar estilo de error al campo
    field.style.borderColor = '#e53e3e';
    
    // Remover error después de unos segundos
    setTimeout(() => {
        if (errorElement.parentElement) {
            errorElement.remove();
            field.style.borderColor = '#e5e7eb';
        }
    }, 3000);
}

// Función para limpiar errores
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = '#e5e7eb';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupDNIValidation();
    setupEntranceAnimation();
    
    const form = document.querySelector('.login-form');
    const dniField = document.getElementById('dni');
    const passwordField = document.getElementById('password');
    
    dniField.addEventListener('input', clearErrors);
    passwordField.addEventListener('input', clearErrors);
    
    form.addEventListener('input', function() {
        const dni = dniField.value;
        const password = passwordField.value;
        const submitButton = form.querySelector('.btn-primary');
        
        // Habilitar/deshabilitar botón según validación
        if (validateDNI(dni) && validatePassword(password)) {
            submitButton.style.opacity = '1';
        } else {
            submitButton.style.opacity = '0.7';
        }
    });
});

// Función para manejar enlaces (crear cuenta y olvidé contraseña)
function handleCreateAccount() {
    // Redirigir a página de registro
    // window.location.href = '/register';
    console.log('Redirigiendo a crear cuenta...');
}

function handleForgotPassword() {
    // Redirigir a página de recuperación de contraseña
    // window.location.href = '/forgot-password';
    console.log('Redirigiendo a recuperar contraseña...');
}