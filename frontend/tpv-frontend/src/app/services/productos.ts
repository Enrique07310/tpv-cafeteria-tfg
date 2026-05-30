import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) { }

  obtenerProductos() {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearProducto(producto: any) {
    return this.http.post(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: any) {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}