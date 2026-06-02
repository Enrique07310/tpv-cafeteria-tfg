import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { ProductosService } from '../../services/productos';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class Productos implements OnInit {

  productos: any[] = [];

  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(
    private productosService: ProductosService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {

    this.productosService.obtenerProductos().subscribe({

      next: (data) => {
        this.productos = data;
      },

      error: (error) => {
        console.error('Error cargando productos', error);
      }

    });

  }

  //  REPONER STOCK
  reponerStock(producto: any) {

    const cantidad =
      prompt('¿Cuánto stock quieres añadir?');

    if (!cantidad) return;

    const nuevoStock =
      producto.stock + Number(cantidad);

    this.http.put(
      `${this.apiUrl}/${producto.id}/stock`,
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