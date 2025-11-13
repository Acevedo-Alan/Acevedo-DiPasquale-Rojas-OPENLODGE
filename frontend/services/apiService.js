const API_BASE_URL = "http://localhost:8080";

const apiService = {
  // Utilidades
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || error.mensaje || "Error en la petición");
    }
    return response.json();
  },

  // ALOJAMIENTOS
  async getAlojamientos() {
    const response = await fetch(`${API_BASE_URL}/api/alojamientos/getAll`);
    return this.handleResponse(response);
  },

  async getAlojamientoById(id) {
    const response = await fetch(`${API_BASE_URL}/api/alojamientos/${id}`);
    return this.handleResponse(response);
  },

  async buscarAlojamientos(params) {
    const queryParams = new URLSearchParams();
    if (params.checkin) queryParams.append("checkin", params.checkin);
    if (params.checkout) queryParams.append("checkout", params.checkout);
    if (params.capacidadMin)
      queryParams.append("capacidadMin", params.capacidadMin);
    if (params.precioMax) queryParams.append("precioMax", params.precioMax);
    if (params.ciudadId) queryParams.append("ciudadId", params.ciudadId);

    const response = await fetch(
      `${API_BASE_URL}/api/alojamientos/buscar?${queryParams}`
    );
    return this.handleResponse(response);
  },

  async crearAlojamiento(data) {
    // Adaptar al formato del DTO
    const alojamientoDTO = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      imagen:
        data.imagen ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      precioNoche: data.precioNoche || data.precioPorNoche,
      capacidadHuespedes: data.capacidadHuespedes || data.capacidadMax,
      direccion: data.direccion, // Objeto Direccion completo
      servicios: data.servicios || [], // Set<Servicio>
    };

    const response = await fetch(
      `${API_BASE_URL}/api/alojamientos/crearAlojamiento`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(alojamientoDTO),
      }
    );
    return this.handleResponse(response);
  },

  async actualizarAlojamiento(id, data) {
    const alojamientoDTO = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      imagen: data.imagen,
      precioNoche: data.precioNoche || data.precioPorNoche,
      capacidadHuespedes: data.capacidadHuespedes || data.capacidadMax,
      direccion: data.direccion,
      servicios: data.servicios || [],
    };

    const response = await fetch(`${API_BASE_URL}/api/alojamientos/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(alojamientoDTO),
    });
    return this.handleResponse(response);
  },

  async eliminarAlojamiento(id) {
    const response = await fetch(`${API_BASE_URL}/api/alojamientos/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  },

  async getAlojamientosPorAnfitrion(anfitrionId) {
    const response = await fetch(
      `${API_BASE_URL}/api/alojamientos/anfitrion/${anfitrionId}`
    );
    return this.handleResponse(response);
  },

  async crearReserva(usuarioId, data) {
    const reservaDTO = {
      alojamientoId: data.alojamientoId,
      checkin: data.checkin || data.fechaInicio, 
      checkout: data.checkout || data.fechaFin,
      huespedes: data.huespedes || data.cantidadHuespedes,
    };

    const response = await fetch(
      `${API_BASE_URL}/api/reservas/usuario/${usuarioId}`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reservaDTO),
      }
    );
    return this.handleResponse(response);
  },

  async modificarReserva(usuarioId, alojamientoId, params) {
    const queryParams = new URLSearchParams({
      nuevoCheckin: params.nuevoCheckin,
      nuevoCheckout: params.nuevoCheckout,
      nuevosHuespedes: params.nuevosHuespedes,
    });

    const response = await fetch(
      `${API_BASE_URL}/api/reservas/usuario/${usuarioId}/alojamiento/${alojamientoId}?${queryParams}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  },

  async cancelarReserva(usuarioId, alojamientoId) {
    const response = await fetch(
      `${API_BASE_URL}/api/reservas/usuario/${usuarioId}/alojamiento/${alojamientoId}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  },

  async obtenerHistorialUsuario(usuarioId) {
    const response = await fetch(
      `${API_BASE_URL}/api/reservas/usuario/${usuarioId}`
    );
    return this.handleResponse(response);
  },

  async obtenerReservasPasadas(usuarioId) {
    const response = await fetch(
      `${API_BASE_URL}/api/reservas/usuario/${usuarioId}/pasadas`
    );
    return this.handleResponse(response);
  },

  async verificarDisponibilidad(alojamientoId, checkin, checkout) {
    const queryParams = new URLSearchParams({ checkin, checkout });
    const response = await fetch(
      `${API_BASE_URL}/api/reservas/disponibilidad/${alojamientoId}?${queryParams}`
    );
    return this.handleResponse(response);
  },

  async obtenerDisponibilidadAlojamiento(alojamientoId) {
    const response = await fetch(
      `${API_BASE_URL}/api/alojamientos/${alojamientoId}/disponibilidad`
    );
    return this.handleResponse(response);
  },

  // SERVICIOS
  async getServicios() {
    const response = await fetch(`${API_BASE_URL}/api/servicios`);
    return this.handleResponse(response);
  },

  async getServicioById(id) {
    const response = await fetch(`${API_BASE_URL}/api/servicios/${id}`);
    return this.handleResponse(response);
  },
};

// Exportar para usar en otros archivos
window.apiService = apiService;
