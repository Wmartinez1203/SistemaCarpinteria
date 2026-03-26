import { Routes } from '@angular/router';
import { Catalog } from './components/catalog/catalog';
import { CartPageComponent } from './services/cart';
import { DetailPage } from './components/detail-page/detail-page';
import { Login } from './login/login';
import { Register } from './register/register'; // <-- Importa el nuevo archivo

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: Catalog },
  { path: 'carrito', component: CartPageComponent },
  { path: 'detalle/:id', component: DetailPage },
  { path: 'login', component: Login },
  { path: 'register', component: Register } // <-- Añade la ruta
];