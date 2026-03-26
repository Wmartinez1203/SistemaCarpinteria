import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5" *ngIf="mueble; else cargando">
      <div class="row align-items-center">
        <div class="col-md-6 mb-4">
          <img [src]="mueble.imagen" class="img-fluid rounded shadow-lg" 
               [alt]="mueble.nombre" style="max-height: 500px; width: 100%; object-fit: cover;">
        </div>
        <div class="col-md-6 ps-lg-5 text-dark">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb small">
              <li class="breadcrumb-item"><a routerLink="/catalogo">Catálogo</a></li>
              <li class="breadcrumb-item active text-capitalize">{{mueble.categoria}}</li>
            </ol>
          </nav>
          
          <h1 class="display-5 fw-bold mb-3">{{mueble.nombre}}</h1>
          <p class="h2 text-primary fw-bold mb-4">$ {{mueble.precio}}</p>
          
          <div class="bg-light p-4 rounded-3 mb-4">
            <h5 class="h6 fw-bold">Descripción del artesano:</h5>
            <p class="text-muted lh-lg mb-0">{{mueble.detalle || 'Calidad garantizada Figueroa.'}}</p>
          </div>

          <div class="d-grid gap-2 d-md-flex">
            <button class="btn btn-primary btn-lg px-5 py-3 rounded-pill" (click)="agregar(mueble)">
              <i class="bi bi-cart-plus me-2"></i>Añadir al Carrito
            </button>
            <a routerLink="/catalogo" class="btn btn-outline-dark btn-lg px-4 rounded-pill py-3">Volver</a>
          </div>
        </div>
      </div>
    </div>

    <ng-template #cargando>
      <div class="container text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-dark">Buscando mueble en la base de datos Figueroa...</p>
      </div>
    </ng-template>
  `
})
export class DetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  
  mueble: any = null;

  ngOnInit() {
    // Usamos paramMap para obtener el ID de forma segura
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.cargarMueble(id);
    });
  }

  cargarMueble(id: string | null) {
    this.http.get<any[]>('http://localhost:5000/api/productos').subscribe({
      next: (productos) => {
        // Buscamos con == para ignorar si uno es string y el otro number
        this.mueble = productos.find(p => p.id == id);
        if (!this.mueble) console.error("Mueble no encontrado con ID:", id);
      },
      error: (err) => console.error('Error cargando detalle:', err)
    });
  }

  agregar(mueble: any) {
    this.cartService.addToCart(mueble);
    alert('¡Añadido al carrito!');
  }
}