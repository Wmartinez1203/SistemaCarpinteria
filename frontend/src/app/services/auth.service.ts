import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Esta variable avisa a toda la app si el usuario cambió
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  private getUserFromStorage() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('figueroa_session');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  actualizarSesion() {
    this.userSubject.next(this.getUserFromStorage());
  }

  logout() {
    localStorage.removeItem('figueroa_session');
    this.userSubject.next(null);
  }
}