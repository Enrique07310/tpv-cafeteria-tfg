import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tpv',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './tpv.html',
  styleUrls: ['./tpv.css']
})
export class Tpv {

  rol = '';

  productos: any[] = [];

  mesas: any[] = [];

  mesaSeleccionada = 1;

  // 🔍 BUSCADOR
  busqueda = '';

  constructor() {

    const token = localStorage.getItem('token');

    if (token) {

      const payload =
        JSON.parse(atob(token.split('.')[1]));

      this.rol = payload.rol;

    }

    // ✅ RECUPERAR PRODUCTOS
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
          nombre: 'Bocadillo Jamon Serrano',
          precio: 4.4,
          stock: 50
        },

        {
          id: 13,
          nombre: 'Bocadillo Mixto',
          precio: 4.4,
          stock: 50
        },

        {
          id: 14,
          nombre: 'Bocadillo Tortilla Francesa',
          precio: 4.6,
          stock: 50
        },

        {
          id: 15,
          nombre: 'Bocadillo Bacon',
          precio: 4.4,
          stock: 50
        }

      ];

      this.guardarProductos();

    }

    // ✅ RECUPERAR MESAS
    const mesasGuardadas =
      localStorage.getItem('mesas');

    if (mesasGuardadas) {

      this.mesas =
        JSON.parse(mesasGuardadas);

    } else {

      this.mesas = [

        {
          id: 1,
          nombre: 'Mesa 1',
          productos: [],
          total: 0
        },

        {
          id: 2,
          nombre: 'Mesa 2',
          productos: [],
          total: 0
        }

      ];

      this.guardarMesas();

    }

  }

  guardarMesas() {

    localStorage.setItem(
      'mesas',
      JSON.stringify(this.mesas)
    );

  }

  guardarProductos() {

    localStorage.setItem(
      'productos',
      JSON.stringify(this.productos)
    );

  }

  seleccionarMesa(id: number) {

    this.mesaSeleccionada = id;

  }

  agregarMesa() {

    const nuevaMesa = {

      id: this.mesas.length + 1,

      nombre: `Mesa ${this.mesas.length + 1}`,

      productos: [],

      total: 0

    };

    this.mesas.push(nuevaMesa);

    this.guardarMesas();

  }

  eliminarMesa(id: number) {

    if (this.mesas.length === 1) {

      alert('Debe existir al menos una mesa');

      return;

    }

    this.mesas =
      this.mesas.filter(m => m.id !== id);

    if (this.mesaSeleccionada === id) {

      this.mesaSeleccionada =
        this.mesas[0].id;

    }

    this.guardarMesas();

  }

  agregarProducto(producto: any) {

    // ❌ SIN STOCK
    if (producto.stock <= 0) {

      alert('Sin stock');

      return;

    }

    const mesa =
      this.mesas.find(
        m => m.id === this.mesaSeleccionada
      );

    if (mesa) {

      mesa.productos.push(producto);

      // ✅ TOTAL BIEN REDONDEADO
      mesa.total = Number(
        (
          mesa.total + producto.precio
        ).toFixed(2)
      );

      // ✅ RESTAR STOCK
      producto.stock--;

      this.guardarMesas();

      this.guardarProductos();

    }

  }

  eliminarProducto(mesaId: number, index: number) {

    const mesa =
      this.mesas.find(m => m.id === mesaId);

    if (mesa) {

      const producto =
        mesa.productos[index];

      // ✅ TOTAL BIEN REDONDEADO
      mesa.total = Number(
        Math.max(
          0,
          mesa.total - producto.precio
        ).toFixed(2)
      );

      // ✅ DEVOLVER STOCK
      const productoOriginal =
        this.productos.find(
          p => p.id === producto.id
        );

      if (productoOriginal) {

        productoOriginal.stock++;

      }

      mesa.productos.splice(index, 1);

      this.guardarMesas();

      this.guardarProductos();

    }

  }

  // ✅ SOLO ADMIN
  reponerStock(producto: any) {

    const cantidad =
      Number(prompt('Cantidad a reponer'));

    if (!cantidad || cantidad <= 0) {

      alert('Cantidad inválida');

      return;

    }

    producto.stock += cantidad;

    this.guardarProductos();

    alert(
      `Nuevo stock: ${producto.stock}`
    );

  }

  // 🔍 BUSCADOR
  productosFiltrados() {

    return this.productos.filter(
      producto =>
        producto.nombre
          .toLowerCase()
          .includes(
            this.busqueda.toLowerCase()
          )
    );

  }

  pagarMesa(mesaId: number) {

    const mesa =
      this.mesas.find(m => m.id === mesaId);

    if (!mesa) return;

    const ticket = {

      mesa: mesa.nombre,

      total: mesa.total,

      fecha: new Date().toLocaleString(),

      empleado:
        localStorage.getItem('usuarioNombre'),

      productos: mesa.productos

    };

    const tickets =
      JSON.parse(
        localStorage.getItem('tickets') || '[]'
      );

    tickets.push(ticket);

    localStorage.setItem(
      'tickets',
      JSON.stringify(tickets)
    );

    mesa.productos = [];

    mesa.total = 0;

    this.guardarMesas();

    alert(`${mesa.nombre} pagada`);

  }

}