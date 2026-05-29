import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class Productos {

  productos = [

    {
      id: 6,
      nombre: 'Cafe Solo',
      precio: 1.3,
      stock: 100,
      
    },

    {
      id: 7,
      nombre: 'Cafe Americano',
      precio: 1.4,
      stock: 100,
      
    },

    {
      id: 8,
      nombre: 'Cafe con leche',
      precio: 1.4,
      stock: 100,
      
    },

    {
      id: 9,
      nombre: 'Cortado',
      precio: 1.4,
      stock: 100,
      
    },

    {
      id: 10,
      nombre: 'Capuchino',
      precio: 1.8,
      stock: 100,
      
    },

    {
      id: 11,
      nombre: 'Café Bombon',
      precio: 1.9,
      stock: 100,
      
    },

    {
      id: 12,
      nombre: 'Bocadillo Jamon Serrano',
      precio: 4.4,
      stock: 50,
      
    },

    {
      id: 13,
      nombre: 'Bocadillo Mixto',
      precio: 4.4,
      stock: 50,
      
    },

    {
      id: 14,
      nombre: 'Bocadillo Tortilla Francesa',
      precio: 4.6,
      stock: 50,
      
    },

    {
      id: 15,
      nombre: 'Bocadillo Bacon',
      precio: 4.4,
      stock: 50,
      
    }

  ];

}