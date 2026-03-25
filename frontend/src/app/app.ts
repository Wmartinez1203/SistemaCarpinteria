import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Importante para las rutas

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // Añadimos RouterOutlet aquí
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent { // Lo dejamos como AppComponent para ser estándar
  title = 'Muebles Figueroa';
  usuario = 'Fernando Martínez';
  semestre = '9° Semestre UCE';
}