import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from '../app';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register {
  private router = inject(Router);
  private appMain = inject(AppComponent);

  nombre = '';
  email = '';
  password = '';

  onRegister() {
    // Simulamos el registro para usuarios normales
    this.appMain.usuario = this.nombre || this.email.split('@')[0];
    this.appMain.isAdmin = false; 
    alert('¡Registro exitoso! Bienvenido a Muebles Figueroa.');
    this.router.navigate(['/catalogo']);
  }

  loginSocial(red: string) {
    alert(`Conectando con la API de ${red}...`);
    this.appMain.usuario = `Usuario_${red}`;
    this.appMain.isAdmin = false;
    this.router.navigate(['/catalogo']);
  }
}