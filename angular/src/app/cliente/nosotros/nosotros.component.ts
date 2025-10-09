import { Component, OnInit } from '@angular/core';
import { IndexService } from '../service/index.service';

@Component({
  selector: 'app-nosotros',
  imports: [],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent implements OnInit{
 totalClientes: number = 0;
  totalProductos: number = 0;
  constructor( private indexService: IndexService) {}
  ngOnInit(): void {
    this.indexService.getIndexData().subscribe({
      next: (data) => {
        this.totalClientes = data.totalClientes;
        this.totalProductos = data.totalProductos;
      },
      error: (err) => console.error('Error fetching index data', err),
    });
  }
}
