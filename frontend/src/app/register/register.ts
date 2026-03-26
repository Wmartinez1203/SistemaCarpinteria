import { Component, OnInit, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app';

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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initGoogle();
    }
  }

  initGoogle() {
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
    
    this.ngZone.run(() => {
      this.http.post('http://127.0.0.1:5000/api/registro', {
        nombre: payload.name,
        email: payload.email
      }).subscribe({
        next: () => {
          this.appMain.usuario = payload.name;
          this.appMain.isAdmin = (payload.email === 'gladimirldu@gmail.com');
          this.router.navigate(['/catalogo']);
        },
        error: () => alert('Error al conectar con el servidor de la Carpintería.')
      });
    });
  }

  onRegister(datos: any) {
    this.http.post('http://127.0.0.1:5000/api/registro', datos).subscribe({
      next: () => {
        this.appMain.usuario = datos.nombre;
        this.appMain.isAdmin = false;
        this.router.navigate(['/catalogo']);
      },
      error: () => alert('Error en el registro manual contra PostgreSQL.')
    });
  }

  loginGoogle() {
    // @ts-ignore
    if (typeof google !== 'undefined') {
      // @ts-ignore
      google.accounts.id.prompt();
    }
  }
}