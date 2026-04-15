import { Injectable, signal } from '@angular/core';

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

  getTotal() { 
    return this.items().reduce((acc, item) => acc + item.precio, 0); 
  }

  // IMPORTANTE: Para vaciar el carrito después de comprar
  clearCart() {
    this.items.set([]);
  }
}