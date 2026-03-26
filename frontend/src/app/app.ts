import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CartService } from './services/cart';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  private cartService = inject(CartService);
  private router = inject(Router);
  
  // Iniciamos como Invitado y sin rol
  usuario: string | null = null; 
  isAdmin: boolean = false;

  get cartCount() {
    return this.cartService.cartCount().length;
  }

  // Función para cerrar sesión y limpiar todo
  logout() {
    this.usuario = null;
    this.isAdmin = false;
    alert('Sesión cerrada.');
    this.router.navigate(['/catalogo']);
  }
}