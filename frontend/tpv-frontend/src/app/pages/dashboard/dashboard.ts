import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  productoTop: string = '';

  unidadesTop: number = 0;

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.cargarDashboard();

    // ✅ CARGAR MESAS REALES
    this.cargarMesas();

  }

  cargarDashboard() {

    this.http.get<any[]>(`${this.apiUrl}/pedidos`)
      .subscribe({

        next: (tickets) => {

          this.totalPedidos = tickets.length;

          this.totalVentas = Number(

            tickets.reduce(
              (total: number, ticket: any) =>
                total + ticket.total,
              0
            ).toFixed(2)

          );

          const contadorProductos: any = {};

          tickets.forEach((ticket: any) => {

            (ticket.lineas || []).forEach((linea: any) => {

              const nombre =
                linea.producto.nombre;

              if (contadorProductos[nombre]) {

                contadorProductos[nombre]++;

              } else {

                contadorProductos[nombre] = 1;

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

        },

        error: (error) => {
          console.error('Error dashboard', error);
        }

      });

  }

  // ✅ CONTAR MESAS REALES
  cargarMesas() {

    this.http.get<any[]>(`${this.apiUrl}/mesas`)
      .subscribe({

        next: (mesas) => {

          this.totalMesas = mesas.length;

        },

        error: (error) => {

          console.error(
            'ERROR CARGANDO MESAS',
            error
          );

        }

      });

  }

}