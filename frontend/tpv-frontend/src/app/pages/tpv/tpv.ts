import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tpv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './tpv.html',
  styleUrls: ['./tpv.css']
})
export class Tpv implements OnInit {

  productos: any[] = [];

  mesas: any[] = [];

  mesaSeleccionada: number = 1;

  busqueda: string = '';

  rol: string = '';

  apiUrl = 'https://tpv-cafeteria-tfg.onrender.com';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.rol = localStorage.getItem('usuarioRol') || '';

    this.cargarProductos();

    // ✅ CARGAR MESAS DESDE BACKEND
    this.cargarMesas();

  }

  cargarProductos() {

    this.http.get<any[]>(`${this.apiUrl}/productos`)
      .subscribe({

        next: (data) => {

          this.productos = data;

        },

        error: (error) => {

          console.error('ERROR CARGANDO PRODUCTOS', error);

        }

      });

  }

  // ✅ CARGAR MESAS DESDE BACKEND
  cargarMesas() {

    this.http.get<any[]>(`${this.apiUrl}/mesas`)
      .subscribe({

        next: (data) => {

          this.mesas = data.map((mesa: any) => ({

            ...mesa,

            productos: [],

            total: 0

          }));

        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO MESAS',
            error
          );

        }

      });

  }

  seleccionarMesa(id: number) {

    this.mesaSeleccionada = id;

  }

  // ✅ CREAR MESA BACKEND
  agregarMesa() {

    const nuevaMesa = {

      nombre: `Mesa ${this.mesas.length + 1}`

    };

    this.http.post(

      `${this.apiUrl}/mesas`,

      nuevaMesa

    ).subscribe({

      next: () => {

        this.cargarMesas();

      },

      error: (error) => {

        console.error(
          'ERROR CREANDO MESA',
          error
        );

      }

    });

  }

  // ✅ ELIMINAR MESA BACKEND
  eliminarMesa(id: number) {

    this.http.delete(

      `${this.apiUrl}/mesas/${id}`

    ).subscribe({

      next: () => {

        this.cargarMesas();

      },

      error: (error) => {

        console.error(
          'ERROR ELIMINANDO MESA',
          error
        );

      }

    });

  }

  productosFiltrados() {

    return this.productos.filter(producto =>

      producto.nombre
        .toLowerCase()
        .includes(this.busqueda.toLowerCase())

    );

  }

  agregarProducto(producto: any) {

    if (producto.stock <= 0) {
      return;
    }

    const mesa = this.mesas.find(
      m => m.id === this.mesaSeleccionada
    );

    if (!mesa) {
      return;
    }

    // ✅ SI NO EXISTE PRODUCTOS
    if (!mesa.productos) {

      mesa.productos = [];

    }

    // ✅ SI NO EXISTE TOTAL
    if (!mesa.total) {

      mesa.total = 0;

    }

    mesa.productos.push(producto);

    mesa.total = Number(
      (mesa.total + producto.precio).toFixed(2)
    );

  }

  eliminarProducto(mesaId: number, index: number) {

    const mesa = this.mesas.find(
      m => m.id === mesaId
    );

    if (!mesa || !mesa.productos) {
      return;
    }

    const producto = mesa.productos[index];

    mesa.total = Number(
      (mesa.total - producto.precio).toFixed(2)
    );

    mesa.productos.splice(index, 1);

  }

  pagarMesa(mesaId: number) {

    const mesa = this.mesas.find(
      m => m.id === mesaId
    );

    if (
      !mesa ||
      !mesa.productos ||
      mesa.productos.length === 0
    ) {

      return;

    }

    const lineas = mesa.productos.map(
      (producto: any) => ({

        producto: producto,

        cantidad: 1,

        subtotal: producto.precio

      })
    );

    const pedido = {

      mesa: mesa.nombre,

      lineas: lineas

    };

    this.http.post(
      `${this.apiUrl}/pedidos`,
      pedido
    ).subscribe({

      next: () => {

        alert('✅ Pedido pagado correctamente');

        mesa.productos = [];

        mesa.total = 0;

        this.cargarProductos();

      },

      error: (error) => {

        console.error(
          'ERROR GUARDANDO PEDIDO:',
          error
        );

      }

    });

  }

  reponerStock(producto: any) {

    const nuevoStock = producto.stock + 10;

    this.http.put(

      `${this.apiUrl}/productos/${producto.id}/stock`,

      {
        stock: nuevoStock
      }

    ).subscribe({

      next: () => {

        producto.stock = nuevoStock;

      },

      error: (error) => {

        console.error(
          'ERROR REPONIENDO STOCK',
          error
        );

      }

    });

  }

}