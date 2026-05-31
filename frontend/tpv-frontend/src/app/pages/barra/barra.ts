import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

@Component({
  selector: 'app-barra',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './barra.html',
  styleUrl: './barra.css',
})
export class Barra {

  productos: any[] = [];

  cuentas: any[] = [];

  apiUrl = 'https://tpv-cafeteria-tfg.onrender.com';

  constructor(private http: HttpClient) {

    const productosGuardados =
      localStorage.getItem('productos');

    if (productosGuardados) {

      this.productos =
        JSON.parse(productosGuardados);

    } else {

      this.productos = [

        {
          id: 6,
          nombre: 'Cafe Solo',
          precio: 1.3,
          stock: 100
        },

        {
          id: 7,
          nombre: 'Cafe Americano',
          precio: 1.4,
          stock: 100
        },

        {
          id: 8,
          nombre: 'Cafe con leche',
          precio: 1.4,
          stock: 100
        },

        {
          id: 9,
          nombre: 'Cortado',
          precio: 1.4,
          stock: 100
        },

        {
          id: 10,
          nombre: 'Capuchino',
          precio: 1.8,
          stock: 100
        },

        {
          id: 11,
          nombre: 'Bombon',
          precio: 1.9,
          stock: 100
        },

        {
          id: 12,
          nombre: 'Bocadillo Mixto',
          precio: 4.4,
          stock: 50
        }

      ];

      this.guardarProductos();

    }

    const cuentasGuardadas =
      localStorage.getItem('cuentasBarra');

    if (cuentasGuardadas) {

      this.cuentas =
        JSON.parse(cuentasGuardadas);

    }

  }

  guardarProductos() {

    localStorage.setItem(
      'productos',
      JSON.stringify(this.productos)
    );

  }

  guardarCuentas() {

    localStorage.setItem(
      'cuentasBarra',
      JSON.stringify(this.cuentas)
    );

  }

  crearCuenta() {

    const nombre =
      prompt('Nombre de la cuenta');

    if (!nombre) return;

    const nuevaCuenta = {

      id: this.cuentas.length + 1,

      nombre: nombre,

      productos: [],

      total: 0

    };

    this.cuentas.push(nuevaCuenta);

    this.guardarCuentas();

  }

  agregarProducto(cuentaId: number, producto: any) {

    if (producto.stock <= 0) {

      alert('Sin stock');

      return;

    }

    const cuenta =
      this.cuentas.find(
        c => c.id === cuentaId
      );

    if (!cuenta) return;

    cuenta.productos.push(producto);

    cuenta.total = Number(
      (
        cuenta.total + producto.precio
      ).toFixed(2)
    );

    producto.stock--;

    this.guardarProductos();

    this.guardarCuentas();

  }

  eliminarProducto(
    cuentaId: number,
    index: number
  ) {

    const cuenta =
      this.cuentas.find(
        c => c.id === cuentaId
      );

    if (!cuenta) return;

    const producto =
      cuenta.productos[index];

    cuenta.total = Number(
      Math.max(
        0,
        cuenta.total - producto.precio
      ).toFixed(2)
    );

    const productoOriginal =
      this.productos.find(
        p => p.id === producto.id
      );

    if (productoOriginal) {

      productoOriginal.stock++;

    }

    cuenta.productos.splice(index, 1);

    this.guardarProductos();

    this.guardarCuentas();

  }

  pagarCuenta(cuentaId: number) {

    const cuenta =
      this.cuentas.find(
        c => c.id === cuentaId
      );

    if (!cuenta) return;

    const lineas = cuenta.productos.map(
      (producto: any) => ({

        producto: producto,

        cantidad: 1,

        subtotal: producto.precio

      })
    );

    const pedido = {

      mesa: `Cuenta ${cuenta.nombre}`,

      lineas: lineas

    };

    this.http.post(
      `${this.apiUrl}/pedidos`,
      pedido
    ).subscribe({

      next: () => {

        this.cuentas =
          this.cuentas.filter(
            c => c.id !== cuentaId
          );

        this.guardarCuentas();

        alert(' Cuenta pagada');

      },

      error: (error) => {

        console.error(
          'ERROR PAGANDO CUENTA',
          error
        );

      }

    });

  }

}