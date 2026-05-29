import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contratar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './contratar.html',
  styleUrls: ['./contratar.css']
})
export class Contratar {

  nombre = '';

  email = '';

  password = '';

  constructor(private http: HttpClient) { }

  contratar() {

    if (
      this.nombre.trim() === '' ||
      this.email.trim() === '' ||
      this.password.trim() === ''
    ) {

      alert('Completa todos los campos');

      return;

    }

    const nuevoUsuario = {

      nombre: this.nombre,

      email: this.email,

      password: this.password,

      rol: 'Empleado'

    };

    this.http.post(
      `${environment.apiUrl}/usuarios`,
      nuevoUsuario,
      { responseType: 'text' }
    ).subscribe({

      next: (respuesta) => {

        console.log(respuesta);

        if (respuesta.includes('❌')) {

          alert(respuesta);

          return;

        }

        alert('Camarero contratado correctamente');

        this.nombre = '';

        this.email = '';

        this.password = '';

      },

      error: (error) => {

        console.log(error);

        alert('Error del backend');

      }

    });

  }

}