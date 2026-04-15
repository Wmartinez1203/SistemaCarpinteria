import { Component, inject, OnInit, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app';

declare var Swal: any;

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
  showPassword = false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initGoogleLogin();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
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
        
        // @ts-ignore
        google.accounts.id.renderButton(
          document.getElementById("googleBtn"), 
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    }, 1000);
  }

  private guardarSesionYEntrar(nombre: string, email: string, isAdmin: boolean) {
    const sesion = { nombre, email, isAdmin };
    localStorage.setItem('figueroa_session', JSON.stringify(sesion));
    
    this.appMain.usuario = nombre;
    this.appMain.isAdmin = isAdmin;
    this.router.navigate(['/catalogo']);
  }

  handleGoogleResponse(response: any) {
    const payload = JSON.parse(window.atob(response.credential.split('.')[1]));
    
    this.ngZone.run(() => {
      this.http.post('http://127.0.0.1:5000/api/registro', {
        nombre: payload.name,
        email: payload.email,
        password: 'google_user' 
      }).subscribe({
        next: () => {
          const isAdmin = (payload.email === 'wladimirmartinez1203@gmail.com');
          this.notificarExito(`¡Hola, ${payload.name}!`, 'Sesión con Google iniciada');
          this.guardarSesionYEntrar(payload.name, payload.email, isAdmin);
        },
        error: () => {
          const isAdmin = (payload.email === 'wladimirmartinez1203@gmail.com');
          this.guardarSesionYEntrar(payload.name, payload.email, isAdmin);
        }
      });
    });
  }

  onSubmit() {
    if (!this.email || !this.password) {
      Swal.fire({ icon: 'warning', title: 'Atención', text: 'Completa los campos.' });
      return;
    }

    this.http.post<any>('http://127.0.0.1:5000/api/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.notificarExito(res.isAdmin ? 'Acceso Admin Concedido' : '¡Bienvenido!', `Hola, ${res.nombre}`);
        this.guardarSesionYEntrar(res.nombre, res.email, res.isAdmin);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Acceso Denegado',
          text: 'Correo o contraseña incorrectos',
          confirmButtonColor: '#212529'
        });
        this.password = ''; 
      }
    });
  }

  private notificarExito(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }
}