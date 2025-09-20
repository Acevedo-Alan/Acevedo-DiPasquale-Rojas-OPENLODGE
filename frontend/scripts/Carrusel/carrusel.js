document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
  
    let currentIndex = 0;
    const slidesToShow = 3; // cuántas imágenes se ven en escritorio
  
    function updateCarousel() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
  
    nextButton.addEventListener("click", () => {
      if (currentIndex < slides.length - slidesToShow) {
        currentIndex++;
        updateCarousel();
      }
    });
  
    prevButton.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  
    // Control del tamaño de las img
 
    function setImageHeight(px) {
      document.documentElement.style.setProperty("--image-height", px + "px");
    }
    setImageHeight(280);
  });
  