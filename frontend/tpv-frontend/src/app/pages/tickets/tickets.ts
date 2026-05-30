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

  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets() {

    this.http.get<any[]>(this.apiUrl)
      .subscribe({

        next: (data) => {
          this.tickets = data;
        },

        error: (error) => {
          console.error('Error cargando tickets', error);
        }

      });

  }

}