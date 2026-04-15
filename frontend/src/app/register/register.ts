import { Component, OnInit, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app';

declare var Swal: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private appMain = inject(AppComponent);
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  showPassword = false; // Variable para el ojito

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initSocialLogins();
    }
  }

  initSocialLogins() {
    setTimeout(() => {
      // @ts-ignore
      if (typeof google !== 'undefined') {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: '286803224541-tuns40h7tvh47cumqqa0r4fjfi0ddgnl.apps.googleusercontent.com',
          callback: (resp: any) => this.handleGoogleLogin(resp)
        });
      }
    }, 1000);
  }

  handleGoogleLogin(response: any) {
    const payload = JSON.parse(window.atob(response.credential.split('.')[1]));
    this.registrarYEntrarSocial(payload.name, payload.email);
  }

  registrarYEntrarSocial(nombre: string, email: string) {
    this.http.post('http://127.0.0.1:5000/api/registro', { nombre, email }).subscribe({
      next: () => this.finalizarSesionSocial(nombre, email),
      error: () => this.finalizarSesionSocial(nombre, email) // Si ya existe, lo logueamos
    });
  }

  private finalizarSesionSocial(nombre: string, email: string) {
    const isAdmin = (email === 'wladimirmartinez1203@gmail.com');
    this.appMain.usuario = nombre;
    this.appMain.isAdmin = isAdmin;
    localStorage.setItem('figueroa_session', JSON.stringify({ nombre, email, isAdmin }));
    this.router.navigate(['/catalogo']);
  }

  onRegister(datos: any) {
    this.http.post('http://127.0.0.1:5000/api/registro', datos).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro Exitoso!',
          text: 'Tu cuenta ha sido creada. Por favor, inicia sesión.',
          confirmButtonColor: '#212529'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.message || 'Error al conectar con el servidor.'
        });
      }
    });
  }

  loginGoogle() {
    // @ts-ignore
    google.accounts.id.prompt();
  }
}