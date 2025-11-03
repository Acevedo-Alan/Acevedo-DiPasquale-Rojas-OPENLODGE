// Array para almacenar servicios seleccionados
let serviciosSeleccionados = [];

async function register(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const imagen = document.getElementById("imagen").value.trim() || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
  const precioNoche = parseFloat(document.getElementById("precioNoche").value);
  const capacidadHuespedes = parseInt(document.getElementById("capacidadHuespedes").value);
  const calle = document.getElementById("calle").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const ciudadNombre = document.getElementById("ciudad").value.trim();
  const paisNombre = document.getElementById("pais").value.trim();

  const button = event.target.querySelector(".btn-primary");
  const originalText = button.textContent;
  button.textContent = "Registrando...";
  button.disabled = true;

  try {
    // 1. Obtener o crear servicios
    const serviciosEntidades = await obtenerOCrearServicios(
      serviciosSeleccionados
    );

    // 2. Crear o buscar País
    let pais = await buscarOCrearPais(paisNombre);

    // 3. Crear o buscar Ciudad
    let ciudad = await buscarOCrearCiudad(ciudadNombre, pais.id);

    // 4. Validar que ciudad y país tengan ID
    if (!ciudad.id || !pais.id) {
      throw new Error("Error al crear la ubicación. Intenta nuevamente.");
    }

    // 5. Crear el alojamiento con su dirección
    const registroData = {
      nombre,
      descripcion,
      imagen,
      precioNoche,
      capacidadHuespedes,
      direccion: {
        calle,
        numero,
        ciudad: ciudad
      },
      servicios: serviciosEntidades || new Set()
    };

    const data = await apiService.crearAlojamiento(registroData);
    showSuccess("Alojamiento registrado correctamente");

    setTimeout(() => {
      window.location.href = "/pages/perfil/perfil.html";
    }, 2000);
  } catch (error) {
    console.error("Error en registro:", error);
    let errorMessage = "Error al registrar el alojamiento";
    
    if (error.message.includes("ubicación")) {
      errorMessage = "Error al crear la ubicación. Por favor, verifica los datos ingresados.";
    } else if (error.message.includes("ciudad")) {
      errorMessage = "Error al crear la ciudad. Por favor, verifica los datos ingresados.";
    } else if (error.message.includes("país")) {
      errorMessage = "Error al crear el país. Por favor, verifica los datos ingresados.";
    }
    
    showError(document.getElementById("nombre"), errorMessage);
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Función para obtener o crear servicios
async function obtenerOCrearServicios(nombresServicios) {
  const serviciosEntidades = [];

  for (const nombreServicio of nombresServicios) {
    try {
      // Intentar buscar el servicio primero
      const servicio = await apiService.getServicioByNombre(nombreServicio);
      if (servicio) {
        serviciosEntidades.push(servicio);
      } else {
        // Si no existe, crearlo
        const nuevoServicio = await apiService.crearServicio({ nombre: nombreServicio });
        if (nuevoServicio) {
          serviciosEntidades.push(nuevoServicio);
        }
      }
    } catch (error) {
      console.error(`Error con servicio ${nombreServicio}:`, error);
    }
  }

  return serviciosEntidades;
}

// Función para buscar o crear país (necesitarás crear estos endpoints en el backend)
async function buscarOCrearPais(nombrePais) {
  try {
    // Intenta buscar el país primero
    const pais = await apiService.getPaisByNombre(nombrePais);
    if (pais) {
      return pais;
    } else {
      // Si no existe, créalo
      const nuevoPais = await apiService.crearPais({ nombre: nombrePais });
      if (nuevoPais) {
        return nuevoPais;
      }
    }
  } catch (error) {
    console.error("Error al buscar/crear país:", error);
  }

  // Si falla, retorna un objeto temporal
  return { id: null, nombre: nombrePais };
}

// Función para buscar o crear ciudad
async function buscarOCrearCiudad(nombreCiudad, paisId) {
  try {
    let ciudad = await apiService.getCiudadByNombreAndPais(nombreCiudad, paisId);
    
    if (!ciudad) {
      ciudad = await apiService.crearCiudad({
        nombre: nombreCiudad,
        pais: {
          id: paisId
        }
      });
    }

    if (!ciudad || !ciudad.id) {
      throw new Error("No se pudo crear o encontrar la ciudad");
    }

    return {
      id: ciudad.id,
      nombre: ciudad.nombre,
      pais: {
        id: ciudad.pais.id,
        nombre: ciudad.pais.nombre
      }
    };
  } catch (error) {
    console.error("Error al buscar/crear ciudad:", error);
    throw error;
  }
}

// Manejo de servicios en la UI
function agregarServicio() {
  const input = document.getElementById("nuevoServicio");
  const nombreServicio = input.value.trim();

  if (nombreServicio && !serviciosSeleccionados.includes(nombreServicio)) {
    serviciosSeleccionados.push(nombreServicio);
    renderizarServicios();
    input.value = "";
  }
}

function eliminarServicio(index) {
  serviciosSeleccionados.splice(index, 1);
  renderizarServicios();
}

function renderizarServicios() {
  const lista = document.getElementById("lista-servicios");
  lista.innerHTML = serviciosSeleccionados
    .map(
      (servicio, index) => `
        <div class="servicio-tag">
          <span>${servicio}</span>
          <button type="button" onclick="eliminarServicio(${index})">×</button>
        </div>
      `
    )
    .join("");
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

function clearError(field) {
  const errorMessage = field.parentElement.querySelector(".error-message");
  if (errorMessage) errorMessage.remove();
  field.style.borderColor = "#e5e7eb";
}

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

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-registrar-propiedad");
  if (form) form.addEventListener("submit", register);

  const btnAgregar = document.getElementById("agregarServicioBtn");
  if (btnAgregar) btnAgregar.addEventListener("click", agregarServicio);

  const inputServicio = document.getElementById("nuevoServicio");
  if (inputServicio) {
    inputServicio.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        agregarServicio();
      }
    });
  }
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
    .servicio-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #e0e7ff;
      color: #005834ff;
      padding: 6px 12px;
      border-radius: 6px;
      margin: 4px;
      font-size: 14px;
    }
    .servicio-tag button {
      background: none;
      border: none;
      color: #00d624ff;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    .servicios { margin: 15px 0; }
    .add-servicio {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    .add-servicio input {
      flex: 1;
      padding: 8px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
    }
    .add-servicio button {
      padding: 8px 16px;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}
