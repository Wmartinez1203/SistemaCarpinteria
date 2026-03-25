import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  // Inyección de dependencias moderna (Angular 19)
  private http = inject(HttpClient);

  title = 'Muebles Figueroa';
  usuario = 'Fernando Martínez';
  muebles: any[] = []; // Aquí se guardarán los datos de la DB

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    // Llamada a tu API de Flask
    this.http.get<any[]>('http://localhost:5000/api/productos')
      .subscribe({
        next: (data) => {
          this.muebles = data;
          console.log('Muebles cargados:', this.muebles);
        },
        error: (err) => console.error('Error conectando al backend:', err)
      });
  }
}