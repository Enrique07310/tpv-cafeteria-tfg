import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

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
export class Tpv implements OnInit {

  rol = '';

  productos: any[] = [];

  mesas: any[] = [];

  mesaSeleccionada = 1;

  busqueda = '';

  private apiProductos =
    `${environment.apiUrl}/productos`;

  private apiPedidos =
    `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (token) {

      const payload =
        JSON.parse(atob(token.split('.')[1]));

      this.rol = payload.rol;

    }

    // ✅ CARGAR PRODUCTOS DESDE BACKEND
    this.cargarProductos();

    // ✅ MESAS GLOBALES
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

  // ✅ PRODUCTOS DESDE POSTGRESQL
  cargarProductos() {

    this.http.get<any[]>(this.apiProductos)
      .subscribe({

        next: (data) => {

          this.productos = data;

        },

        error: (error) => {

          console.error(
            'Error cargando productos',
            error
          );

        }

      });

  }

  guardarMesas() {

    localStorage.setItem(
      'mesas',
      JSON.stringify(this.mesas)
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

      mesa.total = Number(
        (
          mesa.total + producto.precio
        ).toFixed(2)
      );

      producto.stock--;

      this.guardarMesas();

    }

  }

  eliminarProducto(mesaId: number, index: number) {

    const mesa =
      this.mesas.find(m => m.id === mesaId);

    if (mesa) {

      const producto =
        mesa.productos[index];

      mesa.total = Number(
        Math.max(
          0,
          mesa.total - producto.precio
        ).toFixed(2)
      );

      const productoOriginal =
        this.productos.find(
          p => p.id === producto.id
        );

      if (productoOriginal) {

        productoOriginal.stock++;

      }

      mesa.productos.splice(index, 1);

      this.guardarMesas();

    }

  }

  // ✅ REPONER STOCK
  reponerStock(producto: any) {

    const cantidad =
      Number(prompt('Cantidad a reponer'));

    if (!cantidad || cantidad <= 0) {

      alert('Cantidad inválida');

      return;

    }

    producto.stock += cantidad;

    // ✅ ACTUALIZAR EN BACKEND
    this.http.put(
      `${this.apiProductos}/${producto.id}`,
      producto
    ).subscribe();

    alert(
      `Nuevo stock: ${producto.stock}`
    );

  }

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

  // ✅ PAGAR MESA GLOBAL
  pagarMesa(mesaId: number) {

    const mesa =
      this.mesas.find(m => m.id === mesaId);

    if (!mesa) return;

    // ✅ CREAR PEDIDO
    const pedido = {

      mesa: mesa.id,

      lineas: mesa.productos.map(
        (producto: any) => ({

          producto: {
            id: producto.id
          },

          cantidad: 1,

          subtotal: producto.precio

        })

      )

    };

    // ✅ GUARDAR EN POSTGRESQL
    this.http.post(
      this.apiPedidos,
      pedido
    ).subscribe({

      next: () => {

        mesa.productos = [];

        mesa.total = 0;

        this.guardarMesas();

        // ✅ RECARGAR PRODUCTOS
        this.cargarProductos();

        alert(`${mesa.nombre} pagada`);

      },

      error: (error) => {

        console.error(
          'Error creando pedido',
          error
        );

      }

    });

  }

}