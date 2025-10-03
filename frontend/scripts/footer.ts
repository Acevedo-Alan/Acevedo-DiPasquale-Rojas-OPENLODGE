/*
// global-footer.js
class FooterController {
  constructor() {
    this.footer = document.querySelector("footer");
    if (this.footer) this.init();
  }

  init() {
    this.initializeNewsletter();
    this.initializeSocialLinks();
  }

  initializeNewsletter() {
    const newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        this.subscribeNewsletter(email);
      });
    }
  }

  initializeSocialLinks() {
    const socialLinks = document.querySelectorAll(".social-icon");
    socialLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        console.log("Social link clicked:", e.target.href);
      });
    });
  }

  subscribeNewsletter(email) {
    console.log("Subscribing email:", email);
    // Aquí se puede hacer fetch a tu API
  }
}

// Exportar para uso en main.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = FooterController;
}
*/