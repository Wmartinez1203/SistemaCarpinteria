import { Component, inject, Injectable, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = signal<any[]>([]);
  public cartCount = this.items.asReadonly();

  addToCart(product: any) { 
    this.items.update(prev => [...prev, product]); 
  }
  getItems() { return this.items(); }
  getTotal() { return this.items().reduce((acc, item) => acc + item.precio, 0); }
}

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5 text-dark">
      <h2 class="fw-bold">Mi Carrito 🛒</h2>
      <hr>
      <div *ngIf="items.length === 0" class="alert alert-warning text-center">
        Carrito vacío. <a routerLink="/catalogo" class="fw-bold">Ir al catálogo.</a>
      </div>
      <div class="row" *ngIf="items.length > 0">
        <div class="col-md-8">
          <div class="card mb-3 p-3 shadow-sm border-0" *ngFor="let item of items">
            <div class="d-flex align-items-center">
              <img [src]="item.imagen" class="rounded" style="height: 80px; width: 80px; object-fit: cover;">
              <div class="ms-4 flex-grow-1">
                <h5 class="mb-1 fw-bold">{{item.nombre}}</h5>
                <p class="text-primary mb-0 fw-bold">$ {{item.precio}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 bg-light border-0 shadow">
            <h4 class="fw-bold">Resumen</h4>
            <div class="d-flex justify-content-between mb-3 fs-5">
                <span>Total:</span>
                <span class="text-success fw-bold">$ {{total}}</span>
            </div>
            <button class="btn btn-primary btn-lg w-100 mt-2 rounded-pill" (click)="finalizar()">
                Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartPageComponent {
  private cartService = inject(CartService);
  get items() { return this.cartService.getItems(); }
  get total() { return this.cartService.getTotal(); }
  
  finalizar() { 
    alert('Generando factura... (Lógica de 9° semestre UCE activa)'); 
  }
}