// ReservationCalendar.js - Componente para mostrar disponibilidad de alojamiento

class ReservationCalendar {
  constructor(containerId, alojamientoId) {
    this.containerId = containerId;
    this.alojamientoId = alojamientoId;
    this.reservas = [];
    this.currentDate = new Date();
    this.selectedMonth = this.currentDate.getMonth();
    this.selectedYear = this.currentDate.getFullYear();
  }

  async init() {
    try {
      // Cargar reservas del alojamiento
      this.reservas = await apiService.obtenerDisponibilidadAlojamiento(
        this.alojamientoId
      );
      this.render();
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
      this.renderError();
    }
  }

  renderError() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #dc2626;">
        <p>Error al cargar el calendario de disponibilidad</p>
      </div>
    `;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Calcular días del mes
    const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
    const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Obtener fechas reservadas
    const fechasReservadas = this.getFechasReservadas();

    let calendarHTML = `
      <div class="reservation-calendar" style="
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        max-width: 400px;
        margin: 0 auto;
      ">
        <div class="calendar-header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        ">
          <button class="calendar-nav-btn" data-direction="prev" style="
            background: #f3f4f6;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">‹</button>
          <h3 style="margin: 0; font-size: 18px; color: #2d3748;">
            ${monthNames[this.selectedMonth]} ${this.selectedYear}
          </h3>
          <button class="calendar-nav-btn" data-direction="next" style="
            background: #f3f4f6;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">›</button>
        </div>

        <div class="calendar-weekdays" style="
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 8px;
        ">
          ${daysOfWeek
            .map(
              (day) => `
            <div style="
              text-align: center;
              font-weight: 600;
              font-size: 12px;
              color: #718096;
              padding: 8px 0;
            ">${day}</div>
          `
            )
            .join("")}
        </div>

        <div class="calendar-days" style="
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        ">
    `;

    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarHTML += `<div style="padding: 8px;"></div>`;
    }

    // Días del mes
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.selectedYear, this.selectedMonth, day);
      const dateStr = this.formatDate(date);
      const isPast = date < today;
      const isReserved = fechasReservadas.has(dateStr);

      let dayStyle = `
        padding: 8px;
        text-align: center;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      `;

      if (isPast) {
        dayStyle += `color: #cbd5e0; background: #f7fafc;`;
      } else if (isReserved) {
        dayStyle += `color: white; background: #dc2626; font-weight: 600;`;
      } else {
        dayStyle += `color: #2d3748; background: #f0fdf4;`;
      }

      calendarHTML += `
        <div class="calendar-day" data-date="${dateStr}" style="${dayStyle}">
          ${day}
        </div>
      `;
    }

    calendarHTML += `
        </div>

        <div class="calendar-legend" style="
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
          font-size: 12px;
        ">
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 16px; height: 16px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 4px;"></div>
            <span>Disponible</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 16px; height: 16px; background: #dc2626; border-radius: 4px;"></div>
            <span>Reservado</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 16px; height: 16px; background: #f7fafc; border-radius: 4px;"></div>
            <span>Pasado</span>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = calendarHTML;

    // Agregar event listeners
    this.attachEventListeners();
  }

  attachEventListeners() {
    const prevBtn = document.querySelector(
      `.calendar-nav-btn[data-direction="prev"]`
    );
    const nextBtn = document.querySelector(
      `.calendar-nav-btn[data-direction="next"]`
    );

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.selectedMonth--;
        if (this.selectedMonth < 0) {
          this.selectedMonth = 11;
          this.selectedYear--;
        }
        this.render();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.selectedMonth++;
        if (this.selectedMonth > 11) {
          this.selectedMonth = 0;
          this.selectedYear++;
        }
        this.render();
      });
    }
  }

  getFechasReservadas() {
    const fechas = new Set();

    this.reservas.forEach((reserva) => {
      const checkin = new Date(reserva.checkin);
      const checkout = new Date(reserva.checkout);

      // Agregar todas las fechas en el rango (excluyendo checkout)
      let currentDate = new Date(checkin);
      while (currentDate < checkout) {
        fechas.add(this.formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return fechas;
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

// Exportar para uso global
window.ReservationCalendar = ReservationCalendar;

