import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.css']
})
export class Tickets {

  tickets = JSON.parse(localStorage.getItem('tickets') || '[]');

}