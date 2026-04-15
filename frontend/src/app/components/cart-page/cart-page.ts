import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart';

declare var Swal: any;

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage {
  private cartService = inject(CartService);
  private router = inject(Router);

  get items() { return this.cartService.getItems(); }
  get total() { return this.cartService.getTotal(); }
  
  finalizar() { 
    // VALIDACIÓN DE SEGURIDAD
    const sesionData = localStorage.getItem('figueroa_session');
    
    if (!sesionData) {
      Swal.fire({
        icon: 'info',
        title: 'Identificación Necesaria',
        text: 'Para procesar tu factura y pedido, por favor inicia sesión.',
        showCancelButton: true,
        confirmButtonText: 'Ir al Login',
        cancelButtonText: 'Seguir mirando',
        confirmButtonColor: '#212529'
      }).then((result: any) => {
        if (result.isConfirmed) this.router.navigate(['/login']);
      });
      return; // Detiene el proceso
    }

    const usuario = JSON.parse(sesionData);

    Swal.fire({
      title: 'Generando Factura',
      text: `Procesando pedido para ${usuario.nombre}...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: '¡Compra Exitosa!',
        text: `Factura enviada a ${usuario.email}. ¡Gracias por preferir Carpintería Figueroa!`,
        confirmButtonColor: '#212529'
      }).then(() => {
        this.cartService.clearCart();
        this.router.navigate(['/catalogo']);
      });
    }, 2500);
  }
}