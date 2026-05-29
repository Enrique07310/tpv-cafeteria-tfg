import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  obtenerTotalPedidos() {
    return this.http.get(`${this.apiUrl}/pedidos`);
  }

  obtenerTotalVentas() {
    return this.http.get(`${this.apiUrl}/ventas`);
  }

  obtenerTotalProductos() {
    return this.http.get(`${this.apiUrl}/productos`);
  }

  obtenerStockBajo() {
    return this.http.get(`${this.apiUrl}/stock-bajo`);
  }
}