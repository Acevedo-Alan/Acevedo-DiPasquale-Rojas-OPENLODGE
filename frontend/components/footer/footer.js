const footer = document.querySelector(".site-footer");

footer.innerHTML = `
  <div class="footer-container">
    <div class="footer-brand">
      <div>
        <h3 class="brand-title">OpenLodge</h3>
        <p class="brand-tag">Encuentra alojamientos ideales para tu viaje</p>
      </div>
    </div>

    <nav class="footer-nav" aria-label="Enlaces principales">
      <h4 class="footer-heading">Enlaces</h4>
      <ul>
        <li><a href="#">Inicio</a></li>
        <li><a href="#">Buscar</a></li>
        <li><a href="#">Publicar</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
    </nav>

    <div class="footer-contact" aria-label="Contacto">
      <h4 class="footer-heading">Contacto</h4>
      <address>
        <a href="mail:soporte@openlodge.example">soporte@openlodge.example</a><br>
        <a href="tel:+541112345678">+54 9 11 1234 5678</a>
      </address>
    </div>

    <div class="footer-newsletter" aria-label="Suscripción">
       <div class="socials" aria-label="Redes sociales">
        <a href="#" class="social" aria-label="Facebook">
          <!-- simple svg icon -->
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2v-2.9h2.2V9.1c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.15h-1.1c-1.09 0-1.43.68-1.43 1.37v1.66h2.43l-.39 2.9H14.5v7A10 10 0 0 0 22 12z"/></svg>
        </a>
        <a href="#" class="social" aria-label="Instagram">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zM18.5 6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>
        </a>
        <a href="#" class="social" aria-label="Twitter">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M22 5.92a8.54 8.54 0 0 1-2.36.65 4.1 4.1 0 0 0 1.8-2.27 8.2 8.2 0 0 1-2.6.99 4.12 4.12 0 0 0-7 3.76A11.67 11.67 0 0 1 3 4.89a4.11 4.11 0 0 0 1.27 5.5 4.07 4.07 0 0 1-1.86-.51v.05a4.12 4.12 0 0 0 3.3 4 4.14 4.14 0 0 1-1.85.07 4.12 4.12 0 0 0 3.84 2.85A8.26 8.26 0 0 1 2 19.54 11.64 11.64 0 0 0 8.29 21c7.55 0 11.69-6.26 11.69-11.69v-.53A8.18 8.18 0 0 0 22 5.92z"/></svg>
        </a>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; <span id="current-year"></span> OpenLodge. Todos los derechos reservados.</p>
    <ul class="footer-legal">
      <li><a href="#">Términos</a></li>
      <li><a href="#">Privacidad</a></li>
    </ul>
  </div>
`;
