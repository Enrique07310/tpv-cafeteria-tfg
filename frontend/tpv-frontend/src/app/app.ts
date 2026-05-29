import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  rol = '';

  constructor(public router: Router) {
    this.obtenerRol();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.obtenerRol();
      });
  }

  obtenerRol() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.rol = '';
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.rol = payload.rol;
    } catch (e) {
      this.rol = '';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioRol');
    localStorage.removeItem('usuarioEmail');
    this.rol = '';
    this.router.navigate(['/']);
  }
}