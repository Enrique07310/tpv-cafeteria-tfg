import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tpv',
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

    this.rol = localStorage.getItem('rol') || '';

    this.cargarProductos();

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
      },
      {
        id: 3,
        nombre: 'Mesa 3',
        productos: [],
        total: 0
      }
    ];

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

  }

  eliminarMesa(id: number) {

    this.mesas = this.mesas.filter(
      mesa => mesa.id !== id
    );

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

    mesa.productos.push(producto);

    mesa.total += producto.precio;

  }

  eliminarProducto(mesaId: number, index: number) {

    const mesa = this.mesas.find(
      m => m.id === mesaId
    );

    if (!mesa) {
      return;
    }

    const producto = mesa.productos[index];

    mesa.total -= producto.precio;

    mesa.productos.splice(index, 1);

  }

  pagarMesa(mesaId: number) {

    const mesa = this.mesas.find(
      m => m.id === mesaId
    );

    if (!mesa || mesa.productos.length === 0) {

      return;

    }

    const lineas = mesa.productos.map(
      (producto: any) => ({

        producto: {
          id: producto.id
        },

        cantidad: 1

      })
    );

    const pedido = {

      mesa: mesaId,

      lineas: lineas

    };

    console.log('PEDIDO ENVIADO:', pedido);

    this.http.post(
      `${this.apiUrl}/pedidos`,
      pedido
    ).subscribe({

      next: (response) => {

        console.log(
          'PEDIDO GUARDADO:',
          response
        );

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