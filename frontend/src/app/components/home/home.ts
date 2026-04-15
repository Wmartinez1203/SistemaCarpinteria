import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-section text-white d-flex align-items-center position-relative" 
             style="height: 85vh; border-bottom: 5px solid #D4AF37; overflow: hidden;">
      <img src="assets/banner.jpeg" alt="Taller Figueroa" 
           class="position-absolute w-100 h-100 object-fit-cover top-0 start-0" 
           style="z-index: 1; filter: brightness(0.5);">
      
      <div class="container text-center position-relative" style="z-index: 2;">
        <h1 class="display-1 fw-bold mb-3" style="letter-spacing: 2px; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">Arte en Madera</h1>
        <p class="lead mb-5 fs-3 text-light">Herencia familiar y maestría artesanal en Carcelén Bajo.</p>
        <div class="d-flex justify-content-center gap-3">
          <a routerLink="/catalogo" class="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-lg fw-bold">Ver Catálogo</a>
          <a href="#contacto" class="btn btn-outline-light btn-lg rounded-pill px-5 py-3 fw-bold">Contáctanos</a>
        </div>
      </div>
    </section>

    <section id="historia" class="py-5 bg-white">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-md-5 mb-5 mb-md-0 text-center">
             <div class="position-relative p-2 border shadow-lg bg-light rounded-4">
                <img src="logo-figueroa.jpg" class="img-fluid rounded-3" alt="Legado Figueroa">
                <div class="position-absolute bottom-0 end-0 bg-primary text-white p-4 rounded-start-4 shadow-lg border-start border-white border-2">
                  <h3 class="mb-0 fw-bold">+40 Años</h3>
                  <small>De Tradición</small>
                </div>
             </div>
          </div>
          <div class="col-md-7 ps-md-5">
            <h6 class="text-primary fw-bold text-uppercase ls-2 mb-3">Desde las manos del abuelo</h6>
            <h2 class="display-4 fw-bold mb-4 text-dark">El Legado de Rómulo Washington Figueroa Caicedo</h2>
            <p class="lead text-secondary mb-4">
              Muebles Figueroa nació de las manos de mi abuelito, 
              <strong>Rómulo Washington</strong>, un maestro que nos enseñó que la madera tiene alma.
            </p>
            <p class="text-muted mb-4">
              Hoy, en Carcelén Bajo, continuamos su herencia aplicando las mismas técnicas de ensamblaje tradicional combinada con el diseño moderno que tu hogar merece.
            </p>
            <div class="p-3 bg-light rounded-3 border-start border-primary border-4 shadow-sm">
              <i class="text-dark italic">"Un mueble bien hecho es un legado para siempre." - R. Washington Figueroa</i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="contacto" class="py-5 bg-light">
      <div class="container py-5">
        <div class="row g-5">
          <div class="col-md-6">
            <h2 class="fw-bold mb-4">Ubicación y Horarios</h2>
            <div class="mb-4 d-flex align-items-center">
              <i class="bi bi-geo-alt-fill text-primary fs-3 me-3"></i>
              <div>
                <h6 class="mb-0 fw-bold">Dirección</h6>
                <p class="text-muted mb-0 small">Carcelén Bajo, Quito - Ecuador</p>
              </div>
            </div>
            <div class="mb-4 d-flex align-items-center">
              <i class="bi bi-clock-fill text-primary fs-3 me-3"></i>
              <div>
                <h6 class="mb-0 fw-bold">Horario de Atención</h6>
                <p class="text-muted mb-0 small">Lunes a Sábado: 09:00 am - 07:00 pm</p>
              </div>
            </div>
            <div class="d-flex gap-4 mt-4 fs-3">
              <a href="https://www.facebook.com/MueblesFigueroaa/" target="_blank" class="text-dark"><i class="bi bi-facebook"></i></a>
              <a href="https://www.tiktok.com/@mueblesfysc" target="_blank" class="text-dark"><i class="bi bi-tiktok"></i></a>
              <a href="#" class="text-success"><i class="bi bi-whatsapp"></i></a>
            </div>
          </div>
          <div class="col-md-6 text-center">
            <a href="https://maps.app.goo.gl/eRm1u1W62gNGwGMg8" target="_blank">
              <img src="assets/maps-figueroa.png" class="img-fluid rounded-4 shadow-lg hover-up border bg-white p-1" alt="Mapa Figueroa">
            </a>
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-dark text-white py-4 text-center border-top border-secondary">
      <small class="opacity-75">© 2026 Muebles Figueroa - Desarrollado por Fernando Martínez Figueroa</small>
    </footer>
  `,
  styles: [`.hover-up:hover { transform: translateY(-5px); transition: 0.3s; }.ls-2 { letter-spacing: 2px; }`]
})
export class HomeComponent {}