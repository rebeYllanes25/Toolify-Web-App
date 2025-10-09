import { Component, AfterViewInit } from '@angular/core';

import { Chart, PolarAreaController, RadialLinearScale, ArcElement, Tooltip, Legend, Title,ChartConfiguration } from 'chart.js';
import { ProductoServiceService } from '../../service/producto-service.service';

@Component({
  selector: 'app-componente-tres',
  imports: [],
  templateUrl: './componente-tres.component.html',
  styleUrl: './componente-tres.component.css'
})
export class ComponenteTresComponent implements AfterViewInit {
  constructor(private productoService: ProductoServiceService) { }

  ngAfterViewInit(): void {
    // Registrar los elementos necesarios
    Chart.register(PolarAreaController, RadialLinearScale, ArcElement, Tooltip, Legend, Title);

    this.productoService.listadoDeProductoPorProveedor().subscribe(proveedores => {
      const labels = proveedores.map(p => p.razonSocial);
      const dataValues = proveedores.map(p => p.totalProductos);

      const backgroundColors = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(255, 205, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(201, 203, 207, 0.5)',
        'rgba(255, 99, 71, 0.5)',
        'rgba(60, 179, 113, 0.5)',
        'rgba(128, 0, 128, 0.5)'
      ];

      const data = {
        labels: labels,
        datasets: [{
          label: 'Stock por Proveedor',
          data: dataValues,
          backgroundColor: backgroundColors,
        }]
      };

      const config: ChartConfiguration<'polarArea', number[], string> = {
        type: 'polarArea',
        data: {
          labels: labels,
          datasets: [{
            label: 'Stock por Proveedor',
            data: dataValues,
            backgroundColor: backgroundColors,
          }]
        },
        options: {
          responsive: true,
          animation: {
            duration: 4000,
            easing: 'easeOutBounce' as const  
          },
          plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Stock por Proveedor' }
          }
        }
      };

      new Chart(
        document.getElementById('proveedorPolarArea') as HTMLCanvasElement,
        config
      );
    });
  }
}
