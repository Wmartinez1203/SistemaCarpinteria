import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart';

declare var Swal: any;

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5" *ngIf="!loading && mueble; else cargando" style="min-height: 80vh;">
      <div class="row align-items-center">
        
        <div class="col-md-6 mb-4 text-center">
          <img [src]="mueble.imagen_url" 
               (error)="mueble.imagen_url = 'assets/logo-figueroa.jpg'"
               class="img-fluid rounded shadow-lg animate__animated animate__fadeIn" 
               [alt]="mueble.nombre" 
               style="max-height: 500px; width: 100%; object-fit: cover; border-radius: 20px;">
        </div>

        <div class="col-md-6 ps-lg-5 text-dark">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb small">
              <li class="breadcrumb-item">
                <a routerLink="/catalogo" class="text-decoration-none text-muted">Catálogo</a>
              </li>
              <li class="breadcrumb-item active text-capitalize text-primary fw-bold">
                {{mueble.categoria}}
              </li>
            </ol>
          </nav>

          <h1 class="display-5 fw-bold mb-3">{{mueble.nombre}}</h1>
          <p class="h2 text-primary fw-bold mb-4">$ {{mueble.precio}}</p>

          <div class="bg-light p-4 rounded-3 mb-4 border-start border-primary border-4 shadow-sm">
            <p class="small text-muted mb-2">
              <strong>📏 Medidas:</strong> {{mueble.medidas || 'A convenir'}}
            </p>
            <h5 class="h6 fw-bold text-dark">Descripción técnica:</h5>
            <p class="text-muted lh-lg mb-0">
              {{mueble.descripcion || 'Artesanía de alta calidad elaborada en el taller Figueroa.'}}
            </p>
          </div>

          <div class="d-grid gap-2 d-md-flex">
            <button class="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow fw-bold" 
                    (click)="agregar(mueble)">
              <i class="bi bi-cart-plus me-2"></i>Añadir al Carrito
            </button>
            <a routerLink="/catalogo" class="btn btn-outline-dark btn-lg px-4 rounded-pill py-3">
              Volver al Catálogo
            </a>
          </div>
        </div>
      </div>
    </div>

    <ng-template #cargando>
      <div class="container text-center py-5" style="margin-top: 100px; min-height: 80vh;">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-dark fw-bold animate__animated animate__pulse animate__infinite">
          Consultando taller Figueroa...
        </p>
      </div>
    </ng-template>
  `
})
export class DetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  mueble: any = null;
  loading: boolean = true;

  ngOnInit() {
    // Escuchamos los cambios en los parámetros de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.iniciarCarga(id);
      }
    });
  }

  private iniciarCarga(id: string) {
    this.loading = true;
    this.mueble = null; // Limpiamos rastro del mueble anterior
    this.cargarMueble(id);
  }

  cargarMueble(id: string) {
    // Consumo del API corregida del backend
    this.http.get<any>(`http://localhost:5000/api/productos/${id}`).subscribe({
      next: (producto) => {
        this.mueble = producto;
        this.finalizarCarga();
      },
      error: (err) => {
        console.error("Error en la conexión con el taller:", err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Mueble no encontrado',
          text: 'Lo sentimos, el mueble solicitado no está disponible.',
          confirmButtonColor: '#0d6efd'
        });
        this.router.navigate(['/catalogo']);
      }
    });
  }

  private finalizarCarga() {
    // Un pequeño delay para que la transición visual sea suave
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges(); // Notificamos a Angular el cambio de estado
    }, 300);
  }

  agregar(mueble: any) {
    // Verificación de sesión antes de comprar
    const session = localStorage.getItem('figueroa_session');
    
    if (!session) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia Sesión',
        text: 'Para realizar pedidos en la Carpintería Figueroa, debes estar registrado.',
        confirmButtonColor: '#0d6efd'
      });
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(mueble);
    Swal.fire({
      icon: 'success',
      title: '¡Excelente elección!',
      text: `${mueble.nombre} ha sido añadido al carrito.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  }
}