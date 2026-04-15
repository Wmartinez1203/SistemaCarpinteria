import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var Swal: any;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5" style="margin-top: 100px !important; color: black !important;">
      <div class="row">
        <div class="col-md-4">
          <div class="card shadow border-0 p-4 rounded-4 bg-white">
            <h4 class="fw-bold mb-4 text-primary">
              <i class="bi" [ngClass]="editando ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
              {{ editando ? 'Editar Mueble' : 'Nuevo Mueble' }}
            </h4>
            <form (ngSubmit)="guardar()">
              <div class="mb-3">
                <label class="small fw-bold">Nombre</label>
                <input type="text" [(ngModel)]="nuevo.nombre" name="nombre" class="form-control" required>
              </div>
              <div class="row">
                <div class="col-6 mb-3">
                  <label class="small fw-bold">Categoría</label>
                  <select [(ngModel)]="nuevo.categoria" name="categoria" class="form-select">
                    <option value="Salas">Salas</option>
                    <option value="Comedores">Comedores</option>
                    <option value="Dormitorios">Dormitorios</option>
                    <option value="Oficina">Oficina</option>
                  </select>
                </div>
                <div class="col-6 mb-3">
                  <label class="small fw-bold">Precio ($)</label>
                  <input type="number" [(ngModel)]="nuevo.precio" name="precio" class="form-control" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="small fw-bold">Medidas</label>
                <input type="text" [(ngModel)]="nuevo.medidas" name="medidas" class="form-control">
              </div>
              <div class="mb-3">
                <label class="small fw-bold">Detalle / Materiales</label>
                <textarea [(ngModel)]="nuevo.detalle" name="detalle" class="form-control" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label class="small fw-bold">Foto Real</label>
                <input type="file" (change)="onFileSelected($event)" class="form-control">
              </div>
              <button type="submit" class="btn btn-dark w-100 rounded-pill mt-2 shadow">
                {{ editando ? 'Guardar Cambios' : 'Publicar Mueble' }}
              </button>
              <button *ngIf="editando" type="button" (click)="limpiarFormulario()" class="btn btn-link w-100 text-muted mt-1">Cancelar</button>
            </form>
          </div>
        </div>

        <div class="col-md-8">
          <div class="card shadow border-0 p-4 rounded-4 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-4">
               <h4 class="fw-bold m-0">Inventario del Taller</h4>
               <button class="btn btn-outline-dark btn-sm rounded-pill" (click)="volver()">Volver al Catálogo</button>
            </div>
            <div class="table-responsive">
              <table class="table align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Mueble</th>
                    <th>Precio</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of productos">
                    <td>
                      <div class="d-flex align-items-center">
                        <img [src]="p.imagen_url" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                        <div>
                          <div class="fw-bold">{{p.nombre}}</div>
                          <small class="text-muted">{{p.categoria}}</small>
                        </div>
                      </div>
                    </td>
                    <td class="fw-bold text-primary">$ {{p.precio}}</td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-outline-primary me-2 border-0" (click)="prepararEdicion(p)">
                        <i class="bi bi-pencil-fill"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger border-0" (click)="borrar(p.id)">
                        <i class="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  productos: any[] = [];
  nuevo: any = { id: null, nombre: '', categoria: 'Salas', precio: 0, medidas: '', detalle: '' };
  selectedFile: File | null = null;
  editando: boolean = false;

  ngOnInit() { this.obtenerProductos(); }

  obtenerProductos() {
    this.http.get<any[]>('http://localhost:5000/api/productos').subscribe(res => {
      this.productos = res;
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  guardar() {
    const formData = new FormData();
    formData.append('nombre', this.nuevo.nombre);
    formData.append('categoria', this.nuevo.categoria);
    formData.append('precio', this.nuevo.precio.toString());
    formData.append('medidas', this.nuevo.medidas);
    formData.append('detalle', this.nuevo.detalle);
    if (this.selectedFile) formData.append('imagen', this.selectedFile);

    if (this.editando) {
      this.http.put(`http://localhost:5000/api/productos/${this.nuevo.id}`, formData).subscribe(() => {
        Swal.fire('Actualizado', 'Mueble corregido con éxito', 'success');
        this.limpiarFormulario();
        this.obtenerProductos();
      });
    } else {
      this.http.post('http://localhost:5000/api/productos', formData).subscribe(() => {
        Swal.fire('Publicado', 'Mueble agregado al catálogo', 'success');
        this.limpiarFormulario();
        this.obtenerProductos();
      });
    }
  }

  prepararEdicion(p: any) {
    this.editando = true;
    this.nuevo = { id: p.id, nombre: p.nombre, categoria: p.categoria, precio: p.precio, medidas: p.medidas, detalle: p.descripcion };
    window.scrollTo(0,0);
  }

  borrar(id: number) {
    Swal.fire({
      title: '¿Eliminar mueble?',
      text: "Se borrará de PostgreSQL permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      confirmButtonColor: '#d33'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:5000/api/productos/${id}`).subscribe(() => {
          this.obtenerProductos();
          Swal.fire('Eliminado', 'El registro ha sido borrado.', 'success');
        });
      }
    });
  }

  limpiarFormulario() {
    this.nuevo = { id: null, nombre: '', categoria: 'Salas', precio: 0, medidas: '', detalle: '' };
    this.selectedFile = null;
    this.editando = false;
  }

  volver() { this.router.navigate(['/catalogo']); }
}