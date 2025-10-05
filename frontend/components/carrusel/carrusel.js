const carrusel = document.querySelector(".carrusel");

carrusel.innerHTML = `<div class="carousel-container">
        <div class="carousel-slide active">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600" alt="Vista de la propiedad">
            <div class="carousel-overlay">
                <h1>Vista Principal</h1>
                <p>Disfruta de espacios cómodos y elegantes diseñados para tu descanso</p>
            </div>
        </div>
        
        <div class="carousel-slide">
            <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600" alt="Habitación principal">
            <div class="carousel-overlay">
                <h1>Comodidad Premium</h1>
                <p>Habitaciones espaciosas con todas las amenidades que necesitas</p>
            </div>
        </div>
        
        <div class="carousel-slide">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600" alt="Área social">
            <div class="carousel-overlay">
                <h1>Espacios Sociales</h1>
                <p>Áreas comunes perfectas para relajarte y socializar</p>
            </div>
        </div>

        <div class="carousel-controls">
            <button class="carousel-btn" id="prevBtn">
                <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button class="carousel-btn" id="nextBtn">
                <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
            </button>
        </div>

        <div class="carousel-dots" id="dots"></div>
    </div>`;

// Funcionalidad
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("dots");

  let currentSlide = 0;
  const totalSlides = slides.length;
  function createDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("carousel-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(slideIndex) {
    slides.forEach((slide) => slide.classList.remove("active"));
    document
      .querySelectorAll(".carousel-dot")
      .forEach((dot) => dot.classList.remove("active"));
    slides[slideIndex].classList.add("active");
    document
      .querySelectorAll(".carousel-dot")
      [slideIndex].classList.add("active");

    currentSlide = slideIndex;
  }

  // Siguiente diapositiva
  function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    goToSlide(next);
  }

  // Diapositiva anterior
  function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  let autoplayInterval = setInterval(nextSlide, 5000);

  // Pausar autoplay al hacer hover
  const carouselContainer = document.querySelector(".carousel-container");
  carouselContainer.addEventListener("mouseenter", () => {
    clearInterval(autoplayInterval);
  });

  carouselContainer.addEventListener("mouseleave", () => {
    autoplayInterval = setInterval(nextSlide, 5000);
  });

  // Inicializar puntos
  createDots();


  // Soporte táctil básico
  let startX = 0;
  let endX = 0;

  carouselContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carouselContainer.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const difference = startX - endX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        nextSlide(); 
      } else {
        prevSlide();
      }
    }
  });
});
