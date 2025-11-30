const API_BASE_URL_MOD = "http://localhost:8080";

let alojamientoIdMod = null;
let usuarioActualMod = null;
let reservaActual = null;
let alojamientoActual = null;

document.addEventListener("DOMContentLoaded", async () => {
  cargarUsuarioActual();

  if (!usuarioActualMod || !usuarioActualMod.id) {
    alert("Debes iniciar sesión");
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  alojamientoIdMod = urlParams.get("alojamientoId");

  if (!alojamientoIdMod) {
    alert("No se especificó un alojamiento");
    window.location.href = "/pages/index/index.html";
    return;
  }

  await cargarDatosReserva();
  configurarBotones();
  configurarCalculadoraImporte();
});

function cargarUsuarioActual() {
  const userData = localStorage.getItem("usuario");
  if (userData) {
    usuarioActualMod = JSON.parse(userData);
  }
}

async function cargarDatosReserva() {
  try {
    const response = await fetch(
      `${API_BASE_URL_MOD}/reservas/historial/usuario`,
      {
        method: "GET",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActualMod.token}`
        },
      }
    );

    if (!response.ok) throw new Error("Error al cargar reservas");

    const reservas = await response.json();
    reservaActual = reservas.find((r) => r.alojamientoId == alojamientoIdMod);

    if (!reservaActual) {
      alert("No tienes una reserva activa en este alojamiento");
      window.location.href = `/pages/alojamiento/alojamiento.html?id=${alojamientoIdMod}`;
      return;
    }

    await cargarAlojamiento();
    mostrarDatosReserva();
    configurarFechasMinimas();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar la reserva");
  }
}

async function cargarAlojamiento() {
  try {
    const response = await fetch(
      `${API_BASE_URL_MOD}/alojamientos/${alojamientoIdMod}`,
      {
        method: "GET",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActualMod.token}`
        },
      }
    );

    if (!response.ok) throw new Error("Error al cargar alojamiento");

    alojamientoActual = await response.json();
    mostrarDatosAlojamiento(alojamientoActual);
  } catch (error) {
    console.error("Error:", error);
  }
}

function mostrarDatosAlojamiento(alojamiento) {
  const direccion = alojamiento.direccion || {};
  const ciudadObj = direccion.ciudad || {};
  const paisObj = ciudadObj.pais || {};
  
  const ciudad = ciudadObj.nombre || direccion.ciudad || "";
  const pais = paisObj.nombre || "";
  const calle = direccion.calle || "";
  const numero = direccion.numero || "";
  
  const direccionCompleta = `${calle} ${numero}${ciudad ? ", " + ciudad : ""}${pais ? ", " + pais : ""}`;

  document.querySelector(".propiedad-nombre").textContent = alojamiento.nombre || "Nombre no disponible";
  document.querySelector(".propiedad-direccion").textContent = direccionCompleta;
  document.querySelector(".propiedad-precio").textContent = `$${alojamiento.precioNoche} / noche`;
  document.querySelector(".propiedad-dueño").textContent = 
    `Anfitrión: ${alojamiento.anfitrionNombre || ""} ${alojamiento.anfitrionApellido || ""}`;

  const img = document.querySelector(".propiedad-imagen img");
  if (img && alojamiento.imagen) {
    img.src = alojamiento.imagen;
    img.alt = alojamiento.nombre;
  }

  // Mostrar capacidad máxima
  const capacidadSpan = document.getElementById("capacidad-maxima");
  if (capacidadSpan) {
    capacidadSpan.textContent = alojamiento.capacidadHuespedes || "-";
  }

  // Establecer el máximo en el input de huéspedes
  const inputHuespedes = document.getElementById("nuevos-huespedes");
  if (inputHuespedes && alojamiento.capacidadHuespedes) {
    inputHuespedes.max = alojamiento.capacidadHuespedes;
  }
}

function mostrarDatosReserva() {
  // Verificar plazo de 48 horas
  const fechaCreacion = new Date(reservaActual.fechaCreacion);
  const limite48h = new Date(fechaCreacion.getTime() + 48 * 60 * 60 * 1000);
  const ahora = new Date();
  const puedeModificar = ahora < limite48h;

  const mensajePlazo = document.querySelector(".mensaje-plazo p");
  if (mensajePlazo) {
    if (puedeModificar) {
      const horasRestantes = Math.ceil((limite48h - ahora) / (1000 * 60 * 60));
      mensajePlazo.textContent = `Tienes ${horasRestantes} hora(s) restante(s) para modificar o cancelar la reserva`;
      mensajePlazo.style.color = "#2d3748";
    } else {
      mensajePlazo.textContent = "El plazo de 48 horas para modificar la reserva ha expirado";
      mensajePlazo.style.color = "#e53e3e";
      
      // Deshabilitar el formulario
      const formulario = document.getElementById("form-modificar-reserva");
      if (formulario) {
        Array.from(formulario.elements).forEach(element => {
          if (element.type !== "button") {
            element.disabled = true;
          }
        });
      }
      
      const btnGuardar = document.querySelector(".btn-principal");
      const btnCancelar = document.getElementById("btn-cancelar");
      if (btnGuardar) btnGuardar.disabled = true;
      if (btnCancelar) btnCancelar.disabled = true;
    }
  }

  // Mostrar datos actuales de la reserva
  document.getElementById("checkin-actual").textContent = formatearFecha(reservaActual.checkin);
  document.getElementById("checkout-actual").textContent = formatearFecha(reservaActual.checkout);
  document.getElementById("huespedes-actual").textContent = reservaActual.huespedes;
  document.getElementById("importe-actual").textContent = `$${reservaActual.importe || "0"}`;

  // Pre-llenar el formulario con los valores actuales
  document.getElementById("nuevo-checkin").value = reservaActual.checkin;
  document.getElementById("nuevo-checkout").value = reservaActual.checkout;
  document.getElementById("nuevos-huespedes").value = reservaActual.huespedes;
}

