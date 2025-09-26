/* <script>
        // TypeScript compilado a JavaScript
        class HeaderController {
            constructor() {
                this.header = document.getElementById('header');
                this.nav = document.getElementById('nav');
                this.mobileToggle = document.getElementById('mobileToggle');
                this.init();
            }

            init() {
                // Sticky header on scroll
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        this.header.classList.add('scrolled');
                    } else {
                        this.header.classList.remove('scrolled');
                    }
                });

                // Mobile menu toggle
                this.mobileToggle?.addEventListener('click', () => {
                    this.nav.classList.toggle('mobile-active');
                });

                // Dynamic header based on user role
                this.updateHeaderByRole();
            }

            updateHeaderByRole() {
                const userRole = this.getUserRole(); // Simulated - replace with actual role logic
                
                if (userRole === "ANFITRION") {
                    this.updateMenuForHost();
                } else if (userRole === "HUESPED") {
                    this.updateMenuForGuest();
                }
            }

            getUserRole() {
                // This should connect to your actual authentication system
                return localStorage.getItem('userRole') || 'GUEST';
            }

            updateMenuForHost() {
                const navCenter = document.querySelector('.nav-center');
                navCenter.innerHTML = `
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#propiedades">Mis Propiedades</a></li>
                    <li><a href="#agregar">Agregar Propiedad</a></li>
                    <li><a href="#reservas">Reservaciones</a></li>
                `;
            }

            updateMenuForGuest() {
                const navCenter = document.querySelector('.nav-center');
                navCenter.innerHTML = `
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#destinos">Destinos</a></li>
                    <li><a href="#favoritos">Favoritos</a></li>
                    <li><a href="#reservas">Mis Reservas</a></li>
                `;
            }
        }

        class CarouselController {
            constructor() {
                this.currentSlide = 0;
                this.slides = document.querySelectorAll('.carousel-slide');
                this.dotsContainer = document.getElementById('dots');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.autoPlayInterval = null;
                this.init();
            }

            init() {
                this.createDots();
                this.updateSlide();
                this.startAutoPlay();
                
                this.prevBtn?.addEventListener('click', () => this.prevSlide());
                this.nextBtn?.addEventListener('click', () => this.nextSlide());

                // Pause autoplay on hover
                const container = document.querySelector('.carousel-container');
                container?.addEventListener('mouseenter', () => this.stopAutoPlay());
                container?.addEventListener('mouseleave', () => this.startAutoPlay());
            }

            createDots() {
                this.slides.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => this.goToSlide(index));
                    this.dotsContainer?.appendChild(dot);
                });
            }

            updateSlide() {
                this.slides.forEach((slide, index) => {
                    slide.classList.toggle('active', index === this.currentSlide);
                });

                const dots = this.dotsContainer?.querySelectorAll('.dot');
                dots?.forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentSlide);
                });
            }

            nextSlide() {
                this.currentSlide = (this.currentSlide + 1) % this.slides.length;
                this.updateSlide();
            }

            prevSlide() {
                this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
                this.updateSlide();
            }

            goToSlide(index) {
                this.currentSlide = index;
                this.updateSlide();
            }

            startAutoPlay() {
                this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
            }

            stopAutoPlay() {
                if (this.autoPlayInterval) {
                    clearInterval(this.autoPlayInterval);
                }
            }
        }

        class SearchController {
            constructor() {
                this.searchBtn = document.querySelector('.search-btn');
                this.destinationInput = document.getElementById('destination');
                this.checkinInput = document.getElementById('checkin');
                this.checkoutInput = document.getElementById('checkout');
                this.guestsInput = document.getElementById('guests');
                this.init();
            }

            init() {
                // Set minimum date to today
                const today = new Date().toISOString().split('T')[0];
                if (this.checkinInput) this.checkinInput.min = today;
                if (this.checkoutInput) this.checkoutInput.min = today;

                // Handle check-in date change
                this.checkinInput?.addEventListener('change', (e) => {
                    const checkinDate = e.target.value;
                    if (this.checkoutInput) {
                        this.checkoutInput.min = checkinDate;
                        if (this.checkoutInput.value && this.checkoutInput.value < checkinDate) {
                            this.checkoutInput.value = '';
                        }
                    }
                });

                // Handle search
                this.searchBtn?.addEventListener('click', () => this.performSearch());
            }

            performSearch() {
                const searchData = {
                    destination: this.destinationInput?.value,
                    checkin: this.checkinInput?.value,
                    checkout: this.checkoutInput?.value,
                    guests: this.guestsInput?.value
                };

                console.log('Searching with:', searchData);
                // Implement your search logic here
                // You can redirect to search results page or trigger an API call
            }
        }

        // Initialize controllers when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            new HeaderController();
            new CarouselController();
            new SearchController();
        });
    </script> */