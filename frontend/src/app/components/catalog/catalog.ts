import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-light py-5 mb-5 border-bottom shadow-sm">
      <div class="container text-center">
        <h1 class="display-6 fw-bold">Nuestro Catálogo</h1>
        <p class="lead text-muted">Herencia en cada madera - Carpintería Figueroa</p>
      </div>
    </header>

    <div class="container mb-5">
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col" *ngFor="let m of muebles">
          <div class="card h-100 border-0 shadow-sm catalog-card">
            <img [src]="m.imagen" class="card-img-top" [alt]="m.nombre" style="height: 250px; object-fit: cover;">
            <div class="card-body text-center">
              <span class="badge bg-info text-dark mb-2">{{ m.categoria }}</span>
              <h5 class="card-title h6 mb-3">{{ m.nombre }}</h5>
              <p class="h5 text-primary fw-bold mb-4">$ {{ m.precio }}</p>
              <div class="btn-group w-100">
                <button class="btn btn-outline-dark btn-sm" (click)="verDetalles(m)">Detalles</button>
                <button class="btn btn-primary btn-sm" (click)="agregar(m)">+ Al carrito</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalog-card { transition: all 0.3s ease; border-radius: 12px; overflow: hidden; }
    .catalog-card:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
  `]
})
export class Catalog implements OnInit {
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private router = inject(Router);
  
  muebles: any[] = [];

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/api/productos')
      .subscribe({
        next: (res) => this.muebles = res,
        error: (err) => console.error('Error cargando productos:', err)
      });
  }

  agregar(mueble: any) { this.cartService.addToCart(mueble); }
  verDetalles(mueble: any) { this.router.navigate(['/detalle', mueble.id]); }
}