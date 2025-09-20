class HeaderManager {
    private header: HTMLElement;
    private mobileMenuBtn: HTMLElement;
    private navLinks: HTMLElement;
    private searchBtn: HTMLElement;
    private isMenuOpen: boolean;

    constructor() {
        this.header = document.getElementById('header')!;
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn')!;
        this.navLinks = document.getElementById('navLinks')!;
        this.searchBtn = document.getElementById('searchBtn')!;
        this.isMenuOpen = false;

        this.init();
    }

    private init(): void {
        this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        window.addEventListener('scroll', () => this.handleScroll());
        this.searchBtn.addEventListener('click', () => this.handleSearch());

        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target as Node) && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        this.setupSmoothScroll();
        this.loadSampleProperties();
    }

    private toggleMobileMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
        this.mobileMenuBtn.classList.toggle('active');
        this.navLinks.classList.toggle('active');
    }

    private closeMobileMenu(): void {
        this.isMenuOpen = false;
        this.mobileMenuBtn.classList.remove('active');
        this.navLinks.classList.remove('active');
    }

    private handleScroll(): void {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        const hero = document.querySelector('.hero') as HTMLElement;
        if (hero && scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }

    private handleSearch(): void {
        this.searchBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.searchBtn.style.transform = '';
        }, 150);

        document.getElementById('properties')?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    private setupSmoothScroll(): void {
        this.navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href')!.substring(1);
                const targetElement = document.getElementById(targetId);
                targetElement?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    private loadSampleProperties(): void {
        const featuredProperties = [
            { title: "Casa moderna en el centro", description: "Hermosa casa con todas las comodidades.", price: "$150/noche" },
            { title: "Cabaña en la montaña", description: "Perfecta para descansar en la naturaleza.", price: "$120/noche" },
            { title: "Apartamento frente al mar", description: "Disfruta de las mejores vistas al océano.", price: "$200/noche" }
        ];

        const featuredList = document.getElementById('featuredList')!;
        const propertiesList = document.getElementById('propertiesList')!;

        featuredProperties.forEach(property => {
            const card = this.createPropertyCard(property);
            featuredList.appendChild(card.cloneNode(true));
            propertiesList.appendChild(card.cloneNode(true));
        });
    }

    private createPropertyCard(property: { title: string, description: string, price: string }): HTMLElement {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <h3 style="color: #2c5530; margin-bottom: 1rem; font-size: 1.3rem;">${property.title}</h3>
            <p style="margin-bottom: 1rem; color: #666;">${property.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: #4a7c59; font-size: 1.2rem;">${property.price}</span>
                <button style="padding: 0.5rem 1rem; background: #2c5530; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Ver más
                </button>
            </div>
        `;
        return card;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HeaderManager();
});
