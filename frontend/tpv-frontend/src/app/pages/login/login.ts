import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login {

  email = '';

  password = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    //  VALIDAR CAMPOS
    if (!this.email || !this.password) {

      alert('Debes rellenar email y contraseña');

      return;

    }

    const datos = {

      email: this.email,

      password: this.password

    };

    this.http.post(

      `${environment.apiUrl}/usuarios/login`,

      datos,

      { responseType: 'text' }

    ).subscribe({

      next: (token) => {

        //  SI EL BACKEND DEVUELVE ERROR
        if (token.includes('❌')) {

          alert(token);

          return;

        }

        //  GUARDAR TOKEN
        localStorage.setItem(
          'token',
          token
        );

        //  LEER JWT
        const payload =
          JSON.parse(atob(token.split('.')[1]));

        //  GUARDAR EMAIL
        localStorage.setItem(
          'usuarioEmail',
          payload.sub
        );

        //  GUARDAR ROL
        localStorage.setItem(
          'usuarioRol',
          payload.rol
        );

        //  GUARDAR NOMBRE
        localStorage.setItem(
          'usuarioNombre',
          payload.sub
        );

        alert('Login correcto');

        //  IR AL INICIO
        this.router.navigate(['/inicio']);

      },

      error: () => {

        alert('Email o contraseña incorrectos');

      }

    });

  }

}