import { Component, inject, OnInit } from '@angular/core'; // Añadimos OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from '../app';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login'; // Importante
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  // Añadimos GoogleSigninButtonModule a los imports
  imports: [CommonModule, FormsModule, RouterLink, GoogleSigninButtonModule], 
  templateUrl: './login.html'
})
export class Login implements OnInit { // Implementamos OnInit
  private router = inject(Router);
  private appMain = inject(AppComponent);
  private authService = inject(SocialAuthService); // Servicio de la librería
  private backendAuth = inject(AuthService);      // Tu servicio de Flask

  email = '';
  password = '';

  ngOnInit() {
    // Escuchamos cuando el usuario usa el botón de Google
    this.authService.authState.subscribe((user) => {
      if (user) {
        console.log("Token de Google:", user.idToken);
        
        // Enviamos al backend de Muebles Figueroa
        this.backendAuth.loginWithGoogle(user.idToken).subscribe({
          next: (res) => {
            this.appMain.usuario = res.user.nombre;
            this.appMain.isAdmin = false; // Por defecto cliente
            this.router.navigate(['/catalogo']);
          },
          error: (err) => alert('Error al validar con Google')
        });
      }
    });
  }

  onSubmit() {
    // Tu lógica actual de Admin se mantiene intacta
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