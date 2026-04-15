import { Component, inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router'; 
import { CartService } from './services/cart';

declare var Swal: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private ngZone = inject(NgZone);
  private cartService = inject(CartService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  usuario: string | null = null; 
  isAdmin: boolean = false;

  get cartCount() {
    return this.cartService.cartCount().length;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.verificarSesion();

      // ESTO SOLUCIONA EL REFRESH: Escucha cambios de ruta para actualizar el Navbar
      this.router.events.subscribe(() => {
        this.verificarSesion();
      });
    }
  }

  verificarSesion() {
    if (isPlatformBrowser(this.platformId)) {
      const sesionData = localStorage.getItem('figueroa_session');
      if (sesionData) {
        const sesion = JSON.parse(sesionData);
        this.usuario = sesion.nombre;
        this.isAdmin = sesion.isAdmin;
      } else {
        this.usuario = null;
        this.isAdmin = false;
      }
    }
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Se cerrará tu acceso a la Carpintería Figueroa.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#212529',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.ngZone.run(() => {
          localStorage.removeItem('figueroa_session');
          
          // RESETEO INSTANTÁNEO: El Navbar cambia sin F5
          this.usuario = null;
          this.isAdmin = false;
          
          this.router.navigate(['/login']);
        });
      }
    });
  }
}