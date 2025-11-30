const API_BASE_URL_ALOJ = "http://localhost:8080";

let alojamientoActual = null;
let usuarioActual = null;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const alojamientoId = urlParams.get("id");

  if (!alojamientoId) {
    alert("No se especificó un alojamiento");
    window.location.href = "/pages/index/index.html";
    return;
  }

  await cargarUsuarioActual();
  await cargarAlojamiento(alojamientoId);
});

async function cargarUsuarioActual() {
  const userData = localStorage.getItem("usuario");
  if (userData) {
    usuarioActual = JSON.parse(userData);
  }
}

async function cargarAlojamiento(id) {
  try {
    const headers = {
      "Content-Type": "application/json"
    };
    
    if (usuarioActual && usuarioActual.token) {
      headers["Authorization"] = `Bearer ${usuarioActual.token}`;
    }

    const response = await fetch(
      `${API_BASE_URL_ALOJ}/alojamientos/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: headers,
      }
    );

    if (!response.ok) throw new Error("Alojamiento no encontrado");

    alojamientoActual = await response.json();

    console.log("Alojamiento cargado:", alojamientoActual);
    console.log("Usuario actual:", usuarioActual);
    console.log("¿Es anfitrión?", usuarioActual?.id === alojamientoActual.anfitrionId);

    // Primero mostrar el alojamiento (esto hace visible la vista)
    mostrarAlojamiento(alojamientoActual);
    
    // DESPUÉS configurar el calendario (cuando los botones ya son visibles)
    await configurarCalendarioDisponibilidad(id);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar el alojamiento");
    window.location.href = "/pages/index/index.html";
  }
}

function mostrarAlojamiento(alojamiento) {
  const esAnfitrion =
    usuarioActual && 
    usuarioActual.id && 
    alojamiento.anfitrionId && 
    usuarioActual.id === alojamiento.anfitrionId;
  
  console.log("Mostrando alojamiento. Es anfitrión:", esAnfitrion);
  
  const vistaAnfitrion = document.getElementById("vista-anfitrion");
  const vistaHuesped = document.getElementById("vista-huesped");

  if (esAnfitrion) {
    if (vistaAnfitrion) vistaAnfitrion.style.display = "block";
    if (vistaHuesped) vistaHuesped.style.display = "none";
    llenarDatosVista(vistaAnfitrion, alojamiento);
  } else {
    if (vistaHuesped) vistaHuesped.style.display = "block";
    if (vistaAnfitrion) vistaAnfitrion.style.display = "none";
    llenarDatosVista(vistaHuesped, alojamiento);
  }

  configurarBotones(esAnfitrion);
}

function llenarDatosVista(vista, alojamiento) {
  const direccion = alojamiento.direccion || {};
  const ciudadObj = direccion.ciudad || {};
  const paisObj = ciudadObj.pais || {};

  const ciudad = ciudadObj.nombre || "Ciudad no especificada";
  const pais = paisObj.nombre || "";
  const calle = direccion.calle || "";
  const numero = direccion.numero || "";

  vista.querySelector("#nombre-propiedad").textContent = alojamiento.nombre;
  vista.querySelector("#localidad").textContent = `${ciudad}${pais ? ", " + pais : ""}`;
  vista.querySelector("#direccion").textContent = `${calle} ${numero}`;

  vista.querySelector("#nombre-anfitrion").textContent =
    `Anfitrión: ${alojamiento.anfitrionNombre} ${alojamiento.anfitrionApellido}`;

  vista.querySelector("#precio-propiedad").textContent =
    `$${alojamiento.precioNoche} / noche`;

  const serviciosContainer = vista.querySelector("#servicios-alojamiento");
  serviciosContainer.innerHTML = "";

  if (alojamiento.servicios && alojamiento.servicios.length > 0) {
    alojamiento.servicios.forEach((servicio) => {
      const div = document.createElement("div");
      div.className = "servicio-item";
      div.textContent = servicio.nombre;
      serviciosContainer.appendChild(div);
    });
  } else {
    serviciosContainer.innerHTML = "<p>No hay servicios disponibles</p>";
  }

  const carrusel = vista.querySelector(".carrusel");
  if (carrusel && alojamiento.imagen) {
    carrusel.innerHTML = `
      <img src="${alojamiento.imagen}" alt="${alojamiento.nombre}" 
           style="width: 100%; max-height: 400px; object-fit: cover;">
    `;
  }
}

async function configurarCalendarioDisponibilidad(alojamientoId) {
  try {
    const esAnfitrion = usuarioActual && 
                       usuarioActual.id && 
                       alojamientoActual.anfitrionId && 
                       usuarioActual.id === alojamientoActual.anfitrionId;

    let reservas = [];
    
    if (esAnfitrion && usuarioActual.token) {
      // ANFITRIÓN: obtener información completa con datos de huéspedes
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${usuarioActual.token}`
      };

      const response = await fetch(
        `${API_BASE_URL_ALOJ}/reservas/historial/alojamiento/${alojamientoId}`,
        {
          method: "GET",
          credentials: "include",
          headers: headers,
        }
      );

      if (response.ok) {
        reservas = await response.json();
        console.log("Reservas completas (anfitrión):", reservas);
      } else {
        console.error("Error al cargar reservas del anfitrión:", response.status);
      }
    } else {
      // HUÉSPED: obtener solo fechas ocupadas (sin datos personales)
      const response = await fetch(
        `${API_BASE_URL_ALOJ}/reservas/fechas-ocupadas/${alojamientoId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      if (response.ok) {
        reservas = await response.json();
        console.log("Fechas ocupadas (huésped):", reservas);
      } else {
        console.error("Error al cargar fechas ocupadas:", response.status);
      }
    }
    
    // Usar setTimeout para asegurarse de que el DOM esté completamente renderizado
    setTimeout(() => {
      configurarBotonesCalendario(reservas, esAnfitrion);
    }, 100);
    
  } catch (error) {
    console.error("Error al cargar calendario:", error);
    setTimeout(() => {
      configurarBotonesCalendario([], false);
    }, 100);
  }
}

function configurarBotonesCalendario(reservas, esAnfitrion) {
  const calendarioBtns = document.querySelectorAll(".calendario-disponibilidad");
  console.log("Botones de calendario encontrados:", calendarioBtns.length);
  console.log("Botones encontrados:", calendarioBtns);
  
  if (calendarioBtns.length === 0) {
    console.error("No se encontraron botones de calendario");
    return;
  }
  
  calendarioBtns.forEach((btn) => {
    // Limpiar eventos anteriores
    const nuevoBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(nuevoBtn, btn);
    
    // Agregar evento al nuevo botón
    nuevoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Click en calendario detectado");
      console.log("Mostrando", reservas.length, "reservas");
      mostrarModalCalendario(reservas, esAnfitrion);
    });
    
    console.log("Listener agregado al botón:", nuevoBtn);
  });
}

function mostrarModalCalendario(reservas, esAnfitrion) {
  console.log("Mostrando modal con", reservas.length, "reservas. Es anfitrión:", esAnfitrion);
  
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const contenido = document.createElement("div");
  contenido.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  `;

  let html = "<h3 style='margin-top: 0; color: #2d3748;'>Calendario de Disponibilidad</h3>";

  if (!reservas || reservas.length === 0) {
    html += "<p style='color: #4a5568;'>No hay reservas para este alojamiento. ¡Está completamente disponible!</p>";
  } else {
    html += '<ul style="list-style: none; padding: 0;">';
    reservas.forEach((reserva) => {
      const checkin = reserva.checkin ? new Date(reserva.checkin).toLocaleDateString("es-ES") : "N/A";
      const checkout = reserva.checkout ? new Date(reserva.checkout).toLocaleDateString("es-ES") : "N/A";
      
      if (esAnfitrion) {
        // Vista anfitrión: mostrar información completa
        const huespedes = reserva.huespedes || "N/A";
        const nombreHuesped = reserva.usuarioNombre && reserva.usuarioApellido 
          ? `${reserva.usuarioNombre} ${reserva.usuarioApellido}` 
          : "Huésped";
        
        html += `
          <li style="padding: 1rem; border-bottom: 1px solid #e2e8f0; margin-bottom: 0.5rem;">
            <strong style="color: #2d3748;">Del ${checkin} al ${checkout}</strong><br>
            <span style="color: #4a5568;">Huésped: ${nombreHuesped}</span><br>
            <span style="color: #4a5568;">Cantidad de huéspedes: ${huespedes}</span>
          </li>
        `;
      } else {
        // Vista huésped: solo mostrar fechas ocupadas
        html += `
          <li style="padding: 1rem; border-bottom: 1px solid #e2e8f0; margin-bottom: 0.5rem;">
            <strong style="color: #2d3748;">Ocupado del ${checkin} al ${checkout}</strong>
          </li>
        `;
      }
    });
    html += "</ul>";
  }

  html += `
    <button 
      onclick="this.closest('div[style*=fixed]').remove()" 
      style="
        margin-top: 1rem; 
        padding: 0.75rem 1.5rem; 
        background: #3182ce; 
        color: white; 
        border: none; 
        border-radius: 6px; 
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background 0.2s;
      "
      onmouseover="this.style.background='#2c5282'"
      onmouseout="this.style.background='#3182ce'"
    >
      Cerrar
    </button>
  `;

  contenido.innerHTML = html;
  modal.appendChild(contenido);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);
}

function configurarBotones(esAnfitrion) {
  console.log("Configurando botones. Es anfitrión:", esAnfitrion);
  
  if (esAnfitrion) {
    // BOTONES PARA ANFITRIÓN
    const btnEliminar = document.querySelector("#vista-anfitrion .eliminar-popup");
    console.log("Botón eliminar encontrado:", btnEliminar);
    if (btnEliminar) {
      btnEliminar.addEventListener("click", eliminarAlojamiento);
    }

    // Buscar todos los botones posibles para modificar
    const btnModificar = document.querySelector(
      '#vista-anfitrion [data-target="/pages/alojamiento/modificarReserva/modificarReserva.html"]'
    );
    
    console.log("Botón modificar encontrado:", btnModificar);
    
    if (btnModificar) {
      btnModificar.textContent = "Modificar alojamiento";
      btnModificar.removeAttribute("data-target");
      btnModificar.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `/pages/modificarPropiedad/modificarPropiedad.html?id=${alojamientoActual.id}`;
      });
    }

    // Ocultar botón "Modificar reserva" en vista anfitrión
    const btnModificarReservaAnfitrion = document.querySelectorAll(
      '#vista-anfitrion [data-target="/pages/alojamiento/modificarReserva/modificarReserva.html"]'
    );
    btnModificarReservaAnfitrion.forEach(btn => {
      if (btn.textContent.includes("Modificar reserva")) {
        btn.style.display = "none";
      }
    });
  } else {
    // BOTONES PARA HUÉSPED
    const btnReservar = document.querySelector(
      '#vista-huesped [data-target="/pages/alojamiento/formularioReserva/formularioReserva.html"]'
    );
    if (btnReservar) {
      btnReservar.addEventListener("click", (e) => {
        e.preventDefault();
        if (!usuarioActual || !usuarioActual.id) {
          alert("Debes iniciar sesión para reservar");
          window.location.href = "/pages/autenticacion/login/login.html";
        } else {
          window.location.href = `/pages/alojamiento/formularioReserva/formularioReserva.html?alojamientoId=${alojamientoActual.id}`;
        }
      });
    }

    // El botón "Modificar reserva" ahora redirige directamente
    const btnModificarReserva = document.querySelector(
      '#vista-huesped [data-target="/pages/alojamiento/modificarReserva/modificarReserva.html"]'
    );

    if (btnModificarReserva) {
      btnModificarReserva.addEventListener("click", (e) => {
        e.preventDefault();
        if (!usuarioActual || !usuarioActual.id) {
          alert("Debes iniciar sesión");
          window.location.href = "/pages/autenticacion/login/login.html";
        } else {
          window.location.href = `/pages/alojamiento/modificarReserva/modificarReserva.html?alojamientoId=${alojamientoActual.id}`;
        }
      });
    }
  }
}

async function eliminarAlojamiento() {
  if (!confirm("¿Estás seguro de eliminar este alojamiento?")) return;

  try {
    const response = await fetch(
      `${API_BASE_URL_ALOJ}/alojamientos/eliminar/${alojamientoActual.id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActual.token}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    alert("Alojamiento eliminado exitosamente");
    window.location.href = "/pages/index/index.html";
  } catch (error) {
    console.error("Error:", error);
    alert("Error al eliminar el alojamiento: " + error.message);
  }
}