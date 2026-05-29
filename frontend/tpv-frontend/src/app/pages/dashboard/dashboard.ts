import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalPedidos: number = 0;

  totalVentas: number = 0;

  totalProductos: number = 10;

  totalMesas: number = 0;

  // 🏆 PRODUCTO MÁS VENDIDO
  productoTop: string = '';

  unidadesTop: number = 0;

  ngOnInit(): void {

    const tickets =
      JSON.parse(localStorage.getItem('tickets') || '[]');

    const mesas =
      JSON.parse(localStorage.getItem('mesas') || '[]');

    // ✅ TOTAL PEDIDOS
    this.totalPedidos = tickets.length;

    // ✅ TOTAL VENTAS
    this.totalVentas = Number(

      tickets.reduce(
        (total: number, ticket: any) =>
          total + ticket.total,
        0
      ).toFixed(2)

    );

    // ✅ TOTAL MESAS
    this.totalMesas = mesas.length;

    // 🏆 PRODUCTOS MÁS VENDIDOS
    const contadorProductos: any = {};

    tickets.forEach((ticket: any) => {

      ticket.productos.forEach((producto: any) => {

        if (contadorProductos[producto.nombre]) {

          contadorProductos[producto.nombre]++;

        } else {

          contadorProductos[producto.nombre] = 1;

        }

      });

    });

    let maxVentas = 0;

    for (const producto in contadorProductos) {

      if (
        contadorProductos[producto] > maxVentas
      ) {

        maxVentas =
          contadorProductos[producto];

        this.productoTop = producto;

        this.unidadesTop = maxVentas;

      }

    }

  }

}