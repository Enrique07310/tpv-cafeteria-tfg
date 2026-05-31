import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.css']
})
export class Tickets implements OnInit {

  tickets: any[] = [];

  rol: string = '';

  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    //  LEER ROL
    this.rol =
      localStorage.getItem('usuarioRol') || '';

    this.cargarTickets();

  }

  cargarTickets() {

    this.http.get<any[]>(this.apiUrl)
      .subscribe({

        next: (data) => {

          this.tickets = data;

        },

        error: (error) => {

          console.error(
            'Error cargando tickets',
            error
          );

        }

      });

  }

  //  BORRAR HISTORIAL
  borrarHistorial() {

    if (
      !confirm(
        '¿Seguro que quieres borrar todo el historial?'
      )
    ) {
      return;
    }

    this.http.delete(

      `${this.apiUrl}/borrar`,

      { responseType: 'text' }

    ).subscribe({

      next: () => {

        this.tickets = [];

        alert(' Historial borrado');

      },

      error: (error) => {

        console.error(
          'ERROR BORRANDO HISTORIAL',
          error
        );

      }

    });

  }

}