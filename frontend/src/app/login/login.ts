import { Component, inject, OnInit, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private appMain = inject(AppComponent);
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  email = '';
  password = '';

  ngOnInit() {
    // Solo inicializamos si estamos en el navegador para evitar el ReferenceError
    if (isPlatformBrowser(this.platformId)) {
      this.initGoogleLogin();
    }
  }

  initGoogleLogin() {
    setTimeout(() => {
      // @ts-ignore
      if (typeof google !== 'undefined') {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: '286803224541-tuns40h7tvh47cumqqa0r4fjfi0ddgnl.apps.googleusercontent.com',
          callback: (resp: any) => this.handleGoogleResponse(resp)
        });
        
        // Renderizamos el botón oficial en el contenedor que tengas en tu HTML
        // @ts-ignore
        google.accounts.id.renderButton(
          document.getElementById("googleBtn"), 
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    }, 1000);
  }

  handleGoogleResponse(response: any) {
    // Decodificamos el perfil del usuario desde el token JWT
    const payload = JSON.parse(window.atob(response.credential.split('.')[1]));
    
    this.ngZone.run(() => {
      // Verificamos o registramos en tu PostgreSQL
      this.http.post('http://127.0.0.1:5000/api/registro', {
        nombre: payload.name,
        email: payload.email
      }).subscribe({
        next: () => {
          this.appMain.usuario = payload.name;
          // Si eres tú, activamos el modo Admin
          this.appMain.isAdmin = (payload.email === 'gladimirldu@gmail.com');
          this.router.navigate(['/catalogo']);
        },
        error: () => alert('Error de conexión con el servidor Figueroa')
      });
    });
  }

  onSubmit() {
    // Tu lógica de "Orden 66" para acceso directo
    if (this.email === 'gladimirldu@gmail.com' && this.password === 'Orden_66') {
      this.appMain.usuario = 'Fernando Martínez (Admin)';
      this.appMain.isAdmin = true;
      alert('Acceso Total Concedido, Ingeniero.');
      this.router.navigate(['/catalogo']);
    } 
    else if (this.email !== '' && this.password !== '') {
      this.appMain.usuario = this.email.split('@')[0];
      this.appMain.isAdmin = false;
      this.router.navigate(['/catalogo']);
    } 
  }
}