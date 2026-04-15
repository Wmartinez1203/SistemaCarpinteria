import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { Catalog } from './components/catalog/catalog';
import { CartPage } from './components/cart-page/cart-page';
import { DetailPage } from './components/detail-page/detail-page';
import { AdminComponent } from './components/admin/admin';
import { Login } from './login/login'; 
import { Register } from './register/register'; 

export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'catalogo', component: Catalog },
  { path: 'carrito', component: CartPage },
  { path: 'detalle/:id', component: DetailPage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'admin', component: AdminComponent }
];




  