function configurarFechasMinimas() {
  const hoy = new Date().toISOString().split("T")[0];
  const inputCheckin = document.getElementById("nuevo-checkin");
  const inputCheckout = document.getElementById("nuevo-checkout");

  if (inputCheckin) {
    inputCheckin.min = hoy;
  }

  if (inputCheckout) {
    inputCheckout.min = hoy;
  }

  // Actualizar checkout mínimo cuando cambia checkin
  if (inputCheckin) {
    inputCheckin.addEventListener("change", () => {
      const checkinDate = new Date(inputCheckin.value);
      const minCheckout = new Date(checkinDate);
      minCheckout.setDate(minCheckout.getDate() + 1);
      
      if (inputCheckout) {
        inputCheckout.min = minCheckout.toISOString().split("T")[0];
        
        // Si checkout es anterior al nuevo mínimo, actualizarlo
        if (inputCheckout.value && new Date(inputCheckout.value) <= checkinDate) {
          inputCheckout.value = minCheckout.toISOString().split("T")[0];
        }
      }
    });
  }
}

function configurarCalculadoraImporte() {
  const inputCheckin = document.getElementById("nuevo-checkin");
  const inputCheckout = document.getElementById("nuevo-checkout");

  const calcularImporte = () => {
    if (!alojamientoActual || !inputCheckin.value || !inputCheckout.value) return;

    const checkin = new Date(inputCheckin.value);
    const checkout = new Date(inputCheckout.value);
    
    if (checkout <= checkin) {
      document.getElementById("nuevo-importe").textContent = "Las fechas no son válidas";
      return;
    }

    const noches = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const importe = noches * alojamientoActual.precioNoche;
    
    document.getElementById("nuevo-importe").textContent = 
      `$${importe.toFixed(2)} (${noches} noche${noches !== 1 ? "s" : ""})`;
  };

  if (inputCheckin) inputCheckin.addEventListener("change", calcularImporte);
  if (inputCheckout) inputCheckout.addEventListener("change", calcularImporte);

  // Calcular importe inicial
  calcularImporte();
}

function configurarBotones() {
  const formulario = document.getElementById("form-modificar-reserva");
  const btnVolver = document.getElementById("btn-volver");
  const btnCancelar = document.getElementById("btn-cancelar");

  if (formulario) {
    formulario.addEventListener("submit", modificarReserva);
  }

  if (btnVolver) {
    btnVolver.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `/pages/alojamiento/alojamiento.html?id=${alojamientoIdMod}`;
    });
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", cancelarReserva);
  }
}

async function modificarReserva(e) {
  e.preventDefault();

  const nuevoCheckin = document.getElementById("nuevo-checkin").value;
  const nuevoCheckout = document.getElementById("nuevo-checkout").value;
  const nuevosHuespedes = parseInt(document.getElementById("nuevos-huespedes").value);

  // Validaciones
  if (!nuevoCheckin || !nuevoCheckout || !nuevosHuespedes) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (new Date(nuevoCheckout) <= new Date(nuevoCheckin)) {
    alert("La fecha de checkout debe ser posterior al checkin");
    return;
  }

  if (alojamientoActual && nuevosHuespedes > alojamientoActual.capacidadHuespedes) {
    alert(`La cantidad de huéspedes no puede superar ${alojamientoActual.capacidadHuespedes}`);
    return;
  }

  if (!confirm("¿Estás seguro de modificar esta reserva?")) return;

  try {
    const response = await fetch(
      `${API_BASE_URL_MOD}/reservas/modificarReserva/alojamiento/${alojamientoIdMod}?` +
      `nuevoCheckin=${nuevoCheckin}&nuevoCheckout=${nuevoCheckout}&nuevosHuespedes=${nuevosHuespedes}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActualMod.token}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    alert("Reserva modificada exitosamente");
    window.location.href = `/pages/alojamiento/alojamiento.html?id=${alojamientoIdMod}`;
  } catch (error) {
    console.error("Error:", error);
    alert("Error al modificar la reserva: " + error.message);
  }
}

async function cancelarReserva(e) {
  e.preventDefault();

  if (!confirm("¿Estás seguro de cancelar esta reserva? Esta acción no se puede deshacer.")) return;

  try {
    const response = await fetch(
      `${API_BASE_URL_MOD}/reservas/cancelarReserva/alojamiento/${alojamientoIdMod}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActualMod.token}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    alert("Reserva cancelada exitosamente");
    window.location.href = `/pages/alojamiento/alojamiento.html?id=${alojamientoIdMod}`;
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cancelar la reserva: " + error.message);
  }
}

function formatearFecha(fecha) {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}