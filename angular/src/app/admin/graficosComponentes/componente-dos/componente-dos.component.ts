import { Component, AfterViewInit } from '@angular/core';

//chart.js
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, Title, ChartConfiguration } from 'chart.js';
import { ProductoServiceService } from '../../service/producto-service.service';

@Component({
  selector: 'app-componente-dos',
  imports: [],
  templateUrl: './componente-dos.component.html',
  styleUrl: './componente-dos.component.css'
})
export class ComponenteDosComponent implements AfterViewInit {


  constructor(private productoService: ProductoServiceService) { }
  ngAfterViewInit(): void {
    // Registrar los elementos de Chart.js
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Title,);

    // Llamar a la API
    this.productoService.listadoDeProductoPorCategoria().subscribe(producto => {

      const labels = producto.map(c => c.descripcion);
      const dataValues = producto.map(c => c.totalProductos);

      const backgroundColors = [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
        'rgb(255, 99, 71)',
        'rgb(60, 179, 113)'
      ];

      const data = {
        labels: labels,
        datasets: [{
          label: 'Stock por Categoría',
          data: dataValues,
          backgroundColor: backgroundColors,
        }]
      };

      const config: ChartConfiguration<'doughnut', number[], string> = {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Productos por Categoría',
            data: dataValues,
            backgroundColor: backgroundColors,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const  
            },
            title: {
              display: true,
              text: 'Productos por Categoría'
            }
          }
        }
      };

      new Chart(
        document.getElementById('categoriaDoughnut') as HTMLCanvasElement,
        config
      );

    });
  }
}
