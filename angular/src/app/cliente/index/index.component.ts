import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { CategoriaVentasDTO } from '../../shared/dto/categoriaVentas.model';
import { IndexService } from '../service/index.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit{
  categories: CategoriaVentasDTO[] = [];
  totalClientes: number = 0;
  totalProductos: number = 0;
  constructor(private router: Router, private indexService: IndexService) {}
  ngOnInit(): void {
    this.indexService.getIndexData().subscribe({
      next: (data) => {
        this.categories = data.categories;
        this.totalClientes = data.totalClientes;
        this.totalProductos = data.totalProductos;
      },
      error: (err) => console.error('Error fetching index data', err),
    });
  }
  comprar() {
    this.router.navigate(['/cliente/producto']);
  }
}
