import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from '../app';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  private router = inject(Router);
  private appMain = inject(AppComponent);

  email = '';
  password = '';

  onSubmit() {
    // 1. Lógica para el Administrador (Tú)
    if (this.email === 'gladimirldu@gmail.com' && this.password === 'Orden_66') {
      this.appMain.usuario = 'Fernando Martínez (Admin)';
      this.appMain.isAdmin = true;
      alert('Acceso Total Concedido, Ingeniero.');
      this.router.navigate(['/catalogo']);
    } 
    // 2. Lógica para Usuarios Registrados (Clientes)
    else if (this.email !== '' && this.password !== '') {
      this.appMain.usuario = this.email.split('@')[0]; // Nombre temporal
      this.appMain.isAdmin = false;
      alert('Bienvenido al Catálogo Figueroa');
      this.router.navigate(['/catalogo']);
    } 
    else {
      alert('Por favor, ingresa tus credenciales.');
    }
  }
}