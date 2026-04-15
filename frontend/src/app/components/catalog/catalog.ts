import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // <--- Importamos ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

declare var Swal: any;

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

    <div class="container mb-5" style="min-height: 60vh;">
      <div *ngIf="muebles.length === 0" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Cargando piezas exclusivas...</p>
      </div>

      <div class="row row-cols-1 row-cols-md-3 g-4" *ngIf="muebles.length > 0">
        <div class="col" *ngFor="let m of muebles">
          <div class="card h-100 border-0 shadow-sm catalog-card">
            <img [src]="m.imagen_url" class="card-img-top" [alt]="m.nombre" style="height: 250px; object-fit: cover;">
            <div class="card-body text-center">
              <span class="badge bg-info text-dark mb-2">{{ m.categoria || 'Mueble' }}</span>
              <h5 class="card-title h6 mb-3 fw-bold text-uppercase">{{ m.nombre }}</h5>
              <p class="h5 text-primary fw-bold mb-4">$ {{ m.precio }}</p>
              <div class="btn-group w-100 shadow-sm">
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
  private cdr = inject(ChangeDetectorRef); // <--- Inyectamos el detector de cambios
  
  muebles: any[] = [];

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<any[]>('http://localhost:5000/api/productos').subscribe({
      next: (res) => {
        this.muebles = res;
        // FORZAMOS LA DETECCIÓN DE CAMBIOS
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
      }
    });
  }

  agregar(mueble: any) { 
    if (!localStorage.getItem('figueroa_session')) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debes iniciar sesión para añadir productos al carrito.',
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(mueble);
    Swal.fire({
      icon: 'success',
      title: 'Agregado',
      text: `${mueble.nombre} a tu lista`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
  }

  verDetalles(mueble: any) { 
    this.router.navigate(['/detalle', mueble.id]); 
  }
}